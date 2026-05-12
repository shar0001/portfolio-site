import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import { CategoryNav } from '@/components/ui/CategoryNav'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SHR — PM / App Developer / Motion Designer',
  description: 'Creative professional at the intersection of product management, app development, and motion design.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <CategoryNav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
