// config/db.js
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host:             process.env.DB_HOST,
  user:             process.env.DB_USER,
  password:         process.env.DB_PASSWORD,
  database:         process.env.DB_NAME,
  port:             process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
})

// Test connection on startup but don't crash the app if DB is unreachable
try {
  const conn = await pool.getConnection()
  console.log('✅ MySQL connected')
  conn.release()
} catch (err) {
  console.error('⚠️  MySQL connection failed on startup:', err.message)
  console.error('The server will continue to run but database operations will fail until the DB is reachable.')
}

export default pool