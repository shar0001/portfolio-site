'use client'
import { useEffect, useRef } from 'react'

/**
 * Minimal premium cursor: a small dot + a lagging ring.
 * - ring expands when hovering interactive elements ([data-cursor="expand"])
 * - click emits one soft ripple ring
 * Disabled on touch / reduced-motion (handled in CSS + guards here).
 */
export function StudioCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const m = { x: innerWidth / 2, y: innerHeight / 2 }
    const r = { x: m.x, y: m.y }
    let raf = 0

    const onMove = (e: MouseEvent) => { m.x = e.clientX; m.y = e.clientY }

    // ring expands over interactive targets
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest('[data-cursor="expand"], a, button')
      ring.style.width  = t ? '68px' : '40px'
      ring.style.height = t ? '68px' : '40px'
      ring.style.opacity = t ? '0.6' : '1'
    }

    const onDown = (e: MouseEvent) => {
      const rip = document.createElement('div')
      rip.className = 'studio-cursor studio-cursor--ring'
      rip.style.left = `${e.clientX}px`
      rip.style.top  = `${e.clientY}px`
      rip.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out'
      document.body.appendChild(rip)
      requestAnimationFrame(() => {
        rip.style.transform = 'translate(-50%, -50%) scale(2.6)'
        rip.style.opacity = '0'
      })
      setTimeout(() => rip.remove(), 650)
    }

    const tick = () => {
      r.x += (m.x - r.x) * 0.18
      r.y += (m.y - r.y) * 0.18
      dot.style.transform  = `translate(${m.x}px, ${m.y}px) translate(-50%, -50%)`
      ring.style.transform = `translate(${r.x}px, ${r.y}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    tick()

    window.addEventListener('mousemove', onMove,  { passive: true })
    window.addEventListener('mouseover', onOver,  { passive: true })
    window.addEventListener('mousedown', onDown,  { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="studio-cursor studio-cursor--dot"  aria-hidden="true" />
      <div ref={ringRef} className="studio-cursor studio-cursor--ring" aria-hidden="true" />
    </>
  )
}
