'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  life: number
  maxLife: number
  r: number; g: number; b: number
}

// Ivory and warm-gold tones only — no colors
const PALETTE = [
  { r: 231, g: 224, b: 207 }, // ivory
  { r: 216, g: 196, b: 138 }, // warm gold
  { r: 200, g: 188, b: 162 }, // warm grey-cream
]

export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles  = useRef<Particle[]>([])
  const rafId      = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Desktop only
    if ('ontouchstart' in window) return

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const spawn = (cx: number, cy: number) => {
      if (particles.current.length >= 55) return
      const col     = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const maxLife = 55 + Math.random() * 75
      particles.current.push({
        x: cx + (Math.random() - 0.5) * 18,
        y: cy + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.55 + 0.2),
        size: Math.random() * 2.8 + 1.2,
        life: 0,
        maxLife,
        ...col,
      })
    }

    const onMove = (e: MouseEvent) => {
      if (Math.random() < 0.55) spawn(e.clientX, e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter(p => p.life < p.maxLife)

      for (const p of particles.current) {
        const t     = p.life / p.maxLife
        // Fade in then fade out, max opacity 0.28
        const alpha = t < 0.15
          ? (t / 0.15) * 0.28
          : (1 - t) * 0.28

        ctx.save()
        ctx.globalAlpha = Math.max(0, alpha)
        ctx.shadowBlur  = 5
        ctx.shadowColor = `rgb(${p.r},${p.g},${p.b})`
        ctx.fillStyle   = `rgb(${p.r},${p.g},${p.b})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.25), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        p.x  += p.vx
        p.y  += p.vy
        p.vy *= 0.985
        p.life++
      }

      rafId.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    />
  )
}
