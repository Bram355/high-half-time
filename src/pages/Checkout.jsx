import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCart = location.state?.cart || [];

  const [cart, setCart] = useState(initialCart);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  const handleQuantityChange = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleConfirmOrder = () => {
    alert('🎉 Order placed!');
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">🛒 Your Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>Your cart is empty.</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-600"
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white/5 p-4 rounded-xl"
              >
                <div>
                  <h2 className="font-bold text-xl">{item.name}</h2>
                  <p className="text-green-400">Ksh {item.price} × {item.quantity}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/20"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/20"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-3 text-red-400 hover:text-red-500"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <h2 className="text-xl font-semibold">Total: Ksh {total}</h2>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => navigate('/menu')}
                className="bg-gray-800 px-6 py-3 rounded-full hover:bg-gray-700"
              >
                🔙 Back to Menu
              </button>
              <button
                onClick={handleConfirmOrder}
                className="bg-green-700 px-6 py-3 rounded-full hover:bg-green-600"
              >
                ✅ Confirm Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
