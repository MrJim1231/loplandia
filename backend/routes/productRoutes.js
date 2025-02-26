import express from 'express'
import { getProductsByGroupId, syncProductData, getProducts, getProductsByCategory, getProductById, getProductsOfSubcategories } from '../controllers/productController.js'

const router = express.Router()

// Маршрут для синхронизации продуктов
router.get('/sync', syncProductData)

// Маршрут для получения всех продуктов
router.get('/', getProducts)

// Маршрут для получения продуктов по категории
router.get('/category/:categoryId', getProductsByCategory)

// Маршрут для получения продуктов по подкатегории
router.get('/category/allproductsofsubcategories/:categoryId', getProductsOfSubcategories)

// Маршрут для получения продукта по ID
router.get('/:id', getProductById)

// Маршрут для получения продуктов по groupId
router.get('/group/:groupId/products', getProductsByGroupId)

export default router
