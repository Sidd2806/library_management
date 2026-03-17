// routes/bookRoutes.js
import express from 'express'
import { fetchAllBooks, search, addBook, editBook, removeBook } from '../controllers/bookController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(verifyToken)

router.get('/',        fetchAllBooks)   // GET    /api/books
router.get('/search',  search)          // GET    /api/books/search?q=
router.post('/',       addBook)         // POST   /api/books
router.put('/:id',     editBook)        // PUT    /api/books/:id
router.delete('/:id',  removeBook)      // DELETE /api/books/:id

export default router