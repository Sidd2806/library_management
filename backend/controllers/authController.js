// controllers/authController.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, findUserByUsername } from '../models/userModel.js'

const SALT_ROUNDS = 10

export const register = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password)
      return res.status(400).json({ message: 'username and password are required.' })

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })

    const existingUser = await findUserByUsername(username)
    if (existingUser)
      return res.status(409).json({ message: 'username already exists.' })

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    await createUser(username, hashedPassword)

    return res.status(201).json({ message: 'User registered successfully.' })
  } catch (err) {
    console.error('Register error:', err.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password)
      return res.status(400).json({ message: 'username and password are required.' })

    const user = await findUserByUsername(username)
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials.' })

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, username: user.username },
    })
  } catch (err) {
    console.error('Login error:', err.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}
