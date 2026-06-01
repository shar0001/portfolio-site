'use client'
import { useEffect, useRef } from 'react'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export function AmbientBackground() {
  const blob1 = useRef<HTMLDivElement>(null)
  const blob2 = useRef<HTMLDivElement>(null)
  const blob3 = useRef<HTMLDivElement>(null)
  const blob4 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let mx = 0.5, my = 0.5
    let cx = 0.5, cy = 0.5
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth
      my = e.clientY / window.innerHeight
    }

    const tick = () => {
      cx += (mx - cx) * 0.025
      cy += (my - cy) * 0.025
      const dx = (cx - 0.5) * 60
      const dy = (cy - 0.5) * 45

      if (blob1.current) blob1.current.style.transform = `translate(${dx * -0.9}px, ${dy * -0.7}px)`
      if (blob2.current) blob2.current.style.transform = `translate(${dx * 0.7}px,  ${dy * 0.5}px)`
      if (blob3.current) blob3.current.style.transform = `translate(${dx * -0.4}px, ${dy * 0.9}px)`
      if (blob4.current) blob4.current.style.transform = `translate(${dx * 0.5}px,  ${dy * -0.6}px)`

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
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Deep navy base */}
      <div className="absolute inset-0" style={{ background: '#0d1324' }} />

      {/* Primary blue glow — top-left, parallax with cursor */}
      <div
        ref={blob1}
        className="absolute"
        style={{
          top: '-22%', left: '-16%',
          width: '80%', height: '75%',
          background: 'radial-gradient(ellipse at center, rgba(48,96,210,0.30) 0%, rgba(20,50,140,0.08) 52%, transparent 70%)',
          filter: 'blur(55px)',
          willChange: 'transform',
        }}
      />

      {/* Violet glow — right */}
      <div
        ref={blob2}
        className="absolute"
        style={{
          top: '8%', right: '-18%',
          width: '65%', height: '65%',
          background: 'radial-gradient(ellipse at center, rgba(90,60,200,0.20) 0%, rgba(60,30,160,0.05) 52%, transparent 70%)',
          filter: 'blur(65px)',
          willChange: 'transform',
        }}
      />

      {/* Cyan glow — bottom-center */}
      <div
        ref={blob3}
        className="absolute"
        style={{
          bottom: '-12%', left: '18%',
          width: '65%', height: '55%',
          background: 'radial-gradient(ellipse at center, rgba(28,120,200,0.18) 0%, rgba(12,80,160,0.04) 52%, transparent 70%)',
          filter: 'blur(75px)',
          willChange: 'transform',
        }}
      />

      {/* Secondary bright orb — mid-right */}
      <div
        ref={blob4}
        className="absolute"
        style={{
          top: '35%', right: '5%',
          width: '40%', height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(80,140,255,0.10) 0%, transparent 68%)',
          filter: 'blur(50px)',
          willChange: 'transform',
        }}
      />

      {/* Static center haze */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 55% at 48% 38%, rgba(24,48,110,0.14) 0%, transparent 65%)',
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.030,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 115% 115% at 50% 50%, transparent 38%, rgba(5,8,20,0.68) 100%)',
        }}
      />
    </div>
  )
}
