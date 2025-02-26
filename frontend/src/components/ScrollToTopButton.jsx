import React, { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa' // Импортируем иконку стрелочки вверх
import './ScrollToTopButton.css' // Стиль для кнопки

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Показывать или скрывать кнопку в зависимости от прокрутки
  const checkScrollTop = () => {
    if (!isVisible && window.pageYOffset > 400) {
      setIsVisible(true)
    } else if (isVisible && window.pageYOffset <= 400) {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  }, [isVisible])

  return <div className="scroll-to-top">{isVisible && <FaArrowUp className="scroll-icon" onClick={scrollToTop} />}</div>
}

export default ScrollToTopButton
