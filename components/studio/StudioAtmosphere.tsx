'use client'
import { useEffect, useRef } from 'react'

const BLOBS = [
  { c: 'rgba(100, 55, 190, 0.38)',  s: 58, top: '6%',  left: '4%',  px: -1.0, py: -0.7 },
  { c: 'rgba(20, 90, 200, 0.30)',   s: 50, top: '44%', left: '60%', px:  0.8, py:  0.5 },
  { c: 'rgba(170, 40, 70, 0.24)',   s: 44, top: '70%', left: '18%', px: -0.5, py:  0.9 },
  { c: 'rgba(20, 150, 110, 0.28)',  s: 38, top: '22%', left: '76%', px:  0.6, py: -0.6 },
]

export function StudioAtmosphere() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = ref.current
    if (!root) return
    const nodes = Array.from(root.children) as HTMLElement[]

    let mx = 0.5, my = 0.5, cx = 0.5, cy = 0.5
    let t = 0, raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth
      my = e.clientY / window.innerHeight
    }

    const tick = () => {
      t += 0.005
      cx += (mx - cx) * 0.02
      cy += (my - cy) * 0.02
      const dx = (cx - 0.5) * 80
      const dy = (cy - 0.5) * 60

      nodes.forEach((n, i) => {
        const b = BLOBS[i]
        const driftX = Math.sin(t + i * 1.7) * 26
        const driftY = Math.cos(t + i * 1.1) * 22
        n.style.transform = `translate(${dx * b.px + driftX}px, ${dy * b.py + driftY}px)`
      })
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    tick()
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="studio-atmos" ref={ref} aria-hidden="true">
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="studio-atmos__blob"
          style={{
            top: b.top,
            left: b.left,
            width: `${b.s}vmin`,
            height: `${b.s}vmin`,
            background: `radial-gradient(circle at 50% 50%, ${b.c} 0%, transparent 68%)`,
          }}
        />
      ))}
    </div>
  )
}
