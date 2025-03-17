import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ServiceWorkerUnregister from '@/components/ServiceWorkerUnregister'
import './globals.css'

export const metadata: Metadata = {
  title: 'EmojiBrush',
  description: 'Make art for your friends (and enemies) with Emojis',
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
        <ServiceWorkerUnregister />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
