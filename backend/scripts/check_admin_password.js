import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
})

const run = async () => {
  const [rows] = await pool.query("SELECT username, password, CHAR_LENGTH(password) as len FROM users WHERE username = 'admin'")
  console.log(rows)
  if (rows.length === 0) {
    console.error('No admin user found')
    process.exit(1)
  }
  const pw = rows[0].password
  console.log('Stored length:', rows[0].len)
  const ok = await bcrypt.compare('admin123', pw)
  console.log('bcrypt compare result:', ok)
  await pool.end()
}

run().catch(e=>{console.error(e); process.exit(1)})
