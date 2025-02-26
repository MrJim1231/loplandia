import Group from '../models/Group.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'

// Получить все группы
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
    res.json(groups)
  } catch (error) {
    console.error('Ошибка при получении групп:', error.message)
    res.status(500).send('Ошибка при получении групп')
  }
}

// Получить все товары в конкретной группе
const getProductsByGroup = async (req, res) => {
  const { groupId } = req.params
  try {
    // Ищем товары по groupId
    const products = await Product.find({ groupId }).populate('categoryId')
    if (!products.length) {
      return res.status(404).send('Товары в данной группе не найдены')
    }
    res.json(products)
  } catch (error) {
    console.error('Ошибка при получении товаров по группе:', error.message)
    res.status(500).send('Ошибка при получении товаров по группе')
  }
}

export { getAllGroups, getProductsByGroup }
