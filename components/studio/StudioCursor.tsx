'use client'
import { useEffect, useRef } from 'react'

export function StudioCursor() {
  const rRef    = useRef<HTMLDivElement>(null)
  const gRef    = useRef<HTMLDivElement>(null)
  const bRef    = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    const r = rRef.current, g = gRef.current, b = bRef.current, ring = ringRef.current
    if (!r || !g || !b || !ring) return

    const m  = { x: innerWidth / 2, y: innerHeight / 2 }
    const rp = { x: m.x, y: m.y }
    const gp = { x: m.x, y: m.y }
    const bp = { x: m.x, y: m.y }
    const rg = { x: m.x, y: m.y }
    let raf = 0

    const onMove = (e: MouseEvent) => { m.x = e.clientX; m.y = e.clientY }

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest('[data-cursor="expand"], a, button')
      ring.style.width   = t ? '76px' : '44px'
      ring.style.height  = t ? '76px' : '44px'
      ring.style.opacity = t ? '0.45' : '0.75'
    }

    const onDown = (e: MouseEvent) => {
      const rip = document.createElement('div')
      rip.className = 'studio-cursor studio-cursor--ring'
      rip.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;transition:transform 0.55s ease-out,opacity 0.55s ease-out`
      document.body.appendChild(rip)
      requestAnimationFrame(() => {
        rip.style.transform = 'translate(-50%,-50%) scale(2.8)'
        rip.style.opacity = '0'
      })
      setTimeout(() => rip.remove(), 600)
    }

    const tick = () => {
      // R follows slowest — trails the most, creates the "red ghost"
      rp.x += (m.x - rp.x) * 0.055; rp.y += (m.y - rp.y) * 0.055
      // G medium
      gp.x += (m.x - gp.x) * 0.11;  gp.y += (m.y - gp.y) * 0.11
      // B fastest — nearly at cursor tip
      bp.x += (m.x - bp.x) * 0.22;  bp.y += (m.y - bp.y) * 0.22
      // ring follows at mid speed
      rg.x += (m.x - rg.x) * 0.10;  rg.y += (m.y - rg.y) * 0.10

      r.style.transform    = `translate(${rp.x}px,${rp.y}px) translate(-50%,-50%)`
      g.style.transform    = `translate(${gp.x}px,${gp.y}px) translate(-50%,-50%)`
      b.style.transform    = `translate(${bp.x}px,${bp.y}px) translate(-50%,-50%)`
      ring.style.transform = `translate(${rg.x}px,${rg.y}px) translate(-50%,-50%)`
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
      <div ref={rRef}    className="studio-cursor studio-cursor--r"    aria-hidden="true" />
      <div ref={gRef}    className="studio-cursor studio-cursor--g"    aria-hidden="true" />
      <div ref={bRef}    className="studio-cursor studio-cursor--b"    aria-hidden="true" />
      <div ref={ringRef} className="studio-cursor studio-cursor--ring" aria-hidden="true" />
    </>
  )
}
