import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa' // Импорт иконок
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './CategorySlider.module.css'
import './reset.css'

const CategorySlider = () => {
  const { language } = useContext(LanguageContext)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sliderRef = useRef(null)

  const excludedCategories = new Set(['Постільна білизна', 'Півтора-спальний', 'Двоспальний', 'Евро', 'Євро', 'Сімейний', 'Індивідуальний пошив', 'Іедивідуальний пошив'])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: allCategories } = await axios.get(`${API_URL}/api/categories`, { cache: 'no-store' })
        const filteredCategories = allCategories.filter((category) => !excludedCategories.has(category.name))
        setCategories(filteredCategories)
      } catch (err) {
        setError('Ошибка при загрузке категорий')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>{error}</div>

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }

  const goNext = () => sliderRef.current.slickNext()
  const goPrev = () => sliderRef.current.slickPrev()

  return (
    <section className={styles.container}>
      <h2 className={styles.sectionTitle}>Категории</h2>
      <div className={styles.sliderContainer}>
        <button className={styles.prevArrow} onClick={goPrev}>
          <FaChevronLeft className={styles.iconArrow} /> {/* Иконка стрелки влево */}
        </button>
        <Slider ref={sliderRef} {...sliderSettings}>
          {categories.map((category) => (
            <div key={category._id} className={styles.categorySliderItem}>
              <Link to={`/category/allproductsofsubcategories/${category._id}`} className={styles.categoryLink}>
                <img loading="lazy" src={category.image || 'default-image.jpg'} alt={category.name} className={styles.categoryImage} width="300" height="200" />
                <h2 className={styles.categoryName}>{category.name}</h2>
              </Link>
            </div>
          ))}
        </Slider>
        <button className={styles.nextArrow} onClick={goNext}>
          <FaChevronRight className={styles.iconArrow} /> {/* Иконка стрелки вправо */}
        </button>
      </div>
    </section>
  )
}

export default CategorySlider
