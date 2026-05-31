'use client'
import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AmbientBackground } from '@/components/ui/AmbientBackground'
import { CursorAtmosphere }  from '@/components/ui/CursorAtmosphere'

export function Providers({ children }: { children: ReactNode }) {
  // Lenis smooth scroll + GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', () => { ScrollTrigger.update() })

    const rafCallback = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafCallback)
    }
  }, [])

  return (
    <>
      {/* Global atmosphere — sits behind all page content (z-index 0) */}
      <AmbientBackground />
      {/* Global interactive particles — floats above content (z-index 4) */}
      <CursorAtmosphere />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  )
}
