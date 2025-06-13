import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthHeader } from '@/components/AuthHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hack The Ham',
  description: 'Hack your way to Amateur Radio license success with smart memorization techniques for Technician, General, and Extra class exams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <AuthHeader />
            <main className="flex-1">
              {children}
            </main>
            <footer className="mt-auto py-4 px-4 text-center border-t border-gray-200 bg-white">
              <p className="text-sm text-gray-500">
                Created by{' '}
                <a 
                  href="https://www.qrz.com/db/NY0E" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  NY0E
                </a>
                {' '}• 73
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
