// src/pages/UpdateBook.jsx
import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { updateBook } from '../services/api'

export default function UpdateBook() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const location  = useLocation()

  // Book data passed from BookTable via navigate state
  const existing  = location.state?.book || {}

  const [title, setTitle]       = useState(existing.title    || '')
  const [author, setAuthor]     = useState(existing.author   || '')
  const [isbn, setIsbn]         = useState(existing.isbn     || '')
  const [quantity, setQuantity] = useState(existing.quantity || '')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title || !author || !isbn || !quantity) {
      setError('All fields are required.')
      return
    }

    setLoading(true)
    try {
      await updateBook(id, title, author, isbn, parseInt(quantity))
      navigate('/books')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>

      <div className="bg-white border rounded p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded text-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="border rounded px-5 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}