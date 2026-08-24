import type { Metadata, Viewport } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthHeader } from '@/components/AuthHeader'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'QRZ Ready',
  description: 'QRZ is ham radio for who is calling? -- and soon, the answer will be you. Prepare for your FCC Amateur Radio license exam with smart memorization techniques.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'QRZ Ready',
  },
}

export const viewport: Viewport = {
  themeColor: '#0e1117',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plexMono.variable} font-sans bg-bg text-ink`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <AuthHeader />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
