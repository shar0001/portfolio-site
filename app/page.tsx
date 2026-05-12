'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { profile } from '@/content/profile'
import { NierBoot } from '@/components/ui/NierBoot'
import { GlitchText } from '@/components/ui/GlitchText'

const categories = [
  { href: '/movie', label: 'Movie',  sub: 'Motion design & visual effects',       color: '#3b82f6', num: '01' },
  { href: '/apps',  label: 'Apps',   sub: 'iOS & web application development',     color: '#7c3aed', num: '02' },
  { href: '/model', label: 'Model',  sub: 'Visual direction & archive',            color: '#f43f5e', num: '03' },
]

// stagger helper
const stagger = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0  },
  transition: { delay, duration: 0.45, ease: [0.76, 0, 0.24, 1] as const },
})

export default function Home() {
  const [showBoot, setShowBoot] = useState(false)
  const [ready, setReady]       = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('nierBooted')) {
      setShowBoot(true)
    } else {
      setReady(true)
    }
    // Skip on any keypress
    const skip = () => {
      if (showBoot) {
        sessionStorage.setItem('nierBooted', '1')
        setShowBoot(false)
        setReady(true)
      }
    }
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [showBoot])

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem('nierBooted', '1')
    setShowBoot(false)
    setReady(true)
  }, [])

  return (
    <>
      {showBoot && <NierBoot onComplete={handleBootComplete} />}

      <main className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-24 pb-16">

        {/* ── Self-introduction ── */}
        <section className="mb-20 max-w-xl relative">

          {/* HUD corner brackets */}
          <motion.div
            className="absolute -top-5 -left-5 w-8 h-8 border-t border-l border-white/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={ready ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.05, duration: 0.35 }}
          />
          <motion.div
            className="absolute -bottom-5 -right-5 w-8 h-8 border-b border-r border-white/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={ready ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.35 }}
          />

          {/* Section label */}
          <motion.p
            className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-8"
            {...(ready ? stagger(0.1) : { initial: { opacity: 0 } })}
          >
            {'>'}&nbsp;Profile_Archive
          </motion.p>

          {/* Name with glitch */}
          <motion.h1
            className="text-[clamp(3rem,9vw,7rem)] font-semibold tracking-[-0.02em] leading-[0.92] mb-8"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {ready && (
              <GlitchText
                text={profile.name.split(' ')[0]}
                delay={200}
                speed={30}
                className="text-[#f0f0f0]"
              />
            )}
            <br />
            <span className="text-[#1c1c1c]">——</span>
          </motion.h1>

          {/* Animated horizontal rule */}
          <motion.div
            className="h-px bg-white/08 mb-8 origin-left"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={ready ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* catchJa */}
          <motion.p
            className="text-base text-[#606060] leading-relaxed mb-6 max-w-sm whitespace-pre-line"
            {...(ready ? stagger(0.38) : { initial: { opacity: 0 } })}
          >
            {profile.catchJa}
          </motion.p>

          {/* catchEn */}
          <motion.p
            className="text-sm text-[#3a3a3a] leading-relaxed max-w-sm italic"
            {...(ready ? stagger(0.48) : { initial: { opacity: 0 } })}
          >
            {profile.catchEn}
          </motion.p>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.56, duration: 0.4 }}
          >
            {profile.tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="px-3 py-1.5 text-[11px] font-mono border border-[rgba(255,255,255,0.07)] text-[#505050] rounded-full hover:border-[rgba(255,255,255,0.15)] hover:text-[#808080] transition-all duration-300"
                initial={{ opacity: 0, y: 6 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.58 + i * 0.07, duration: 0.3 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </section>

        {/* ── Category archive ── */}
        <section>
          <motion.p
            className="font-mono text-[10px] tracking-[0.4em] text-[#303030] uppercase mb-6"
            {...(ready ? stagger(0.68) : { initial: { opacity: 0 } })}
          >
            {'>'}&nbsp;Select_Archive
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
            {categories.map(({ href, label, sub, color, num }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.76 + i * 0.1, duration: 0.45 }}
              >
                <Link
                  href={href}
                  className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 min-h-[180px] flex flex-col justify-between overflow-hidden hover:border-[var(--border-hover)] transition-all duration-500 block"
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${color}0d 0%, transparent 70%)` }}
                  />

                  {/* NieR corner brackets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/10 group-hover:border-white/30 transition-colors duration-400" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/10 group-hover:border-white/30 transition-colors duration-400" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/10 group-hover:border-white/30 transition-colors duration-400" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/10 group-hover:border-white/30 transition-colors duration-400" />

                  {/* Scan line sweep on hover */}
                  <div
                    className="absolute inset-x-0 h-px -top-px opacity-0 group-hover:opacity-70 group-hover:top-full pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, transparent, ${color}, transparent)`,
                      boxShadow: `0 0 8px ${color}`,
                      transition: 'top 0.55s linear, opacity 0.15s',
                    }}
                  />

                  <div className="relative z-10">
                    <p className="font-mono text-[10px] text-[#303030] mb-4">{num}</p>
                    <h2 className="text-2xl font-semibold mb-2" style={{ color: '#c0c0c0' }}>
                      {label}
                    </h2>
                    <p className="text-xs text-[#404040] leading-relaxed">{sub}</p>
                  </div>

                  <div
                    className="relative z-10 font-mono text-[10px] opacity-30 group-hover:opacity-100 transition-all duration-300 tracking-widest"
                    style={{ color }}
                  >
                    ENTER ARCHIVE →
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to right, transparent, ${color}50, transparent)` }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
