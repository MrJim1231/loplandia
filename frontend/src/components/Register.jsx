// Register.js
import React, { useState, useContext, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageContext'
import styles from './Register.module.css'

const Register = () => {
  const { language } = useContext(LanguageContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false)
  const [isUsernameValid, setIsUsernameValid] = useState(false)

  const text = {
    UA: {
      register: 'Реєстрація',
      email: 'Електронна пошта',
      password: 'Пароль',
      confirmPassword: 'Підтвердіть пароль',
      username: "Ім'я користувача",
      passwordError: 'Пароль повинен містити хоча б 6 символів',
      confirmPasswordError: 'Паролі не співпадають',
      usernameError: "Ім'я користувача повинно містити хоча б 3 символи",
      validPassword: 'Пароль валідний',
      validConfirmPassword: 'Паролі співпадають',
      validUsername: "Ім'я користувача валідне",
      submit: 'Зареєструватися',
      loading: 'Завантаження...',
      switchToLogin: 'Є акаунт? Увійти',
    },
    RU: {
      register: 'Регистрация',
      email: 'Электронная почта',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      username: 'Имя пользователя',
      passwordError: 'Пароль должен содержать хотя бы 6 символов',
      confirmPasswordError: 'Пароли не совпадают',
      usernameError: 'Имя пользователя должно содержать хотя бы 3 символа',
      validPassword: 'Пароль валиден',
      validConfirmPassword: 'Пароли совпадают',
      validUsername: 'Имя пользователя валидно',
      submit: 'Зарегистрироваться',
      loading: 'Загрузка...',
      switchToLogin: 'Есть аккаунт? Войти',
    },
  }

  const [currentText, setCurrentText] = useState(text[language])

  useEffect(() => {
    setCurrentText(text[language])
  }, [language])

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)

    if (value.length < 6) {
      setPasswordError(currentText.passwordError)
      setIsPasswordValid(false)
    } else {
      setPasswordError('')
      setIsPasswordValid(true)
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (value !== password) {
      setConfirmPasswordError(currentText.confirmPasswordError)
      setIsConfirmPasswordValid(false)
    } else {
      setConfirmPasswordError('')
      setIsConfirmPasswordValid(true)
    }
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value
    setUsername(value)

    if (value.length < 3) {
      setUsernameError(currentText.usernameError)
      setIsUsernameValid(false)
    } else {
      setUsernameError('')
      setIsUsernameValid(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = `${API_URL}/api/auth/register`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/confirm-email', { state: { email } })
      } else {
        setError(data.message || 'Ошибка регистрации')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError('Ошибка сервера')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.registerTitle}>{currentText.register}</h2>
      <form onSubmit={handleSubmit}>
        <input className={styles.inputField} type="text" value={username} onChange={handleUsernameChange} placeholder={currentText.username} required />
        <small className={isUsernameValid ? styles.valid : styles.invalid}>{isUsernameValid ? currentText.validUsername : usernameError}</small>
        <input className={styles.inputField} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={currentText.email} required />
        <input className={styles.inputField} type="password" value={password} onChange={handlePasswordChange} placeholder={currentText.password} required />
        <small className={isPasswordValid ? styles.valid : styles.invalid}>{isPasswordValid ? currentText.validPassword : passwordError}</small>
        <input className={styles.inputField} type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder={currentText.confirmPassword} required />
        <small className={isConfirmPasswordValid ? styles.valid : styles.invalid}>{isConfirmPasswordValid ? currentText.validConfirmPassword : confirmPasswordError}</small>
        <button className={styles.submitButton} type="submit" disabled={loading || !isPasswordValid || !isConfirmPasswordValid || !isUsernameValid}>
          {loading ? currentText.loading : currentText.submit}
        </button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.authSwitch}>
        <button onClick={() => navigate('/auth/login')}>{currentText.switchToLogin}</button>
      </div>
    </div>
  )
}

export default Register
