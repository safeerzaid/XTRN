import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: rootDir,
  plugins: [react(), tailwindcss()],

  server: {
    host: '0.0.0.0',
    port: 5173,

    // Proxy /api requests to the Express back-end.
    // This runs on the dev machine, so 'localhost' here always refers to
    // the PC — not the mobile device visiting 192.168.1.14:5173.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})