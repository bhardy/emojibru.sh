import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EmojiBrush',
  description: 'Make art for your friends (and enemies) with Emojis',
  openGraph: {
    title: 'EmojiBrush',
    description: 'Make art for your friends (and enemies) with Emojis',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EmojiBrush',
      },
      {
        url: '/twitter-image.png',
        width: 1200,
        height: 630,
        alt: 'EmojiBrush',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmojiBrush',
    description: 'Make art for your friends (and enemies) with Emojis',
    images: ['/twitter-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
