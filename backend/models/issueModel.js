// models/issueModel.js
import pool from '../config/db.js'

export const createIssueRecord = async (bookId, userId) => {
  const [result] = await pool.execute(
    'INSERT INTO issued_books (book_id, user_id, issue_date) VALUES (?, ?, NOW())',
    [bookId, userId]
  )
  return result
}

export const findOpenIssue = async (bookId, userId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM issued_books WHERE book_id = ? AND user_id = ? AND return_date IS NULL',
    [bookId, userId]
  )
  return rows[0] || null
}

export const markAsReturned = async (issueId) => {
  const [result] = await pool.execute(
    'UPDATE issued_books SET return_date = NOW() WHERE id = ?',
    [issueId]
  )
  return result
}

export const countIssuedBooks = async () => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS total FROM issued_books WHERE return_date IS NULL'
  )
  return rows[0].total
}

export const getAllIssues = async () => {
  const [rows] = await pool.execute(`
    SELECT ib.id, b.title AS book_title, b.author, u.email, ib.issue_date, ib.return_date
    FROM issued_books ib
    JOIN books b ON ib.book_id = b.id
    JOIN users u ON ib.user_id = u.id
    ORDER BY ib.issue_date DESC
  `)
  return rows
}