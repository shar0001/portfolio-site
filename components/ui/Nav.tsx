'use client'
import { useState, useEffect } from 'react'

const links = [
  { href: '#appdev', label: 'App Dev' },
  { href: '#motion', label: 'Motion' },
  { href: '#visual', label: 'Visual' },
  { href: '#about', label: 'About' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 md:px-16 lg:px-24 h-16 flex items-center justify-between transition-all duration-700 ${
        scrolled
          ? 'bg-[rgba(8,8,8,0.88)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.05)]'
          : ''
      }`}
    >
      <a href="#hero" className="font-mono text-sm font-semibold text-[#f0f0f0] tracking-widest">
        SHR
      </a>

      <div className="hidden md:flex items-center gap-8">
        {links.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="font-mono text-xs text-[#505050] hover:text-[#f0f0f0] transition-colors duration-300 uppercase tracking-[0.15em]"
          >
            {label}
          </a>
        ))}
      </div>

      <a
        href="mailto:hello@example.com"
        className="hidden md:block font-mono text-xs text-[#404040] hover:text-[#818cf8] transition-colors duration-300"
      >
        Contact ↗
      </a>
    </nav>
  )
}
