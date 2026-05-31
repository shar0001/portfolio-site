'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'

export interface WorkDetail {
  title?: string
  year?: string
  tag?: string
  description?: string
  role?: string
  tools?: string[]
  tech?: string[]
  status?: string
  storeUrl?: string
  insight?: string
  type: 'photo' | 'video'
}

interface Props {
  work: WorkDetail | null
  onClose: () => void
}

export function WorkModal({ work, onClose }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const techList = work?.tools ?? work?.tech

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {work && (
        /* Full-screen backdrop — bottom-anchored on mobile, centered on desktop */
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Sheet */}
          <motion.div
            className="relative w-full md:max-w-lg max-h-[90vh] md:max-h-[80vh] overflow-y-auto"
            style={{ background: '#0e0d0b' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className="w-8 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Sticky header */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between px-6 pt-5 pb-4 md:pt-6"
              style={{ background: '#0e0d0b', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="flex-1 pr-4">
                {(work.tag || work.year || work.status) && (
                  <p className="font-mono text-[8px] text-[#383430] tracking-widest uppercase mb-2">
                    {work.tag}{work.tag && work.year && ' · '}{work.year}
                    {work.status && ` · ${work.status}`}
                  </p>
                )}
                <h2
                  className="leading-tight"
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 300,
                    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                    color: '#c0b8a8',
                  }}
                >
                  {work.title}
                </h2>
              </div>

              {/* Close button — large tap target */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-10 h-10 flex items-center justify-center transition-colors duration-200"
                style={{ color: '#484440', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#c0b8a8' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#484440' }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pt-5 pb-8 space-y-5">
              {work.role && (
                <section>
                  <p className="font-mono text-[8px] text-[#2e2c2a] uppercase tracking-widest mb-2">Role</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6a6860' }}>
                    {work.role}
                  </p>
                </section>
              )}

              {techList && techList.length > 0 && (
                <section>
                  <p className="font-mono text-[8px] text-[#2e2c2a] uppercase tracking-widest mb-2">Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {techList.map(t => (
                      <span
                        key={t}
                        className="font-mono text-[9px] px-2.5 py-1"
                        style={{
                          color: '#585450',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {work.description && (
                <section>
                  <p className="font-mono text-[8px] text-[#2e2c2a] uppercase tracking-widest mb-2">About</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#5e5c58' }}>
                    {work.description}
                  </p>
                </section>
              )}

              {work.insight && (
                <section style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="font-mono text-[8px] text-[#2e2c2a] uppercase tracking-widest mb-2">Process</p>
                  <p className="text-sm leading-relaxed italic" style={{ color: '#504e4a' }}>
                    {work.insight}
                  </p>
                </section>
              )}

              {work.storeUrl && (
                <div className="pt-2">
                  <a
                    href={work.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] tracking-widest transition-opacity hover:opacity-100"
                    style={{ color: '#888278', opacity: 0.7 }}
                  >
                    App Store で見る →
                  </a>
                </div>
              )}
            </div>

            {/* iOS safe-area bottom padding */}
            <div className="h-safe-area-inset-bottom md:h-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
