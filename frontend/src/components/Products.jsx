import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Products.css' // Создаем стили для компонента продуктов

function Products() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1) // Стартовая страница
  const [totalPages, setTotalPages] = useState(1) // Общее количество страниц

  // Функция для загрузки продуктов с API
  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?page=${page}`)
      setProducts(response.data.products) // Сохраняем полученные продукты
      setTotalPages(response.data.totalPages) // Сохраняем общее количество страниц
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error) // Логируем ошибку
    }
  }

  // Загружаем продукты при изменении страницы
  useEffect(() => {
    fetchProducts(page)
  }, [page])

  return (
    <div className="products">
      <h1>Продукты</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-item">
              <a href={`/product/${product._id}`}>
                <img
                  src={product.image[0] || 'https://via.placeholder.com/150'} // Используем изображение или заглушку
                  alt={product.name}
                  className="product-image"
                />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>
                  Цена: {product.price} {product.currency}
                </p>
              </a>
            </div>
          ))
        ) : (
          <p>Продукты не найдены.</p>
        )}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
          Назад
        </button>
        <span>
          Страница {page} из {totalPages}
        </span>
        <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages}>
          Вперед
        </button>
      </div>
    </div>
  )
}

export default Products
