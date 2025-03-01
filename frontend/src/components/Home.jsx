import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Link, useLocation } from 'react-router-dom'
import styles from './Home.module.css'
import './reset.css'
import Header from '../components/Header' // Импортируем новый компонент Header
import CategorySlider from '../components/CategorySlider'

const Home = () => {
  const [categories, setCategories] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
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
            .filter((product) => product.available)
            .forEach((product) => {
              if (product.price >= 500 && !productNames.has(product.name)) {
                uniqueProducts.push(product)
                productNames.add(product.name)
              }
            })

          return { ...category, products: uniqueProducts.slice(0, 2) }
        })

        setCategories(categoriesWithProducts)
      } catch (error) {
        console.error('Ошибка при загрузке категорий и товаров:', error)
      }
    }

    fetchCategoriesWithProducts()
  }, [location.pathname])

  const getDiscountedPrice = (product, category) => {
    if (category && category.discount) {
      const discountedPrice = product.price - category.discount
      return discountedPrice > 0 ? discountedPrice : 0
    }
    return null
  }

  return (
    <div>
      <Header /> {/* Используем новый компонент Header */}
      <CategorySlider /> {/* Используем новый компонент CategorySlider */}
      <section className={styles.featuredProducts}>
        <h2 className={styles.sectionTitle}>Популярные товары</h2>
        <div className={styles.productsGrid}>
          {categories.map((category) =>
            category.products.map((product) => {
              const discountedPrice = getDiscountedPrice(product, category)
              return (
                <div key={product._id} className={styles.productCard}>
                  <Link to={`/group/${product.groupId}/products`}>
                    <img src={product.image[0]} alt={product.name} className={styles.productImage} loading="lazy" />
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>
                      Цена:{' '}
                      {discountedPrice ? (
                        <>
                          <span className={styles.priceBeforeDiscount}>{product.price} грн</span>
                          <span className={styles.priceAfterDiscount}>{discountedPrice.toFixed(2)} грн</span>
                        </>
                      ) : (
                        <span className={styles.priceAfterDiscount}>{product.price} грн</span>
                      )}
                    </p>
                    <p className={styles.productAvailable}>
                      <strong>Наличие:</strong> {isMobile ? '✔' : 'Есть в наличии'}
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
