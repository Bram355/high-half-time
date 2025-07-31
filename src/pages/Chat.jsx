import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([
    { sender: 'Admin', text: '🎤 Yo! Welcome to the street chat – drop your vibe 🍪' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { sender: 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 animate-blink bg-gradient-to-br from-blue-200 via-indigo-200 to-blue-100 text-gray-800">
      
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-extrabold text-white graffiti-style drop-shadow-lg">
          💬 Live Vibe Chat
        </h1>
        <p className="text-sm text-gray-700 italic">Let the streets speak...</p>
      </div>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto bg-white bg-opacity-90 rounded-xl p-4 shadow-inner border border-blue-300 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-sm break-words rounded-xl px-4 py-2 shadow-md ${
              msg.sender === 'You'
                ? 'bg-green-200 ml-auto text-right'
                : 'bg-gray-100 mr-auto text-left'
            }`}
          >
            <p className="text-xs font-bold text-gray-500">{msg.sender}</p>
            <p className="text-base text-gray-800">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center mt-4 gap-2">
        <input
          type="text"
          placeholder="Type your vibe..."
          className="flex-1 px-4 py-2 rounded-full border border-blue-400 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-bold transition"
        >
          Send 🚀
        </button>
      </div>

      {/* Back Link */}
      <div className="mt-6 text-center">
        <Link
          to="/menu"
          className="inline-block text-white bg-black hover:bg-gray-800 px-6 py-2 rounded-full font-bold transition shadow-lg"
        >
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}
