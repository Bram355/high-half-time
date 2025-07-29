import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

// Fix marker icons not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Checkout() {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: -1.29, lng: 36.82 }); // Default Nairobi
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("order"));
    if (!savedOrder) {
      navigate("/menu");
    } else {
      setOrder(savedOrder);
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    const finalOrder = {
      ...order,
      location: position,
      timestamp: new Date().toISOString(),
    };

    // Save to fake orders DB (or send to backend later)
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    allOrders.push(finalOrder);
    localStorage.setItem("orders", JSON.stringify(allOrders));

    alert("Order placed! 🚚💨");
    navigate("/orders");
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📍 Choose Delivery Location</h2>

      <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchControl setPosition={setPosition} />
        <Marker position={position} />
      </MapContainer>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Cookies:</strong> {order?.quantity}</p>
          <p><strong>Total:</strong> KES {order?.total}</p>
          <p>
            <strong>Lat:</strong> {position.lat.toFixed(5)} <br />
            <strong>Lng:</strong> {position.lng.toFixed(5)}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          ✅ Confirm Delivery Location & Place Order
        </button>
      </form>
    </div>
  );
}

// Inline component for search bar
function SearchControl({ setPosition }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      searchLabel: "Type your area (e.g. Westlands)...",
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (e) => {
      const loc = e.location;
      setPosition({ lat: loc.y, lng: loc.x });
      map.setView([loc.y, loc.x], 15);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setPosition]);

  return null;
}
