import mongoose from 'mongoose'

// Определение схемы для продукта
const productSchema = new mongoose.Schema(
  {
    offerId: { type: String, required: true, unique: true }, // Новое поле для offerId
    name: { type: String, required: true }, // Название товара
    description: { type: String }, // Описание товара
    price: { type: Number, required: true }, // Цена товара
    currency: { type: String, required: true }, // Валюта
    image: { type: [String], default: [] }, // Изображения товара
    vendor: { type: String }, // Производитель товара
    available: { type: Boolean, default: true }, // Статус наличия товара
    quantityInStock: { type: Number, default: 0 }, // Количество товара на складе
    param: { type: String }, // Параметр (например, размер, цвет)
    weight: { type: Number }, // Вес товара
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Связь с категорией товара
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }, // Связь с группой товара
  },
  { timestamps: true }
) // Добавим временные метки для создания и обновления

// Создание модели продукта
const Product = mongoose.model('Product', productSchema)

export default Product
