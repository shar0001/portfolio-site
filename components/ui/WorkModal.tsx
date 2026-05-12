'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

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
        /* Backdrop — click outside to close, also centers the panel */
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[#111111] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* NieR corner brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/15" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/15" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 font-mono text-[11px] text-[#404040] hover:text-[#808080] transition-colors"
            >
              × close
            </button>

            <p className="font-mono text-[10px] text-[#383838] tracking-widest uppercase mb-3">
              {work.tag}{work.tag && work.year && ' · '}{work.year}
              {work.status && <span className="ml-3 text-[#303030]">— {work.status}</span>}
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-[#f0f0f0] mb-5 leading-tight pr-8">
              {work.title}
            </h2>

            {work.role && (
              <div className="mb-4">
                <p className="font-mono text-[9px] text-[#303030] uppercase tracking-widest mb-1.5">Role</p>
                <p className="text-sm text-[#808080]">{work.role}</p>
              </div>
            )}

            {techList && techList.length > 0 && (
              <div className="mb-4">
                <p className="font-mono text-[9px] text-[#303030] uppercase tracking-widest mb-2">Tools</p>
                <div className="flex flex-wrap gap-2">
                  {techList.map(t => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-[10px] font-mono text-[#7c3aed] bg-[rgba(124,58,237,0.08)] rounded-md border border-[rgba(124,58,237,0.15)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {work.description && (
              <div className="mb-4">
                <p className="font-mono text-[9px] text-[#303030] uppercase tracking-widest mb-1.5">About</p>
                <p className="text-sm text-[#606060] leading-relaxed">{work.description}</p>
              </div>
            )}

            {work.insight && (
              <div className="pt-4 border-t border-[rgba(255,255,255,0.05)]">
                <p className="font-mono text-[9px] text-[#303030] uppercase tracking-widest mb-1.5">Process</p>
                <p className="text-sm text-[#505050] leading-relaxed italic">{work.insight}</p>
              </div>
            )}

            {work.storeUrl && (
              <div className="mt-5">
                <a
                  href={work.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
                >
                  App Store で見る →
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
