// controllers/bookController.js
import { getAllBooks, searchBooks, getBookById, createBook, updateBook, deleteBook } from '../models/bookModel.js'

export const fetchAllBooks = async (req, res) => {
  try {
    const books = await getAllBooks()
    return res.status(200).json(books)
  } catch (err) {
    console.error('fetchAllBooks error:', err.message)
    return res.status(500).json({ message: 'Failed to fetch books.' })
  }
}

export const search = async (req, res) => {
  try {
    const { q } = req.query
    if (!q || q.trim() === '')
      return res.status(400).json({ message: 'Search query is required.' })

    const books = await searchBooks(q.trim())
    return res.status(200).json(books)
  } catch (err) {
    console.error('search error:', err.message)
    return res.status(500).json({ message: 'Search failed.' })
  }
}

export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, quantity } = req.body

    if (!title || !author || !isbn || quantity === undefined)
      return res.status(400).json({ message: 'All fields are required: title, author, isbn, quantity.' })

    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < 1)
      return res.status(400).json({ message: 'Quantity must be a positive integer.' })

    const result = await createBook(title, author, isbn, qty)
    return res.status(201).json({ message: 'Book added successfully.', bookId: result.insertId })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'A book with this ISBN already exists.' })
    console.error('addBook error:', err.message)
    return res.status(500).json({ message: 'Failed to add book.' })
  }
}

export const editBook = async (req, res) => {
  try {
    const { id } = req.params
    const { title, author, isbn, quantity } = req.body

    if (!title || !author || !isbn || quantity === undefined)
      return res.status(400).json({ message: 'All fields are required.' })

    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < 1)
      return res.status(400).json({ message: 'Quantity must be a positive integer.' })

    const existing = await getBookById(id)
    if (!existing)
      return res.status(404).json({ message: 'Book not found.' })

    await updateBook(id, title, author, isbn, qty)
    return res.status(200).json({ message: 'Book updated successfully.' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'A book with this ISBN already exists.' })
    console.error('editBook error:', err.message)
    return res.status(500).json({ message: 'Failed to update book.' })
  }
}

export const removeBook = async (req, res) => {
  try {
    const { id } = req.params

    const existing = await getBookById(id)
    if (!existing)
      return res.status(404).json({ message: 'Book not found.' })

    await deleteBook(id)
    return res.status(200).json({ message: 'Book deleted successfully.' })
  } catch (err) {
    console.error('removeBook error:', err.message)
    return res.status(500).json({ message: 'Failed to delete book.' })
  }
}