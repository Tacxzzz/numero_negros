import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BetMoto',
        short_name: 'BetMoto',
        description: 'BetMoto',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f0ba2c',
        icons: [
          {
            src: 'icons/BetMotoLogoOnly.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/BetMotoLogoOnly.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/',
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
  build: {
    minify: false,
    sourcemap: false,
    cssCodeSplit: false,
    target: 'esnext',
    ssr: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
