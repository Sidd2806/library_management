// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import authRoutes  from './routes/authRoutes.js'
import bookRoutes  from './routes/bookroutes.js'
import issueRoutes from './routes/issueRoutes.js'

// Triggers DB connection check on startup
import './config/db.js'

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth',  authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api',       issueRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})