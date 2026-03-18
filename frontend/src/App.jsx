import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import AddBook from './pages/AddBook.jsx'
import Books from './pages/Books.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import UpdateBook from './pages/UpdateBook.jsx'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function ProtectedLayout({ children }) {
  return (
    <PrivateRoute>
      <div className="min-h-screen bg-stone-200 text-slate-900">
        <Navbar />
        <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="w-full animate-[fade-in_0.45s_ease]">{children}</div>
        </main>
      </div>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedLayout>
              <Books />
            </ProtectedLayout>
          }
        />
        <Route
          path="/books/add"
          element={
            <ProtectedLayout>
              <AddBook />
            </ProtectedLayout>
          }
        />
        <Route
          path="/books/edit/:id"
          element={
            <ProtectedLayout>
              <UpdateBook />
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
