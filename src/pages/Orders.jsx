import { useEffect, useState } from "react";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      const allOrders = JSON.parse(saved);

      // Filter orders by current user
      const userOrders = allOrders.filter(
        (order) => order.phone === user.phone
      );

      // Sort most recent first
      const sorted = userOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setOrders(sorted);
    }
  }, [user]);

  if (!orders.length) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>No orders yet. 🍪</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Your Orders</h2>

      <ul className="space-y-4">
        {orders.map((order, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow-md">
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total:</strong> KES {order.total}</p>
            <p><strong>Location:</strong> {order.location}</p>
            {order.note && <p><strong>Note:</strong> {order.note}</p>}
            <p><strong>Status:</strong> {order.status}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
