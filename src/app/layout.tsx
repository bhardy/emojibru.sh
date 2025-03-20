import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EmojiBrush - Create Emoji Art',
  description: 'Create beautiful Emoji art for your friends and enemies',
  metadataBase: new URL('https://emojibru.sh'), // @todo: add env vars to handle this
  keywords: [
    'emoji art',
    'emoji creator',
    'emoji drawing',
    'online emoji art tool',
    'creative emoji',
    'digital emoji art',
    'emoji canvas',
  ],
  creator: 'Brant Hardy',
  alternates: {
    canonical: 'https://emojibru.sh',
  },
  robots: {
    index: true,
    follow: true,
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
