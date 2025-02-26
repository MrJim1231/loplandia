import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import authRoutes from './routes/authRoutes.js'
import orderRoutes from './routes/ordersRoutes.js'
import cors from 'cors'
import compression from 'compression'
import { fileURLToPath } from 'url'

// Определяем __dirname в ES-модуле
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Загрузка переменных окружения
dotenv.config()

// Создаем приложение
const app = express()
const port = process.env.PORT || 5000

// Настройка CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))

// Применяем сжатие для всех ответов
app.use(compression())

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB подключен'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err))

// Парсинг JSON тела запроса
app.use(express.json())

// Обслуживание статики (фронтенда)
const frontendPath = path.resolve(__dirname, '../frontend/dist')
app.use(express.static(frontendPath))

// Обслуживание файлов из папки assets
const assetsPath = path.resolve(__dirname, '../frontend/assets')
app.use('/assets', express.static(assetsPath))

// Обслуживание изображений из папки "public/assets/image"
const publicAssetsPath = path.resolve(__dirname, 'public/assets/image')
app.use('/assets/image', express.static(publicAssetsPath))

// Роуты для различных API
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)

// Раздача robots.txt
app.use('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'))
})

// Отправляем index.html для всех остальных маршрутов
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
