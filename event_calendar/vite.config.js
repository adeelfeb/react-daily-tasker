import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  define: {
    global: 'globalThis',
  },
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: 3000,
    open: true
  }
})
