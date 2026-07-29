import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Elcorps Member Loyalty',
        short_name: 'Elcorps Loyalty',
        theme_color: '#0b3d5c',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // hati-hati cache untuk data point/transaksi — jangan cache API call, cukup cache static assets
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.elcorps\.com\/.*/i,
            handler: 'NetworkFirst', // data poin/reward harus selalu fresh, fallback ke cache kalau offline
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 5 },
          },
        ],
      },
    }),
  ],
})