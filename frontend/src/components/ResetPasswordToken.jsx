import React, { useState, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './ResetPasswordToken.module.css' // Импорт стилей
import { LanguageContext } from '../context/LanguageContext'

const ResetPasswordToken = () => {
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { token } = useParams()
  const { language } = useContext(LanguageContext)

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, {
        token,
        newPassword,
      })
      navigate('/auth/login')
    } catch (err) {
      setError(language === 'UA' ? 'Не вдалося скинути пароль. Спробуйте ще раз.' : 'Не удалось сбросить пароль. Попробуйте снова.')
    }
  }

  const texts = {
    UA: {
      title: 'Скидання пароля',
      placeholder: 'Введіть новий пароль',
      button: 'Скинути пароль',
    },
    RU: {
      title: 'Сброс пароля',
      placeholder: 'Введите новый пароль',
      button: 'Сбросить пароль',
    },
  }

  return (
    <div className={styles.resetPasswordTokenContainer}>
      <h2>{texts[language].title}</h2>
      <input
        type="password"
        className={styles.inputField}
        placeholder={texts[language].placeholder}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        aria-label={texts[language].placeholder}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
      <button className={styles.resetPasswordButton} onClick={handleResetPassword}>
        {texts[language].button}
      </button>
    </div>
  )
}

export default ResetPasswordToken
