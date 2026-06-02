import type { Metadata } from 'next'
import { Playfair_Display, Syne } from 'next/font/google'
import './webgl.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'SHR — Body, image, product & motion',
  description:
    'Model, motion designer, app creator, and production-minded creative based in Tokyo.',
}

export default function WebGLLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`webgl-theme ${playfair.variable} ${syne.variable}`}>
      {children}
    </div>
  )
}
