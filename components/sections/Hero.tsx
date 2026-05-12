'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 })

    tl.from(titleRef.current, {
      y: 70,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
    })
      .from(
        subtitleRef.current,
        { y: 30, opacity: 0, duration: 1, ease: 'power3.out' },
        '-=0.8',
      )
      .from(
        tagsRef.current ? Array.from(tagsRef.current.children) : [],
        { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.6',
      )
      .from(
        indicatorRef.current,
        { opacity: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.2',
      )

    return () => { tl.kill() }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-2xl">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] mb-8 uppercase">
          Portfolio / 2026
        </p>

        <h1
          ref={titleRef}
          className="text-[clamp(3.5rem,10vw,8rem)] font-semibold tracking-[-0.02em] leading-[0.9] mb-8 text-[#f0f0f0]"
        >
          Creative<br />
          <span className="text-[#2a2a2a]">——</span><br />
          Director
        </h1>

        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-[#505050] mb-10 leading-relaxed max-w-sm"
        >
          Building at the intersection of technology,
          motion, and visual direction.
        </p>

        <div ref={tagsRef} className="flex flex-wrap gap-2">
          {['PM', 'App Developer', 'Motion Designer', 'Visual'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-[11px] font-mono border border-[rgba(255,255,255,0.08)] text-[#606060] rounded-full hover:border-[rgba(255,255,255,0.15)] hover:text-[#909090] transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={indicatorRef}
        className="absolute bottom-10 left-8 md:left-16 lg:left-24 flex items-center gap-3 text-[#303030]"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#303030] to-transparent" />
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
      </div>
    </section>
  )
}
