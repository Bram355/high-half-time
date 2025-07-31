import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!/^\d{4}$/.test(pin)) return setError('PIN must be 4 digits');
    if (pin !== confirmPin) return setError("PINs don't match");
    if (!/^\+?\d{10,15}$/.test(phone)) return setError('Enter valid phone number');

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (existingUsers.some(user => user.username === username)) {
      return setError('Username already exists');
    }

    const newUser = { username, phone, pin };
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    onRegister(newUser); // 👈 set user in App
    navigate('/menu');   // 👈 redirect to menu
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
