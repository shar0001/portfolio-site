'use client'
import { useEffect, useRef } from 'react'

/**
 * ─── Glass hero visual ────────────────────────────────────────────────────────
 *
 * Strategy: use a PRE-RENDERED glass asset (video preferred, image fallback)
 * rather than real-time WebGL — true spectral dispersion / caustics can't be
 * reproduced live. Lightweight cursor effects are layered on top to make light
 * feel like it moves over the glass.
 *
 *   • Parallax       — CSS transform on the visual, eased toward the cursor
 *   • Soft glow      — cursor-following radial-gradient (mix-blend screen)
 *   • Prism highlight — cursor-following RGB/rainbow smear (mix-blend screen)
 *   • Ripple + particles — handled globally by <CursorAtmosphere/>
 *
 * ── To replace the asset later ────────────────────────────────────────────────
 *   Drop your files into /public/media/ :
 *     • glass-hero.mp4   ← looped pre-rendered glass video (preferred)
 *     • glass-hero.jpg   ← poster / static fallback image
 *   A <video> with only a poster (no playable mp4) simply shows the image, so
 *   the "static image only" strategy works with no code change.
 *
 * ── To tune intensity ─────────────────────────────────────────────────────────
 *   PARALLAX_PX / TILT_DEG / glow & prism gradient alphas below.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const VIDEO_SRC  = `${BASE}/media/glass-hero.mp4`
const POSTER_SRC = `${BASE}/media/glass-hero.jpg`

const PARALLAX_PX = 20   // how far the visual drifts with the cursor
const TILT_DEG    = 3.5  // subtle 3D tilt
const EASE_MOVE   = 0.06 // parallax inertia (lower = lazier)
const EASE_GLOW   = 0.12 // glow inertia

export function GlassHero() {
  const visualRef = useRef<HTMLDivElement>(null)
  const glowRef   = useRef<HTMLDivElement>(null)
  const prismRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch  = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    // Mobile / reduced-motion: keep the static visual, skip cursor effects.
    if (reduce || touch) return

    // We want the glow position in absolute pixels to avoid vertical alignment shifts
    // when the container height is greater than 100vh.
    const aim     = { x: 0, y: 0 }       // target, normalised -1..1
    const cur     = { x: 0, y: 0 }       // eased parallax
    
    // Using pixel-based positioning
    const gAim    = { x: typeof window !== 'undefined' ? window.innerWidth * 0.62 : 0, y: typeof window !== 'undefined' ? window.innerHeight * 0.4 : 0 }
    const gCur    = { x: typeof window !== 'undefined' ? window.innerWidth * 0.62 : 0, y: typeof window !== 'undefined' ? window.innerHeight * 0.4 : 0 }
    let raf = 0

    const onMove = (e: MouseEvent) => {
      aim.x = (e.clientX / window.innerWidth)  * 2 - 1
      aim.y = (e.clientY / window.innerHeight) * 2 - 1
      gAim.x = e.clientX
      gAim.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      cur.x  += (aim.x  - cur.x)  * EASE_MOVE
      cur.y  += (aim.y  - cur.y)  * EASE_MOVE
      gCur.x += (gAim.x - gCur.x) * EASE_GLOW
      gCur.y += (gAim.y - gCur.y) * EASE_GLOW

      if (visualRef.current) {
        visualRef.current.style.transform =
          `scale(1.08) translate3d(${cur.x * PARALLAX_PX}px, ${cur.y * PARALLAX_PX}px, 0)` +
          ` rotateX(${cur.y * -TILT_DEG}deg) rotateY(${cur.x * TILT_DEG}deg)`
      }
      
      const gx = gCur.x.toFixed(1)
      const gy = (gCur.y + window.scrollY).toFixed(1) // Adjust for vertical scroll offset
      
      if (glowRef.current) {
        glowRef.current.style.background =
          `radial-gradient(circle at ${gx}px ${gy}px,` +
          ` rgba(200,218,255,0.26), rgba(150,180,255,0.06) 20%, transparent 42%)`
      }
      if (prismRef.current) {
        // offset rainbow smear (approx 20px) → "light splitting through glass"
        const gxMinus20 = (gCur.x - 20).toFixed(1)
        const gxPlus20  = (gCur.x + 20).toFixed(1)
        const gyPlus20  = (gCur.y + 20 + window.scrollY).toFixed(1)
        
        prismRef.current.style.background =
          `radial-gradient(circle at ${gxMinus20}px ${gy}px, rgba(255,80,150,0.12), transparent 26%),` +
          `radial-gradient(circle at ${gxPlus20}px ${gy}px, rgba(90,200,255,0.12), transparent 26%),` +
          `radial-gradient(circle at ${gx}px ${gyPlus20}px, rgba(130,255,190,0.10), transparent 24%)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="glass-hero" aria-hidden="true">
      {/* CSS glass fallback — always behind, shows if no asset is present yet */}
      <div className="glass-hero__fallback" />

      {/* Pre-rendered glass asset (video; poster doubles as the static image) */}
      <div ref={visualRef} className="glass-hero__visual">
        <video
          className="glass-hero__media"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={POSTER_SRC}
          onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none' }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* Cursor-following soft glow — light gliding over the glass */}
      <div ref={glowRef} className="glass-hero__glow" />
      {/* Cursor-following prism highlight — spectral split */}
      <div ref={prismRef} className="glass-hero__prism" />

      {/* Readability mask — fades the visual under the text on the left */}
      <div className="glass-hero__mask" />
    </div>
  )
}
