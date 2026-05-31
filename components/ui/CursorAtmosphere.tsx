'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  softR: number
  life: number
  maxLife: number
  r: number; g: number; b: number
  maxAlpha: number
}

// Luminous pale-blue / violet / cyan palette
const PALETTE = [
  { r: 155, g: 184, b: 255 },  // pale blue   #9bb8ff
  { r: 200, g: 182, b: 255 },  // pale violet #c8b6ff
  { r: 167, g: 240, b: 255 },  // cyan        #a7f0ff
  { r: 240, g: 244, b: 255 },  // near-white
  { r: 180, g: 214, b: 255 },  // light blue
]
function pick() { return PALETTE[Math.floor(Math.random() * PALETTE.length)] }

/**
 * Three-layer luminous particle atmosphere.
 *
 * Layer 0 — tiny bright sparks:  2–5 px, high opacity, short life
 * Layer 1 — medium soft clouds:  5–13 px, medium opacity, medium life
 * Layer 2 — blurred glow blobs:  14–32 px, low opacity, long life
 *
 * Desktop: cursor halo (lagging glow) + particles on move + burst on click
 * Mobile:  visible burst on tap
 */
export function CursorAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const curPos    = useRef({ x: -1000, y: -1000 })
  const haloPos   = useRef({ x: -1000, y: -1000 })
  const rafId     = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // ── Spawn helpers ────────────────────────────────────────────────────
    function spawnTiny(cx: number, cy: number, spread = 22, speed = 1) {
      if (particles.current.length >= 220) return
      const col = pick()
      const a = Math.random() * Math.PI * 2
      const d = Math.random() * spread
      const s = Math.random() * 3.5 + 1.5
      particles.current.push({
        x: cx + Math.cos(a) * d,
        y: cy + Math.sin(a) * d,
        vx: (Math.random() - 0.5) * 0.55 * speed,
        vy: -(Math.random() * 0.65 + 0.15) * speed,
        size: s, softR: s * 2.6,
        life: 0, maxLife: 26 + Math.random() * 44,
        ...col, maxAlpha: Math.random() * 0.22 + 0.18,
      })
    }

    function spawnMedium(cx: number, cy: number, spread = 32, speed = 1) {
      if (particles.current.length >= 220) return
      const col = pick()
      const a = Math.random() * Math.PI * 2
      const d = Math.random() * spread
      const s = Math.random() * 8 + 5
      particles.current.push({
        x: cx + Math.cos(a) * d,
        y: cy + Math.sin(a) * d,
        vx: (Math.random() - 0.5) * 0.40 * speed,
        vy: -(Math.random() * 0.50 + 0.08) * speed,
        size: s, softR: s * 2.8,
        life: 0, maxLife: 60 + Math.random() * 70,
        ...col, maxAlpha: Math.random() * 0.11 + 0.08,
      })
    }

    function spawnGlow(cx: number, cy: number, spread = 48, speed = 0.55) {
      if (particles.current.length >= 220) return
      const col = pick()
      const a = Math.random() * Math.PI * 2
      const d = Math.random() * spread
      const s = Math.random() * 18 + 14
      particles.current.push({
        x: cx + Math.cos(a) * d,
        y: cy + Math.sin(a) * d,
        vx: (Math.random() - 0.5) * 0.22 * speed,
        vy: -(Math.random() * 0.28 + 0.04) * speed,
        size: s, softR: s * 2.2,
        life: 0, maxLife: 90 + Math.random() * 110,
        ...col, maxAlpha: Math.random() * 0.06 + 0.04,
      })
    }

    function spawnBurst(cx: number, cy: number) {
      const n0 = 10 + Math.floor(Math.random() * 6)
      const n1 =  5 + Math.floor(Math.random() * 4)
      const n2 =  3 + Math.floor(Math.random() * 3)
      for (let i = 0; i < n0; i++) spawnTiny(cx,   cy, 65, 1.5)
      for (let i = 0; i < n1; i++) spawnMedium(cx, cy, 55, 1.2)
      for (let i = 0; i < n2; i++) spawnGlow(cx,   cy, 70, 0.8)
    }

    // ── Desktop: throttled cursor tracking ──────────────────────────────
    let lastSpawn = 0
    const onMove = (e: MouseEvent) => {
      curPos.current = { x: e.clientX, y: e.clientY }
      const now = performance.now()
      if (now - lastSpawn < 30) return
      lastSpawn = now
      const n = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < n; i++) spawnTiny(e.clientX, e.clientY)
      if (Math.random() < 0.38) spawnMedium(e.clientX, e.clientY)
      if (Math.random() < 0.14) spawnGlow(e.clientX, e.clientY)
    }

    const onClick = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY)

    // ── Mobile: tap burst ────────────────────────────────────────────────
    const onTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        curPos.current = { x: t.clientX, y: t.clientY }
        spawnBurst(t.clientX, t.clientY)
      }
    }

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) {
      window.addEventListener('touchstart', onTouch, { passive: true })
    } else {
      window.addEventListener('mousemove', onMove,  { passive: true })
      window.addEventListener('click',     onClick, { passive: true })
    }

    // ── Render loop ───────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Halo — follows cursor with easing (desktop only)
      if (!isTouch) {
        haloPos.current.x += (curPos.current.x - haloPos.current.x) * 0.07
        haloPos.current.y += (curPos.current.y - haloPos.current.y) * 0.07

        if (curPos.current.x > -900) {
          const hx = haloPos.current.x, hy = haloPos.current.y

          // Outer soft halo
          const g1 = ctx.createRadialGradient(hx, hy, 0, hx, hy, 95)
          g1.addColorStop(0,   'rgba(155,184,255,0.10)')
          g1.addColorStop(0.4, 'rgba(155,184,255,0.03)')
          g1.addColorStop(1,   'rgba(155,184,255,0)')
          ctx.beginPath(); ctx.arc(hx, hy, 95, 0, Math.PI * 2)
          ctx.fillStyle = g1; ctx.fill()

          // Inner bright point
          const g2 = ctx.createRadialGradient(hx, hy, 0, hx, hy, 26)
          g2.addColorStop(0, 'rgba(220,234,255,0.16)')
          g2.addColorStop(1, 'rgba(220,234,255,0)')
          ctx.beginPath(); ctx.arc(hx, hy, 26, 0, Math.PI * 2)
          ctx.fillStyle = g2; ctx.fill()
        }
      }

      // Particles
      particles.current = particles.current.filter(p => p.life < p.maxLife)

      for (const p of particles.current) {
        const t = p.life / p.maxLife
        const alpha = p.maxAlpha * (t < 0.10 ? t / 0.10 : 1 - (t - 0.10) / 0.90)

        if (alpha > 0.004) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.softR)
          g.addColorStop(0,    `rgba(${p.r},${p.g},${p.b},${alpha})`)
          g.addColorStop(0.45, `rgba(${p.r},${p.g},${p.b},${alpha * 0.30})`)
          g.addColorStop(1,    `rgba(${p.r},${p.g},${p.b},0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.softR, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }

        p.x  += p.vx
        p.y  += p.vy
        p.vx += (Math.random() - 0.5) * 0.016
        p.vy *= 0.993
        p.life++
      }

      rafId.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize',     resize)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('click',      onClick)
      window.removeEventListener('touchstart', onTouch)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 4 }}
      aria-hidden="true"
    />
  )
}
