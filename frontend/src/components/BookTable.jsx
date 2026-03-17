// src/components/BookTable.jsx
import { useNavigate } from 'react-router-dom'

export default function BookTable({ books, onDelete, onIssue, onReturn }) {
  const navigate = useNavigate()

  if (books.length === 0) {
    return <p className="text-gray-500 text-center py-10">No books found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-sm">

        {/* Table Head */}
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">#</th>
            <th className="border px-4 py-2 text-left">Title</th>
            <th className="border px-4 py-2 text-left">Author</th>
            <th className="border px-4 py-2 text-left">ISBN</th>
            <th className="border px-4 py-2 text-center">Qty</th>
            <th className="border px-4 py-2 text-center">Available</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {books.map((book, index) => (
            <tr key={book.id} className="hover:bg-gray-50">

              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2 font-medium">{book.title}</td>
              <td className="border px-4 py-2">{book.author}</td>
              <td className="border px-4 py-2 text-gray-500">{book.isbn}</td>
              <td className="border px-4 py-2 text-center">{book.quantity}</td>

              {/* Available count with color */}
              <td className="border px-4 py-2 text-center">
                <span className={book.available > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {book.available}
                </span>
              </td>

              {/* Action buttons */}
              <td className="border px-4 py-2">
                <div className="flex gap-2 justify-center flex-wrap">

                  {/* Edit */}
                  <button
                    onClick={() => navigate(`/books/edit/${book.id}`, { state: { book } })}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(book.id, book.title)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>

                  {/* Issue */}
                  <button
                    onClick={() => onIssue(book.id, book.title)}
                    disabled={book.available === 0}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Issue
                  </button>

                  {/* Return */}
                  <button
                    onClick={() => onReturn(book.id, book.title)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
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
  )
}