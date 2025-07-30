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

// Fix marker icons
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

    return () => {
      map.removeControl(geocoder);
    };
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
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const cart = [
    { name: 'Mega Kush Cookie', quantity: 2, price: 2500 },
    { name: 'Baked Brownie', quantity: 1, price: 1800 },
  ];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] text-white p-4 flex flex-col gap-6 overflow-y-auto pb-28">
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-lime-400">
        🌿 High-Half-Time Checkout
      </h2>

      {/* Cart Summary */}
      <div className="bg-[#2e2e2e] rounded-2xl p-6 shadow-2xl border border-lime-500">
        <h3 className="text-xl font-bold mb-4 text-center text-white">🛒 Order Summary</h3>
        <ul className="divide-y divide-gray-700">
          {cart.map((item, idx) => (
            <li key={idx} className="py-3 flex justify-between">
              <span className="text-lime-300">
                {item.name} <span className="text-sm text-gray-400">x{item.quantity}</span>
              </span>
              <span className="font-semibold text-white">Ksh {item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-700 mt-4 pt-4 text-lg font-bold flex justify-between text-lime-400">
          <span>Total</span>
          <span>Ksh {total}</span>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-center text-white">
          📍 Pick or Search Delivery Location
        </h3>
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white">
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
            <LocationMarker
              setPosition={setPosition}
              setAddress={setAddress}
            />
          </MapContainer>
        </div>

        {/* Address Display */}
        <div className="mt-4 bg-white text-black rounded-xl p-4 shadow-md">
          <p className="text-sm font-bold text-gray-700">📍 Selected Location:</p>
          {position ? (
            <>
              <p className="text-sm mt-2">{address}</p>
              <p className="text-xs mt-1 italic text-gray-500">
                (Lat: {position.lat.toFixed(5)}, Lng: {position.lng.toFixed(5)})
              </p>
            </>
          ) : (
            <p className="text-sm mt-2">No location selected yet</p>
          )}
        </div>
      </div>

      {/* Action Buttons - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1a1a1a] border-t border-gray-700 p-4 flex justify-between z-50">
        <button
          className="w-[48%] bg-black border border-white hover:bg-gray-800 text-white py-3 rounded-xl font-bold text-md transition-all duration-300"
          onClick={() => navigate('/menu')}
        >
          🔙 Return to Menu
        </button>

        <button
          className="w-[48%] bg-lime-600 hover:bg-lime-700 text-black py-3 rounded-xl font-bold text-md transition-all duration-300 shadow-lg"
          onClick={() => alert('✅ Order placed!')}
        >
          ✅ Confirm Order
        </button>
      </div>
    </div>
  );
}
