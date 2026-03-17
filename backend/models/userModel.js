// models/userModel.js
import pool from '../config/db.js'

export const findUserByUsername = async (username) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  )
  return rows[0] || null
}

export const createUser = async (username, hashedPassword) => {
  const [result] = await pool.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword]
  )
  return result
}