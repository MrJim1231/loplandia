// middleware/authMiddleware.js
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') // Получаем токен из заголовков

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Проверяем токен
    req.userId = decoded.userId // Добавляем userId в запрос
    next() // Пропускаем запрос дальше
  } catch (err) {
    return res.status(401).json({ message: 'Недействительный токен.' })
  }
}

export default authMiddleware
