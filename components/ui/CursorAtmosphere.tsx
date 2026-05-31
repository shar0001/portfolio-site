'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  life: number
  maxLife: number
  r: number; g: number; b: number
  maxAlpha: number
}

// Palette — ivory, warm gold, cool blue-gray, warm gray
const PALETTE = [
  { r: 232, g: 224, b: 206 }, // ivory
  { r: 203, g: 183, b: 131 }, // warm gold
  { r: 155, g: 168, b: 174 }, // cool blue-gray
  { r: 205, g: 196, b: 178 }, // warm gray
]

function pick() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)]
}

/**
 * Desktop: cursor-reactive "air disturbance" particles.
 * Particles spawn in a radius AROUND the cursor, not at it —
 * the feel is disturbed air, not a sparkle trail.
 * Click creates a soft radial pulse.
 *
 * Mobile: lightweight passive particles drifting upward.
 * Both: respect prefers-reduced-motion.
 */
export function CursorAtmosphere() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const particles  = useRef<Particle[]>([])
  const rafId      = useRef<number>(0)
  const isMobile   = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    isMobile.current = 'ontouchstart' in window || window.innerWidth < 768

    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // ── Spawn a single particle around (cx, cy) ──────────────────────────
    const spawnOne = (
      cx: number,
      cy: number,
      burstRadius = 28,
      speedScale = 1,
      sizeScale  = 1,
    ) => {
      if (particles.current.length >= 70) return
      const col   = pick()
      const angle = Math.random() * Math.PI * 2
      const r     = Math.random() * burstRadius
      const maxLife = 90 + Math.random() * 90

      particles.current.push({
        x:        cx + Math.cos(angle) * r,
        y:        cy + Math.sin(angle) * r,
        vx:       (Math.random() - 0.5) * 0.3 * speedScale,
        vy:       -(Math.random() * 0.45 + 0.08) * speedScale,
        size:     (Math.random() * 7 + 1.5) * sizeScale,
        life:     0,
        maxLife,
        ...col,
        // max opacity 0.06–0.15 — very low, air-like
        maxAlpha: Math.random() * 0.09 + 0.05,
      })
    }

    // ── Desktop: cursor-reactive ─────────────────────────────────────────
    let moveFrame = 0
    const onMove = (e: MouseEvent) => {
      // Throttle to every 2nd mouse-move event
      if (++moveFrame % 2 !== 0) return
      if (Math.random() < 0.65) spawnOne(e.clientX, e.clientY, 28, 1, 1)
    }

    const onClick = (e: MouseEvent) => {
      // Click pulse — 10 particles in a wider radius
      for (let i = 0; i < 10; i++) {
        spawnOne(e.clientX, e.clientY, 60, 1.4, 1.3)
      }
    }

    // ── Mobile: passive ambient particles ────────────────────────────────
    let passiveTimer: ReturnType<typeof setInterval> | null = null
    if (isMobile.current) {
      passiveTimer = setInterval(() => {
        if (particles.current.length < 20) {
          const x = Math.random() * canvas.width
          const y = canvas.height + 10
          spawnOne(x, y, 20, 0.5, 0.8)
        }
      }, 600)
    } else {
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('click',     onClick, { passive: true })
    }

    // ── Render loop ───────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter(p => p.life < p.maxLife)

      for (const p of particles.current) {
        const t = p.life / p.maxLife

        // Smooth fade-in (0–15%) then fade-out
        const alpha = p.maxAlpha * (
          t < 0.15
            ? t / 0.15
            : 1 - (t - 0.15) / 0.85
        )

        if (alpha > 0) {
          ctx.save()
          ctx.globalAlpha = alpha
          ctx.fillStyle   = `rgb(${p.r},${p.g},${p.b})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * (1 - t * 0.2)), 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        p.x  += p.vx
        p.y  += p.vy
        p.vy *= 0.988   // gentle deceleration
        p.life++
      }

      rafId.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click',     onClick)
      if (passiveTimer) clearInterval(passiveTimer)
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
