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
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
          style={{ background: 'rgba(6,8,18,0.78)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full md:max-w-lg max-h-[90vh] md:max-h-[80vh] overflow-y-auto"
            style={{ background: '#10152a', border: '1px solid rgba(155,184,255,0.10)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className="w-8 h-1 rounded-full" style={{ background: 'rgba(155,184,255,0.15)' }} />
            </div>

            {/* Sticky header */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between px-6 pt-5 pb-4 md:pt-6"
              style={{ background: '#10152a', borderBottom: '1px solid rgba(155,184,255,0.08)' }}
            >
              <div className="flex-1 pr-4">
                {(work.tag || work.year || work.status) && (
                  <p className="font-mono text-[8px] tracking-widest uppercase mb-2" style={{ color: '#6070a8' }}>
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
                    color: '#e8eeff',
                  }}
                >
                  {work.title}
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-10 h-10 flex items-center justify-center transition-colors duration-200"
                style={{ color: '#6070a8', border: '1px solid rgba(155,184,255,0.12)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e8eeff' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6070a8' }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pt-5 pb-8 space-y-5">
              {work.role && (
                <section>
                  <p className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: '#5060a0' }}>Role</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#96a0bd' }}>
                    {work.role}
                  </p>
                </section>
              )}

              {techList && techList.length > 0 && (
                <section>
                  <p className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: '#5060a0' }}>Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {techList.map(t => (
                      <span
                        key={t}
                        className="font-mono text-[9px] px-2.5 py-1"
                        style={{
                          color: '#8090c8',
                          background: 'rgba(155,184,255,0.06)',
                          border: '1px solid rgba(155,184,255,0.12)',
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
                  <p className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: '#5060a0' }}>About</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#96a0bd', lineHeight: 1.8 }}>
                    {work.description}
                  </p>
                </section>
              )}

              {work.insight && (
                <section style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(155,184,255,0.08)' }}>
                  <p className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: '#5060a0' }}>Process</p>
                  <p className="text-sm leading-relaxed italic" style={{ color: '#8090c0', lineHeight: 1.8 }}>
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
                    className="font-mono text-[10px] tracking-widest transition-colors hover:text-[#a7f0ff]"
                    style={{ color: '#9bb8ff' }}
                  >
                    App Store で見る →
                  </a>
                </div>
              )}
            </div>

            <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
