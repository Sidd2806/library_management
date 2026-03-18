// controllers/issueController.js
import pool from '../config/db.js'

export const issueBook = async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { book_id } = req.body
    const userId = req.user.id

    if (!book_id) {
      conn.release()
      return res.status(400).json({ message: 'book_id is required.' })
    }

    await conn.beginTransaction()

    const [rows] = await conn.execute(
      'SELECT * FROM books WHERE id = ? FOR UPDATE',
      [book_id]
    )
    const book = rows[0]

    if (!book) {
      await conn.rollback()
      conn.release()
      return res.status(404).json({ message: 'Book not found.' })
    }

    if (book.available <= 0) {
      await conn.rollback()
      conn.release()
      return res.status(400).json({ message: 'Book is not available.' })
    }

    const [existing] = await conn.execute(
      'SELECT * FROM issued_books WHERE book_id = ? AND user_id = ? AND return_date IS NULL',
      [book_id, userId]
    )
    if (existing.length > 0) {
      await conn.rollback()
      conn.release()
      return res.status(400).json({ message: 'You already have this book issued.' })
    }

    await conn.execute(
      'UPDATE books SET available = available - 1 WHERE id = ?',
      [book_id]
    )
    await conn.execute(
      'INSERT INTO issued_books (book_id, user_id, issue_date) VALUES (?, ?, NOW())',
      [book_id, userId]
    )

    await conn.commit()
    conn.release()
    return res.status(200).json({ message: `"${book.title}" issued successfully.` })
  } catch (err) {
    await conn.rollback()
    conn.release()
    console.error('issueBook error:', err.message)
    return res.status(500).json({ message: 'Failed to issue book.' })
  }
}

export const returnBook = async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { book_id } = req.body
    const userId = req.user.id

    if (!book_id) {
      conn.release()
      return res.status(400).json({ message: 'book_id is required.' })
    }

    await conn.beginTransaction()

    const [openIssue] = await conn.execute(
      'SELECT * FROM issued_books WHERE book_id = ? AND user_id = ? AND return_date IS NULL',
      [book_id, userId]
    )

    if (openIssue.length === 0) {
      await conn.rollback()
      conn.release()
      return res.status(400).json({ message: 'No active issue found for this book.' })
    }

    await conn.execute(
      'UPDATE issued_books SET return_date = NOW() WHERE id = ?',
      [openIssue[0].id]
    )
    await conn.execute(
      'UPDATE books SET available = available + 1 WHERE id = ? AND available < quantity',
      [book_id]
    )

    const [bookRows] = await conn.execute('SELECT title FROM books WHERE id = ?', [book_id])

    await conn.commit()
    conn.release()
    return res.status(200).json({ message: `"${bookRows[0].title}" returned successfully.` })
  } catch (err) {
    await conn.rollback()
    conn.release()
    console.error('returnBook error:', err.message)
    return res.status(500).json({ message: 'Failed to return book.' })
  }
}

export const getDashboardStats = async (req, res) => {
  try {
    const [totalResult]     = await pool.execute('SELECT COUNT(*) AS total FROM books')
    const [availableResult] = await pool.execute('SELECT SUM(available) AS total FROM books')
    const [issuedResult]    = await pool.execute('SELECT COUNT(*) AS total FROM issued_books WHERE return_date IS NULL')
    const [recentIssues]    = await pool.execute(`
      SELECT ib.id, b.title AS book_title, u.email, ib.issue_date
      FROM issued_books ib
      JOIN books b ON ib.book_id = b.id
      JOIN users u ON ib.user_id = u.id
      WHERE ib.return_date IS NULL
      ORDER BY ib.issue_date DESC
      LIMIT 5
    `)

    return res.status(200).json({
      totalBooks:     totalResult[0].total,
      availableBooks: availableResult[0].total || 0,
      issuedBooks:    issuedResult[0].total,
      recentIssues,
    })
  } catch (err) {
    console.error('getDashboardStats error:', err.message)
    return res.status(500).json({ message: 'Failed to fetch dashboard stats.' })
  }
}
