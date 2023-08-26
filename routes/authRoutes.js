import express from 'express'
import {
    register,
    login,
    updateUser,
    getCurrentUser,
    logout
} from '../controllers/authControllers.js'
import auth from '../middleware/auth.js'
import testUser from '../middleware/testUser.js'
import rateLimiter from 'express-rate-limit'

const router = express.Router()

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10,
    message: 'Too many request from this IP, Please try again later'
})

router.route('/getCurrentUser').get(auth, getCurrentUser)
router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/updateUser').patch(auth, testUser, updateUser)
router.route('/logout').get(auth, logout)

export default router