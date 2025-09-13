import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        changeOrigin: true,
      },
    },
  },
  // Configure preview server for production-like runs (vite preview)
  // Render uses an external hostname; allow it here to avoid "Blocked request".
  preview: {
    host: '0.0.0.0',
    port: 4173,
    // Only allow the Render domain
    allowedHosts: ['setup-for-me.onrender.com'],
  },
})