import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/AuthContext'

const inter = Inter({ 
  subsets: ['latin', 'greek'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'SMH holdings Admin Panel',
    template: '%s | SMH holdings Admin'
  },
  description: 'Admin panel for SMH holdings management',
  icons: {
    icon: '/logoetc.png',
    shortcut: '/logoetc.png',
    apple: '/logoetc.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

