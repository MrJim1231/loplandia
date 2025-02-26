import React, { createContext, useState, useEffect } from 'react'

// Создаем контекст
export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Загружаем корзину из localStorage при монтировании компонента
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCart(storedCart)
  }, []) // Загружаем корзину только один раз при монтировании

  // Сохраняем корзину в localStorage при изменении состояния корзины
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart]) // Обновляем localStorage каждый раз при изменении корзины

  // Добавляем товар в корзину
  const addToCart = (product) => {
    const updatedCart = [...cart]
    const existingItemIndex = updatedCart.findIndex((item) => item.id === product.id && item.param === product.param)

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += 1
    } else {
      updatedCart.push({ ...product, quantity: 1 })
    }

    setCart(updatedCart) // Обновляем состояние корзины
  }

  // Удаляем товар из корзины
  const removeItem = (itemId, itemParam) => {
    const updatedCart = cart.filter((item) => item.id !== itemId || item.param !== itemParam)
    setCart(updatedCart) // Обновляем состояние корзины
    localStorage.setItem('cart', JSON.stringify(updatedCart)) // Немедленно обновляем localStorage
  }

  // Изменяем количество товара в корзине
  const changeQuantity = (itemId, itemParam, quantity) => {
    const updatedCart = cart.map((item) => (item.id === itemId && item.param === itemParam ? { ...item, quantity } : item))
    setCart(updatedCart) // Обновляем состояние корзины
    localStorage.setItem('cart', JSON.stringify(updatedCart)) // Обновляем localStorage
  }

  // Получаем общую стоимость товаров в корзине
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Очищаем корзину
  const clearCart = () => {
    setCart([]) // Очищаем корзину
    localStorage.removeItem('cart') // Удаляем корзину из localStorage
  }

  return <CartContext.Provider value={{ cart, addToCart, removeItem, changeQuantity, getTotalPrice, clearCart }}>{children}</CartContext.Provider>
}
