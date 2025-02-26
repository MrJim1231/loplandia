import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { FaShoppingCart } from 'react-icons/fa'
import styles from './CartIcon.module.css'

const CartIcon = () => {
  const { cart } = useContext(CartContext)

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const totalItems = getTotalItems()

  return totalItems > 0 ? (
    <Link to="/cart" className={styles.cartIcon}>
      <FaShoppingCart className={styles.cartIconImage} />
      <span className={styles.cartCount}>{totalItems}</span>
    </Link>
  ) : null // Иконка не отображается, если в корзине нет товаров
}

export default CartIcon
