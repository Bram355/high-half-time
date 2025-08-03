// Checkout.jsx
// ─────────────────────────────────────────────────────────────────────────
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

// 🔥 Firebase
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCart = location.state?.cart || [];

  const [cart, setCart] = useState(initialCart);
  const [total, setTotal] = useState(0);
  const username = localStorage.getItem('username') || 'Guest';
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [house, setHouse] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [position, setPosition] = useState({ lat: -1.2921, lng: 36.8219 });
  const [tempAddress, setTempAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');

  /* ───────────────── totals ───────────────── */
  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  /* ───────────────── Leaflet ───────────────── */
  useEffect(() => {
    const map = L.map('search-map').setView([position.lat, position.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([position.lat, position.lng]).addTo(map);

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on('markgeocode', function (e) {
        const newLatLng = e.geocode.center;
        setPosition(newLatLng);
        setTempAddress(e.geocode.name);
        marker.setLatLng(newLatLng);
        map.setView(newLatLng, 15);
      })
      .addTo(map);

    return () => map.remove();
  }, []);

  /* ───────────────── SAVE ORDER ───────────────── */
  const handleConfirmOrder = async () => {
    if (!phone || !city || !house || !manualLocation) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        phone,
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        location: {
          address: selectedAddress || manualLocation,
          lat: position.lat,
          lng: position.lng,
        },
        customerName: username,
        timestamp: Timestamp.now(),
      });

      alert('🎉 Order placed! We got your location.');
      navigate('/admin'); // <--- now goes to admin
    } catch (err) {
      console.error('❌ Firestore error:', err);
      alert('Something went wrong — please try again.');
    }
  };

  /* ───────────────── helpers ───────────────── */
  const handleQuantityChange = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">🍰 Cheque Your Stash</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>Your cart is empty.</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-600"
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <>
          {/* ------- CART LIST ------- */}
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white/5 p-4 rounded-xl"
              >
                <div>
                  <h2 className="font-bold text-xl">{item.name}</h2>
                  <p className="text-green-400">
                    Ksh {item.price} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/20"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/20"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-3 text-red-400 hover:text-red-500"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ------- TOTAL & FORM ------- */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-center">
              Total: Ksh {total}
            </h2>

            {/* customer details */}
            <div className="mt-6 space-y-4">
              <div className="bg-white/10 text-white p-3 rounded-lg">
                Username: <span className="text-green-300 font-bold">{username}</span>
              </div>
              <input
                type="text"
                placeholder="Contact Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/10 p-3 rounded-lg text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/10 p-3 rounded-lg text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Apartment / House Number"
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="w-full bg-white/10 p-3 rounded-lg text-white placeholder-gray-400"
              />
              <textarea
                placeholder="Manual Location Description"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                className="w-full bg-white/10 p-3 rounded-lg text-white placeholder-gray-400"
              ></textarea>
            </div>

            {/* map & address picker */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-2">Pick Location on Map</h3>
              <div id="search-map" className="h-64 w-full rounded-xl overflow-hidden z-10" />
              {tempAddress && (
                <button
                  onClick={() => setSelectedAddress(tempAddress)}
                  className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                >
                  ✅ OK – Use this location
                </button>
              )}
            </div>

            {selectedAddress && (
              <div className="mt-4 bg-white/10 text-green-300 p-4 rounded-xl">
                📍 <span className="font-semibold">{selectedAddress}</span>
              </div>
            )}

            {/* action buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => navigate('/menu')}
                className="bg-gray-800 px-6 py-3 rounded-full hover:bg-gray-700"
              >
                🔙 Back to Menu
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="bg-green-700 px-6 py-3 rounded-full hover:bg-green-600 z-50"
              >
                ✅ Confirm Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
