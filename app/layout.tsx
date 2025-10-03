import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TENZIN - Safe-Human Level Intelligence | OCTAVE-X',
  description: 'Safe-Human Level Intelligence powered by revolutionary advances in neural architecture.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
