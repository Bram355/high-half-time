import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import db from "/src/firebase";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(results);
    });

    return () => unsubscribe(); // Clean up
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">📦 Admin Order Dashboard</h2>

      {orders.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Quantity</th>
                <th className="border px-4 py-2 text-left">Location</th>
                <th className="border px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{order.name}</td>
                  <td className="border px-4 py-2">{order.quantity}</td>
                  <td className="border px-4 py-2">{order.location}</td>
                  <td className="border px-4 py-2 text-sm text-gray-700">
                    {order.timestamp?.toDate().toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
