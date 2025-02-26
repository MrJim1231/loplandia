import express from 'express'
import { createOrder, getAllOrders } from '../controllers/orderController.js' // Подключаем оба контроллера
import authMiddleware from '../middleware/authMiddleware.js' // Мидлвар для проверки токена

const router = express.Router()

// Маршрут для создания заказа, мидлвар не обязательный
// Если пользователь авторизован, мы привяжем заказ к пользователю, если нет, то заказ будет создан без userId
router.post('/', createOrder)

// Маршрут для получения всех заказов (для администраторов или всех пользователей)
// Здесь используем authMiddleware, так как для получения заказов нужен авторизованный пользователь
router.get('/', authMiddleware, getAllOrders)

// Маршрут для получения заказов пользователя (только для авторизованных пользователей)
// router.get('/user', authMiddleware, getUserOrders)

export default router
