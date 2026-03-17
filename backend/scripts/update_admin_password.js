import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const passwordArg = process.argv[2]
if (!passwordArg) {
  console.error('Usage: node scripts/update_admin_password.js <db_root_password>')
  process.exit(1)
}

const HASH = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.'

try {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: passwordArg,
    database: process.env.DB_NAME || 'library',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 5,
  })

  const [result] = await pool.query("UPDATE users SET password = ? WHERE username = 'admin'", [HASH])
  console.log('UPDATE result:', result.affectedRows, 'row(s) affected')

  const [rows] = await pool.query("SELECT username, password FROM users WHERE username = 'admin'")
  console.log('User row:', rows)

  await pool.end()
  process.exit(0)
} catch (err) {
  console.error('Error running update:', err.message)
  process.exit(1)
}
