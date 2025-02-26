import { createContext, useState, useEffect } from 'react'

export const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('language')
    return savedLang === 'UA' || savedLang === 'RU' ? savedLang : 'UA'
  })

  // Изменяем атрибут lang в <html>
  useEffect(() => {
    document.documentElement.lang = language === 'UA' ? 'uk' : 'ru'
  }, [language])

  // Функция для смены языка
  const changeLanguage = (newLang) => {
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return <LanguageContext.Provider value={{ language, changeLanguage }}>{children}</LanguageContext.Provider>
}
