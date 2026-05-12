'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '@/content/profile'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.from(sectionRef.current.querySelectorAll('.fade-in'), {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    })
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen px-8 md:px-16 lg:px-24 py-24 flex flex-col justify-center"
    >
      <div className="mb-16">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-4">04</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#f0f0f0] fade-in">
          About
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl">
        {/* Bio paragraphs from content/profile.ts */}
        <div className="space-y-5">
          {profile.bio.map((paragraph, i) => (
            <p
              key={i}
              className={`fade-in leading-[1.85] ${
                i === 0
                  ? 'text-[#808080] text-base'
                  : i === profile.bio.length - 1
                  ? 'text-[#404040] text-sm'
                  : 'text-[#585858] text-sm'
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Career timeline from content/profile.ts */}
        <div className="fade-in">
          <div className="border-t border-[var(--border)]">
            {profile.career.map(({ year, role, org }) => (
              <div
                key={year}
                className="flex items-baseline gap-4 py-4 border-b border-[rgba(255,255,255,0.04)] group hover:bg-[rgba(255,255,255,0.01)] transition-colors px-2 -mx-2 rounded"
              >
                <span className="font-mono text-[10px] text-[#383838] w-28 shrink-0 leading-relaxed">
                  {year}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#c0c0c0] font-medium text-sm group-hover:text-[#f0f0f0] transition-colors">
                    {role}
                  </p>
                  <p className="font-mono text-[10px] text-[#383838] mt-0.5">{org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <p className="font-mono text-[10px] text-[#303030] tracking-widest uppercase">
          Open to new opportunities
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="font-mono text-sm text-[#606060] hover:text-[#818cf8] transition-colors duration-300 group"
        >
          {profile.email}{' '}
          <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">↗</span>
        </a>
      </div>
    </section>
  )
}
