'use client'
import { useEffect, useRef } from 'react'
import { ProjectIndex } from '@/components/studio/ProjectIndex'

export default function StudioHome() {
  const rootRef = useRef<HTMLDivElement>(null)

  // Reveal hero blocks on mount (no scroll needed for the first view)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = Array.from(root.querySelectorAll('.s-reveal')) as HTMLElement[]
    if (reduce) { els.forEach((e) => (e.dataset.shown = 'true')); return }
    els.forEach((e, i) => {
      window.setTimeout(() => { e.dataset.shown = 'true' }, 120 + i * 110)
    })
  }, [])

  return (
    <div ref={rootRef}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="studio-hero studio-container">
        <p className="studio-hero__eyebrow s-reveal">
          Shusaku Nishiura — Tokyo
        </p>

        <h1 className="studio-hero__title s-reveal" style={{ transitionDelay: '60ms' }}>
          Body, image,<br />
          product <em>&amp;</em> motion.
        </h1>

        <p className="studio-hero__lead s-reveal" style={{ transitionDelay: '180ms' }}>
          Model, motion designer, app creator, and production-minded creative
          based in Tokyo — building visual systems across the body, the screen,
          and the product.
        </p>

        <span className="studio-hero__scroll s-reveal" style={{ transitionDelay: '300ms' }}>
          <span style={{ width: 28, height: 1, background: 'currentColor', display: 'inline-block' }} />
          Scroll
        </span>
      </header>

      {/* ── Project index ─────────────────────────────────────────────────── */}
      <ProjectIndex />

      {/* ── Footer / contact ──────────────────────────────────────────────── */}
      <footer className="studio-footer studio-container" id="contact">
        <p className="studio-footer__big">
          Let&rsquo;s make<br />something precise.
        </p>
        <a
          className="studio-footer__contact"
          href="mailto:shusaku.bbb@gmail.com"
          data-cursor="expand"
        >
          shusaku.bbb@gmail.com
        </a>
      </footer>
    </div>
  )
}
