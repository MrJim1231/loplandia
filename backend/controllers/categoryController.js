import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import Category from '../models/Category.js'
import cron from 'node-cron'

const syncCategories = async () => {
  try {
    const url =
      'https://backend.mydrop.com.ua/vendor/api/export/products/prom/yml?public_api_key=7cbe3718003f120a0fa58cc327e6bdd508667edf&price_field=price&param_name=%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%80&stock_sync=true&category_id=17670&platform=prom&file_format=yml&use_import_ids=false&with_hidden=false'

    console.log('🔄 Fetching categories data...')
    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/xml' },
    })

    console.log('✅ Data fetched successfully')
    const parser = new XMLParser({ ignoreAttributes: false })
    const parsedData = parser.parse(response.data)
    const categoriesData = parsedData?.yml_catalog?.shop?.categories?.category || []
    const productsData = parsedData?.yml_catalog?.shop?.offers?.offer || []

    const formattedCategories = Array.isArray(categoriesData)
      ? categoriesData.map((cat) => ({
          id: cat['@_id'],
          name: cat['#text'],
          parentId: cat['@_parentId'] || null,
        }))
      : [
          {
            id: categoriesData['@_id'],
            name: categoriesData['#text'],
            parentId: categoriesData['@_parentId'] || null,
          },
        ]

    const categoryMap = {}
    for (const category of formattedCategories) {
      let discount = 0
      if (category.name === 'Бязь') {
        discount = 0 // Скидка для Бязь
      } else if (category.name === 'Однотонна Бязь') {
        discount = 0 // Скидка для Полікотон
      } else if (category.name === 'Полікотон') {
        discount = 0 // Скидка для Полікотон
      } else {
        discount = 900 // Скидка для остальных
      }

      const existingCategory = await Category.findOneAndUpdate({ id: category.id }, { $set: { name: category.name, parentId: category.parentId, discount } }, { upsert: true, new: true })
      categoryMap[category.id] = existingCategory
      console.log(`✅ Synced category: ${category.name} (ID: ${category.id}), Discount: ${discount} грн`)
    }

    // Удаление категорий, которых больше нет в источнике данных
    const existingCategories = await Category.find()
    const existingCategoryIds = existingCategories.map((cat) => cat.id)

    const sourceCategoryIds = formattedCategories.map((cat) => cat.id)
    const categoriesToDelete = existingCategoryIds.filter((id) => !sourceCategoryIds.includes(id))

    if (categoriesToDelete.length > 0) {
      await Category.deleteMany({ id: { $in: categoriesToDelete } })
      console.log(`🗑️ Deleted categories with IDs: ${categoriesToDelete.join(', ')}`)
    }

    for (const category of formattedCategories) {
      const subcategories = formattedCategories.filter((cat) => cat.parentId === category.id)
      const subcategoryIds = subcategories.map((sub) => categoryMap[sub.id]._id)

      const relatedProducts = productsData.filter((prod) => subcategories.some((sub) => sub.id == prod.categoryId))
      const imageUrl = relatedProducts.length > 0 ? relatedProducts[0].picture : null

      await Category.findOneAndUpdate({ id: category.id }, { $set: { subcategories: subcategoryIds, image: imageUrl } }, { new: true })
      console.log(`🔗 Updated category: ${category.name}, Image: ${imageUrl || 'No image'}`)
    }

    console.log('✅ Categories synchronization completed')
  } catch (error) {
    console.error('❌ Error during categories synchronization:', error.message)
    throw error
  }
}

// Планируем запуск синхронизации каждые 4 часа (каждые 240 минут)
cron.schedule('0 */4 * * *', () => {
  console.log('🔄 Running categories sync...')
  syncCategories()
})

export { syncCategories }
