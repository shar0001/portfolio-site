'use client'
import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; softR: number
  life: number; maxLife: number
  r: number; g: number; b: number
  maxAlpha: number
}

interface Ripple {
  x: number; y: number
  r: number; maxR: number
  alpha: number; life: number; maxLife: number
}

// Luminous pale-blue / violet / cyan / white palette
const PALETTE = [
  { r: 154, g: 184, b: 255 },  // pale blue    #9ab8ff
  { r: 208, g: 194, b: 255 },  // pale violet  #d0c2ff
  { r: 167, g: 239, b: 255 },  // cyan         #a7efff
  { r: 235, g: 242, b: 255 },  // near-white   #ebf2ff
  { r: 180, g: 220, b: 255 },  // sky blue
  { r: 255, g: 255, b: 255 },  // pure white sparks
]
function pick() { return PALETTE[Math.floor(Math.random() * PALETTE.length)] }

export function CursorAtmosphere() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const dotRef     = useRef<HTMLDivElement>(null)
  const particles  = useRef<Particle[]>([])
  const ripples    = useRef<Ripple[]>([])
  const curPos     = useRef({ x: -2000, y: -2000 })
  const haloPos    = useRef({ x: -2000, y: -2000 })
  const rafId      = useRef<number>(0)

  const [hovering, setHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(isTouch)

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

    // ── Spawn helpers ──────────────────────────────────────────────────────
    function spawnTiny(cx: number, cy: number, spread = 24, speed = 1) {
      if (particles.current.length >= 320) return
      const col = pick()
      const a = Math.random() * Math.PI * 2
      const d = Math.random() * spread
      const s = Math.random() * 3 + 2
      particles.current.push({
        x: cx + Math.cos(a) * d,
        y: cy + Math.sin(a) * d,
        vx: (Math.random() - 0.5) * 0.60 * speed,
        vy: -(Math.random() * 0.75 + 0.20) * speed,
        size: s, softR: s * 2.8,
        life: 0, maxLife: 30 + Math.random() * 45,
        ...col, maxAlpha: Math.random() * 0.20 + 0.25,
      })
    }

    function spawnMedium(cx: number, cy: number, spread = 36, speed = 1) {
      if (particles.current.length >= 320) return
      const col = pick()
      const a = Math.random() * Math.PI * 2
      const d = Math.random() * spread
      const s = Math.random() * 8 + 6
      particles.current.push({
        x: cx + Math.cos(a) * d,
        y: cy + Math.sin(a) * d,
        vx: (Math.random() - 0.5) * 0.42 * speed,
        vy: -(Math.random() * 0.52 + 0.10) * speed,
        size: s, softR: s * 3.0,
        life: 0, maxLife: 70 + Math.random() * 70,
        ...col, maxAlpha: Math.random() * 0.12 + 0.12,
      })
    }

    function spawnGlow(cx: number, cy: number, spread = 52, speed = 0.55) {
      if (particles.current.length >= 320) return
      const col = pick()
      const a = Math.random() * Math.PI * 2
      const d = Math.random() * spread
      const s = Math.random() * 21 + 15
      particles.current.push({
        x: cx + Math.cos(a) * d,
        y: cy + Math.sin(a) * d,
        vx: (Math.random() - 0.5) * 0.24 * speed,
        vy: -(Math.random() * 0.30 + 0.05) * speed,
        size: s, softR: s * 2.4,
        life: 0, maxLife: 100 + Math.random() * 120,
        ...col, maxAlpha: Math.random() * 0.06 + 0.06,
      })
    }

    function spawnBurst(cx: number, cy: number) {
      const n0 = 14 + Math.floor(Math.random() * 8)
      const n1 =  7 + Math.floor(Math.random() * 5)
      const n2 =  4 + Math.floor(Math.random() * 3)
      for (let i = 0; i < n0; i++) spawnTiny(cx,   cy, 75, 1.8)
      for (let i = 0; i < n1; i++) spawnMedium(cx, cy, 65, 1.4)
      for (let i = 0; i < n2; i++) spawnGlow(cx,   cy, 85, 1.0)
      // ripple ring
      if (ripples.current.length < 6) {
        ripples.current.push({ x: cx, y: cy, r: 0, maxR: 180, alpha: 0.28, life: 0, maxLife: 50 })
      }
    }

    // ── Desktop: throttled cursor tracking ────────────────────────────────
    let lastSpawn = 0
    const onMove = (e: MouseEvent) => {
      curPos.current = { x: e.clientX, y: e.clientY }
      
      // Initialize position if not set
      if (haloPos.current.x < -1000) {
        haloPos.current.x = e.clientX
        haloPos.current.y = e.clientY
      }

      const now = performance.now()
      if (now - lastSpawn < 22) return
      lastSpawn = now
      const n = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < n; i++) spawnTiny(e.clientX, e.clientY)
      if (Math.random() < 0.55) spawnMedium(e.clientX, e.clientY)
      if (Math.random() < 0.22) spawnGlow(e.clientX, e.clientY)
    }

    const onClick = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY)

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="hover"]')
      ) {
        setHovering(true)
      } else {
        setHovering(false)
      }
    }

    // ── Mobile: tap burst ──────────────────────────────────────────────────
    const onTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        curPos.current = { x: t.clientX, y: t.clientY }
        spawnBurst(t.clientX, t.clientY)
      }
    }

    if (isTouch) {
      window.addEventListener('touchstart', onTouch, { passive: true })
    } else {
      window.addEventListener('mousemove', onMove,       { passive: true })
      window.addEventListener('click',     onClick,      { passive: true })
      window.addEventListener('mouseover', onMouseOver,  { passive: true })
    }

    // ── Render loop ────────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // ── Halo — lagging cursor glow (desktop only) ──
      if (!isTouch) {
        // Easing interpolation for ultra-smooth movement (0.15 matches typical mouse transition nicely)
        const ease = 0.15
        if (curPos.current.x > -1000) {
          if (haloPos.current.x < -1000) {
            haloPos.current.x = curPos.current.x
            haloPos.current.y = curPos.current.y
          } else {
            haloPos.current.x += (curPos.current.x - haloPos.current.x) * ease
            haloPos.current.y += (curPos.current.y - haloPos.current.y) * ease
          }

          // Both dot and glow use EXACTLY the same coordinates - NO offset to keep them centered
          const hx = haloPos.current.x
          const hy = haloPos.current.y

          // Outer atmosphere halo (130px)
          const g1 = ctx.createRadialGradient(hx, hy, 0, hx, hy, 130)
          g1.addColorStop(0,   'rgba(154,184,255,0.18)')
          g1.addColorStop(0.3, 'rgba(154,184,255,0.07)')
          g1.addColorStop(0.7, 'rgba(154,184,255,0.02)')
          g1.addColorStop(1,   'rgba(154,184,255,0)')
          ctx.beginPath(); ctx.arc(hx, hy, 130, 0, Math.PI * 2)
          ctx.fillStyle = g1; ctx.fill()

          // Mid glow ring (68px)
          const g3 = ctx.createRadialGradient(hx, hy, 0, hx, hy, 68)
          g3.addColorStop(0,   'rgba(167,239,255,0.12)')
          g3.addColorStop(0.5, 'rgba(167,239,255,0.04)')
          g3.addColorStop(1,   'rgba(167,239,255,0)')
          ctx.beginPath(); ctx.arc(hx, hy, 68, 0, Math.PI * 2)
          ctx.fillStyle = g3; ctx.fill()

          // Inner bright core (42px)
          const g2 = ctx.createRadialGradient(hx, hy, 0, hx, hy, 42)
          g2.addColorStop(0,   'rgba(235,242,255,0.28)')
          g2.addColorStop(0.4, 'rgba(220,234,255,0.10)')
          g2.addColorStop(1,   'rgba(220,234,255,0)')
          ctx.beginPath(); ctx.arc(hx, hy, 42, 0, Math.PI * 2)
          ctx.fillStyle = g2; ctx.fill()

          // Subtle glowing edge (cursor border)
          ctx.beginPath(); ctx.arc(hx, hy, 16, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
          ctx.lineWidth = 1
          ctx.stroke()

          // Move the dot div in complete sync with the canvas drawing coordinates
          if (dotRef.current) {
            dotRef.current.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%)`
          }
        }
      }

      // ── Ripple rings ──
      ripples.current = ripples.current.filter(r => r.life < r.maxLife)
      for (const r of ripples.current) {
        const t = r.life / r.maxLife
        r.r = r.maxR * (1 - Math.pow(1 - t, 2.2))
        const alpha = r.alpha * (1 - t) * (1 - t)
        if (alpha > 0.003) {
          ctx.beginPath()
          ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(154,184,255,${alpha})`
          ctx.lineWidth = Math.max(0.5, 2 - t * 1.8)
          ctx.stroke()
          // secondary inner ripple
          const r2 = r.r * 0.55
          const a2 = alpha * 0.45
          if (a2 > 0.002 && r2 > 4) {
            ctx.beginPath()
            ctx.arc(r.x, r.y, r2, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(167,239,255,${a2})`
            ctx.lineWidth = Math.max(0.4, 1.4 - t)
            ctx.stroke()
          }
        }
        r.life++
      }

      // ── Particles ──
      particles.current = particles.current.filter(p => p.life < p.maxLife)

      for (const p of particles.current) {
        const t = p.life / p.maxLife
        const alpha = p.maxAlpha * (t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88)

        if (alpha > 0.005) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.softR)
          g.addColorStop(0,    `rgba(${p.r},${p.g},${p.b},${alpha})`)
          g.addColorStop(0.40, `rgba(${p.r},${p.g},${p.b},${alpha * 0.28})`)
          g.addColorStop(1,    `rgba(${p.r},${p.g},${p.b},0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.softR, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }

        p.x  += p.vx
        p.y  += p.vy
        p.vx += (Math.random() - 0.5) * 0.018
        p.vy *= 0.992
        p.life++
      }

      rafId.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize',     resize)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('click',      onClick)
      window.removeEventListener('mouseover',  onMouseOver)
      window.removeEventListener('touchstart', onTouch)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 4 }}
        aria-hidden="true"
      />
      {/* Show the simple dot cursor on desktop, styled exactly like the original SimpleCursor */}
      {!isTouchDevice && (
        <div
          ref={dotRef}
          className="fixed top-0 left-0 pointer-events-none rounded-full transition-all duration-150 ease-out"
          style={{
            width: hovering ? '20px' : '8px',
            height: hovering ? '20px' : '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            mixBlendMode: 'difference',
            zIndex: 9999,
            transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
            willChange: 'transform, width, height',
          }}
          aria-hidden="true"
        />
      )}
    </>
  )
}
