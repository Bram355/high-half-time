import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import animeImg from '../assets/anime.png';

export default function Login({ onLogin }) {
  const [input, setInput] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(
    localStorage.getItem('ageConfirmed') !== 'true'
  );
  const graffitiSoundRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    graffitiSoundRef.current = new Audio('/spray.mp3');
  }, []);

  const handleLogin = async () => {
    setError('');

    if (!input) return setError('Please enter a username or email');

    const isAdmin = input.includes('@');

    if (isAdmin) {
      // Admin login with Firebase email & password
      try {
        const userCred = await signInWithEmailAndPassword(auth, input, pin);
        const tokenResult = await userCred.user.getIdTokenResult();

        const userData = {
          uid: userCred.user.uid,
          email: userCred.user.email,
          username: tokenResult.claims.name || 'Admin',
          isAdmin: tokenResult.claims.admin === true,
        };

        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        onLogin(userData);
        navigate('/admin');
      } catch (err) {
        console.error('Admin login error:', err.message);
        setError('Invalid admin credentials');
      }
    } else {
      // Guest login: just use a username and save to Firestore
      const userData = {
        username: input.trim(),
        isAdmin: false,
      };

      try {
        const guestId = `guest_${Date.now()}`;
        await setDoc(doc(db, 'users', guestId), {
          username: userData.username,
          createdAt: new Date(),
        });

        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        graffitiSoundRef.current?.play();
        onLogin(userData);
        navigate('/menu');
      } catch (err) {
        console.error('Guest login error:', err.message);
        setError('Could not login as guest');
      }
    }
  };

  const handleConfirmAge = () => {
    localStorage.setItem('ageConfirmed', 'true');
    setShowDisclaimer(false);
  };

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
        backgroundImage: "url('/anime-bg.jpg')",
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

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Enter username or admin email"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-5 py-3 text-lg font-semibold rounded-full bg-white text-black placeholder-gray-500 mb-4 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
          />

          {input.includes('@') && (
            <input
              type="password"
              placeholder="Admin Password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-5 py-3 text-lg font-semibold rounded-full bg-white text-black placeholder-gray-500 mb-6 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
            />
          )}

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
