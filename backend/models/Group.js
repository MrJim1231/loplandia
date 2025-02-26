import mongoose from 'mongoose'

// Определение схемы для группы
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Название группы
    description: { type: String }, // Описание группы
    // Продукты этой группы
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
) // Добавляем временные метки для создания и обновления

// Создание модели группы
const Group = mongoose.model('Group', groupSchema)

export default Group
