import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Link, useLocation } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import styles from './Home.module.css'
import bannerImage from '/assets/image/banner/banner.jpg'
import './reset.css'

const Home = () => {
  const [categories, setCategories] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768) // Проверяем ширину экрана
  const { language } = useContext(LanguageContext)
  const location = useLocation()

  const texts = {
    UA: {
      welcome: 'Ласкаво просимо до магазину постільної білизни',
      subtitle: 'Найкраща якість для вашого комфорту',
      shopNow: 'Купити зараз',
      popularProducts: 'Популярні товари',
      price: 'Ціна',
      availability: 'Наявність',
      available: 'Є в наявності',
    },
    RU: {
      welcome: 'Добро пожаловать в магазин постельного белья',
      subtitle: 'Лучшее качество для вашего комфорта',
      shopNow: 'Купить сейчас',
      popularProducts: 'Популярные товары',
      price: 'Цена',
      availability: 'Наличие',
      available: 'Есть в наличии',
    },
  }

  const currentTexts = texts[language] || texts['UA']

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (location.pathname === '/') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = bannerImage
      link.as = 'image'
      link.type = 'image/jpeg'
      document.head.appendChild(link)
    }

    const fetchCategoriesWithProducts = async () => {
      try {
        const categoriesResponse = await axios.get(`${API_URL}/api/categories`)
        const categoriesData = categoriesResponse.data

        const productRequests = categoriesData.map((category) => axios.get(`${API_URL}/api/products/category/allproductsofsubcategories/${category._id}`))

        const productResponses = await Promise.all(productRequests)

        const categoriesWithProducts = categoriesData.map((category, index) => {
          const uniqueProducts = []
          const productNames = new Set()

          productResponses[index].data
            .filter((product) => product.available) // Оставляем только товары в наличии
            .forEach((product) => {
              if (product.price >= 500 && !productNames.has(product.name)) {
                uniqueProducts.push(product)
                productNames.add(product.name)
              }
            })

          return {
            ...category,
            products: uniqueProducts.slice(0, 2), // Берем 2 уникальных товара из каждой категории
          }
        })

        setCategories(categoriesWithProducts)
      } catch (error) {
        console.error('Ошибка при загрузке категорий и товаров:', error)
      }
    }

    fetchCategoriesWithProducts()
  }, [location.pathname])

  // Функция для вычисления цены со скидкой
  const getDiscountedPrice = (product, category) => {
    if (category && category.discount) {
      const discountedPrice = product.price - category.discount
      return discountedPrice > 0 ? discountedPrice : 0 // Цена не может быть меньше нуля
    }
    return null // Если скидки нет, возвращаем null
  }

  return (
    <div>
      <header className={styles.heroSection}>
        {location.pathname === '/' && <img src={bannerImage} alt={currentTexts.welcome} className={styles.heroBanner} loading="eager" />}
        <h1 className={styles.heroTitle}>{currentTexts.welcome}</h1>
        <p className={styles.heroSubtitle}>{currentTexts.subtitle}</p>
        <Link to="/categories" className={styles.shopNow}>
          {currentTexts.shopNow}
        </Link>
      </header>

      <section className={styles.featuredProducts}>
        <h2 className={styles.sectionTitle}>{currentTexts.popularProducts}</h2>
        <div className={styles.productsGrid}>
          {categories.map((category) =>
            category.products
              .filter((product) => product.available) // Показываем только товары в наличии
              .map((product) => {
                const discountedPrice = getDiscountedPrice(product, category)
                return (
                  <div key={product._id} className={styles.productCard}>
                    <Link to={`/group/${product.groupId}/products`}>
                      <img src={product.image[0]} alt={product.name} className={styles.productImage} loading="lazy" />
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productPrice}>
                        {currentTexts.price}:{' '}
                        {discountedPrice ? (
                          <>
                            <span className={styles.priceBeforeDiscount}>
                              {product.price} {isMobile ? '' : 'грн'}
                            </span>
                            <span className={styles.priceAfterDiscount}>{discountedPrice.toFixed(2)} грн</span>
                          </>
                        ) : (
                          <span className={styles.priceAfterDiscount}>{product.price} грн</span>
                        )}
                      </p>
                      <p className={styles.productAvailable}>
                        <strong>{currentTexts.availability}:</strong> {isMobile ? '✔' : currentTexts.available}
                      </p>
                    </Link>
                  </div>
                )
              })
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
