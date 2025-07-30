import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Cart from './pages/Cart';

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (phone) {
      setUser({ phone });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {user && <Header cartCount={cart.length} />}
      <main className="p-4">
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/menu" /> : <Login onLogin={setUser} />
            }
          />
          <Route
            path="/menu"
            element={
              user ? <Menu cart={cart} setCart={setCart} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/cart"
            element={
              user ? <Cart cart={cart} setCart={setCart} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/checkout"
            element={
              user ? <Checkout cart={cart} setCart={setCart} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/orders"
            element={
              user ? <Orders user={user} /> : <Navigate to="/" />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
