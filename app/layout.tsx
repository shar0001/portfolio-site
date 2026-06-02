import type { Metadata } from 'next'
import { Cormorant_Garamond, Albert_Sans, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import { CategoryNav } from '@/components/ui/CategoryNav'
import { CustomCursor } from '@/components/ui/CustomCursor'
import './globals.css'

const albertSans = Albert_Sans({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'Shusaku Nishiura | Portfolio',
  description: 'Portfolio of Shusaku Nishiura',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${albertSans.variable} ${geistMono.variable} ${cormorant.variable}`}>
      <body>
        <div className="noise-overlay" />
        <CustomCursor />
        <Providers>
          <CategoryNav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
