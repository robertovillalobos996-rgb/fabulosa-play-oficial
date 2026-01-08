import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Esto asegura que use la carpeta donde tienes /publicidad/
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})