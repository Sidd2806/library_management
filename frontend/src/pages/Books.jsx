import { useEffect, useState } from 'react'
import BookTable from '../components/BookTable'
import { deleteBook, getAllBooks, issueBook, returnBook, searchBooks } from '../services/api'

export default function Books() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const showSuccess = (msg) => {
    setMessage(msg)
    setError('')
    setTimeout(() => setMessage(''), 3000)
  }

  const showError = (msg) => {
    setError(msg)
    setMessage('')
    setTimeout(() => setError(''), 3000)
  }

  const loadBooks = async () => {
    setLoading(true)
    try {
      const allBooks = await getAllBooks()
      setBooks(allBooks)
    } catch {
      showError('Failed to load books.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks()
  },[])

  useEffect(() => {
    if (query.trim() === '') {
      loadBooks()
      return
    }

    const timeout = setTimeout(async () => {
      try {
        const filteredBooks = await searchBooks(query)
        setBooks(filteredBooks)
      } catch {
        showError('Search failed.')
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [query])

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

  const handleIssue = async (id) => {
    try {
      const data = await issueBook(id)
      showSuccess(data.message)
      loadBooks()
    } catch (err) {
      showError(err.response?.data?.message || 'Issue failed.')
    }
  }

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
    <div className="space-y-6">
      <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex w-fit items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">Catalog</div>
          <h1 className="font-['Playfair_Display'] text-4xl leading-tight text-slate-900 sm:text-[3.25rem]">Book Collection</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Search the catalog, update book records, and manage issue and return actions from one workspace.
          </p>
        </div>
        <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">{books.length} result(s)</div>
      </section>

      {message && <p className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[0.92rem] text-emerald-800">{message}</p>}
      {error && <p className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-[0.92rem] text-rose-700">{error}</p>}

      <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-xl">
            <label className="mb-2 block text-sm font-medium text-slate-900">Search books</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[0.95rem] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-500">
            Use the action buttons in each row to issue, return, edit, or remove books.
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center text-slate-500">Loading catalog...</div>
      ) : (
        <BookTable books={books} onDelete={handleDelete} onIssue={handleIssue} onReturn={handleReturn} />
      )}
    </div>
  )
}
