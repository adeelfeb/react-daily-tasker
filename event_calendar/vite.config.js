import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    jsxImportSource: 'react'
  })],
  define: {
    global: 'globalThis',
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  },
  optimizeDeps: {
    include: ['react-big-calendar'],
    force: true
  },
  build: {
    commonjsOptions: {
      include: [/react-big-calendar/, /node_modules/]
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },
  logLevel: 'warn'
})
