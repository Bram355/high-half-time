import { useNavigate } from 'react-router-dom';

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const handleQuantityChange = (index, newQty) => {
    const updated = [...cart];
    updated[index].quantity = newQty;
    updated[index].totalPrice = newQty * updated[index].price;
    setCart(updated);
  };

  const handleRemove = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="max-w-3xl mx-auto bg-black text-green-400 p-6 rounded-lg shadow-lg">
      <h1 className="text-4xl graffiti-font text-center mb-6 animate-pulse">
        Your Cart 🍪
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-white">No cookies in your cart yet, bruh 💤</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-green-900 bg-opacity-20 p-4 rounded shadow-sm"
              >
                <div>
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p>Ksh {item.price} each</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <label>Qty:</label>
                    <input
                      type="number"
                      min={item.minQuantity || 1}
                      className="w-16 px-2 py-1 rounded bg-gray-800 text-white"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">Total: Ksh {item.totalPrice}</p>
                  <button
                    className="text-sm text-red-400 hover:text-red-600"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <p className="text-2xl font-bold">Grand Total: Ksh {totalAmount}</p>
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout 🚀
            </button>
          </div>
        </>
      )}
    </div>
  );
}
