'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Center the cursor dot on the mouse coordinates
    gsap.set(cursor, { xPercent: -50, yPercent: -50 })

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isMagnetic = target.closest('a, button, [role="button"]')

      if (isMagnetic) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          scale: 4,
          duration: 0.3,
          ease: 'power3.out'
        })
      } else {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          scale: 1,
          duration: 0.15,
          ease: 'power3.out'
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" />
}
