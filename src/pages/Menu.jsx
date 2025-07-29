import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const cookiePrice = 250; // price per cookie in KES

export default function Menu() {
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(cookiePrice);
  const navigate = useNavigate();

  // Redirect to login if no phone in localStorage
  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (!phone) {
      navigate("/");
    }
  }, [navigate]);

  // Recalculate total when quantity changes
  useEffect(() => {
    setTotal(quantity * cookiePrice);
  }, [quantity]);

  // Handle quantity change with validation
  function handleQuantityChange(e) {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else {
      setQuantity(val);
    }
  }

  function handleProceed() {
    localStorage.setItem("order", JSON.stringify({ quantity, total }));
    navigate("/checkout");
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🍪 Choose Your Cookies</h2>

      <div className="space-y-4">
        <p className="text-lg">
          Each cookie: <strong>KES {cookiePrice}</strong>
        </p>

        <label className="block">
          <span className="text-gray-700">Quantity</span>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </label>

        <p className="text-xl font-semibold">Total: KES {total}</p>

        <button
          onClick={handleProceed}
          className="w-full bg-green-700 text-white p-2 rounded-md hover:bg-green-800"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
