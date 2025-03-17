import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EmojiBrush',
    short_name: 'EmojiBrush App',
    description: 'Make art for your friends (and enemies) with Emojis',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: '/icon-mask.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  }
}
