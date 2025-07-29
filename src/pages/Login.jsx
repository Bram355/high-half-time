import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  function handleLogin() {
    const fakeUser = { name: 'Customer', phone };
    localStorage.setItem("phone", phone); // store in localStorage
    onLogin(fakeUser);
    navigate('/menu');
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Welcome to High-Half-Time 🌿</h1>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter your phone number"
        className="w-full border p-2 rounded mb-4"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Log In
      </button>
    </div>
  );
}
