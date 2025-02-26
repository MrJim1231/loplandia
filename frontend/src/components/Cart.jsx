import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { LanguageContext } from '../context/LanguageContext'
import OrderForm from './OrderForm'
import './Cart.css'

const Cart = () => {
  const { cart, removeItem, changeQuantity, getTotalPrice, clearCart } = useContext(CartContext)
  const { language } = useContext(LanguageContext)
  const [isOrderFormVisible, setOrderFormVisible] = useState(false)
  const [elasticStates, setElasticStates] = useState({})
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-2) // Возвращаемся на предыдущую страницу
  }

  const handleRemoveItem = (itemId, itemParam) => {
    removeItem(itemId, itemParam)
  }

  const handleQuantityChange = (itemId, itemParam, change) => {
    const item = cart.find((item) => item.id === itemId && item.param === itemParam)
    const newQuantity = change === '+' ? item.quantity + 1 : item.quantity - 1
    if (newQuantity > 0 && newQuantity <= item.quantityInStock) {
      changeQuantity(itemId, itemParam, newQuantity)
    }
  }

  const calculateTotalPrice = () => {
    let totalPrice = getTotalPrice()
    cart.forEach((item) => {
      const key = `${item.id}-${item.param}`
      if (elasticStates[key]) {
        totalPrice += item.quantity * 100
      }
    })
    return totalPrice
  }

  const cartWithElastic = cart.map((item) => {
    const key = `${item.id}-${item.param}`
    return {
      ...item,
      includeElastic: elasticStates[key] || false,
      size: item.param,
      image: item.image[0] || 'https://via.placeholder.com/150',
    }
  })

  return (
    <div>
      {/* Навигационная панель */}
      <div className="navbar">
        <Link to="/" className="backToHomeLink">
          {language === 'UA' ? 'Головна' : 'Главная'}
        </Link>{' '}
        /{' '}
        <Link to="/categories" className="backToCategoriesLink">
          {language === 'UA' ? 'Категорії' : 'Категории'}
        </Link>{' '}
        /{' '}
        <span className="goBackButton" onClick={handleGoBack}>
          {language === 'UA' ? 'Товари' : 'Товары'}
        </span>
      </div>

      <div className="cart">
        <h1>{language === 'UA' ? 'Кошик' : 'Корзина'}</h1>
        {cart.length === 0 ? (
          <p>{language === 'UA' ? 'Кошик порожній' : 'Корзина пуста'}</p>
        ) : (
          <ul>
            {cart.map((item) => {
              const key = `${item.id}-${item.param}`
              return (
                <li key={key} className="cart-item">
                  <img src={item.image[0] || 'https://via.placeholder.com/150'} alt={`${language === 'UA' ? 'Купити' : 'Купить'} ${item.name}`} className="cart-item-image" />
                  <div>
                    <h2>{item.name}</h2>
                    <p>
                      {language === 'UA' ? 'Ціна:' : 'Цена:'} {item.price} грн
                    </p>
                    <p>
                      {language === 'UA' ? 'Розмір:' : 'Размер:'} {item.param}
                    </p>
                    <p>
                      {language === 'UA' ? 'В наявності:' : 'В наличии:'} {item.quantityInStock}
                    </p>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(item.id, item.param, '-')} disabled={item.quantity <= 1}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.param, '+')} disabled={item.quantity >= item.quantityInStock}>
                        +
                      </button>
                    </div>
                    <div className="elastic-option">
                      <input
                        type="checkbox"
                        id={`elastic-${key}`}
                        name={`elastic-${key}`}
                        checked={elasticStates[key] || false}
                        onChange={() =>
                          setElasticStates((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                      />
                      <label htmlFor={`elastic-${key}`}>{language === 'UA' ? ' Резинка (+100 грн за комплект)' : ' Резинка (+100 грн за комплект)'}</label>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id, item.param)}>{language === 'UA' ? 'Видалити' : 'Удалить'}</button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="cart-total">
          <h2>
            {language === 'UA' ? 'Разом:' : 'Итого:'} {calculateTotalPrice()} грн.
          </h2>
        </div>

        {cart.length > 0 && (
          <div className="cart-actions">
            <button onClick={() => setOrderFormVisible(!isOrderFormVisible)}>
              {isOrderFormVisible ? (language === 'UA' ? 'Сховати форму' : 'Скрыть форму') : language === 'UA' ? 'Оформити замовлення' : 'Оформить заказ'}
            </button>
            {isOrderFormVisible && <OrderForm cart={cartWithElastic} getTotalPrice={calculateTotalPrice} clearCart={clearCart} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
