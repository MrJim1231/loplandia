import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Меняем порт на 3000
    host: true, // Делаем сервер доступным в сети
  },
})
