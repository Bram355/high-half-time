import { useState } from 'react';

export default function Menu() {
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
      name: 'Mint Blazed Cookie',
      price: 250,
      quantity: 10,
      available: true,
    },
  ]);

  const updateQuantity = (id, delta) => {
    setCookies(prev =>
      prev.map(cookie => {
        const minQty = cookie.name.includes('Choco') || cookie.name.includes('Mint') ? 10 : 1;
        return cookie.id === id
          ? { ...cookie, quantity: Math.max(minQty, cookie.quantity + delta) }
          : cookie;
      })
    );
  };

  const toggleAvailability = (id) => {
    setCookies(prev =>
      prev.map(cookie =>
        cookie.id === id ? { ...cookie, available: !cookie.available } : cookie
      )
    );
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* Smoke Animation */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-0">
        <div className="smoke animate-pulse" />
      </div>

      {/* Background Music */}
      <audio autoPlay loop volume="0.2" className="hidden" id="bg-music">
        <source src="/audio/lofi.mp3" type="audio/mp3" />
      </audio>

      {/* Header */}
      <div className="text-center mb-14 relative z-10">
        <h1 className="text-5xl font-black tracking-wide graffiti-title">
          🍪 HIGH-HALF-TIME MENU
        </h1>
        <p className="mt-2 text-lg text-green-300 font-semibold animate-pulse">
          You're about to get baked 😵‍💫🔥
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {cookies.map(cookie => (
          <div
            key={cookie.id}
            className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${
              cookie.available ? 'from-green-900 to-green-700' : 'from-gray-800 to-gray-600'
            }`}
          >
            <h2 className="text-2xl font-bold text-green-200 mb-2">{cookie.name}</h2>
            <p className="text-lg font-semibold">Ksh {cookie.price * cookie.quantity}</p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => updateQuantity(cookie.id, -1)}
                className="bg-green-800 hover:bg-green-600 text-white px-3 py-1 rounded-full text-lg"
              >
                -
              </button>
              <span className="text-xl font-bold">{cookie.quantity}</span>
              <button
                onClick={() => updateQuantity(cookie.id, 1)}
                className="bg-green-800 hover:bg-green-600 text-white px-3 py-1 rounded-full text-lg"
              >
                +
              </button>
            </div>

            <button
              className="mt-4 block w-full bg-white text-green-800 font-bold py-2 rounded-xl hover:bg-green-200 transition-all duration-200"
            >
              Add to Cart
            </button>

            <div className="mt-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cookie.available}
                  onChange={() => toggleAvailability(cookie.id)}
                  className="accent-green-400 scale-125"
                />
                <span className="text-green-300 font-semibold">
                  {cookie.available ? 'Available' : 'Out of stock'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
