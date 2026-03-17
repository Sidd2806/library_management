// src/pages/AddBook.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addBook } from '../services/api'

export default function AddBook() {
  const navigate              = useNavigate()
  const [title, setTitle]     = useState('')
  const [author, setAuthor]   = useState('')
  const [isbn, setIsbn]       = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title || !author || !isbn || !quantity) {
      setError('All fields are required.')
      return
    }

    setLoading(true)
    try {
      await addBook(title, author, isbn, parseInt(quantity))
      navigate('/books')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>

      <div className="bg-white border rounded p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="e.g. The Great Gatsby"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="e.g. F. Scott Fitzgerald"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="e.g. 978-0743273565"
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
              placeholder="e.g. 5"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded text-sm disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Book'}
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