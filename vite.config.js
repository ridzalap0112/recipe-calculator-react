import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = '/recipe-calculator-react/'

// https://vite.dev/config/
export default defineConfig({
  base: repoBase,
  plugins: [react()],
})
