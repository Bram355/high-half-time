import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ setPosition, setAddress }) {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
    })
      .on('markgeocode', async function (e) {
        const center = e.geocode.center;
        map.setView(center, 16);
        setPosition(center);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${center.lat}&lon=${center.lng}&format=json`
          );
          const data = await res.json();
          setAddress(data.display_name || '');
        } catch {
          setAddress('Unknown location');
        }
      })
      .addTo(map);

    return () => map.removeControl(geocoder);
  }, [map, setPosition, setAddress]);

  useMapEvents({
    click: async (e) => {
      const { latlng } = e;
      setPosition(latlng);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || '');
      } catch {
        setAddress('Unknown location');
      }
    },
  });

  return null;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');

  const [cart, setCart] = useState([
    { name: 'Mega Kush Cookie', quantity: 2, price: 2500 },
    { name: 'Baked Brownie', quantity: 1, price: 1800 },
  ]);

  const [deletedItem, setDeletedItem] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, index: null });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDelete = (index) => {
    setConfirmDelete({ show: true, index });
  };

  const confirmDeleteItem = () => {
    const item = cart[confirmDelete.index];
    const updated = [...cart];
    updated.splice(confirmDelete.index, 1);
    setCart(updated);
    setDeletedItem(item);
    setShowToast(true);
    setConfirmDelete({ show: false, index: null });

    setTimeout(() => setShowToast(false), 4000);
  };

  const undoDelete = () => {
    if (deletedItem) {
      setCart((prev) => [...prev, deletedItem]);
      setDeletedItem(null);
      setShowToast(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col justify-between relative">
      <div className="p-4 flex flex-col gap-6 pb-40 overflow-y-auto">
        {/* Checkout Header */}
        <h2 className="text-2xl font-bold text-center">🛒 View Checkout</h2>

        {/* Cart Items */}
        <div className="bg-white text-black rounded-2xl p-6 shadow-xl">
          <ul className="divide-y divide-gray-300">
            {cart.map((item, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
                <div>
                  {item.name}{' '}
                  <span className="text-sm text-gray-600">x{item.quantity}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span>Ksh {item.price * item.quantity}</span>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="border-t border-gray-300 mt-4 pt-4 text-lg font-bold flex justify-between">
            <span>Total</span>
            <span>Ksh {total}</span>
          </div>
        </div>

        {/* Map */}
        <h2 className="text-2xl font-bold text-center">📍 Pick Delivery Location</h2>
        <div className="rounded-3xl overflow-hidden shadow-xl border border-white">
          <MapContainer
            center={[-1.286389, 36.817223]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '400px', width: '100%' }}
            className="rounded-3xl"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && <Marker position={position} />}
            <LocationMarker setPosition={setPosition} setAddress={setAddress} />
          </MapContainer>
        </div>

        {/* Address */}
        <div className="mt-4 bg-white text-black rounded-xl p-4 shadow-md">
          <p className="text-sm font-semibold">📍 Selected Location:</p>
          {position ? (
            <>
              <p className="text-sm mt-2">{address}</p>
              <p className="text-xs italic text-gray-500">
                (Lat: {position.lat.toFixed(5)}, Lng: {position.lng.toFixed(5)})
              </p>
            </>
          ) : (
            <p className="text-sm mt-2">No location selected yet</p>
          )}
        </div>
      </div>

      {/* Fixed Buttons */}
      <div className="fixed bottom-0 w-full bg-[#1a1a1a] border-t border-white p-4 flex justify-between items-center z-50">
        <button
          onClick={() => navigate('/menu')}
          className="bg-black border border-white text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          🔙 Return to Menu
        </button>
        <button
          onClick={() => alert('✅ Order placed!')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          ✅ Confirm Order
        </button>
      </div>

      {/* Toast Snackbar */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50">
          <span>🗑️ Item deleted.</span>
          <button onClick={undoDelete} className="ml-4 underline text-green-400">
            Undo
          </button>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setConfirmDelete({ show: false, index: null })}
                className="px-4 py-2 rounded-lg border border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteItem}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
