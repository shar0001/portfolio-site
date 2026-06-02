'use client'
import Link from 'next/link'

const LINKS = [
  { href: '/#about',   label: 'About' },
  { href: '/movie',    label: 'Movie' },
  { href: '/apps',     label: 'Apps' },
  { href: '/model',    label: 'Model' },
  { href: '/#contact', label: 'Contact' },
]

/**
 * Minimal editorial nav for the WebGL homepage.
 * mix-blend-mode: difference (set in CSS) keeps the white text legible
 * over both the dark canvas and any bright project image behind it.
 */
export function WebGLNav() {
  return (
    <nav className="webgl-nav" aria-label="Main navigation">
      <div className="webgl-nav__inner">
        <Link href="/" className="webgl-nav__logo" aria-label="SHR — Home">
          SHR
        </Link>
        <div className="webgl-nav__links">
          {LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="webgl-nav__link"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
