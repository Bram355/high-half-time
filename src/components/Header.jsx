import { Link, useNavigate } from "react-router-dom";

export default function Header({ cartCount = 0 }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("phone");
    localStorage.removeItem("order");
    // Don't remove all orders unless user is clearing history
    // localStorage.removeItem("orders");
    navigate("/", { replace: true });
    window.location.reload(); // refresh to reset App state
  }

  return (
    <header className="bg-green-700 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">🌿 High-Half-Time</h1>
      <nav className="space-x-4">
        <Link to="/menu" className="hover:underline">Menu</Link>
        <Link to="/checkout" className="hover:underline">Checkout</Link>
        <Link to="/orders" className="hover:underline">Orders</Link>
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
