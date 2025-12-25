import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bookstore-d1k4.onrender.com/api', // L'adresse de votre backend Node
        changeOrigin: true,
        secure: false,
      },
    },
  },
})