import express from 'express'
import { registerUser, loginUser, getProfile, sendResetPasswordEmail, resetPassword, confirmRegistration } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// Регистрация
router.post('/register', registerUser)

// Логин
router.post('/login', loginUser)

// Защищенный маршрут для получения профиля
router.get('/profile', authMiddleware, getProfile)

// Маршрут для отправки email с ссылкой для сброса пароля
router.post('/reset-password-request', sendResetPasswordEmail)

// Маршрут для сброса пароля по токену
router.post('/reset-password/:token', resetPassword)

// Маршрут для сброса пароля
router.post('/reset-password', resetPassword)

// Маршрут для подтверждения регистрации
router.post('/confirm-registration', confirmRegistration)

export default router
