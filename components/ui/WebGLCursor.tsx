'use client'
import { useEffect, useRef } from 'react'

/**
 * Custom cursor: a small dot at exact mouse position + a lagging ring.
 * Uses mix-blend-mode: difference so it remains visible over both dark
 * and bright surfaces. Hidden on touch/mobile devices.
 */
export function WebGLCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX  = 0
    let ringY  = 0
    let rafId  = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Dot follows exactly
      dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`
    }

    const onMouseEnterExpandable = () => {
      ring.dataset.expanded = 'true'
    }
    const onMouseLeaveExpandable = () => {
      ring.dataset.expanded = 'false'
    }

    const onMouseDown = (e: MouseEvent) => {
      // Spawn ripple element
      const ripple = document.createElement('div')
      ripple.className = 'webgl-cursor--ripple'
      ripple.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
      document.body.appendChild(ripple)
      // Remove after animation completes
      const cleanup = () => {
        ripple.removeEventListener('animationend', cleanup)
        ripple.remove()
      }
      ripple.addEventListener('animationend', cleanup)
    }

    // Track expandable elements
    const isExpandable = (el: Element | null): boolean => {
      if (!el) return false
      return (
        el.matches('[data-cursor="expand"], a, button') ||
        isExpandable(el.parentElement)
      )
    }

    const onMouseOver = (e: MouseEvent) => {
      if (isExpandable(e.target as Element)) {
        onMouseEnterExpandable()
      } else {
        onMouseLeaveExpandable()
      }
    }

    // Animation loop for ring lerp
    const animate = () => {
      // Ring lerps at ~0.18 easing
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousedown', onMouseDown)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="webgl-cursor--dot"  aria-hidden="true" />
      <div ref={ringRef} className="webgl-cursor--ring" aria-hidden="true" />
    </>
  )
}
