import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // Quiet things down:
    reporters: ['dot'],     // compact output
    silent: true,           // hide console.log in successful tests
    logHeapUsage: false,    // keep memory noise down
    // handy, optional:
    css: true,              // let CSS imports just work
    globals: true,
    // Suppress console warnings
    onConsoleLog: () => false,
    // Disable browser console
    browser: {
      enabled: false
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
    }
  }
})