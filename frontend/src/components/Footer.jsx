import React, { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext' // импортируем контекст
import styles from './Footer.module.css'

const Footer = () => {
  const { language } = useContext(LanguageContext) // получаем текущий язык из контекста

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2025 {language === 'UA' ? 'Магазин постільної білизни. Усі права захищені.' : 'Магазин постельного белья. Все права защищены.'}</p>
        <p>{language === 'UA' ? 'Контакт: info@beddingstore.com | Телефон: +38 067 123 4567' : 'Контакт: info@beddingstore.com | Телефон: +7 067 123 4567'}</p>
      </div>
    </footer>
  )
}

export default Footer
