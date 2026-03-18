import { useNavigate } from 'react-router-dom'

export default function BookTable({ books, onDelete, onIssue, onReturn }) {
  const navigate = useNavigate()

  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-800">No books found.</p>
        <p className="mt-2 text-sm text-slate-500">Try a different search, or add a new title to grow the catalog.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-215 w-full border-separate border-spacing-0 text-left text-[0.92rem]">
          <thead>
            <tr>
              <th className="border-b border-stone-200 bg-stone-50 px-4 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">#</th>
              <th className="border-b border-stone-200 bg-stone-50 px-4 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Title</th>
              <th className="border-b border-stone-200 bg-stone-50 px-4 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Author</th>
              <th className="border-b border-stone-200 bg-stone-50 px-4 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">ISBN</th>
              <th className="border-b border-stone-200 bg-stone-50 px-4 py-4 text-center text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Qty</th>
              <th className="border-b border-stone-200 bg-stone-50 px-4 py-4 text-center text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Available</th>
              <th className="border-b border-stone-200 bg-stone-50 px-4 py-4 text-center text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id} className="hover:bg-stone-50/70">
                <td className="border-b border-stone-100 px-4 py-4 align-top font-semibold text-slate-500">{index + 1}</td>
                <td className="border-b border-stone-100 px-4 py-4 align-top">
                  <div className="font-semibold text-slate-900">{book.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">Book ID {book.id}</div>
                </td>
                <td className="border-b border-stone-100 px-4 py-4 align-top text-slate-700">{book.author}</td>
                <td className="border-b border-stone-100 px-4 py-4 align-top font-mono text-xs text-slate-500 sm:text-sm">{book.isbn}</td>
                <td className="border-b border-stone-100 px-4 py-4 align-top text-center font-semibold text-slate-800">{book.quantity}</td>
                <td className="border-b border-stone-100 px-4 py-4 align-top text-center">
                  <span className={`inline-flex min-w-16 items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${book.available > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {book.available}
                  </span>
                </td>
                <td className="border-b border-stone-100 px-4 py-4 align-top">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => navigate(`/books/edit/${book.id}`, { state: { book } })}
                      className="inline-flex items-center justify-center rounded-full border border-stone-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-stone-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(book.id, book.title)}
                      className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => onIssue(book.id, book.title)}
                      disabled={book.available === 0}
                      className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Issue
                    </button>
                    <button
                      onClick={() => onReturn(book.id, book.title)}
                      className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 transition hover:bg-amber-100"
                    >
                      Return
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
