import Order from '../models/Order.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

console.log('EMAIL_LOGIN:', process.env.EMAIL_LOGIN)
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '*****' : 'NOT SET')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendOrderEmail = async (order) => {
  const orderNumber = order.orderNumber

  const adminMailOptions = {
    from: 'Інтернет-магазин Sleep & Dream <' + process.env.EMAIL_LOGIN + '>',
    to: process.env.EMAIL_LOGIN,
    subject: `Нове замовлення №${orderNumber}`,
    text: `Нове замовлення №${orderNumber}:
Ім'я: ${order.fullName}
Телефон: ${order.phone}
Email: ${order.email}
Доставка: ${order.delivery}
Місто: ${order.city}
Відділення: ${order.postOffice}
Оплата: ${order.payment}
Примітка: ${order.note}
Товари:
${order.items
  .map(
    (item) => `- ${item.name} (Ціна: ${item.price} грн, Кількість: ${item.quantity}, Сума: ${item.price * item.quantity} грн, На резинці: ${item.includeElastic ? 'Так' : 'Ні'}, Розмір: ${item.size})`
  )
  .join('\n')}
Загальна сума: ${order.total} грн`,
  }

  const userMailOptions = {
    from: 'Інтернет-магазин Sleep & Dream <' + process.env.EMAIL_LOGIN + '>',
    to: order.email,
    subject: `Ваше замовлення №${orderNumber} підтверджено`,
    text: `Вітаємо, ${order.fullName}!
Ваше замовлення №${orderNumber} успішно оформлено. Ось його деталі:
Товари:
${order.items
  .map(
    (item) => `- ${item.name} (Ціна: ${item.price} грн, Кількість: ${item.quantity}, Сума: ${item.price * item.quantity} грн, На резинці: ${item.includeElastic ? 'Так' : 'Ні'}, Розмір: ${item.size})`
  )
  .join('\n')}
Загальна сума: ${order.total} грн

Дякуємо за покупку!
З повагою,
Інтернет-магазин Sleep & Dream`,
  }

  await transporter.sendMail(adminMailOptions)
  await transporter.sendMail(userMailOptions)
}

const createOrder = async (req, res) => {
  // Удалили лог
  // console.log('Дані запиту:', req.body)

  const token = req.headers.authorization?.split(' ')[1]
  let userId = null

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      userId = decoded.userId
    } catch (error) {
      console.log('Помилка перевірки токена:', error.message)
    }
  }

  const { fullName, phone, email, delivery, city, postOffice, payment, note, items, total } = req.body

  try {
    const orderNumber = `ORD-${Date.now()}`
    const order = new Order({
      fullName,
      phone,
      email,
      delivery,
      city,
      postOffice,
      payment,
      note,
      items,
      total,
      orderNumber,
      userId,
    })

    await order.save()

    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { orders: order._id } })
    }

    await sendOrderEmail(order)

    res.status(201).json({
      message: `Замовлення №${orderNumber} успішно створене та надіслане на пошту!`,
      order,
    })
  } catch (error) {
    console.error('Помилка створення замовлення:', error)
    res.status(500).json({ error: 'Помилка створення замовлення.' })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    let userId = null

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        userId = decoded.userId
      } catch (error) {
        console.log('Помилка перевірки токена:', error.message)
      }
    }

    const query = userId ? { userId } : {}
    const orders = await Order.find(query)

    if (orders.length === 0) {
      return res.status(200).json({ message: 'Замовлення не знайдено.' })
    }

    res.status(200).json(orders)
  } catch (error) {
    console.error('Помилка отримання всіх замовлень:', error)
    res.status(500).json({ error: 'Помилка отримання всіх замовлень.' })
  }
}

export { createOrder, getAllOrders }
