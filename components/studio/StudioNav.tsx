'use client'
import Link from 'next/link'

const LINKS = [
  { href: '/studio#about',   label: 'About',   hideMobile: false },
  { href: '/movie',          label: 'Movie',   hideMobile: false },
  { href: '/apps',           label: 'Apps',    hideMobile: false },
  { href: '/model',          label: 'Model',   hideMobile: false },
  { href: '/studio#contact', label: 'Contact', hideMobile: true  },
]

/**
 * Minimal editorial nav. mix-blend-mode: difference (set in CSS) keeps the
 * white text legible against the light field and any preview behind it.
 */
export function StudioNav() {
  return (
    <nav className="studio-nav" aria-label="Studio">
      <div className="studio-nav__inner">
        <Link href="/studio" className="studio-nav__logo">SHR</Link>
        <div className="studio-nav__links">
          {LINKS.map(({ href, label, hideMobile }) => (
            <Link
              key={label}
              href={href}
              className={`studio-nav__link${hideMobile ? ' studio-nav__link--hide-mobile' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
