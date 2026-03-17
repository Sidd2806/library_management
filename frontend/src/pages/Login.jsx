// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/api'

export default function Login() {
  const navigate            = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode]     = useState('login') // 'login' or 'register'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Both fields are required.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        await registerUser(username, password)
      }
      const data = await loginUser(username, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">📚 LibraryMS</h1>

        {/* Mode Toggle */}
        <div className="flex mb-6 border rounded overflow-hidden">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-medium ${mode === 'login' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-sm font-medium ${mode === 'register' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter password"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
          </button>

        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: admin / admin123
        </p>

      </div>
    </div>
  )
}