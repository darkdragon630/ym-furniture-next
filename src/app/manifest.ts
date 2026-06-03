import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'YM FURNITUR - Mebel Jepara',
    short_name: 'YM FURNITUR',
    description: 'Mebel Jepara berkualitas sejak 1985',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFDF7',
    theme_color: '#C49A35',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}