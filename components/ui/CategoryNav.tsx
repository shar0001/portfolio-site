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

  // Hidden on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-5 md:px-12 h-14 flex items-center justify-between"
      style={{
        background: 'linear-gradient(to bottom, rgba(8,8,6,0.92) 0%, rgba(8,8,6,0) 100%)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-mono text-[11px] tracking-[0.25em] transition-colors duration-300"
        style={{ color: '#484440' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#888278' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#484440' }}
      >
        SHR
      </Link>

      {/* Page links */}
      <div className="flex items-center">
        {LINKS.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors duration-300"
              style={{ color: isActive ? '#c0b8a0' : '#383430' }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Contact — desktop only */}
      <a
        href="mailto:hello@example.com"
        className="hidden md:block font-mono text-[9px] tracking-widest transition-opacity duration-300"
        style={{ color: '#484440', opacity: 0.6 }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0.6' }}
      >
        Contact ↗
      </a>
    </nav>
  )
}
