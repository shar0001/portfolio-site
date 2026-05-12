'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const works = [
  { id: '01', title: 'Brand Identity Motion', type: 'Motion Graphics', duration: '0:30', featured: true },
  { id: '02', title: 'Product Demo Reel', type: 'AE Composite', duration: '1:20', featured: false },
  { id: '03', title: 'Title Sequence', type: 'Typography', duration: '0:45', featured: false },
  { id: '04', title: 'Visual Effects', type: 'VFX', duration: '0:20', featured: false },
]

function VideoCard({ work }: { work: typeof works[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div
      className={`bento-card group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--border-hover)] transition-all duration-500 ${
        work.featured ? 'md:col-span-8 min-h-[340px]' : 'md:col-span-4 min-h-[200px]'
      }`}
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
      }}
    >
      {/* Placeholder gradient (replace with actual video) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a] via-[#0a0a12] to-[#080810] flex items-center justify-center">
        {/* Grid line decorative */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(129,140,248,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Play button */}
        <div className="relative z-10 w-14 h-14 rounded-full border border-[rgba(255,255,255,0.08)] flex items-center justify-center group-hover:border-[rgba(255,255,255,0.2)] group-hover:scale-110 transition-all duration-500">
          <div
            className="w-0 h-0 ml-1 opacity-40 group-hover:opacity-90 transition-opacity duration-300"
            style={{
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '10px solid #f0f0f0',
            }}
          />
        </div>

        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          muted
          loop
          playsInline
        />
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#080808] via-[rgba(8,8,8,0.7)] to-transparent">
        <p className="font-mono text-[10px] text-[#404040] mb-1.5">
          {work.type} · {work.duration}
        </p>
        <h3 className="text-[#d0d0d0] font-medium text-sm group-hover:text-[#f0f0f0] transition-colors">
          {work.title}
        </h3>
      </div>

      <div className="absolute top-4 right-4 font-mono text-[10px] text-[#303030]">
        {work.id}
      </div>
    </div>
  )
}

export function MotionWork() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.from(sectionRef.current.querySelectorAll('.bento-card'), {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }, [])

  return (
    <section id="motion" ref={sectionRef} className="min-h-screen px-8 md:px-16 lg:px-24 py-24">
      <div className="mb-16">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-4">02</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#f0f0f0]">
          Motion
        </h2>
        <p className="text-[#505050] mt-3 text-sm max-w-xs">
          After Effects — motion graphics, compositing, visual effects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {works.map((w) => (
          <VideoCard key={w.id} work={w} />
        ))}
      </div>
    </section>
  )
}
