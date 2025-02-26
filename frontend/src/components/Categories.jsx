import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Link } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import styles from './Categories.module.css'

const Categories = () => {
  const { language } = useContext(LanguageContext)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const excludedCategories = new Set(['Постільна білизна', 'Півтора-спальний', 'Двоспальний', 'Евро', 'Євро', 'Сімейний', 'Індивідуальний пошив', 'Іедивідуальний пошив'])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: allCategories } = await axios.get(`${API_URL}/api/categories`, { cache: 'no-store' })
        setCategories(allCategories.filter((category) => !excludedCategories.has(category.name)))
      } catch (err) {
        setError(language === 'UA' ? 'Помилка при завантаженні категорій' : 'Ошибка при загрузке категорий')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [language])

  const texts = {
    UA: {
      title: 'Купити постільну білизну за типом тканини',
      description: 'Обирайте якісні комплекти постільної білизни з бязі, сатину, ранфорсу, страйп-сатину та полікотону. Доставка по всій Україні!',
      loading: 'Завантаження...',
      backToHome: 'Головна',
    },
    RU: {
      title: 'Купить постельное бельё по типу ткани',
      description: 'Выбирайте качественные комплекты постельного белья из бязи, сатина, ранфорса, страйп-сатина и поликоттона. Доставка по всей Украине!',
      loading: 'Загрузка...',
      backToHome: 'Главная',
    },
  }

  if (loading) return <div>{texts[language].loading}</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      {' '}
      <Link to="/" className={styles.backToHomeLink}>
        {texts[language].backToHome}
      </Link>
      <div className={styles.categoriesContainer}>
        <h1 className={styles.categoriesTitle}>{texts[language].title}</h1>
        <p className={styles.categoriesDescription}>{texts[language].description}</p>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <Link key={category._id} to={`/category/allproductsofsubcategories/${category._id}`} className={styles.categoryLink}>
              {category.image ? (
                <img loading="lazy" src={category.image} alt={`${language === 'UA' ? 'Купити' : 'Купить'} ${category.name}`} className={styles.categoryImage} width="300" height="200" />
              ) : (
                <p>{language === 'UA' ? 'Зображення недоступне' : 'Изображение не доступно'}</p>
              )}
              <h2 className={styles.categoryName}>{category.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories
