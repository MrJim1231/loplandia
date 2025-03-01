import React, { useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
// import styles from './Header.module.css'
import styles from './Home.module.css'
import bannerImage from '/assets/image/banner/banner.jpg'

const Header = () => {
  const { language } = useContext(LanguageContext)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = bannerImage
      link.as = 'image'
      link.type = 'image/jpeg'
      document.head.appendChild(link)
    }
  }, [location.pathname])

  const texts = {
    UA: {
      welcome: 'Ласкаво просимо до магазину постільної білизни',
      subtitle: 'Найкраща якість для вашого комфорту',
      shopNow: 'Купити зараз',
    },
    RU: {
      welcome: 'Добро пожаловать в магазин постельного белья',
      subtitle: 'Лучшее качество для вашего комфорта',
      shopNow: 'Купить сейчас',
    },
  }

  const currentTexts = texts[language] || texts['UA']

  return (
    <header className={styles.heroSection}>
      {location.pathname === '/' && <img src={bannerImage} alt={currentTexts.welcome} className={styles.heroBanner} loading="eager" />}
      <h1 className={styles.heroTitle}>{currentTexts.welcome}</h1>
      <p className={styles.heroSubtitle}>{currentTexts.subtitle}</p>
      <Link to="/categories" className={styles.shopNow}>
        {currentTexts.shopNow}
      </Link>
    </header>
  )
}

export default Header
