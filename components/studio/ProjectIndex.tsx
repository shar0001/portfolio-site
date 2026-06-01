'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const enc = (p: string) => p.split('/').map(encodeURIComponent).join('/')
const media = (p: string) => `${BASE}${enc(p)}`

interface Project {
  cat: string
  title: string
  meta: string
  href: string
  img: string
}

// Centered index — rows link to the existing (dark) sections.
const PROJECTS: Project[] = [
  { cat: 'Editorial',  title: 'Model Archive',    meta: '2022 — 25', href: '/model', img: '/media/韓国.jpeg' },
  { cat: 'Motion',     title: 'Motion Reel',       meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'iOS',        title: 'Pittanko',          meta: 'App',       href: '/apps',  img: '/media/素材01.jpg' },
  { cat: 'iOS',        title: 'Kakeibo',           meta: 'App',       href: '/apps',  img: '/media/素材01.jpg' },
  { cat: 'Brand Film', title: 'MIKIMOTO',          meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Portrait',   title: 'Van Cleef & Arpels', meta: 'ELLE',     href: '/model', img: '/media/ELLE JAPON × Van Cleef & Arpels.jpg' },
]

export function ProjectIndex() {
  const indexRef   = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const imgRef     = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const index   = indexRef.current
    const preview = previewRef.current
    const img     = imgRef.current
    if (!index || !preview || !img) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch  = window.matchMedia('(hover: none)').matches

    // ── Scroll reveal ──────────────────────────────────────────────────────
    const reveals = Array.from(index.querySelectorAll('.s-reveal')) as HTMLElement[]
    let io: IntersectionObserver | null = null
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.shown = 'true'
            io!.unobserve(e.target)
          }
        }),
        { threshold: 0.2 },
      )
      reveals.forEach((el) => io!.observe(el))
    } else {
      reveals.forEach((el) => { el.dataset.shown = 'true' })
    }

    // ── Cursor-following hover preview (desktop only) ──────────────────────
    let raf = 0
    const pos = { x: innerWidth * 0.7, y: innerHeight * 0.5 }
    const cur = { x: pos.x, y: pos.y }

    const move = (e: MouseEvent) => { pos.x = e.clientX; pos.y = e.clientY }
    const follow = () => {
      cur.x += (pos.x - cur.x) * 0.12
      cur.y += (pos.y - cur.y) * 0.12
      preview.style.left = `${cur.x}px`
      preview.style.top  = `${cur.y}px`
      raf = requestAnimationFrame(follow)
    }

    const rows = Array.from(index.querySelectorAll<HTMLElement>('.studio-row'))
    const enter = (src: string) => {
      img.src = src
      preview.dataset.show = 'true'
      index.dataset.hovering = 'true'
    }
    const leave = () => {
      preview.dataset.show = 'false'
      index.dataset.hovering = 'false'
    }

    if (!touch && !reduce) {
      window.addEventListener('mousemove', move, { passive: true })
      follow()
      rows.forEach((row) => {
        row.addEventListener('mouseenter', () => enter(row.dataset.img!))
        row.addEventListener('mouseleave', leave)
      })
    }

    return () => {
      io?.disconnect()
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="studio-index studio-container" id="work" ref={indexRef}>
      <div className="studio-index__head s-reveal">
        <span className="studio-index__label">Selected Work</span>
        <span className="studio-index__label">{`(${PROJECTS.length})`}</span>
      </div>

      {PROJECTS.map((p, i) => (
        <Link
          key={`${p.title}-${i}`}
          href={p.href}
          className="studio-row s-reveal"
          data-img={media(p.img)}
          data-cursor="expand"
          style={{ transitionDelay: `${Math.min(i, 5) * 60}ms` }}
        >
          <span className="studio-row__cat">{p.cat}</span>
          <span className="studio-row__title">{p.title}</span>
          <span className="studio-row__meta">{p.meta}</span>
        </Link>
      ))}

      {/* floating preview */}
      <div className="studio-preview" ref={previewRef} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} alt="" />
      </div>
    </section>
  )
}
