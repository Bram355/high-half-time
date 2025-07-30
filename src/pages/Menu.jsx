import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching menu items (replace with real fetch later)
    setItems([
      { id: 1, name: 'Cosmic Cookies', price: 'KSh 500', image: '/cookie1.jpg' },
      { id: 2, name: 'Ganja Gummies', price: 'KSh 300', image: '/gummies.jpg' },
      { id: 3, name: 'Baked Brownies', price: 'KSh 600', image: '/brownie.jpg' }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-green-400 font-bold">High-Half-Time 🌿 Menu</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-green-700"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-green-300">{item.name}</h2>
              <p className="text-white mt-1">{item.price}</p>
              <button className="mt-4 bg-green-500 hover:bg-green-600 text-black py-2 px-4 rounded">
                Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
