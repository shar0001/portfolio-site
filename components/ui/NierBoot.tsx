'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  '> INITIALIZING MEMORY ARCHIVE...',
  '> COGNITIVE PROFILE: NISHIURA SHUSAKU',
  '> CROSS-REFERENCING DATA BANKS...',
  '> CAREER PATH: NON-LINEAR SEQUENCE DETECTED',
  '> INTEGRATING ANOMALOUS RECORDS...',
  '> WARNING: UNDEFINED BOUNDARIES BETWEEN ROLES',
  '> RECONSTRUCTION IN PROGRESS...',
  '> ARCHIVE READY.',
]

interface Props {
  onComplete: () => void
}

export function NierBoot({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [glitching, setGlitching] = useState(false)
  const [done, setDone] = useState(false)

  const complete = useCallback(() => {
    setDone(true)
    setTimeout(onComplete, 600)
  }, [onComplete])

  useEffect(() => {
    let i = 0
    const tick = () => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]])
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100))
        i++
        setTimeout(tick, 220 + Math.random() * 180)
      } else {
        setTimeout(() => setGlitching(true), 300)
        setTimeout(complete, 900)
      }
    }
    const start = setTimeout(tick, 300)
    return () => clearTimeout(start)
  }, [complete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#050505] flex flex-col justify-center px-8 md:px-24 select-none overflow-hidden"
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Scanlines on boot screen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)',
            }}
          />

          {/* Corner decorations */}
          <div className="absolute top-6 left-6">
            <div className="w-8 h-8 border-t-2 border-l-2 border-white/25" />
          </div>
          <div className="absolute top-6 right-6">
            <div className="w-8 h-8 border-t-2 border-r-2 border-white/25" />
          </div>
          <div className="absolute bottom-6 left-6">
            <div className="w-8 h-8 border-b-2 border-l-2 border-white/25" />
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="w-8 h-8 border-b-2 border-r-2 border-white/25" />
          </div>

          {/* Top label */}
          <div className="absolute top-8 left-16 font-mono text-[10px] text-white/20 tracking-[0.35em] uppercase">
            Portfolio Archive  v1.0
          </div>
          <div className="absolute top-8 right-16 font-mono text-[10px] text-white/20 tracking-[0.2em]">
            2026.05.13
          </div>

          {/* Horizontal rule top */}
          <div className="absolute top-14 left-6 right-6 h-px bg-white/08 nier-line-h" />

          {/* Boot log */}
          <div className={`relative z-10 max-w-lg ${glitching ? 'nier-glitch' : ''}`}>
            <div className="space-y-2">
              {lines.map((line, idx) => (
                <motion.p
                  key={idx}
                  className={`font-mono tracking-wider ${
                    idx === lines.length - 1
                      ? 'text-white text-[12px] md:text-sm'
                      : 'text-white/25 text-[11px] md:text-[12px]'
                  }`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {line}
                </motion.p>
              ))}
              {lines.length < BOOT_LINES.length && (
                <span className="inline-block w-2 h-[14px] bg-white align-middle nier-cursor" />
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="relative z-10 mt-10 max-w-lg">
            <div className="flex justify-between items-center font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase mb-2">
              <span>Loading</span>
              <span>{progress}%</span>
            </div>
            <div className="h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25, ease: 'linear' }}
              />
              {/* shimmer on bar */}
              <div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{ animation: 'nier-shimmer 1.2s linear infinite' }}
              />
            </div>
          </div>

          {/* Bottom rule */}
          <div className="absolute bottom-14 left-6 right-6 h-px bg-white/08 nier-line-h" style={{ animationDelay: '0.2s' }} />

          {/* Skip hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] text-white/15 tracking-widest">
            — PRESS ANY KEY TO SKIP —
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
