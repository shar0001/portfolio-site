'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const categories = [
  { href: '/',       label: 'About',  color: '#818cf8' },
  { href: '/movie',  label: 'Movie',  color: '#3b82f6' },
  { href: '/apps',   label: 'Apps',   color: '#7c3aed' },
  { href: '/model',  label: 'Model',  color: '#f43f5e' },
]

export function CategoryNav() {
  const pathname = usePathname()
  const activeColor = categories.find(c => c.href === pathname)?.color ?? '#818cf8'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-8 md:px-16 h-16 flex items-center justify-between"
      style={{
        background: 'linear-gradient(to bottom, rgba(8,8,8,0.9) 0%, transparent 100%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="font-mono text-sm font-semibold text-[#f0f0f0] tracking-[0.25em]">
        SHR
      </Link>

      {/* Category links */}
      <div className="flex items-center gap-1">
        {categories.map(({ href, label, color }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="relative px-4 py-2 font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-300"
              style={{ color: isActive ? color : '#505050' }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-full"
                  style={{ background: `${color}10`, border: `1px solid ${color}25` }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </Link>
          )
        })}
      </div>

      {/* Contact */}
      <a
        href="mailto:hello@example.com"
        className="hidden md:block font-mono text-[11px] transition-colors duration-300"
        style={{ color: activeColor, opacity: 0.7 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
      >
        Contact ↗
      </a>
    </nav>
  )
}
