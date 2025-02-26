import React, { useState, useContext } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import './OrderForm.css'

const OrderForm = ({ cart, getTotalPrice, clearCart }) => {
  const { language } = useContext(LanguageContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '1',
    phone: '1',
    email: 'berezhnoioleh@gmail.com',
    delivery: 'Нова Пошта',
    city: '2',
    postOffice: '3',
    payment: 'Повна оплата',
    note: '1',
  })

  const [isModalOpen, setIsModalOpen] = useState(false) // Состояние модалки
  const [isOrderComplete, setIsOrderComplete] = useState(false) // Отображать ли сообщение об успешном заказе

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    setIsModalOpen(true) // Открываем модалку

    const token = localStorage.getItem('token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          items: cart,
          total: getTotalPrice(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        clearCart()
        setIsOrderComplete(true) // Показываем сообщение "Заказ оформлен!"

        setTimeout(() => {
          setIsModalOpen(false)
          navigate(token ? '/profile' : '/')
        }, 2000) // Закрываем модалку через 2 сек
      } else {
        alert(language === 'UA' ? data.error || 'Помилка при оформленні замовлення. Спробуйте ще раз.' : data.error || 'Ошибка при оформлении заказа. Попробуйте снова.')
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error)
      alert(language === 'UA' ? 'Помилка при оформленні замовлення.' : 'Ошибка при оформлении заказа.')
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmitOrder} className="order-form">
        <div>
          <label>{language === 'UA' ? 'ПІБ' : 'ФИО'}</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div>
          <label>{language === 'UA' ? 'Телефон' : 'Телефон'}</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>{language === 'UA' ? 'Доставка' : 'Доставка'}</label>
          <input type="text" name="delivery" value="Нова Пошта" disabled />
        </div>
        <div>
          <label>{language === 'UA' ? 'Місто' : 'Город'}</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div>
          <label>{language === 'UA' ? 'Відділення пошти' : 'Отделение почты'}</label>
          <input type="text" name="postOffice" value={formData.postOffice} onChange={handleChange} required />
        </div>
        <div>
          <label>{language === 'UA' ? 'Оплата' : 'Оплата'}</label>
          <select name="payment" value={formData.payment} onChange={handleChange}>
            <option value="Повна оплата">{language === 'UA' ? 'Повна оплата' : 'Полная оплата'}</option>
            <option value="Наложений платіж с передоплатою 100 грн">{language === 'UA' ? 'Наложений платіж с передоплатою 100 грн' : 'Наложенный платеж с предоплатой 100 грн'}</option>
          </select>
        </div>
        <div>
          <label>{language === 'UA' ? 'Примітка' : 'Примечание'}</label>
          <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
        </div>
        <button type="submit">{language === 'UA' ? 'Підтвердити замовлення' : 'Подтвердить заказ'}</button>
      </form>

      {/* Модалка */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            {isOrderComplete ? (
              <p>{language === 'UA' ? 'Замовлення оформлено!' : 'Заказ оформлен!'}</p>
            ) : (
              <>
                <div className="preloader"></div>
                <p>{language === 'UA' ? 'Обробка замовлення...' : 'Обработка заказа...'}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default OrderForm
