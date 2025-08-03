import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function TestOrderForm() {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    location: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "orders"), {
        ...form,
        timestamp: new Date()
      });
      alert("Order submitted!");
      setForm({ name: "", quantity: "", location: "" });
    } catch (err) {
      console.error(err);
      alert("Error sending order");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Test Weed Cookie Order Form</h2>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="border p-2 w-full mb-4"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Submit Order</button>
    </form>
  );
}
