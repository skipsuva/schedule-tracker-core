import type { Metadata } from 'next'
import '../styles/globals.css'

// TODO: Add metadata configuration
export const metadata: Metadata = {
  title: 'Keel',
  description: 'A calm, household-level web application for tracking kids\' activities, camps, schedules, and costs',
}

// TODO: Implement root layout with providers, navigation, etc.
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
