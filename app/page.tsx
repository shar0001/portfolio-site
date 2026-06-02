'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const container = containerRef.current
    if (!title || !container) return

    // Intro Animation
    gsap.fromTo(title, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
    )

    // Cursor Parallax & Skew Effect
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const xPos = (clientX / window.innerWidth - 0.5) * 2 // -1 to 1
      const yPos = (clientY / window.innerHeight - 0.5) * 2 // -1 to 1

      gsap.to(title, {
        x: xPos * 30,
        y: yPos * 30,
        skewX: xPos * 1.5,
        skewY: yPos * 1.5,
        duration: 1.2,
        ease: 'power3.out'
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <main ref={containerRef} className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <h1 
        ref={titleRef}
        className="text-center whitespace-nowrap will-change-transform"
        style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontWeight: 300,
          fontSize: 'clamp(4rem, 12vw, 150px)',
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          color: 'var(--text-primary)'
        }}
      >
        Shusaku<br />Nishiura
      </h1>
    </main>
  )
}
