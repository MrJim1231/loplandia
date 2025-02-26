import mongoose from 'mongoose' // Используем import для mongoose

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  parentId: { type: String, default: null },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  image: { type: String, default: null }, // Добавлено поле image
  discount: { type: Number, default: 0 }, // Добавляем поле скидки
})

const Category = mongoose.model('Category', categorySchema)

export default Category
