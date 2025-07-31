import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([
    { sender: 'Admin', text: '🎤 Yo! Welcome to the street chat – drop your vibe 🍪' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    // Optional spray sound
    const spray = new Audio('https://www.fesliyanstudios.com/play-mp3/387'); // short spray sound
    spray.volume = 0.2;
    spray.play();

    setMessages([...messages, { sender: user?.name || 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4 text-white relative overflow-hidden">

      {/* Background graffiti effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://i.ibb.co/XbJXZ3V/graffiti-wall.jpg')] bg-cover blur-sm"></div>

      {/* Header */}
      <div className="text-center mb-4 z-10">
        <h1 className="text-5xl font-bold text-pink-300 drop-shadow graffiti-text">
          💬 Vibe Wall
        </h1>
        <p className="text-sm italic text-gray-300">Speak your thoughts</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto z-10 rounded-xl p-4 bg-white bg-opacity-5 backdrop-blur-lg border border-pink-500 space-y-3 shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-sm break-words px-4 py-2 rounded-xl shadow-md transform transition-all duration-300 animate-fade-in ${
              msg.sender === (user?.name || 'You')
                ? 'ml-auto bg-gradient-to-br from-green-400 to-green-600 text-white'
                : 'mr-auto bg-white bg-opacity-10 border border-gray-400 text-gray-100'
            }`}
          >
            <p className="text-xs font-bold text-gray-300">{msg.sender}</p>
            <p className="text-base">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex items-center mt-4 z-10 gap-2">
        <input
          type="text"
          placeholder="Drop your vibe 💨"
          className="flex-1 px-4 py-2 rounded-full border border-pink-400 bg-black bg-opacity-30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full font-bold transition"
        >
          Send 🚀
        </button>
      </div>

      {/* Back to Menu Button */}
      <div className="mt-6 text-center z-10">
        <Link
          to="/menu"
          className="inline-block text-black bg-lime-300 hover:bg-lime-400 px-6 py-2 rounded-full font-bold transition shadow-lg"
        >
          ← Back to Munchies
        </Link>
      </div>

      {/* Styles */}
      <style>{`
        .graffiti-text {
          font-family: 'Permanent Marker', cursive;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
