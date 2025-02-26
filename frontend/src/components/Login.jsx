import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import styles from './Login.module.css'

const text = {
  UA: {
    login: 'Увійти',
    email: 'Електронна пошта',
    password: 'Пароль',
    submit: 'Увійти',
    loading: 'Завантаження...',
    resetPassword: 'Відновити пароль',
    switchToRegister: 'Немає акаунта? Зареєструватися',
  },
  RU: {
    login: 'Войти',
    email: 'Электронная почта',
    password: 'Пароль',
    submit: 'Войти',
    loading: 'Загрузка...',
    resetPassword: 'Восстановить пароль',
    switchToRegister: 'Нет аккаунта? Зарегистрироваться',
  },
}

const Login = () => {
  const { language } = useContext(LanguageContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentText = text[language] || text.RU // Защита от undefined

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = 'http://localhost:5000/api/auth/login'
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`)
      }

      const data = await response.json()

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (!data.emailVerified) {
        navigate('/confirm-email', { state: { email: data.user.email } })
      } else {
        navigate('/profile')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError(error.message || 'Ошибка авторизации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <h2>{currentText.login}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={currentText.email} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={currentText.password} required />
        <button type="submit" disabled={loading}>
          {loading ? currentText.loading : currentText.submit}
        </button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.authSwitch}>
        <button onClick={() => navigate('/auth/register')}>{currentText.switchToRegister}</button>
      </div>

      <div className={styles.authActions}>
        <button onClick={() => navigate('/reset-password')}>{currentText.resetPassword}</button>
      </div>
    </div>
  )
}

export default Login
