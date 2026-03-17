// src/services/api.js
import axios from 'axios'

// Create Axios instance
const AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If token expired, redirect to login
AxiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ───────────────────────────────────────────────────
export const loginUser = async (username, password) => {
  const { data } = await AxiosInstance.post('/api/auth/login', { username, password })
  return data
}

export const registerUser = async (username, password) => {
  const { data } = await AxiosInstance.post('/api/auth/register', { username, password })
  return data
}

// ── Books ──────────────────────────────────────────────────
export const getAllBooks = async () => {
  const { data } = await AxiosInstance.get('/api/books')
  return data
}

export const searchBooks = async (q) => {
  const { data } = await AxiosInstance.get(`/api/books/search?q=${q}`)
  return data
}

export const addBook = async (title, author, isbn, quantity) => {
  const { data } = await AxiosInstance.post('/api/books', { title, author, isbn, quantity })
  return data
}

export const updateBook = async (id, title, author, isbn, quantity) => {
  const { data } = await AxiosInstance.put(`/api/books/${id}`, { title, author, isbn, quantity })
  return data
}

export const deleteBook = async (id) => {
  const { data } = await AxiosInstance.delete(`/api/books/${id}`)
  return data
}

// ── Issue / Return ─────────────────────────────────────────
export const issueBook = async (book_id) => {
  const { data } = await AxiosInstance.post('/api/issue', { book_id })
  return data
}

export const returnBook = async (book_id) => {
  const { data } = await AxiosInstance.post('/api/return', { book_id })
  return data
}

// ── Dashboard ──────────────────────────────────────────────
export const getDashboard = async () => {
  const { data } = await AxiosInstance.get('/api/dashboard')
  return data
}