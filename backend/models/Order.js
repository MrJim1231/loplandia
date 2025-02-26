import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    delivery: {
      type: String,
      required: true,
      enum: ['Нова Пошта'],
    },
    city: {
      type: String,
      required: true,
    },
    postOffice: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      required: true,
      enum: ['Повна оплата', 'Наложений платіж с передоплатою 100 грн'],
    },
    note: {
      type: String,
      required: false,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        includeElastic: { type: Boolean, default: false }, // Информация о резинке
        size: String, // Размер товара
        image: String, // Картинка товара
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Order', orderSchema)
