'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProjectIndex } from '@/components/studio/ProjectIndex'

export default function StudioHome() {
  const heroRef  = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Hero reveals on mount (no scroll needed for the first view).
    const hero = heroRef.current
    if (hero) {
      const els = Array.from(hero.querySelectorAll('.s-reveal')) as HTMLElement[]
      if (reduce) {
        els.forEach((e) => (e.dataset.shown = 'true'))
      } else {
        els.forEach((e, i) =>
          window.setTimeout(() => { e.dataset.shown = 'true' }, 120 + i * 110))
      }
    }

    // About reveals on scroll-in.
    const about = aboutRef.current
    if (!about) return
    if (reduce) {
      about.querySelectorAll('.s-reveal').forEach(
        (e) => ((e as HTMLElement).dataset.shown = 'true'))
      return
    }
    gsap.registerPlugin(ScrollTrigger)
    const st = ScrollTrigger.create({
      trigger: about,
      start: 'top 82%',
      once: true,
      onEnter: () =>
        about.querySelectorAll('.s-reveal').forEach(
          (e) => ((e as HTMLElement).dataset.shown = 'true')),
    })
    return () => { st.kill() }
  }, [])

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="studio-hero studio-container" ref={heroRef}>
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

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section className="studio-about studio-container" id="about" ref={aboutRef}>
        <span className="studio-about__label s-reveal">About</span>
        <p className="studio-about__body s-reveal" style={{ transitionDelay: '80ms' }}>
          A Tokyo-based practice working across <em>body</em>, <em>image</em>,
          {' '}<em>product</em> and <em>motion</em> — modelling, motion design and
          app development held to a single, production-minded standard. Every
          project is treated as a considered visual system rather than a one-off.
        </p>
      </section>

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
