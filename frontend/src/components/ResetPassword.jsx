import React, { useState, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import styles from './ResetPassword.module.css' // Импортируем CSS-модуль

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false) // Состояние для модального окна
  const [isRequestSent, setIsRequestSent] = useState(false) // Статус успешности запроса
  const navigate = useNavigate()
  const { language } = useContext(LanguageContext)

  const handleResetPasswordRequest = async () => {
    setIsModalOpen(true) // Открываем модальное окно

    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password-request`, { email })
      setMessage(response.data.message)
      setIsRequestSent(true) // Успех — письмо отправлено
      setTimeout(() => {
        setIsModalOpen(false) // Закрываем модалку после успешного ответа
        navigate('/auth/login') // Редирект на страницу регистрации
      }, 2000)
    } catch (err) {
      setError('Не удалось отправить письмо. Попробуйте снова.')
      setIsRequestSent(false) // Ошибка — не удалось отправить
      setTimeout(() => {
        setIsModalOpen(false) // Закрываем модалку при ошибке
      }, 2000)
    }
  }

  const text = {
    UA: {
      title: 'Запит на скидання пароля',
      placeholder: 'Введіть ваш email',
      button: 'Відправити посилання для скидання пароля',
    },
    RU: {
      title: 'Запрос на сброс пароля',
      placeholder: 'Введите ваш email',
      button: 'Отправить ссылку для сброса пароля',
    },
  }

  return (
    <>
      <div className={styles.resetPasswordRequestContainer}>
        <h2>{text[language].title}</h2>
        <input type="email" placeholder={text[language].placeholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p>{error}</p>}
        {message && <p className={styles.successMessage}>{message}</p>}
        <button onClick={handleResetPasswordRequest} className={styles.button}>
          {text[language].button}
        </button>
      </div>

      {/* Модалка */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {isRequestSent ? (
              <p>{language === 'UA' ? 'Письмо с инструкциями отправлено!' : 'Письмо с инструкциями отправлено!'}</p>
            ) : (
              <>
                <div className={styles.preloader}></div>
                <p>{language === 'UA' ? 'Обробка запиту...' : 'Обработка запроса...'}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ResetPassword
