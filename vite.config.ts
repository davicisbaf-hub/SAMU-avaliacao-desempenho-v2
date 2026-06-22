import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    allowedHosts: [
      'avaliacao360.cisbaf.org.br'
    ],
    
    proxy: {
      "/api": {
        target: "http://192.168.1.10:8026",
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
