'use client'
import { useEffect, useRef, useState } from 'react'

export function SimpleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    let mouseX = -100
    let mouseY = -100

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      
      // Update cursor position directly without requestAnimationFrame for zero latency, 
      // or use rAF for smoother rendering.
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${hovering ? 2.5 : 1})`
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if hovering over clickable elements
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="hover"]')
      ) {
        setHovering(true)
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(2.5)`
      } else {
        setHovering(false)
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [hovering])

  return (
    <>
      <style>{`
        /* Hide the default cursor only on desktop */
        @media (pointer: fine) {
          body {
            cursor: none;
          }
          a, button, [data-cursor="hover"] {
            cursor: none;
          }
        }
      `}</style>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none rounded-full"
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          mixBlendMode: 'difference',
          zIndex: 9999,
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(1)',
          transition: 'transform 0.15s ease-out, background-color 0.15s ease-out',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </>
  )
}
