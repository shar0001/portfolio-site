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
        background: 'linear-gradient(to bottom, rgba(10,13,28,0.92) 0%, rgba(10,13,28,0) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Link
        href="/"
        className="font-mono text-[11px] tracking-[0.25em] transition-colors duration-300"
        style={{ color: '#7080b0' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#b0c4f0' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#7080b0' }}
      >
        SHR
      </Link>

      <div className="flex items-center">
        {LINKS.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors duration-300"
              style={{ color: isActive ? '#e8eeff' : '#6878a8' }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <a
        href="mailto:hello@example.com"
        className="hidden md:block font-mono text-[9px] tracking-widest transition-opacity duration-300"
        style={{ color: '#6878a8', opacity: 0.7 }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
      >
        Contact ↗
      </a>
    </nav>
  )
}
