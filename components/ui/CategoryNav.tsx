'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function CategoryNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  // Using mix-blend-difference so it remains visible against both dark/light backgrounds
  const linkClasses = "fixed z-50 text-[11px] font-sans uppercase tracking-[0.2em] mix-blend-difference text-[#EBE8E3] hover:opacity-70 transition-opacity"

  return (
    <>
      <Link href="/" className={`${linkClasses} top-8 left-8 md:top-12 md:left-12`}>
        Home
      </Link>
      <Link href="/movie" className={`${linkClasses} top-8 right-8 md:top-12 md:right-12`}>
        Index
      </Link>
      <Link href="/model" className={`${linkClasses} bottom-8 left-8 md:bottom-12 md:left-12`}>
        About
      </Link>
      <a href="mailto:shusaku.bbb@gmail.com" className={`${linkClasses} bottom-8 right-8 md:bottom-12 md:right-12`}>
        Contact
      </a>
    </>
  )
}
