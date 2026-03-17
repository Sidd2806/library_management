// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar      from './components/Navbar.jsx'
import Login       from './pages/Login.jsx'
import Dashboard   from './pages/Dashboard.jsx'
import Books       from './pages/Books.jsx'
import AddBook     from './pages/AddBook.jsx'
import UpdateBook  from './pages/UpdateBook.jsx'

// Redirects to /login if no token found
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected - all share the Navbar */}
        <Route path="/" element={
          <PrivateRoute>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
              <Dashboard />
            </div>
          </PrivateRoute>
        } />

        <Route path="/books" element={
          <PrivateRoute>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
              <Books />
            </div>
          </PrivateRoute>
        } />

        <Route path="/books/add" element={
          <PrivateRoute>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
              <AddBook />
            </div>
          </PrivateRoute>
        } />

        <Route path="/books/edit/:id" element={
          <PrivateRoute>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
              <UpdateBook />
            </div>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}