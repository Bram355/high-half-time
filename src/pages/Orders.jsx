import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import db from "../firebase";

export default function Orders({ user }) {
  const [latestOrder, setLatestOrder] = useState(null);
  const username = user?.username || "Guest";

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
    <div className="min-h-screen bg-black text-white px-4 py-6 font-mono">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">📦 Your Latest Order</h1>

      {!latestOrder ? (
        <p className="text-center text-gray-400">
          No orders yet. Try placing one from the menu.
        </p>
      ) : (
        <div className="border border-green-500 p-6 rounded-xl bg-gradient-to-br from-green-900 to-green-700 shadow-lg max-w-2xl mx-auto space-y-4 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row justify-between">
            <p><strong>👤 Name:</strong> {latestOrder.customerName}</p>
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                latestOrder.status === "Delivered"
                  ? "bg-green-600 text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {latestOrder.status || "Pending"}
            </span>
          </div>

          <p><strong>📞 Phone:</strong> {latestOrder.phone}</p>
          <p><strong>📍 Location:</strong> {latestOrder.location?.address || "Not provided"}</p>
          <p>
            <strong>🍪 Items:</strong>{" "}
            {Array.isArray(latestOrder.items)
              ? latestOrder.items.map(i => `${i.name} x${i.quantity}`).join(", ")
              : "None"}
          </p>
          <p><strong>💰 Total:</strong> KES {latestOrder.total}</p>
          <p><strong>⏰ Time:</strong>{" "}
            {latestOrder.timestamp?.seconds
              ? new Date(latestOrder.timestamp.seconds * 1000).toLocaleString()
              : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
