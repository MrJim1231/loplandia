import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext' // Импорт контекста

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      {' '}
      {/* Оборачиваем приложение в провайдер языка */}
      <App />
    </LanguageProvider>
  </StrictMode>
)
