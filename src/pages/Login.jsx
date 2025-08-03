import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import animeImg from '../assets/anime.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const graffitiSoundRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    graffitiSoundRef.current = new Audio('/spray.mp3');
  }, []);

  const handleLogin = async () => {
    setError('');
    if (!username) {
      return setError('Enter your username');
    }

    const uname = username.trim().toLowerCase();

    // ADMIN login (username = "admin")
    if (uname === 'admin') {
      if (!pin) return setError('Admin must enter password');
      try {
        await signInWithEmailAndPassword(auth, 'admin@email.com', pin);
        const userData = {
          uid: 'admin',
          email: 'admin@email.com',
          username: 'admin',
          isAdmin: true,
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        graffitiSoundRef.current?.play();
        onLogin(userData);
        return navigate('/admin');
      } catch (err) {
        console.error(err);
        return setError('Invalid admin password');
      }
    }

    // CUSTOMER login (username only)
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', uname));
      const snapshot = await getDocs(q);

      let userId;
      if (snapshot.empty) {
        const newDocRef = doc(usersRef);
        await setDoc(newDocRef, {
          username: uname,
          createdAt: new Date(),
        });
        userId = newDocRef.id;
      } else {
        userId = snapshot.docs[0].id;
      }

      const userData = {
        uid: userId,
        email: '',
        username: uname,
        phone: '',
        isAdmin: false,
      };

      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      graffitiSoundRef.current?.play();
      onLogin(userData);
      navigate('/menu');
    } catch (err) {
      console.error(err);
      return setError('Failed to log in. Try again.');
    }
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
          <p className="text-center text-pink-300 italic font-mono mb-6">
            "Nobody knows it's you"
          </p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 text-lg font-semibold rounded-full bg-white text-black placeholder-gray-500 mb-4 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
          />

          {username.trim().toLowerCase() === 'admin' && (
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
