'use client'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef } from 'react'
import { WebGLNav } from '@/components/ui/WebGLNav'
import { WebGLCursor } from '@/components/ui/WebGLCursor'

// ── Project data ─────────────────────────────────────────────────────────────
const PROJECTS = [
  { cat: 'Editorial', title: 'Model Archive',       meta: '2022 — 25', href: '/model', img: '/media/韓国.jpeg' },
  { cat: 'iOS',       title: 'Pittanko App',         meta: 'App',       href: '/apps',  img: '/media/素材01.jpg' },
  { cat: 'iOS',       title: 'Kakeibo App',          meta: 'App',       href: '/apps',  img: '/media/素材01.jpg' },
  { cat: 'Motion',    title: 'Motion Reel',          meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Film',      title: 'AI Video Experiments', meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Brand',     title: 'Marketing Tests',      meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Portrait',  title: 'Portrait Archive',     meta: 'ELLE',      href: '/model', img: '/media/ELLE JAPON × Van Cleef & Arpels.jpg' },
] as const

// Base path for static assets
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function encodeImagePath(path: string): string {
  return path
    .split('/')
    .map((seg) => (seg ? encodeURIComponent(seg) : seg))
    .join('/')
}

// ── Dynamically import the WebGL canvas (SSR disabled) ───────────────────────
const WebGLScene = dynamic(
  () => import('@/components/webgl/WebGLScene').then((m) => ({ default: m.WebGLScene })),
  { ssr: false }
)

// ── Page component ────────────────────────────────────────────────────────────
export default function WebGLHome() {
  const scrollRef = useRef<number>(0)

  // Track scroll position in a ref (no re-renders) so WebGL can read it
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hero reveal on mount
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reveals = Array.from(
      document.querySelectorAll('.webgl-hero .wgl-reveal')
    ) as HTMLElement[]

    if (reduce) {
      reveals.forEach((el) => (el.dataset.shown = 'true'))
    } else {
      reveals.forEach((el, i) =>
        window.setTimeout(() => { el.dataset.shown = 'true' }, 100 + i * 120)
      )
    }
  }, [])

  return (
    <>
      {/* ── WebGL canvas (fixed, behind everything) ─────────────────────── */}
      <WebGLScene scrollRef={scrollRef} />

      {/* ── Mobile CSS fallback background ─────────────────────────────── */}
      <div className="webgl-mobile-bg" aria-hidden="true" />

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <WebGLNav />

      {/* ── Custom cursor ───────────────────────────────────────────────── */}
      <WebGLCursor />

      {/* ── Scroll container (DOM content above WebGL canvas) ───────────── */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* Hero — 100vh */}
        <section className="webgl-hero" aria-label="Hero">
          <p className="webgl-hero__eyebrow wgl-reveal">
            Shusaku Nishiura — Tokyo
          </p>
          <h1
            className="webgl-hero__title wgl-reveal"
            style={{ transitionDelay: '60ms' }}
          >
            Body, image,{'\n'}product <em>&amp;</em> motion.
          </h1>
          <span
            className="webgl-hero__scroll wgl-reveal"
            style={{ transitionDelay: '200ms' }}
            aria-hidden="true"
          >
            <span
              style={{
                width: 28,
                height: 1,
                background: 'currentColor',
                display: 'inline-block',
              }}
            />
            Scroll
          </span>
        </section>

        {/* Projects — 7 × 100vh */}
        <div className="webgl-projects" aria-label="Projects">
          {PROJECTS.map((project, i) => (
            <section
              key={`${project.title}-${i}`}
              className="webgl-project"
              data-project-index={i}
              aria-label={project.title}
              style={
                // Mobile fallback: CSS background-image on the section itself
                {
                  ['--mobile-bg' as string]: `url("${BASE}${encodeImagePath(project.img)}")`,
                }
              }
            >
              {/* Mobile background image applied via inline style for SSR safety */}
              <style>{`
                @media (max-width: 767px) {
                  [data-project-index="${i}"] {
                    background-image: url("${BASE}${encodeImagePath(project.img)}");
                  }
                }
              `}</style>

              <div className="webgl-project__content">
                <span className="webgl-project__index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="webgl-project__title">{project.title}</h2>
                <div className="webgl-project__meta">
                  <span className="webgl-project__cat">{project.cat}</span>
                  <span className="webgl-project__year">{project.meta}</span>
                </div>
                <a
                  href={project.href}
                  className="webgl-project__cta"
                  data-cursor="expand"
                >
                  View project
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 11L11 1M11 1H3M11 1V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </section>
          ))}
        </div>

        {/* Footer / contact */}
        <footer
          className="webgl-footer"
          id="contact"
          aria-label="Contact"
        >
          <p className="webgl-footer__big">
            Let&rsquo;s make{'\n'}something precise.
          </p>
          <a
            href="mailto:shusaku.bbb@gmail.com"
            className="webgl-footer__email"
            data-cursor="expand"
          >
            shusaku.bbb@gmail.com
          </a>
        </footer>
      </div>
    </>
  )
}
