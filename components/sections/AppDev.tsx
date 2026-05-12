'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const apps = [
  {
    name: 'ピッタンコ',
    description:
      'A smart bill-splitting app with group management, custom ratios, and instant settlement calculation.',
    tech: ['Swift', 'SwiftUI', 'Firebase'],
    status: 'Released',
    year: '2024',
    platforms: ['iOS'],
  },
  {
    name: 'App 02',
    description: 'Next project — details coming soon.',
    tech: ['React Native', 'Supabase', 'TypeScript'],
    status: 'In Dev',
    year: '2025',
    platforms: ['iOS', 'Android'],
  },
]

const techStack = ['Swift / SwiftUI', 'React Native', 'Next.js', 'Firebase', 'Supabase', 'TypeScript']

export function AppDev() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const cards = sectionRef.current.querySelectorAll<HTMLElement>('.bento-card')

    gsap.from(cards, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 72%',
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
    })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <section
      id="appdev"
      ref={sectionRef}
      className="min-h-screen px-8 md:px-16 lg:px-24 py-24"
    >
      <div className="mb-16">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-4">01</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#f0f0f0]">
          App Development
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Featured app — large */}
        <div className="bento-card md:col-span-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 min-h-[360px] flex flex-col justify-between group hover:border-[var(--border-hover)] transition-all duration-500">
          <div>
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="font-mono text-[10px] text-[#383838] mb-2 tracking-widest">{apps[0].year}</p>
                <h3 className="text-2xl font-semibold text-[#f0f0f0]">{apps[0].name}</h3>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-mono bg-[var(--surface-2)] text-[#505050] rounded-lg border border-[var(--border)]">
                {apps[0].status}
              </span>
            </div>
            <p className="text-[#505050] leading-relaxed text-sm max-w-md">
              {apps[0].description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {apps[0].tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-[11px] font-mono text-[#818cf8] bg-[var(--accent-bg)] rounded-md"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Tech stack card */}
        <div className="bento-card md:col-span-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 min-h-[360px] flex flex-col gap-4">
          <p className="font-mono text-[10px] text-[#383838] uppercase tracking-[0.3em]">Stack</p>
          <div className="flex-1 flex flex-col gap-3 justify-center">
            {techStack.map((tech, i) => (
              <div key={tech} className="flex items-center gap-3">
                <div className="w-[3px] h-[3px] rounded-full bg-[#818cf8] shrink-0 opacity-60" />
                <span className="text-xs font-mono text-[#606060]">{tech}</span>
              </div>
            ))}
          </div>
          <div className="font-mono text-[10px] text-[#303030]">
            {apps[0].platforms.join(' · ')}
          </div>
        </div>

        {/* Second app */}
        <div className="bento-card md:col-span-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 min-h-[200px] flex flex-col justify-between group hover:border-[var(--border-hover)] transition-all duration-500">
          <div>
            <p className="font-mono text-[10px] text-[#383838] mb-1.5 tracking-widest">{apps[1].year}</p>
            <h3 className="text-lg font-semibold text-[#f0f0f0] mb-3">{apps[1].name}</h3>
            <p className="text-xs text-[#505050] leading-relaxed">{apps[1].description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {apps[1].tech.map((t) => (
              <span key={t} className="px-2 py-1 text-[10px] font-mono text-[#818cf8] bg-[var(--accent-bg)] rounded-md">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* PM card */}
        <div className="bento-card md:col-span-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 min-h-[200px] flex flex-col justify-between">
          <div>
            <p className="font-mono text-[10px] text-[#383838] mb-2 uppercase tracking-[0.3em]">Product Management</p>
            <h3 className="text-lg font-semibold text-[#f0f0f0] mb-3">End-to-end ownership</h3>
            <p className="text-xs text-[#505050] leading-relaxed">
              Roadmap planning, sprint management, stakeholder alignment — from zero to shipped.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {['Roadmap', 'Agile', 'Figma'].map((label) => (
              <div key={label} className="text-center py-2 bg-[var(--surface-2)] rounded-lg border border-[var(--border)]">
                <span className="text-[10px] font-mono text-[#505050]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
