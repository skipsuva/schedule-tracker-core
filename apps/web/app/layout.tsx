import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Keel',
  description: 'The structure beneath your family plans.',
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
