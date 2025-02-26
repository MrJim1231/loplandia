import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Order from '../models/Order.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Регистрация пользователя
export const registerUser = async (req, res) => {
  const { username, email, password, isAdmin } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Необходимо предоставить все обязательные поля.' })
  }

  try {
    // Проверка на существующего пользователя
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует.' })
    }

    // Хэширование пароля
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Генерация кода подтверждения
    const confirmationCode = crypto.randomBytes(3).toString('hex')
    const confirmationCodeExpires = Date.now() + 3600000 // Код действителен 1 час

    // Создание нового пользователя
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      confirmationCode,
      confirmationCodeExpires,
    })

    // Сохранение пользователя в базе данных
    await newUser.save()

    // Генерация JWT токена для нового пользователя
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Генерация и отправка письма с кодом подтверждения
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      to: newUser.email,
      from: process.env.EMAIL_LOGIN,
      subject: 'Подтверждение регистрации',
      text: `Ваш код подтверждения: ${confirmationCode}. Код действителен в течение 1 часа.`,
    }

    await transporter.sendMail(mailOptions)

    // Отправка токена и данных пользователя в ответ
    res.status(201).json({
      token,
      user: {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    })
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error)
    res.status(500).json({ message: 'Ошибка при регистрации пользователя.' })
  }
}

// Логин пользователя
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Необходимо предоставить email и пароль.' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль.' })
    }

    // Генерация JWT токена с userId
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Если email не подтвержден, добавляем флаг emailVerified: false
    return res.json({
      token,
      emailVerified: user.emailVerified, // Если email не подтвержден, ставим false
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error('Ошибка при входе в систему:', error)
    res.status(500).json({ message: 'Ошибка при входе в систему.' })
  }
}

// Подтверждение регистрации
export const confirmRegistration = async (req, res) => {
  const { email, confirmationCode } = req.body

  if (!email || !confirmationCode) {
    return res.status(400).json({ message: 'Необходимо предоставить email и код подтверждения.' })
  }

  try {
    const user = await User.findOne({
      email,
      confirmationCode,
      confirmationCodeExpires: { $gt: Date.now() }, // Проверка на срок действия кода
    })

    if (!user) {
      return res.status(400).json({ message: 'Недействительный или просроченный код подтверждения.' })
    }

    // Подтверждаем email
    user.emailVerified = true
    user.confirmationCode = undefined
    user.confirmationCodeExpires = undefined
    await user.save()

    // Генерация токена после успешного подтверждения
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Отправляем подтверждение и токен
    res.status(200).json({
      message: 'Email успешно подтвержден.',
      token, // Отправляем токен обратно клиенту
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error('Ошибка при подтверждении регистрации:', error)
    res.status(500).json({ message: 'Ошибка при подтверждении регистрации.' })
  }
}

// Функция для получения профиля пользователя
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('orders') // Популяция для получения заказов
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' })
    }

    res.status(200).json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        orders: user.orders, // Если у вас есть поле с заказами
      },
    })
  } catch (error) {
    console.error('Ошибка при получении данных профиля:', error)
    res.status(500).json({ message: 'Ошибка при получении данных профиля.' })
  }
}

// Генерация и отправка токена сброса пароля
export const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Пожалуйста, предоставьте email.' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Пользователь с таким email не найден.' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordExpires = Date.now() + 3600000 // Токен действителен 1 час

    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetPasswordExpires
    await user.save()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_LOGIN,
      subject: 'Сброс пароля',
      text: `Вы запросили сброс пароля. Перейдите по следующему ссылке для сброса пароля: \n\n 
             http://localhost:5000/reset-password/${resetToken}`,
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'Письмо с инструкциями по сбросу пароля отправлено на ваш email.' })
  } catch (error) {
    console.error('Ошибка при отправке письма:', error)
    res.status(500).json({ message: 'Ошибка при отправке письма.' })
  }
}

// Сброс пароля
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Необходимо предоставить токен и новый пароль.' })
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Проверка на срок действия токена
    })

    if (!user) {
      return res.status(400).json({ message: 'Недействительный или просроченный токен.' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({ message: 'Пароль успешно обновлен.' })
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error)
    res.status(500).json({ message: 'Ошибка при сбросе пароля.' })
  }
}
