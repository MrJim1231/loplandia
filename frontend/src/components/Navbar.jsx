import React, { useContext, useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { LanguageContext } from '../context/LanguageContext'
import { FaBars, FaTimes } from 'react-icons/fa'
import styles from './Navbar.module.css'
import CartIcon from './CartIcons'

function Navbar() {
  const { cart } = useContext(CartContext)
  const { language, changeLanguage } = useContext(LanguageContext)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef(null)
  const location = useLocation() // Добавляем для отслеживания текущего пути

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
    setIsOpen(false)
  }

  const texts = {
    UA: {
      home: 'Головна',
      categories: 'Категорії',
      cart: 'Кошик',
      profile: 'Особистий кабінет',
      logout: 'Вихід',
      languageSelect: 'Вибір мови',
    },
    RU: {
      home: 'Главная',
      categories: 'Категории',
      cart: 'Корзина',
      profile: 'Личный кабинет',
      logout: 'Выход',
      languageSelect: 'Выбор языка',
    },
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Функция для проверки активного состояния категории
  const isCategoryActive = (categoryId) => {
    return location.pathname.includes(categoryId)
  }

  return (
    <nav className={styles.navbar}>
      {!isOpen && <CartIcon />}
      <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Sleep & Dream
      </div>
      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
            {texts[language].home}
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" className={({ isActive }) => (isActive || isCategoryActive('category') ? styles.active : '')}>
            {texts[language].categories}
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? styles.active : '')}>
            {texts[language].cart} {getTotalItems() > 0 && <span>({getTotalItems()})</span>}
          </NavLink>
        </li>
        <li className={styles.authLinks}>
          {token ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
                {texts[language].profile}
              </NavLink>
              <NavLink to="/" onClick={handleLogout} className={styles.logoutButton}>
                {texts[language].logout}
              </NavLink>
            </>
          ) : (
            <NavLink to="/auth/login" className={({ isActive }) => (isActive ? styles.active : '')}>
              {texts[language].profile}
            </NavLink>
          )}
        </li>
        <li className={styles.languageWrapper}>
          <label htmlFor="languageSelect" className={styles.languageLabel}>
            {texts[language].languageSelect}
          </label>
          <select id="languageSelect" className={styles.languageSelect} value={language} onChange={(e) => changeLanguage(e.target.value)}>
            <option value="UA">UA</option>
            <option value="RU">RU</option>
          </select>
        </li>
      </ul>
      <div className={styles.burger} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes className={styles.burgerIcon} /> : <FaBars className={styles.burgerIcon} />}
      </div>
      <div ref={sidebarRef} className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive ? styles.active : '')}>
              {texts[language].home}
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive || isCategoryActive('category') ? styles.active : '')}>
              {texts[language].categories}
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive ? styles.active : '')}>
              {texts[language].cart} {getTotalItems() > 0 && <span>({getTotalItems()})</span>}
            </NavLink>
          </li>
          <li className={styles.authLinks}>
            {token ? (
              <>
                <NavLink to="/profile" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive ? styles.active : '')}>
                  {texts[language].profile}
                </NavLink>
                <NavLink to="/" onClick={handleLogout} className={styles.logoutButton}>
                  {texts[language].logout}
                </NavLink>
              </>
            ) : (
              <NavLink to="/auth/login" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive ? styles.active : '')}>
                {texts[language].profile}
              </NavLink>
            )}
          </li>
        </ul>
        <label htmlFor="languageSelectMobile" className={styles.languageLabel}>
          {texts[language].languageSelect}:
        </label>
        <select id="languageSelectMobile" className={styles.languageSelect} value={language} onChange={(e) => changeLanguage(e.target.value)}>
          <option value="UA">UA</option>
          <option value="RU">RU</option>
        </select>
      </div>
    </nav>
  )
}

export default Navbar
