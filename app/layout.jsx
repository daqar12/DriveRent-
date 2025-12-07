// app/layout.js

import '@/styles/globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { BookingProvider } from '@/context/BookingContext'

export const metadata = {
  title: 'DriveRent - Car Rental Platform',
  description: 'Premium car rental service with admin dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white" suppressHydrationWarning>
        <AuthProvider>
          <BookingProvider>
            <main className="min-h-screen">
              {children}
            </main>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}