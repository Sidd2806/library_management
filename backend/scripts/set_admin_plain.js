import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const plain = process.argv[2] || 'admin123'
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
})

const run = async () => {
  const hash = await bcrypt.hash(plain, 10)
  console.log('Generated hash:', hash)
  const [result] = await pool.query("UPDATE users SET password = ? WHERE username = 'admin'", [hash])
  console.log('Updated rows:', result.affectedRows)
  await pool.end()
}

run().catch(e=>{console.error(e); process.exit(1)})
