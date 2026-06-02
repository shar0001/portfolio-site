'use client'
import { useEffect, useRef } from 'react'

/**
 * Refined premium cursor:
 *  - small dot at the tip
 *  - lagging ring that softly expands over interactive targets
 *  - a faint light haze that trails behind (calm organic atmosphere)
 *  - one soft ripple on click
 * Disabled on touch / reduced-motion.
 */
export function StudioCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hazeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    const dot = dotRef.current, ring = ringRef.current, haze = hazeRef.current
    if (!dot || !ring || !haze) return

    const m  = { x: innerWidth / 2, y: innerHeight / 2 }
    const r  = { x: m.x, y: m.y }   // ring — mild lag
    const h  = { x: m.x, y: m.y }   // haze — heavier lag
    let raf = 0

    const onMove = (e: MouseEvent) => { m.x = e.clientX; m.y = e.clientY }

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest('[data-cursor="expand"], a, button')
      ring.style.width   = t ? '70px' : '42px'
      ring.style.height  = t ? '70px' : '42px'
      ring.style.opacity = t ? '0.45' : '1'
    }

    const onDown = (e: MouseEvent) => {
      const rip = document.createElement('div')
      rip.className = 'studio-cursor studio-cursor--ring'
      rip.style.cssText =
        `left:${e.clientX}px;top:${e.clientY}px;` +
        `transition:transform 0.6s ease-out,opacity 0.6s ease-out`
      document.body.appendChild(rip)
      requestAnimationFrame(() => {
        rip.style.transform = 'translate(-50%,-50%) scale(2.6)'
        rip.style.opacity = '0'
      })
      setTimeout(() => rip.remove(), 650)
    }

    const tick = () => {
      r.x += (m.x - r.x) * 0.18; r.y += (m.y - r.y) * 0.18
      h.x += (m.x - h.x) * 0.07; h.y += (m.y - h.y) * 0.07
      dot.style.transform  = `translate(${m.x}px,${m.y}px) translate(-50%,-50%)`
      ring.style.transform = `translate(${r.x}px,${r.y}px) translate(-50%,-50%)`
      haze.style.transform = `translate(${h.x}px,${h.y}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(tick)
    }
    tick()

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={hazeRef} className="studio-cursor studio-cursor--haze" aria-hidden="true" />
      <div ref={ringRef} className="studio-cursor studio-cursor--ring" aria-hidden="true" />
      <div ref={dotRef}  className="studio-cursor studio-cursor--dot"  aria-hidden="true" />
    </>
  )
}
