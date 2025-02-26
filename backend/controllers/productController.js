import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import Product from '../models/Product.js'
import Category from '../models/Category.js' // Подключаем модель категории
import cron from 'node-cron'
import { syncProducts } from '../services/productSyncService.js'

// Функция для синхронизации из services
const syncProductData = async (req, res) => {
  try {
    console.log('Начало синхронизации продуктов...')
    await syncProducts() // Запуск синхронизации продуктов
    console.log('Продукты успешно синхронизированы')
    res.json({ message: 'Продукты успешно синхронизированы' })
  } catch (error) {
    console.error('Ошибка при синхронизации продуктов:', error.message)
    res.status(500).send('Ошибка при синхронизации продуктов')
  }
}

// Функция для получения продуктов с пагинацией
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)

    const totalProducts = await Product.countDocuments()

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error.message)
    res.status(500).send('Ошибка при получении продуктов')
  }
}

// Функция для получения продуктов по категории
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10

    const products = await Product.find({ categoryId })
      .skip((page - 1) * limit)
      .limit(limit)

    const totalProducts = await Product.countDocuments({ categoryId })

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error('Ошибка при получении продуктов по категории:', error.message)
    res.status(500).send('Ошибка при получении продуктов по категории')
  }
}

// Функция для получения продукта по _id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' })
    }

    res.json(product)
  } catch (error) {
    console.error('Ошибка при получении продукта по ID:', error.message)
    res.status(500).send('Ошибка при получении продукта')
  }
}

// Новый код

// Получение продуктов из всех подкатегорий категории
const getProductsOfSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params

    // Находим категорию и все ее подкатегории
    const category = await Category.findById(categoryId).populate('subcategories')

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' })
    }

    // Собираем ID всех подкатегорий
    const subcategoryIds = category.subcategories.map((subcategory) => subcategory._id)

    // Получаем продукты из всех найденных подкатегорий
    const products = await Product.find({ categoryId: { $in: subcategoryIds } })

    res.json(products)
  } catch (error) {
    console.error('Ошибка при получении продуктов подкатегорий:', error.message)
    res.status(500).json({ error: 'Ошибка при получении продуктов подкатегорий' })
  }
}

// Новый метод для получения продуктов по groupId
const getProductsByGroupId = async (req, res) => {
  try {
    const { groupId } = req.params // Извлекаем groupId из URL

    // Находим все продукты с заданным groupId
    const products = await Product.find({ groupId })

    if (products.length === 0) {
      return res.status(404).json({ message: 'Продукты для этой группы не найдены' })
    }

    res.json(products) // Возвращаем найденные продукты в формате JSON
  } catch (error) {
    console.error('Ошибка при получении продуктов по groupId:', error.message)
    res.status(500).json({ error: 'Ошибка при обработке запроса' })
  }
}

export { syncProductData, getProducts, getProductsByCategory, getProductById, getProductsOfSubcategories, getProductsByGroupId }
