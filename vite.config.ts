import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/image': path.resolve(__dirname, './lib/image-compat.tsx'),
      'next/link': path.resolve(__dirname, './lib/link-compat.tsx'),
    },
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000, // 100 MB para garantizar que todas las imágenes y fuentes se incrusten en Base64
    chunkSizeWarningLimit: 100000,
    cssCodeSplit: false,
    outDir: 'dist',
  },
})
