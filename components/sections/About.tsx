'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const timeline = [
  { year: '2026 —', role: 'Product Manager', org: 'Current' },
  { year: '2023', role: 'App Developer', org: 'Freelance' },
  { year: '2021', role: 'Motion Designer', org: 'Agency' },
  { year: '2018', role: 'Model', org: 'Agency' },
]

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
        <div className="space-y-6">
          <p className="fade-in text-[#707070] leading-relaxed text-lg">
            Started as a model, transitioned into motion design and app development.
            Standing in front of a camera and building what runs behind screens
            gives me a perspective that&apos;s hard to find in one person.
          </p>
          <p className="fade-in text-[#505050] leading-relaxed text-sm">
            Currently focused on product management and development —
            bringing aesthetic sensibility to technical decisions,
            and technical precision to creative direction.
          </p>
          <p className="fade-in text-[#404040] leading-relaxed text-sm">
            Based in Japan. Available for select collaborations.
          </p>
        </div>

        <div className="fade-in">
          <div className="border-t border-[var(--border)]">
            {timeline.map(({ year, role, org }) => (
              <div
                key={year}
                className="flex items-baseline gap-6 py-5 border-b border-[rgba(255,255,255,0.04)] group hover:bg-[rgba(255,255,255,0.01)] transition-colors px-2 -mx-2 rounded"
              >
                <span className="font-mono text-[10px] text-[#383838] w-16 shrink-0">
                  {year}
                </span>
                <span className="text-[#c0c0c0] font-medium text-sm group-hover:text-[#f0f0f0] transition-colors">
                  {role}
                </span>
                <span className="font-mono text-[10px] text-[#383838] ml-auto shrink-0">
                  {org}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-[#303030] tracking-widest uppercase">
            Open to new opportunities
          </p>
          <p className="font-mono text-[10px] text-[#282828]">© 2026</p>
        </div>

        <a
          href="mailto:hello@example.com"
          className="font-mono text-sm text-[#606060] hover:text-[#818cf8] transition-colors duration-300 group"
        >
          hello@example.com{' '}
          <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">↗</span>
        </a>
      </div>
    </section>
  )
}
