import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import animeImg from '../assets/anime.png'; // ✅ Correct import path

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const graffitiSoundRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    graffitiSoundRef.current = new Audio('/spray.mp3'); // Ensure this file is in /public
  }, []);

  const handleLogin = () => {
    if (!phone) return alert('Please enter your phone number');
    if (graffitiSoundRef.current) graffitiSoundRef.current.play();

    localStorage.setItem('phone', phone);
    onLogin({ phone });
    navigate('/menu');
  };

  const handleConfirmAge = () => setShowDisclaimer(false);

  if (showDisclaimer) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="bg-gray-900 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">You must be 21+ to enter</h2>
          <button
            onClick={handleConfirmAge}
            className="bg-green-500 px-6 py-2 rounded text-white text-lg hover:bg-green-600 transition"
          >
            I am 21+
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black text-white relative px-4"
      style={{
        backgroundImage: "url('/anime-bg.jpg')", // Optional: replace with import if needed
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="flex justify-center items-center bg-gradient-to-br from-black/30 to-white/10 p-6 border-b border-white/10">
          <img
            src={animeImg}
            alt="Anime"
            className="rounded-full w-44 h-44 object-cover border-4 border-white shadow-lg animate-spin-slow"
          />
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-extrabold mb-2 text-green-400 text-center tracking-wide">
            Exclusive Infused Collection
          </h1>
          <p className="text-center text-sm text-gray-300 mb-2">(21+)</p>
          <p className="text-center text-pink-300 italic font-mono mb-6">"Nobody knows it's you"</p>

          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-5 py-3 text-lg font-semibold rounded-full bg-white text-black placeholder-gray-500 mb-4 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner transition-all duration-200"
            style={{
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
            }}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-600 text-white py-3 rounded-full text-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
