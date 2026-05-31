'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { profile } from '@/content/profile'
import { CursorAtmosphere } from '@/components/ui/CursorAtmosphere'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'

const categories = [
  { href: '/movie', label: 'Movie', desc: 'Motion design & visual effects',   num: '01' },
  { href: '/apps',  label: 'Apps',  desc: 'iOS & web application development', num: '02' },
  { href: '/model', label: 'Model', desc: 'Visual direction & archive',        num: '03' },
]

export default function Home() {
  return (
    <>
      <CursorAtmosphere />

      <main
        className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-20 pb-16"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* ── Intro ─────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-20">
          <motion.p
            className="font-mono text-[9px] tracking-[0.5em] uppercase mb-7"
            style={{ color: '#383838' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Portfolio · 2025
          </motion.p>

          <motion.h1
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: 'clamp(3rem, 8.5vw, 7.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
              color: '#c0b8a0',
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          >
            Shusaku<br />
            <span style={{ color: '#201e1a' }}>Nishiura</span>
          </motion.h1>

          <motion.div
            className="mt-8 mb-7 h-px w-10 origin-left"
            style={{ background: 'rgba(255,255,255,0.07)' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          />

          <motion.p
            className="text-sm leading-relaxed whitespace-pre-line"
            style={{ color: '#545250', maxWidth: 340 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {profile.catchJa}
          </motion.p>

          <motion.p
            className="mt-4 text-[12px] leading-relaxed italic"
            style={{ color: '#323028', fontFamily: SERIF, maxWidth: 340 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
          >
            {profile.catchEn}
          </motion.p>
        </section>

        {/* ── Category entries ──────────────────────────────────────────── */}
        <nav>
          <motion.p
            className="font-mono text-[8px] tracking-[0.55em] uppercase mb-4"
            style={{ color: '#252320' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.88 }}
          >
            Archive
          </motion.p>

          <div style={{ maxWidth: 460 }}>
            {categories.map(({ href, label, desc, num }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.94 + i * 0.08, ease: [0.76, 0, 0.24, 1] }}
              >
                <Link
                  href={href}
                  className="group flex items-center gap-5 py-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span
                    className="font-mono text-[8px] tracking-[0.4em] shrink-0"
                    style={{ color: '#282624', width: 20 }}
                  >
                    {num}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className="leading-none mb-1.5 transition-colors duration-300"
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 300,
                        fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)',
                        letterSpacing: '-0.01em',
                        color: '#585248',
                      }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-[11px] leading-none"
                      style={{ color: '#2e2c2a' }}
                    >
                      {desc}
                    </p>
                  </div>

                  <span
                    className="font-mono text-[11px] opacity-0 group-hover:opacity-50 transition-opacity duration-300 shrink-0"
                    style={{ color: '#a89878' }}
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        </nav>
      </main>
    </>
  )
}
