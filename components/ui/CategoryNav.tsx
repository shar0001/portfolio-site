'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/',      label: 'About' },
  { href: '/movie', label: 'Movie' },
  { href: '/apps',  label: 'Apps'  },
  { href: '/model', label: 'Model' },
]

export function CategoryNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-5 md:px-12 h-14 flex items-center justify-between"
      style={{
        background: 'linear-gradient(to bottom, rgba(8,12,26,0.88) 0%, rgba(8,12,26,0) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-mono text-[11px] tracking-[0.28em] transition-colors duration-300"
        style={{ color: '#8090c8' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#c8d8f8' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#8090c8' }}
      >
        SHR
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {LINKS.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="relative px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-all duration-300"
              style={{
                color: isActive ? '#f0f5ff' : '#8090c0',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = '#c0d0f0'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = '#8090c0'
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Contact — right side */}
      <a
        href="mailto:shusaku.bbb@gmail.com"
        className="hidden md:block font-mono text-[9px] tracking-[0.25em] transition-colors duration-300"
        style={{ color: '#6070a8' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#a0b4e0' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#6070a8' }}
      >
        Contact ↗
      </a>
    </nav>
  )
}
