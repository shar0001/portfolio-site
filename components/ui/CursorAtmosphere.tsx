'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number      // core radius
  softR: number     // gradient radius = size × softness
  life: number
  maxLife: number
  r: number; g: number; b: number
  maxAlpha: number
}

// ── Palette — ivory / muted gold / warm gray / cool blue-gray ──────────────
const PALETTE = [
  { r: 232, g: 224, b: 206 }, // ivory
  { r: 203, g: 183, b: 131 }, // muted gold
  { r: 205, g: 196, b: 178 }, // warm gray
  { r: 155, g: 168, b: 174 }, // cool blue-gray
]
function pick() { return PALETTE[Math.floor(Math.random() * PALETTE.length)] }

/**
 * Interaction-reactive particle atmosphere.
 *
 * Desktop — cursor move: 1–3 soft particles per 50 ms around cursor
 *           click:       12–24 particle burst
 * Mobile  — tap:         12–24 particle burst (no continuous tracking)
 *
 * Particles: soft radial-gradient circles, opacity 0.04–0.20,
 *            2–14 px on move, up to 22 px on burst.
 *            Lifespan 48–144 frames (0.8–2.4 s at 60 fps).
 *            Respects prefers-reduced-motion.
 */
export function CursorAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
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

    // ── Spawn a single particle ──────────────────────────────────────────
    function spawnOne(
      cx: number,
      cy: number,
      spreadR  = 24,   // scatter radius around (cx,cy)
      speedMul = 1,
      maxSize  = 14,
      alphaMax?: number,
    ) {
      if (particles.current.length >= 90) return
      const col   = pick()
      const angle = Math.random() * Math.PI * 2
      const dist  = Math.random() * spreadR
      const size  = Math.random() * (maxSize - 2) + 2
      particles.current.push({
        x:        cx + Math.cos(angle) * dist,
        y:        cy + Math.sin(angle) * dist,
        vx:       (Math.random() - 0.5) * 0.45 * speedMul,
        vy:       -(Math.random() * 0.5 + 0.1) * speedMul,
        size,
        softR:    size * (1.6 + Math.random() * 1.2),
        life:     0,
        maxLife:  48 + Math.random() * 96,             // 0.8–2.4 s at 60 fps
        ...col,
        maxAlpha: alphaMax ?? (Math.random() * 0.16 + 0.04), // 0.04–0.20
      })
    }

    function spawnBurst(cx: number, cy: number) {
      const n = 12 + Math.floor(Math.random() * 12)    // 12–24
      for (let i = 0; i < n; i++) {
        spawnOne(cx, cy, 55, 1.3, 22, Math.random() * 0.14 + 0.06)
      }
    }

    // ── Desktop: time-throttled cursor tracking ──────────────────────────
    let lastSpawn = 0
    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastSpawn < 50) return              // ~20 spawn-events / s
      lastSpawn = now
      const n = 1 + Math.floor(Math.random() * 3)  // 1–3 particles
      for (let i = 0; i < n; i++) spawnOne(e.clientX, e.clientY)
    }

    const onClick = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY)

    // ── Mobile: tap burst only, no continuous tracking ───────────────────
    const onTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
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
      particles.current = particles.current.filter(p => p.life < p.maxLife)

      for (const p of particles.current) {
        const t = p.life / p.maxLife

        // Smooth 12 % fade-in, then gradual fade-out
        const alpha = p.maxAlpha * (
          t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88
        )

        if (alpha > 0.003) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.softR)
          g.addColorStop(0,   `rgba(${p.r},${p.g},${p.b},${alpha})`)
          g.addColorStop(0.45,`rgba(${p.r},${p.g},${p.b},${alpha * 0.35})`)
          g.addColorStop(1,   `rgba(${p.r},${p.g},${p.b},0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.softR, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }

        // Drift — upward, slight horizontal noise
        p.x  += p.vx
        p.y  += p.vy
        p.vx += (Math.random() - 0.5) * 0.018
        p.vy *= 0.991
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
