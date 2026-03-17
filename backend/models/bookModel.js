// models/bookModel.js
import pool from '../config/db.js'

export const getAllBooks = async () => {
  const [rows] = await pool.execute('SELECT * FROM books ORDER BY title ASC')
  return rows
}

export const searchBooks = async (query) => {
  const term = `%${query}%`
  const [rows] = await pool.execute(
    'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY title ASC',
    [term, term]
  )
  return rows
}

export const getBookById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [id])
  return rows[0] || null
}

export const createBook = async (title, author, isbn, quantity) => {
  const [result] = await pool.execute(
    'INSERT INTO books (title, author, isbn, quantity, available) VALUES (?, ?, ?, ?, ?)',
    [title, author, isbn, quantity, quantity]
  )
  return result
}

export const updateBook = async (id, title, author, isbn, quantity) => {
  const [result] = await pool.execute(
    'UPDATE books SET title = ?, author = ?, isbn = ?, quantity = ? WHERE id = ?',
    [title, author, isbn, quantity, id]
  )
  return result
}

export const deleteBook = async (id) => {
  const [result] = await pool.execute('DELETE FROM books WHERE id = ?', [id])
  return result
}

export const decrementAvailable = async (id) => {
  const [result] = await pool.execute(
    'UPDATE books SET available = available - 1 WHERE id = ? AND available > 0',
    [id]
  )
  return result
}

export const incrementAvailable = async (id) => {
  const [result] = await pool.execute(
    'UPDATE books SET available = available + 1 WHERE id = ? AND available < quantity',
    [id]
  )
  return result
}