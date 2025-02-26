// src/components/ProductDetails.js
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import './ProductDetails.css'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Ошибка при загрузке данных о продукте:', error)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product) // Используем функцию addToCart из контекста
      alert('Товар добавлен в корзину!')
    }
  }

  if (!product) {
    return <p>Загрузка...</p>
  }

  return (
    <div className="product-details">
      <div className="product-image-container">
        {product.image.length > 0 ? (
          product.image.map((img, index) => <img key={index} src={img || 'https://via.placeholder.com/150'} alt={`${product.name} ${index + 1}`} className="product-details-image" />)
        ) : (
          <p>Изображений нет</p>
        )}
      </div>

      <div className="product-description">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>
          Цена: {product.price} {product.currency}
        </p>
        <p>
          <strong>Параметр:</strong> {product.param}
        </p>

        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Добавить в корзину
        </button>
      </div>
    </div>
  )
}

export default ProductDetails
