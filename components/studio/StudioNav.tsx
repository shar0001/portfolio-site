'use client'
import Link from 'next/link'

const LINKS = [
  { href: '/studio',         label: 'Index' },
  { href: '/studio#work',    label: 'Work' },
  { href: '/studio#about',   label: 'About' },
  { href: '/studio#contact', label: 'Contact' },
]

/**
 * Minimal editorial nav. Uses mix-blend-mode: difference (set in CSS) so the
 * white text inverts against the light background and any visual behind it.
 */
export function StudioNav() {
  return (
    <nav className="studio-nav" aria-label="Studio">
      <div className="studio-nav__inner">
        <Link href="/studio" className="studio-nav__logo">SHR</Link>
        <div className="studio-nav__links">
          {LINKS.map(({ href, label }) => (
            <Link key={label} href={href} className="studio-nav__link">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
