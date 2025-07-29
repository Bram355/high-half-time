import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SearchControl from '../components/SearchControl';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ setLocation, setLocationName }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation(e.latlng);

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          const name = data.display_name || 'Unnamed location';
          setLocationName(name);
        })
        .catch(() => setLocationName('Unknown location'));
    },
  });

  return null;
}

export default function Checkout() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!phone) {
      alert('Please enter your phone number!');
      return;
    }

    if (!/^(\+?254|0)?7\d{8}$/.test(phone)) {
      alert('Enter a valid Kenyan phone number (e.g. 0712345678)');
      return;
    }

    if (!location || !locationName) {
      alert('Please select a location on the map or using search!');
      return;
    }

    const orderData = {
      phone,
      location,
      locationName,
    };

    console.log('Order submitted:', orderData);

    alert(`✅ Order for ${phone}\n📍 Location: ${locationName}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        🍪 Enter Your Number & Choose Delivery Location
      </h2>

      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mb-4 w-full border border-gray-300 rounded px-3 py-2"
      />

      <MapContainer
        center={[-1.2921, 36.8219]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '400px', width: '100%' }}
        className="rounded"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <SearchControl
          setLocation={setLocation}
          setLocationName={setLocationName}
        />
        <LocationMarker
          setLocation={setLocation}
          setLocationName={setLocationName}
        />
        {location && <Marker position={location} />}
      </MapContainer>

      {locationName && (
        <div className="mt-3 text-sm text-gray-600 italic">
          📍 Selected location: {locationName}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        ✅ Submit Order
      </button>
    </div>
  );
}
