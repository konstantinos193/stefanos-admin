import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/AuthContext'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: {
    default: 'Stefadash Admin Panel',
    template: '%s | Stefadash Admin'
  },
  description: 'Admin panel for STEFANOS MALESKOS Real Estate management',
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
      <body className={spaceGrotesk.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

