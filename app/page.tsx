'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { profile } from '@/content/profile'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-32 pt-24 pb-16">
      <div ref={containerRef} className="max-w-2xl">
        {/* Title */}
        <h1 
          className="whitespace-nowrap mb-12"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontWeight: 300,
            fontSize: 'clamp(4rem, 10vw, 130px)',
            letterSpacing: '-0.02em',
            lineHeight: 0.9,
            color: 'var(--text-primary)'
          }}
        >
          Shusaku<br />Nishiura
        </h1>

        {/* Intro Text */}
        <div className="mb-16 space-y-6">
          <p className="text-[14px] md:text-[15px] leading-[2.2] tracking-wide text-[var(--text-secondary)] whitespace-pre-line">
            モデルの感性、開発者の論理、PMの推進力。{'\n'}
            異なる現場を渡り歩いた経験が、{'\n'}
            作れるものの幅を広げてくれました。
          </p>
          <p className="text-[12px] md:text-[13px] leading-relaxed tracking-wider text-[var(--text-muted)] italic font-serif">
            From the runway to the codebase — a non-linear path that turned out to be the point
          </p>
        </div>

        {/* Category List */}
        <div className="w-full max-w-lg flex flex-col">
          {[
            { title: 'Movie', desc: 'Motion design & visual effects', href: '/movie' },
            { title: 'Apps', desc: 'iOS & web application development', href: '/apps' },
            { title: 'Model', desc: 'Campaign - editorial - jewelry', href: '/model' },
          ].map((item, index) => (
            <Link 
              key={item.title} 
              href={item.href}
              className="group block py-6 border-b border-[var(--glass-border)] last:border-b transition-colors hover:border-[rgba(255,255,255,0.3)]"
              data-cursor="hover"
            >
              <h2 className="font-serif text-3xl font-light mb-2 text-[var(--text-primary)] transition-colors group-hover:text-white">
                {item.title}
              </h2>
              <p className="text-[11px] font-sans tracking-wide text-[var(--text-muted)] uppercase">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
