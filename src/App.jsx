import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import Chat from './pages/Chat';

import AdminDashboard from './pages/AdminDashboard';
import TestOrderForm from './pages/TestOrderForm';

import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 👇 Force refresh to get latest custom claims
          const tokenResult = await firebaseUser.getIdTokenResult(true);
          const claims = tokenResult.claims;

          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: claims.name || firebaseUser.displayName || "Guest",
            isAdmin: claims.admin === true,
          };

          console.log("✅ Authenticated user:", userData);

          localStorage.setItem("loggedInUser", JSON.stringify(userData));
          setUser(userData);
        } catch (err) {
          console.error("❌ Error getting token:", err);
          setUser(null);
        }
      } else {
        localStorage.removeItem("loggedInUser");
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {user && <Header cartCount={cart.length} />}
      <main className="p-4">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/menu" />
              ) : (
                <Login onLogin={setUser} />
              )
            }
          />
          <Route
            path="/register"
            element={<Register onRegister={setUser} />}
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
          <Route
            path="/chat"
            element={
              user ? <Chat user={user} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin"
            element={
              user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />
            }
          />
          <Route path="/test-order" element={<TestOrderForm />} />
        </Routes>
      </main>
    </div>
  );
}
