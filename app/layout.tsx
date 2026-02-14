import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Earth Echo',
  description: 'Performance-focused interactive experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
