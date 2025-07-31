import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const navigate = useNavigate();

  const [cookies, setCookies] = useState([
    {
      id: 1,
      name: 'Mega Kush Cookie',
      price: 2500,
      quantity: 1,
      available: true,
    },
    {
      id: 2,
      name: 'Choco Kush Cookie',
      price: 250,
      quantity: 10,
      available: true,
    },
    {
      id: 3,
      name: 'Minty Blaze Cookie',
      price: 250,
      quantity: 10,
      available: true,
    },
  ]);

  const [cart, setCart] = useState([]);

  const addToCart = (cookie) => {
    if (cookie.quantity < 10 && (cookie.id === 2 || cookie.id === 3)) {
      alert('Minimum order for this cookie is 10.');
      return;
    }

    const existingItem = cart.find((item) => item.id === cookie.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === cookie.id
            ? { ...item, quantity: item.quantity + cookie.quantity }
            : item
        )
      );
    } else {
      setCart([...cart, cookie]);
    }
  };

  const updateQuantity = (id, amount) => {
    setCookies(
      cookies.map((cookie) =>
        cookie.id === id
          ? {
              ...cookie,
              quantity:
                cookie.id === 2 || cookie.id === 3
                  ? Math.max(10, cookie.quantity + amount)
                  : Math.max(1, cookie.quantity + amount),
            }
          : cookie
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-10">
      <div className="relative flex justify-center mb-6">
        <h1 className="text-4xl font-extrabold text-center tracking-widest uppercase">
          🌿 High-Half-Time Menu
        </h1>

        {/* Circular Pin Badge */}
        <div className="absolute -top-3 -right-3 w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-xs text-white font-bold text-center shadow-lg p-2 animate-pulse">
          You are about to get backed 🍪🔥
        </div>
      </div>

      <p className="text-center text-sm text-yellow-400 mb-10">
        🍪 Minimum order of <strong>10</strong> cookies required for Choco Kush and Minty Blaze.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cookies.map((cookie) => (
          <div
            key={cookie.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-md backdrop-blur"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">{cookie.name}</h2>
              <p className="text-green-400 text-lg mb-4">Ksh {cookie.price}</p>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => updateQuantity(cookie.id, -1)}
                className="px-3 py-1 bg-white/10 rounded-full hover:bg-white/20"
              >
                -
              </button>
              <span>{cookie.quantity}</span>
              <button
                onClick={() => updateQuantity(cookie.id, 1)}
                className="px-3 py-1 bg-white/10 rounded-full hover:bg-white/20"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(cookie)}
              className="bg-green-700 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-all"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* View Checkout and Chat Buttons */}
      <div className="mt-16 flex justify-center items-center gap-6 z-10 relative">
        <button
          onClick={() => navigate('/chat')}
          className="bg-green-800 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
        >
          💬 Chat
        </button>

        <button
          onClick={() => navigate('/checkout')}
          className="bg-white text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
        >
          🛒 View Checkout ({cart.length})
        </button>
      </div>
    </div>
  );
}
