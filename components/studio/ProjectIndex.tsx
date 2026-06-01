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

    // ── Cursor-following hover preview with prism (chromatic aberration) ────
    let raf = 0
    const pos  = { x: innerWidth * 0.7, y: innerHeight * 0.5 }
    const cur  = { x: pos.x, y: pos.y }
    const last = { x: pos.x, y: pos.y }
    let burst = 0          // emerge/dissolve split impulse, decays each frame
    const imgs = Array.from(preview.querySelectorAll('img')) as HTMLImageElement[]

    const REST   = 1.5     // resting split (px) — faint prism at rest
    const VEL_K  = 0.55    // how strongly velocity widens the split
    const MAXSPL = 30      // clamp

    const move = (e: MouseEvent) => { pos.x = e.clientX; pos.y = e.clientY }
    const follow = () => {
      cur.x += (pos.x - cur.x) * 0.12
      cur.y += (pos.y - cur.y) * 0.12
      preview.style.left = `${cur.x}px`
      preview.style.top  = `${cur.y}px`

      // velocity of the eased follower → drives the channel split
      const vx = cur.x - last.x
      const vy = cur.y - last.y
      last.x = cur.x; last.y = cur.y
      const speed = Math.hypot(vx, vy)

      burst *= 0.88
      const split = Math.min(MAXSPL, REST + speed * VEL_K + burst)
      // split mostly along travel direction → reads as motion-prism
      const dirx = speed > 0.01 ? vx / speed : 1
      const diry = speed > 0.01 ? vy / speed : 0
      preview.style.setProperty('--sx', `${(split * dirx).toFixed(2)}px`)
      preview.style.setProperty('--sy', `${(split * diry * 0.6).toFixed(2)}px`)

      raf = requestAnimationFrame(follow)
    }

    const rows = Array.from(index.querySelectorAll<HTMLElement>('.studio-row'))
    const enter = (src: string) => {
      imgs.forEach((im) => { im.src = src })
      preview.dataset.show = 'true'
      index.dataset.hovering = 'true'
      burst = 26            // strong prism on emerge, eases to clean image
    }
    const leave = () => {
      preview.dataset.show = 'false'
      index.dataset.hovering = 'false'
      burst = 26            // splits apart again as it dissolves
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

      {/* floating preview — 3 channel layers screen-blended into a prism */}
      <div className="studio-preview" ref={previewRef} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="studio-preview__layer studio-preview__layer--g"><img alt="" /></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="studio-preview__layer studio-preview__layer--r"><img alt="" /></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="studio-preview__layer studio-preview__layer--b"><img ref={imgRef} alt="" /></div>
      </div>
    </section>
  )
}
