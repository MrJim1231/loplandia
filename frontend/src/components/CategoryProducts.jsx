import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import styles from './CategoryProducts.module.css'

const CategoryProducts = () => {
  const { language } = useContext(LanguageContext)
  const { categoryId } = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768) // Проверка ширины экрана
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [categoriesResponse, productResponse] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/products/category/allproductsofsubcategories/${categoryId}`),
        ])

        setCategories(categoriesResponse.data)
        setProducts(productResponse.data)

        const categoryData = categoriesResponse.data.find((cat) => cat._id === categoryId)
        setCategory(categoryData)
      } catch (err) {
        setError(language === 'UA' ? 'Помилка під час завантаження товарів' : 'Ошибка при загрузке товаров')
      } finally {
        setLoading(false)
      }
    }

    fetchProductsAndCategories()

    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [categoryId, language])

  if (loading) return <div>{language === 'UA' ? 'Завантаження...' : 'Загрузка...'}</div>
  if (error) return <div>{error}</div>

  const sortedProducts = [...products].sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price))
  const availableProducts = sortedProducts.filter((product) => product.available)

  const groupedProducts = Object.values(
    availableProducts.reduce((acc, product) => {
      if (!acc[product.name]) acc[product.name] = product
      return acc
    }, {})
  )

  const handleGroupClick = (groupId) => {
    if (groupId) navigate(`/group/${groupId}/products`)
  }

  // Вычисление цены с учетом скидки
  const getDiscountedPrice = (product) => {
    if (category && category.discount) {
      const discountedPrice = product.price - category.discount
      return discountedPrice > 0 ? discountedPrice : 0 // Цена не может быть меньше нуля
    }
    return null // Если скидки нет, возвращаем null
  }

  return (
    <div>
      <div className={styles.navigationLinks}>
        <Link to="/" className={styles.backToHomeLink}>
          {language === 'UA' ? 'Головна' : 'Главная'}
        </Link>
        {' / '}
        <Link to="/categories" className={styles.backToCategoriesLink}>
          {language === 'UA' ? 'Категорії' : 'Категории'}
        </Link>
      </div>

      <div className={styles.productsContainer}>
        <h2 className={styles.productsTitle}>{language === 'UA' ? 'Товари категорії' : 'Товары категории'}</h2>

        <div className={styles.sortContainer}>
          <label htmlFor="sortPrice" className={styles.sortLabel}>
            {language === 'UA' ? 'Сортувати за ціною:' : 'Сортировать по цене:'}
          </label>
          <select id="sortPrice" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={styles.sortSelect}>
            <option value="asc">{language === 'UA' ? 'Від дешевих до дорогих' : 'От дешевых к дорогим'}</option>
            <option value="desc">{language === 'UA' ? 'Від дорогих до дешевих' : 'От дорогих к дешевым'}</option>
          </select>
        </div>

        <div className={styles.productsGrid}>
          {groupedProducts.map((product, index) => (
            <div key={product.id || index} className={styles.productCard} onClick={() => handleGroupClick(product.groupId)}>
              {index < 2 ? (
                <img src={product.image[0]} alt={`Товар ${product.name}`} className={styles.productImage} width="300" height="200" />
              ) : (
                <img loading="lazy" src={product.image[0]} alt={`Товар ${product.name}`} className={styles.productImage} width="300" height="200" />
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                {language === 'UA' ? 'Ціна' : 'Цена'}:
                {getDiscountedPrice(product) ? (
                  <>
                    <span className={styles.priceBeforeDiscount}>
                      {product.price} {isMobile ? '' : 'грн'}
                    </span>
                    <span className={styles.priceAfterDiscount}>{getDiscountedPrice(product).toFixed(2)} грн</span>
                  </>
                ) : (
                  <span className={styles.priceAfterDiscount}>{product.price} грн</span>
                )}
              </p>
              <p className={styles.productAvailable}>
                <strong>{language === 'UA' ? 'Наявність' : 'Наличие'}:</strong>{' '}
                {isMobile ? '✔' : product.available ? (language === 'UA' ? 'Є в наявності' : 'Есть в наличии') : language === 'UA' ? 'Немає в наявності' : 'Нет в наличии'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryProducts
