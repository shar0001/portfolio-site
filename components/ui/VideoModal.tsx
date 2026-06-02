'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'

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

  useEffect(() => {
    if (src && videoRef.current) videoRef.current.play().catch(() => {})
  }, [src])

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    onClose()
  }

  const isYouTube = src && (src.includes('youtube.com') || src.includes('youtu.be'))
  let embedUrl = ''
  if (isYouTube && src) {
    let videoId = ''
    if (src.includes('youtu.be/')) {
      videoId = src.split('youtu.be/')[1].split('?')[0]
    } else if (src.includes('watch?v=')) {
      videoId = src.split('watch?v=')[1].split('&')[0]
    } else if (src.includes('embed/')) {
      videoId = src.split('embed/')[1].split('?')[0]
    }
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(6,8,20,0.96)', backdropFilter: 'blur(10px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-4xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                {(tag || year) && (
                  <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: '#6070a8' }}>
                    {tag}{tag && year && ' · '}{year}
                  </p>
                )}
                {title && (
                  <p style={{ fontFamily: SERIF, fontWeight: 300, fontSize: '1.1rem', color: '#c9d1e6' }}>
                    {title}
                  </p>
                )}
              </div>

              <button
                onClick={handleClose}
                aria-label="Close video"
                className="w-10 h-10 flex items-center justify-center transition-colors duration-200"
                style={{ color: 'rgba(155,184,255,0.50)', border: '1px solid rgba(155,184,255,0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(232,238,255,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(155,184,255,0.50)' }}
              >
                ✕
              </button>
            </div>

            {isYouTube ? (
              <iframe
                src={embedUrl}
                title={title || "YouTube Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full aspect-video bg-black"
                style={{ maxHeight: '75vh', border: 0 }}
              />
            ) : (
              <video
                ref={videoRef}
                src={src ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${src}` : undefined}
                controls
                playsInline
                className="w-full bg-black"
                style={{ maxHeight: '75vh' }}
              >
                お使いのブラウザは動画再生に対応していません。
              </video>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
