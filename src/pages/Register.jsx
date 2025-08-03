import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');

    if (!/^\d{4}$/.test(pin)) return setError('PIN must be 4 digits');
    if (pin !== confirmPin) return setError("PINs don't match");
    if (!/^\+?\d{10,15}$/.test(phone)) return setError('Enter valid phone number');
    if (!email) return setError('Email is required');

    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, pin);
      const firebaseUser = userCredential.user;

      // ✅ Save additional profile data in Firestore
      await setDoc(doc(collection(db, 'users'), firebaseUser.uid), {
        username,
        phone,
        email,
        createdAt: new Date(),
      });

      const newUser = {
        uid: firebaseUser.uid,
        email,
        username,
        phone,
        isAdmin: false,
      };

      localStorage.setItem('loggedInUser', JSON.stringify(newUser));
      onRegister(newUser);
      navigate('/menu');
    } catch (err) {
      console.error("Error registering:", err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Phone Number (e.g. +254712345678)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="4-digit PIN"
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="Confirm PIN"
        type="password"
        value={confirmPin}
        onChange={(e) => setConfirmPin(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>

      <p className="mt-4 text-center text-sm">
        Already registered? <Link to="/" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
}
