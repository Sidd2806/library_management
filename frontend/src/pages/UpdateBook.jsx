import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getBookById, updateBook } from '../services/api'

export default function UpdateBook() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const existing = location.state?.book || {}

  const [title, setTitle] = useState(existing.title || '')
  const [author, setAuthor] = useState(existing.author || '')
  const [isbn, setIsbn] = useState(existing.isbn || '')
  const [quantity, setQuantity] = useState(existing.quantity || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingBook, setLoadingBook] = useState(!existing.id)

  useEffect(() => {
    if (existing.id) {
      setLoadingBook(false)
      return
    }

    const loadBook = async () => {
      try {
        const book = await getBookById(id)
        setTitle(book.title || '')
        setAuthor(book.author || '')
        setIsbn(book.isbn || '')
        setQuantity(book.quantity || '')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load book details.')
      } finally {
        setLoadingBook(false)
      }
    }

    loadBook()
  }, [existing.id, id])

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

  if (loadingBook) {
    return <p className="text-slate-500">Loading book details...</p>
  }

  return (
    <div className="space-y-6">
      <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex w-fit items-center rounded-full border border-stone-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">Catalog</div>
          <h1 className="font-['Playfair_Display'] text-4xl leading-tight text-slate-900 sm:text-[3.1rem]">Edit book</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Make changes to the catalog record, then save to update what staff see in the books list.
          </p>
        </div>
      </section>

      <div className="max-w-3xl rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.98))] p-6 shadow-[0_14px_28px_rgba(15,23,42,0.05)] sm:p-8">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[0.95rem] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[0.95rem] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[0.95rem] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[0.95rem] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-5 text-sm leading-6 text-slate-600">
            You are editing book ID <span className="font-semibold text-slate-800">{id}</span>. Changes here update the existing record rather than creating a new one.
          </div>

          {error && <p className="md:col-span-2 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-[0.92rem] text-rose-700">{error}</p>}

          <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-stone-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
