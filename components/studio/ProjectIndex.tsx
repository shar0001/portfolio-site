'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

// Centered index — rows link to the existing sections.
const PROJECTS: Project[] = [
  { cat: 'Editorial', title: 'Model Archive',        meta: '2022 — 25', href: '/model', img: '/media/韓国.jpeg' },
  { cat: 'iOS',       title: 'Pittanko App',          meta: 'App',       href: '/apps',  img: '/media/素材01.jpg' },
  { cat: 'iOS',       title: 'Kakeibo App',           meta: 'App',       href: '/apps',  img: '/media/素材01.jpg' },
  { cat: 'Motion',    title: 'Motion Reel',           meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Film',      title: 'AI Video Experiments',  meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Brand',     title: 'Marketing Tests',       meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Portrait',  title: 'Portrait Archive',      meta: 'ELLE',      href: '/model', img: '/media/ELLE JAPON × Van Cleef & Arpels.jpg' },
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

    // ── GSAP ScrollTrigger reveals (head + staggered rows) ─────────────────
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.s-reveal', { opacity: 1, y: 0 })
        return
      }
      gsap.set('.s-reveal', { opacity: 0, y: 26 })

      const rows = gsap.utils.toArray<HTMLElement>('.studio-row')
      ScrollTrigger.batch(rows, {
        start: 'top 88%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
          }),
        once: true,
      })

      const head = index.querySelector('.studio-index__head')
      if (head) {
        gsap.to(head, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: head, start: 'top 90%', once: true },
        })
      }
    }, index)

    // ── Cursor-following soft hover preview ────────────────────────────────
    let raf = 0
    const pos = { x: innerWidth * 0.7, y: innerHeight * 0.5 }
    const cur = { x: pos.x, y: pos.y }
    let py = 0 // gentle in-frame parallax

    const move = (e: MouseEvent) => { pos.x = e.clientX; pos.y = e.clientY }
    const follow = () => {
      cur.x += (pos.x - cur.x) * 0.12
      cur.y += (pos.y - cur.y) * 0.12
      preview.style.left = `${cur.x}px`
      preview.style.top  = `${cur.y}px`
      // subtle in-frame parallax driven by vertical cursor position
      const target = (pos.y / innerHeight - 0.5) * -24
      py += (target - py) * 0.08
      img.style.setProperty('--py', `${py.toFixed(2)}px`)
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
      ctx.revert()
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
        >
          <span className="studio-row__cat">{p.cat}</span>
          <span className="studio-row__title">{p.title}</span>
          <span className="studio-row__meta">{p.meta}</span>
        </Link>
      ))}

      {/* floating soft preview */}
      <div className="studio-preview" ref={previewRef} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} alt="" />
      </div>
    </section>
  )
}
