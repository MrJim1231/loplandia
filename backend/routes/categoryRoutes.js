import express from 'express' // Используем import для express
import Category from '../models/Category.js' // Импорт модели с расширением .js
import { syncCategories } from '../controllers/categoryController.js' // Импорт функции синхронизации категорий

const router = express.Router()

// Маршрут для получения всех категорий
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('subcategories') // Получаем категории с подкатегориями
    res.json(categories)
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error.message)
    res.status(500).json({ error: 'Ошибка при загрузке категорий' })
  }
})

// Маршрут для синхронизации категорий
router.get('/sync', async (req, res) => {
  try {
    await syncCategories() // Синхронизация категорий
    res.json({ message: 'Категории успешно синхронизированы' })
  } catch (error) {
    console.error('Ошибка при синхронизации категорий:', error.message)
    res.status(500).json({ error: 'Ошибка при синхронизации категорий' })
  }
})

// Маршрут для получения подкатегорий по ID категории
router.get('/:id/subcategories', async (req, res) => {
  try {
    const { id } = req.params

    // Находим подкатегории по parentId
    const subcategories = await Category.find({ parentId: id })

    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'Подкатегории не найдены' })
    }

    res.json(subcategories) // Возвращаем список подкатегорий
  } catch (error) {
    console.error('Ошибка при получении подкатегорий:', error.message)
    res.status(500).json({ error: 'Ошибка при получении подкатегорий' })
  }
})

export default router // Экспортируем роутер
