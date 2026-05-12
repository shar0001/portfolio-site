'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  src: string | undefined
  title?: string
  tag?: string
  year?: string
  onClose: () => void
}

export function VideoModal({ src, title, tag, year, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Auto-play when opened
  useEffect(() => {
    if (src && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [src])

  // Pause and reset when closed
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    onClose()
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/92 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* NieR corner brackets */}
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t border-l border-white/20" />
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t border-r border-white/20" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b border-l border-white/20" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b border-r border-white/20" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                {(tag || year) && (
                  <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
                    {tag}{tag && year && ' · '}{year}
                  </p>
                )}
                {title && (
                  <p className="font-mono text-sm text-white/60 mt-0.5">{title}</p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="font-mono text-[11px] text-white/30 hover:text-white/70 transition-colors"
              >
                × close
              </button>
            </div>

            {/* Video player */}
            <video
              ref={videoRef}
              src={src}
              controls
              playsInline
              className="w-full rounded-xl bg-black shadow-2xl"
              style={{ maxHeight: '75vh' }}
            >
              お使いのブラウザは動画再生に対応していません。
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
