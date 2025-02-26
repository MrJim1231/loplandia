import React, { useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'

const MetaTags = () => {
  const { language } = useContext(LanguageContext)
  const location = useLocation()

  useEffect(() => {
    let title, description, keywords, robots

    // Условие для главной страницы
    if (location.pathname === '/') {
      title = language === 'UA' ? 'Магазин постільної білизни' : 'Магазин постельного белья'
      description = language === 'UA' ? 'Купити постільну білизну з найкращою якістю для вашого комфорту.' : 'Купить постельное белье с лучшим качеством для вашего комфорта.'
      keywords =
        language === 'UA' ? 'постільна білизна, комфорт, якість, інтернет-магазин, постіль, текстиль, купити' : 'постельное белье, комфорт, качество, интернет-магазин, постель, текстиль, купить'
      robots = 'index, follow' // Разрешаем индексацию главной страницы
    }
    // Условие для страниц категорий
    else if (location.pathname.includes('categories')) {
      title = language === 'UA' ? 'Категорії постільної білизни' : 'Категории постельного белья'
      description = language === 'UA' ? 'Перегляньте наші категорії постільної білизни для комфортного сну.' : 'Посмотрите наши категории постельного белья для комфортного сна.'
      keywords = language === 'UA' ? 'категорії, постільна білизна, комфорт, текстиль' : 'категории, постельное белье, комфорт, текстиль'
      robots = 'index, follow'
    }
    // Условие для корзины
    else if (location.pathname.includes('cart')) {
      title = language === 'UA' ? 'Корзина покупок' : 'Корзина покупок'
      description = language === 'UA' ? 'Перегляньте ваші вибрані товари та оформіть замовлення.' : 'Посмотрите выбранные товары и оформите заказ.'
      keywords = language === 'UA' ? 'корзина, покупки, замовлення, товари' : 'корзина, покупки, заказ, товары'
      robots = 'index, follow' // Не индексировать корзину
    }
    // Условие для профиля
    else if (location.pathname.includes('profile')) {
      title = language === 'UA' ? 'Профіль користувача' : 'Профиль пользователя'
      description = language === 'UA' ? 'Перегляньте і редагуйте свій профіль.' : 'Посмотрите и отредактируйте свой профиль.'
      keywords = language === 'UA' ? 'профіль, користувач, налаштування, акаунт' : 'профиль, пользователь, настройки, аккаунт'
      robots = 'noindex, nofollow' // Не индексировать профиль
    }
    // Условие для страницы регистрации
    else if (location.pathname.includes('register')) {
      title = language === 'UA' ? 'Реєстрація на сайті' : 'Регистрация на сайте'
      description = language === 'UA' ? 'Зареєструйтесь, щоб зробити покупку та отримувати оновлення.' : 'Зарегистрируйтесь, чтобы сделать покупку и получать обновления.'
      keywords = language === 'UA' ? 'реєстрація, сайт, покупка, оновлення' : 'регистрация, сайт, покупка, обновления'
      robots = 'index, follow' // Не индексировать страницу регистрации
    }
    // Условие для других страниц
    else {
      title = language === 'UA' ? 'Магазин постільної білизни' : 'Магазин постельного белья'
      description = language === 'UA' ? 'Купити постільну білизну з найкращою якістю для вашого комфорту.' : 'Купить постельное белье с лучшим качеством для вашего комфорта.'
      keywords =
        language === 'UA' ? 'постільна білизна, комфорт, якість, інтернет-магазин, постіль, текстиль, купити' : 'постельное белье, комфорт, качество, интернет-магазин, постель, текстиль, купить'
      robots = 'index, follow'
    }

    document.title = title

    // Добавляем мета-теги для SEO
    const metaDescription = document.querySelector('meta[name="description"]')
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    const metaRobots = document.querySelector('meta[name="robots"]')

    if (metaDescription) metaDescription.setAttribute('content', description)
    if (metaKeywords) metaKeywords.setAttribute('content', keywords)
    if (metaRobots) metaRobots.setAttribute('content', robots)

    // Также можно добавить тег для hreflang, чтобы указать поисковикам, на каком языке страница
    const linkHreflang = document.querySelector('link[rel="alternate"][hreflang]')
    if (linkHreflang) linkHreflang.setAttribute('href', window.location.href)
  }, [language, location.pathname])

  return null
}

export default MetaTags
