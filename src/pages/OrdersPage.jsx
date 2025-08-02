// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import db from "../firebase";

export default function OrdersPage() {
  const [latestOrder, setLatestOrder] = useState(null);
  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("customerName", "==", username),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLatestOrder(userOrders[0] || null);
    });

    return () => unsubscribe();
  }, [username]);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 Your Latest Order</h1>

      {!latestOrder ? (
        <p className="text-center text-gray-400">No orders yet. Try placing one from the menu.</p>
      ) : (
        <div className="border border-green-500 p-6 rounded-xl bg-gradient-to-br from-green-900 to-green-700 shadow-md max-w-2xl mx-auto space-y-3">
          <p><strong>👤 Name:</strong> {latestOrder.customerName}</p>
          <p><strong>📞 Phone:</strong> {latestOrder.phone}</p>
          <p><strong>📍 Location:</strong> {latestOrder.location?.address || "Not provided"}</p>
          <p><strong>🍪 Items:</strong> {latestOrder.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</p>
          <p><strong>💰 Total:</strong> KES {latestOrder.total}</p>
          <p><strong>⏰ Time:</strong> {new Date(latestOrder.timestamp.seconds * 1000).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
