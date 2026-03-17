// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">

      {/* Logo */}
      <span className="text-xl font-bold">📚 LibraryMS</span>

      {/* Links */}
      <div className="flex gap-6">
        <Link to="/" className="hover:text-yellow-400">Dashboard</Link>
        <Link to="/books" className="hover:text-yellow-400">Books</Link>
        <Link to="/books/add" className="hover:text-yellow-400">Add Book</Link>
      </div>

      {/* User + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm">👤 {user.username}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>

    </nav>
  )
}