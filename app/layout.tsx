import type { Metadata } from 'next'
import { Cormorant_Garamond, Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import { CategoryNav } from '@/components/ui/CategoryNav'
import { ScanLines } from '@/components/ui/ScanLines'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'SHR — PM / App Developer / Motion Designer',
  description: 'Creative professional at the intersection of product management, app development, and motion design.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable}`}>
      <body>
        <Providers>
          <ScanLines />
          <CategoryNav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
