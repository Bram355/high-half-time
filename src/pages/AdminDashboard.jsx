import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import { db } from "../firebase";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const audioRef = useRef(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!firstLoad.current && liveOrders.length > orders.length) {
        if (audioRef.current) audioRef.current.play();
        toast.success("🍪 New order received!");
      }
      firstLoad.current = false;

      setOrders(liveOrders);
    });

    return () => unsubscribe();
  }, []);

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "orders", id));
      toast("✅ Order deleted.", { icon: "🗑️" });
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono overflow-auto">
      <audio
        ref={audioRef}
        preload="auto"
        src="data:audio/mp3;base64,//uQxAAABAAAANQAAAAAAAASW5mbwAAAA8AAAACAAACcQCAAwASIwBDAAAAC4FAAEABAAZGF0Yf//AAAA"
      />

      <Toaster position="top-right" />

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        🔥 Admin Dashboard – Live Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center">No active orders to show.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-green-500 p-4 rounded-xl bg-gradient-to-br from-green-900 to-green-700 shadow-md text-sm sm:text-base"
            >
              <p>
                <strong>📞 Phone:</strong> {order.phone || "N/A"}
              </p>
              <p>
                <strong>🍪 Items:</strong>{" "}
                {Array.isArray(order.items)
                  ? order.items
                      .map((item) => `${item.name} x${item.quantity}`)
                      .join(", ")
                  : "None"}
              </p>
              <p>
                <strong>📍 Location:</strong> {order.location?.address || "Not provided"}
              </p>
              <p>
                <strong>💰 Total:</strong> KES {order.total || 0}
              </p>
              <p>
                <strong>👤 Name:</strong> {order.customerName}
              </p>
              <p>
                <strong>⏰ Time:</strong>{" "}
                {order.timestamp?.seconds
                  ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>🚚 Status:</strong> {order.status || "Pending"}
              </p>

              <button
                onClick={() => deleteOrder(order.id)}
                className="mt-3 bg-red-800 px-4 py-2 rounded-full hover:bg-red-700 text-white"
              >
                🗑️ Delete Order
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
