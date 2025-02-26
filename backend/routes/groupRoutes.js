import express from 'express'
import Group from '../models/Group.js' // Импортируем модель Group
import Product from '../models/Product.js' // Импортируем модель Product

const router = express.Router()

// Получить все продукты из группы по её ID
// Получить продукты по groupId
router.get('/group/:groupId/products', async (req, res) => {
  const { groupId } = req.params
  try {
    const products = await Product.find({ groupId }) // Получаем продукты с таким groupId

    if (products.length === 0) {
      return res.status(404).json({ message: 'Продукты не найдены в данной группе' })
    }

    res.json(products) // Отправляем найденные продукты
  } catch (error) {
    console.error('Ошибка при получении продуктов по groupId:', error.message)
    res.status(500).send('Ошибка при получении продуктов')
  }
})

// Получить все группы продуктов с их продуктами
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('products') // Загружаем все группы с их продуктами
    res.json(groups) // Отправляем ответ на клиент
  } catch (error) {
    console.error('Ошибка при загрузке групп:', error.message)
    res.status(500).send('Ошибка при загрузке групп')
  }
})

// Получить все продукты в определенной группе по имени
router.get('/:groupName/products', async (req, res) => {
  const { groupName } = req.params
  try {
    // Найти группу по имени и заполнить поле products
    const group = await Group.findOne({ name: groupName }).populate('products')

    // Если группа не найдена, возвращаем 404
    if (!group) {
      return res.status(404).send('Группа не найдена')
    }

    // Отправляем все продукты в группе
    res.json(group.products)
  } catch (error) {
    console.error('Ошибка при загрузке продуктов группы:', error.message)
    res.status(500).send('Ошибка при загрузке продуктов группы')
  }
})

// Создать новую группу с продуктами
router.post('/', async (req, res) => {
  const { name, productIds } = req.body // Извлекаем данные из тела запроса
  try {
    // Создаем новую группу, связываем с продуктами
    const newGroup = new Group({ name, products: productIds })
    await newGroup.save() // Сохраняем группу в базе данных
    res.status(201).json(newGroup) // Отправляем созданную группу в ответ
  } catch (error) {
    console.error('Ошибка при создании группы:', error.message)
    res.status(500).send('Ошибка при создании группы')
  }
})

export default router
