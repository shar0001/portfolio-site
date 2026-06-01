'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { profile } from '@/content/profile'
import { GlassHero } from '@/components/ui/GlassHero'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'

const categories = [
  { href: '/movie', label: 'Movie', desc: 'Motion design & visual effects' },
  { href: '/apps',  label: 'Apps',  desc: 'iOS & web application development' },
  { href: '/model', label: 'Model', desc: 'Campaign · editorial · jewelry' },
]

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Pre-rendered glass visual — right side / softly behind the content */}
      <GlassHero />

      {/* Content — max-width container, strong side margins, readable left column */}
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-[1180px] flex-col justify-center px-7 md:px-12 lg:px-16 pt-24 pb-20 md:pt-28 md:pb-28"
        style={{ zIndex: 2 }}
      >
        {/* ── Hero name ──────────────────────────────────────────────────── */}
        <section className="mb-16 md:mb-20 max-w-[620px]">
          <motion.p
            className="font-mono text-[9px] tracking-[0.55em] uppercase mb-8"
            style={{ color: '#5060a0' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            Portfolio · 2025
          </motion.p>

          <motion.h1
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: 'clamp(3.8rem, 9.5vw, 8.5rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.028em',
              color: '#f5f8ff',
            }}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.18, ease: [0.76, 0, 0.24, 1] }}
          >
            Shusaku<br />
            <span style={{ color: '#9ab8ff' }}>Nishiura</span>
          </motion.h1>

          <motion.p
            className="mt-9 text-[14px] leading-[1.85] whitespace-pre-line"
            style={{ color: '#a5b3d1', maxWidth: 360 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
          >
            {profile.catchJa}
          </motion.p>

          <motion.p
            className="mt-3 text-[12px] leading-relaxed italic"
            style={{ color: '#5868a8', fontFamily: SERIF, maxWidth: 360 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.72 }}
          >
            {profile.catchEn}
          </motion.p>
        </section>

        {/* ── Work categories ────────────────────────────────────────────── */}
        <nav style={{ maxWidth: 480 }}>
          {categories.map(({ href, label, desc }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.82 + i * 0.10, ease: [0.76, 0, 0.24, 1] }}
            >
              <Link
                href={href}
                className="group flex items-center justify-between py-5 md:py-6"
                style={{ borderTop: '1px solid rgba(154,184,255,0.10)' }}
              >
                <div>
                  <p
                    className="leading-none mb-2 transition-colors duration-300"
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 300,
                      fontSize: 'clamp(1.55rem, 3.8vw, 2.3rem)',
                      letterSpacing: '-0.01em',
                      color: '#c0d0f0',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = '#eef4ff' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = '#c0d0f0' }}
                  >
                    {label}
                  </p>
                  <p className="text-[11px]" style={{ color: '#5868a8' }}>
                    {desc}
                  </p>
                </div>

                <span
                  className="font-mono text-[13px] opacity-0 group-hover:opacity-100 transition-all duration-400 translate-x-0 group-hover:translate-x-1"
                  style={{ color: '#9ab8ff' }}
                >
                  ↗
                </span>
              </Link>
            </motion.div>
          ))}
          <div className="h-px" style={{ background: 'rgba(154,184,255,0.10)' }} />
        </nav>
      </div>
    </main>
  )
}
