// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/orders?_sort=id&_order=desc")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🍪 Admin Dashboard</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Phone</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Lat</th>
            <th className="border p-2">Lng</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.phone}</td>
              <td className="border p-2">{order.quantity}</td>
              <td className="border p-2">{order.total}</td>
              <td className="border p-2">{order.location.lat}</td>
              <td className="border p-2">{order.location.lng}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
