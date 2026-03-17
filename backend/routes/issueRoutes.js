// routes/issueRoutes.js
import express from 'express'
import { issueBook, returnBook, getDashboardStats } from '../controllers/issueController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(verifyToken)

router.post('/issue',     issueBook)          // POST /api/issue
router.post('/return',    returnBook)          // POST /api/return
router.get('/dashboard',  getDashboardStats)   // GET  /api/dashboard

export default router