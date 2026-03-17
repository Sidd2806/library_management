// src/pages/Books.jsx
import { useState, useEffect } from 'react'
import { getAllBooks, searchBooks, deleteBook, issueBook, returnBook } from '../services/api'
import BookTable from '../components/BookTable'

export default function Books() {
  const [books, setBooks]     = useState([])
  const [query, setQuery]     = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError]     = useState('')

  // Show success message for 3 seconds
  const showSuccess = (msg) => {
    setMessage(msg)
    setError('')
    setTimeout(() => setMessage(''), 3000)
  }

  // Show error message for 3 seconds
  const showError = (msg) => {
    setError(msg)
    setMessage('')
    setTimeout(() => setError(''), 3000)
  }

  // Load all books
  const loadBooks = async () => {
    setLoading(true)
    try {
      const books = await getAllBooks()
      setBooks(books)
    } catch {
      showError('Failed to load books.')
    } finally {
      setLoading(false)
    }
  }

  // Load books on first render
  useEffect(() => {
    loadBooks()
  }, [])

  // Search with 400ms debounce
  useEffect(() => {
    if (query.trim() === '') {
      loadBooks()
      return
    }
    const timeout = setTimeout(async () => {
      try {
        const books = await searchBooks(query)
        setBooks(books)
      } catch {
        showError('Search failed.')
      }
    }, 400)
    return () => clearTimeout(timeout)
  }, [query])

  // Delete a book
  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deleteBook(id)
      showSuccess('Book deleted successfully.')
      loadBooks()
    } catch (err) {
      showError(err.response?.data?.message || 'Delete failed.')
    }
  }

  // Issue a book
  const handleIssue = async (id) => {
    try {
      const data = await issueBook(id)
      showSuccess(data.message)
      loadBooks()
    } catch (err) {
      showError(err.response?.data?.message || 'Issue failed.')
    }
  }

  // Return a book
  const handleReturn = async (id) => {
    try {
      const data = await returnBook(id)
      showSuccess(data.message)
      loadBooks()
    } catch (err) {
      showError(err.response?.data?.message || 'Return failed.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Books</h1>

      {/* Success message */}
      {message && (
        <p className="bg-green-100 text-green-700 border border-green-300 rounded px-4 py-2 mb-4">
          {message}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="bg-red-100 text-red-700 border border-red-300 rounded px-4 py-2 mb-4">
          {error}
        </p>
      )}

      {/* Search bar */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or author..."
        className="w-full max-w-md border rounded px-3 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />

      {/* Table */}
      {loading
        ? <p className="text-gray-500">Loading...</p>
        : <BookTable
            books={books}
            onDelete={handleDelete}
            onIssue={handleIssue}
            onReturn={handleReturn}
          />
      }

    </div>
  )
}