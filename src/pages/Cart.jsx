import { useNavigate } from 'react-router-dom';

export default function Cart({ cart }) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price.toLocaleString()} Ksh
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.quantity * item.price).toLocaleString()} Ksh
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-right font-bold text-lg">
            Total: {total.toLocaleString()} Ksh
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            OK
          </button>
        </>
      )}
    </div>
  );
}
