import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index-vanilla.html', // Change this to your desired HTML file
      },
    },
  },
  server: {
    open: '/index-vanilla.html', // Automatically open index2.html when the server starts
  },

  
  plugins: [react()],
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: 'jsdom',
    testTimeout: 5000,
  }
})
