'use client'
import { useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sceneState } from '@/lib/sceneState'

const Scene = dynamic(() => import('../canvas/Scene'), { ssr: false })

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Sync route to shared state for 3D canvas
  useEffect(() => {
    sceneState.activeRoute = pathname
    sceneState.scrollProgress = 0
  }, [pathname])

  // Lenis smooth scroll + GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    const onScroll = (e: { progress: number }) => {
      sceneState.scrollProgress = e.progress
      ScrollTrigger.update()
    }

    lenis.on('scroll', onScroll)

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
      <Scene />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  )
}
