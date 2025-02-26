import { useEffect, useState, useContext } from 'react'
import { API_URL } from '../config'
import { LanguageContext } from '../context/LanguageContext'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const Profile = () => {
  const { language } = useContext(LanguageContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1) // Текущая страница
  const ordersPerPage = 5 // Количество заказов на странице
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setError(language === 'UA' ? 'Ви не авторизовані' : 'Вы не авторизованы')
        setLoading(false)

        setTimeout(() => {
          navigate('/register')
        }, 0)

        return
      }

      try {
        const response = await fetch(`${API_URL}/api/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          localStorage.removeItem('token')
          setError(language === 'UA' ? 'Сесія закінчилась. Будь ласка, увійдіть знову.' : 'Сессия истекла. Пожалуйста, войдите снова.')

          setTimeout(() => {
            navigate('/register')
          }, 0)

          return
        }

        const data = await response.json()

        // Проверка, если сервер возвращает сообщение, а не массив
        if (data.message) {
          setError(data.message)
          setOrders([]) // Очистим заказы, так как они не найдены
        } else if (Array.isArray(data)) {
          setOrders(data)
        } else {
          console.error('Received data is not an array', data)
          setError(language === 'UA' ? 'Невірний формат даних' : 'Неверный формат данных')
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [language, navigate])

  // Вычисляем заказы для текущей страницы
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = Array.isArray(orders) ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : []

  // Переключение страниц
  const nextPage = () => setCurrentPage((prev) => prev + 1)
  const prevPage = () => setCurrentPage((prev) => prev - 1)

  return (
    <div className="profile-container">
      <h2 className="profile-title">{language === 'UA' ? 'Ваші замовлення' : 'Ваши заказы'}</h2>

      {loading && <p className="loading-text">{language === 'UA' ? 'Завантаження...' : 'Загрузка...'}</p>}
      {error && <p className="error-text">{error}</p>}

      {orders.length === 0 && !loading && !error && <p className="no-orders">{language === 'UA' ? 'Замовлення не знайдено.' : 'Заказы не найдены.'}</p>}

      {orders.length > 0 && (
        <>
          <div className="orders-list">
            {currentOrders.map((order) => (
              <div key={order._id} className="order-card">
                <h3 className="order-title">{language === 'UA' ? `Замовлення №${order.orderNumber}` : `Заказ №${order.orderNumber}`}</h3>
                <p>{language === 'UA' ? `Email: ${order.email}` : `Email: ${order.email}`}</p>
                <p>{language === 'UA' ? `Місто: ${order.city}` : `Город: ${order.city}`}</p>
                <p>{language === 'UA' ? `Відділення: ${order.postOffice}` : `Отделение: ${order.postOffice}`}</p>
                <p>{language === 'UA' ? `Сума: ${order.total} грн.` : `Сумма: ${order.total} грн.`}</p>
                <p>{language === 'UA' ? 'Товари:' : 'Товары:'}</p>
                <ul className="order-items-list">
                  {order.items.map((item, index) => (
                    <li key={index} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <p>
                          {item.name} x {item.quantity} — {item.price} {language === 'UA' ? 'грн.' : 'грн.'}
                        </p>
                        {item.size && <p>{language === 'UA' ? `Розмір: ${item.size}` : `Размер: ${item.size}`}</p>}
                        {item.includeElastic !== undefined && (
                          <p>{language === 'UA' ? (item.includeElastic ? 'Товар з резинкою' : 'Товар без резинки') : item.includeElastic ? 'Товар с резинкой' : 'Товар без резинки'}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {orders.length >= 5 && (
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
                {language === 'UA' ? 'Назад' : 'Назад'}
              </button>
              <span>
                {language === 'UA' ? 'Сторінка' : 'Страница'} {currentPage} / {Math.ceil(orders.length / ordersPerPage)}
              </span>
              <button onClick={nextPage} disabled={indexOfLastOrder >= orders.length}>
                {language === 'UA' ? 'Вперед' : 'Вперед'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Profile
