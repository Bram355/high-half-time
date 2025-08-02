import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../firebase";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Real-time listener
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const liveOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(liveOrders);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6">🔥 Admin Dashboard – Live Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders placed yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-green-500 p-4 rounded-xl bg-gradient-to-br from-green-900 to-green-700 shadow-md"
            >
              <p><strong>📞 Phone:</strong> {order.phone || "N/A"}</p>

              <p><strong>🍪 Items:</strong>{" "}
                {order.items && Array.isArray(order.items)
                  ? order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")
                  : "None"}
              </p>

              <p><strong>📍 Location:</strong> {order.location?.address || "Not provided"}</p>

              <p><strong>💰 Total:</strong> KES {order.total || 0}</p>

              <p><strong>⏰ Time:</strong>{" "}
                {order.timestamp?.seconds
                  ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                  : "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
