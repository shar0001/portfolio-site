'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function CategoryNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  const categories = [
    { href: '/model', label: 'About' },
    { href: '/movie', label: 'Movie' },
    { href: '/apps',  label: 'Apps' },
    { href: '/model', label: 'Model' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-5 md:px-12 h-14 flex items-center justify-between"
      style={{ pointerEvents: 'none' }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8090c0] hover:text-[#f0f5ff] transition-colors"
        style={{ pointerEvents: 'auto' }}
        data-cursor="hover"
      >
        SHR
      </Link>

      {/* Nav Links */}
      <div className="flex gap-6 md:gap-10 absolute left-1/2 -translate-x-1/2">
        {categories.map((c) => {
          // Check if active. Map 'About' and 'Model' to '/model' logically depending on user route.
          const isActive = pathname === c.href
          
          return (
            <Link
              key={c.label}
              href={c.href}
              className="text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-300"
              style={{
                color: isActive ? '#ffffff' : '#8090c0',
                textShadow: isActive ? '0 0 12px rgba(154,184,255,0.4)' : 'none',
                pointerEvents: 'auto',
              }}
              data-cursor="hover"
            >
              {c.label}
            </Link>
          )
        })}
      </div>

      {/* Contact */}
      <a
        href="mailto:shusaku.bbb@gmail.com"
        className="font-mono text-[10px] tracking-[0.15em] text-[#8090c0] hover:text-[#f0f5ff] transition-colors"
        style={{ pointerEvents: 'auto' }}
        data-cursor="hover"
      >
        Contact ↗
      </a>
    </nav>
  )
}
