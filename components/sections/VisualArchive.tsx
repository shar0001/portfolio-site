'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const photos = [
  { id: 'A1', label: 'Editorial', year: '2022', cols: 5, rows: 2 },
  { id: 'A2', label: 'Campaign', year: '2021', cols: 4, rows: 1 },
  { id: 'A3', label: 'Portrait', year: '2022', cols: 3, rows: 1 },
  { id: 'A4', label: 'Commercial', year: '2020', cols: 4, rows: 1 },
  { id: 'A5', label: 'Editorial', year: '2023', cols: 3, rows: 1 },
]

export function VisualArchive() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.from(sectionRef.current.querySelectorAll('.photo-card'), {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      scale: 0.96,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out',
    })
  }, [])

  return (
    <section id="visual" ref={sectionRef} className="min-h-screen px-8 md:px-16 lg:px-24 py-24">
      <div className="mb-16">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-4">03</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#f0f0f0]">
          Visual Archive
        </h2>
        <p className="text-[#505050] mt-3 text-sm max-w-xs leading-relaxed">
          A curated record of visual direction — campaigns, editorials, and art direction.
        </p>
      </div>

      <div className="grid grid-cols-12 grid-rows-2 gap-3 h-[500px] md:h-[560px]">
        {/* Large left card */}
        <div
          className="photo-card col-span-12 md:col-span-5 row-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden relative group hover:border-[var(--border-hover)] transition-all duration-500 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] to-[#080808]" />
          <span className="relative font-mono text-[10px] text-[#252525] z-10 tracking-widest">
            {photos[0].label.toUpperCase()} / {photos[0].year}
          </span>
          <div className="absolute bottom-5 left-5">
            <p className="font-mono text-[10px] text-[#303030]">{photos[0].id}</p>
          </div>
        </div>

        {/* Top right pair */}
        {[photos[1], photos[2]].map((photo) => (
          <div
            key={photo.id}
            className={`photo-card col-span-6 md:col-span-${photo.cols - 1} row-span-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden relative group hover:border-[var(--border-hover)] transition-all duration-500 flex items-center justify-center`}
            style={{ gridColumn: `span ${photo.cols}` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] to-[#080808]" />
            <span className="relative font-mono text-[10px] text-[#252525] z-10 tracking-widest">
              {photo.label.toUpperCase()} / {photo.year}
            </span>
            <div className="absolute bottom-3 left-4">
              <p className="font-mono text-[10px] text-[#303030]">{photo.id}</p>
            </div>
          </div>
        ))}

        {/* Bottom right pair */}
        {[photos[3], photos[4]].map((photo) => (
          <div
            key={photo.id}
            className="photo-card col-span-6 row-span-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden relative group hover:border-[var(--border-hover)] transition-all duration-500 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] to-[#080808]" />
            <span className="relative font-mono text-[10px] text-[#252525] z-10 tracking-widest">
              {photo.label.toUpperCase()} / {photo.year}
            </span>
            <div className="absolute bottom-3 left-4">
              <p className="font-mono text-[10px] text-[#303030]">{photo.id}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
