import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import './ConfirmEmail.css'

const ConfirmEmail = () => {
  const { language } = useContext(LanguageContext)
  const navigate = useNavigate()
  const location = useLocation() // Получаем email из state
  const [email, setEmail] = useState(location.state?.email || '') // Извлекаем email из state
  const [confirmationCode, setConfirmationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const text = {
    UA: {
      confirmEmail: 'Підтвердження електронної пошти',
      confirmationCode: 'Код підтвердження',
      submit: 'Підтвердити',
      loading: 'Завантаження...',
      success: 'Ваш email успішно підтверджено!',
      error: 'Помилка підтвердження',
    },
    RU: {
      confirmEmail: 'Подтверждение электронной почты',
      confirmationCode: 'Код подтверждения',
      submit: 'Подтвердить',
      loading: 'Загрузка...',
      success: 'Ваш email успешно подтвержден!',
      error: 'Ошибка подтверждения',
    },
  }

  const [currentText, setCurrentText] = useState(text[language])

  useEffect(() => {
    setCurrentText(text[language])
  }, [language])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const url = 'http://localhost:5000/api/auth/confirm-registration'
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, confirmationCode }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token && data.user) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          setSuccess(true)
          setTimeout(() => {
            navigate('/profile')
          }, 2000)
        } else {
          setError('Получены некорректные данные от сервера')
        }
      } else {
        setError(data.message || currentText.error)
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError(currentText.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="confirm-email-container">
      <h2>{currentText.confirmEmail}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="text" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} placeholder={currentText.confirmationCode} required />
        <button type="submit" disabled={loading}>
          {loading ? currentText.loading : currentText.submit}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{currentText.success}</p>}
    </div>
  )
}

export default ConfirmEmail
