import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Group from '../models/Group.js' // Импортируем модель Group
import cron from 'node-cron'

// Функция для синхронизации продуктов
const syncProducts = async (req, res) => {
  try {
    const url =
      'https://backend.mydrop.com.ua/vendor/api/export/products/prom/yml?public_api_key=7cbe3718003f120a0fa58cc327e6bdd508667edf&price_field=price&param_name=%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%80&stock_sync=true&category_id=17670&platform=prom&file_format=yml&'

    // Запрос к API
    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/xml' },
    })

    // Парсим XML в JSON
    const parser = new XMLParser({ ignoreAttributes: false })
    const parsedData = parser.parse(response.data)

    // Извлекаем данные о продуктах
    const productsData = parsedData?.yml_catalog?.shop?.offers?.offer || []
    const formattedProducts = Array.isArray(productsData)
      ? productsData.map((prod) => ({
          id: prod['@_id'],
          offerId: prod['@_offer_id'] || prod['@_id'],
          name: prod.name || 'Без названия',
          description: prod.description || '',
          price: parseFloat(prod.price || '0.00').toFixed(2),
          currency: prod.currencyId || 'UAH',
          image: Array.isArray(prod.picture) ? prod.picture : prod.picture ? [prod.picture] : [],
          vendor: prod.vendor || '-',
          available:
            String(prod.available || 'false')
              .trim()
              .toLowerCase() === 'true',
          quantityInStock: parseInt(prod.quantity_in_stock || '0', 10) || 0,
          param: Array.isArray(prod.param) ? prod.param[0]?.['#text'] : prod.param?.['#text'] || 'Не указан',
          weight: parseFloat(prod.weight || '0.0') || 0.0,
          categoryId: prod.categoryId || '17670',
        }))
      : [
          {
            id: productsData['@_id'],
            offerId: productsData['@_offer_id'] || productsData['@_id'],
            name: productsData.name || 'Без названия',
            description: productsData.description || '',
            price: parseFloat(productsData.price || '0.00').toFixed(2),
            currency: productsData.currencyId || 'UAH',
            image: Array.isArray(productsData.picture) ? productsData.picture : productsData.picture ? [productsData.picture] : [],
            vendor: productsData.vendor || '-',
            available:
              String(productsData.available || 'false')
                .trim()
                .toLowerCase() === 'true',
            quantityInStock: parseInt(productsData.quantity_in_stock || '0', 10) || 0,
            param: Array.isArray(productsData.param) ? productsData.param[0]?.['#text'] : productsData.param?.['#text'] || 'Не указан',
            weight: parseFloat(productsData.weight || '0.0') || 0.0,
            categoryId: productsData.categoryId || '17670',
          },
        ]

    console.log('Processed products:', formattedProducts.slice(0, 5)) // Логируем первые 5 продуктов

    // Обновляем или добавляем продукты в базу данных
    for (const product of formattedProducts) {
      if (!product.offerId) {
        console.log(`Ошибка: product с id ${product.id} не имеет offerId, пропускаем его.`)
        continue
      }

      const category = await Category.findOne({ id: product.categoryId })

      if (!category) {
        console.log(`Категория с id ${product.categoryId} не найдена, пропускаем продукт ${product.id}`)
        continue
      }

      // Генерация имени для группы
      const groupName = product.name

      // Создаем или находим группу
      let group = await Group.findOne({ name: groupName })

      if (!group) {
        group = new Group({ name: groupName })
        await group.save()
        console.log(`Группа создана: ${groupName}`)
      }

      // Проверяем, существует ли уже продукт с таким offerId
      const existingProduct = await Product.findOne({ offerId: product.offerId })

      if (existingProduct) {
        // Продукт существует, обновляем его данные
        existingProduct.name = product.name
        existingProduct.description = product.description
        existingProduct.price = product.price
        existingProduct.currency = product.currency
        existingProduct.image = product.image
        existingProduct.vendor = product.vendor
        existingProduct.available = product.available
        existingProduct.quantityInStock = product.quantityInStock
        existingProduct.param = product.param
        existingProduct.weight = product.weight
        existingProduct.categoryId = category._id
        existingProduct.groupId = group._id

        await existingProduct.save()
        console.log(`Продукт с offerId ${product.offerId} обновлен.`)
      } else {
        // Если продукта нет в базе данных, добавляем его
        await Product.create({ ...product, categoryId: category._id, groupId: group._id })
        console.log(`Продукт с offerId ${product.offerId} создан.`)
      }
    }

    // Удаление продуктов, которых больше нет в источнике
    const allOfferIds = formattedProducts.map((p) => p.offerId)
    const removedProducts = await Product.find({ offerId: { $nin: allOfferIds } })

    if (removedProducts.length > 0) {
      await Product.deleteMany({ offerId: { $nin: allOfferIds } })
      console.log(`Удалено продуктов: ${removedProducts.length}`)
    }

    if (res) {
      res.json({ message: 'Продукты успешно синхронизированы' })
    }
  } catch (error) {
    console.error('Ошибка при синхронизации продуктов:', error.message)
    if (res) {
      res.status(500).send('Ошибка при синхронизации продуктов')
    }
  }
}

// Планируем запуск синхронизации продуктов каждые 4 часа (каждые 240 минут)
cron.schedule('0 */4 * * *', () => {
  console.log('🔄 Running products sync...')
  syncProducts()
})

export { syncProducts }
