'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  heroImage, galleryImages, aspectFor,
  type ModelImage,
} from '@/content/model'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'
const TEXT  = '#E8E0CE'
const MUTED = '#9A9283'
const DIM   = '#6B6350'
const LINE  = 'rgba(232,224,206,0.08)'
const BASE  = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// URL-encode each path segment (spaces / × / & / 日本語 → valid URL)
const enc = (p: string) => p.split('/').map(encodeURIComponent).join('/')
const url = (p: string) => `${BASE}${enc(p)}`

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', fn)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const isVideo = src.endsWith('.mp4') || src.toLowerCase().endsWith('.mov')

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10"
      style={{ background: 'rgba(3,4,8,0.96)', backdropFilter: 'blur(16px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      {isVideo ? (
        <motion.video
          layoutId={`media-${src}`}
          src={src}
          controls
          autoPlay
          loop
          muted
          playsInline
          style={{ 
            objectFit: 'contain', 
            boxShadow: '0 0 90px rgba(0,0,0,0.85)',
            maxHeight: '60vh',
            maxWidth: '70vw',
            margin: 'auto'
          }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <motion.img
          // eslint-disable-next-line @next/next/no-img-element
          src={src}
          alt={alt}
          style={{ 
            objectFit: 'contain', 
            boxShadow: '0 0 90px rgba(0,0,0,0.85)',
            maxHeight: '60vh',
            maxWidth: '70vw',
            margin: 'auto'
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
          onClick={e => e.stopPropagation()}
        />
      )}
      <button
        className="absolute top-5 right-6 font-mono text-[10px] tracking-[0.35em] uppercase transition-colors duration-200"
        style={{ color: 'rgba(232,224,206,0.42)' }}
        onClick={onClose}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(232,224,206,0.85)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(232,224,206,0.42)' }}
      >
        Close ✕
      </button>
    </motion.div>
  )
}

// ── Reveal-on-scroll ──────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Gallery photo — frame respects each image's natural ratio, no captions ────
function GalleryPhoto({ img, onOpen }: {
  img: ModelImage; onOpen: (src: string, alt: string) => void
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
  const isVideo = img.type === 'video'
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-[50]"
            style={{ background: 'rgba(3,4,8,0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsActive(false)}
          />
        )}
      </AnimatePresence>

      <motion.figure
        ref={ref}
        className={`group w-full overflow-hidden mb-3 md:mb-4 ${
          isVideo ? (isActive ? 'relative z-[60]' : 'relative cursor-pointer z-0') : 'relative z-0'
        }`}
        style={{
          aspectRatio: aspectFor[img.orientation],
          background: 'rgba(8,7,5,0.6)',
        }}
        initial={{ opacity: 0, y: 26 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        onClick={() => {
          if (isVideo && !isActive) {
            setIsActive(true)
          }
        }}
      >
        {isVideo ? (
          <video
            src={url(img.src)}
            className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-out ${
              !isActive ? 'object-cover group-hover:scale-[1.03]' : 'object-contain bg-black'
            }`}
            autoPlay
            loop
            muted={!isActive}
            controls={isActive}
            playsInline
            style={{
              filter: isActive ? 'none' : 'saturate(0.92) brightness(0.97)',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.filter = 'saturate(1.0) brightness(1.04)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.filter = 'saturate(0.92) brightness(0.97)' }}
            onClick={(e) => {
              if (isActive) {
                e.stopPropagation()
              }
            }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={url(img.src)}
            alt={img.alt}
            className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            style={{
              objectFit: img.fit ?? 'cover',
              objectPosition: img.position ?? 'center center',
              filter: 'saturate(0.92) brightness(0.97)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(1.0) brightness(1.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.92) brightness(0.97)' }}
            loading="lazy"
          />
        )}
      </motion.figure>
    </>
  )
}

// ── Credit block ──────────────────────────────────────────────────────────────
function CreditBlock({ client, campaign, year, credits }: {
  client: string; campaign?: string; year: string
  credits: { role: string; name: string }[]
}) {
  return (
    <Reveal>
      <div className="py-8" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <p className="text-base tracking-[0.05em]" style={{ fontFamily: SERIF, fontWeight: 400, color: TEXT }}>
              {client}
            </p>
            {campaign && (
              <p className="text-[11px] mt-0.5 italic" style={{ fontFamily: SERIF, color: MUTED }}>
                {campaign}
              </p>
            )}
          </div>
          <p className="font-mono text-[8px] tracking-[0.4em]" style={{ color: DIM }}>{year}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2.5">
          {credits.map(({ role, name }) => (
            <div key={role} className="flex gap-2 items-baseline">
              <span className="font-mono text-[7px] tracking-[0.3em] uppercase shrink-0" style={{ color: DIM, width: 56 }}>
                {role}
              </span>
              <span className="text-[11px] leading-tight" style={{ color: MUTED }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ModelPage() {
  const [lightboxSrc, setLightboxSrc] = useState('')
  const [lightboxAlt, setLightboxAlt] = useState('')

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src)
    setLightboxAlt(alt)
  }

  return (
    <>
      <main
        className="relative mx-auto min-h-screen w-full max-w-[1180px] px-7 md:px-12 lg:px-16 pt-24 pb-20 md:pt-28 md:pb-28"
        style={{ zIndex: 1 }}
      >
        {/* ── HERO — contained editorial frame (never full-bleed) ─────────── */}
        <section className="pb-10 md:pb-16">
          <div className="mx-auto">

            {/* Name + minimal meta, ABOVE the image — never over the face */}
            <motion.div
              className="flex items-end justify-between mb-6 md:mb-9"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
            >
              <h1
                className="leading-[0.92]"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: 'clamp(2.4rem, 6vw, 4.6rem)',
                  letterSpacing: '-0.02em',
                  color: TEXT,
                }}
              >
                Shusaku<br />Nishiura
              </h1>
            </motion.div>

            {/* Contained hero image — max-height keeps the close-up elegant */}
            <motion.div
              className="relative w-full flex justify-center cursor-zoom-in"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
              onClick={() => openLightbox(url(heroImage.src), heroImage.alt)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url(heroImage.src)}
                alt={heroImage.alt}
                className="w-auto"
                style={{
                  maxHeight: '78vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  objectPosition: heroImage.position,
                }}
                loading="eager"
              />
            </motion.div>
          </div>
        </section>

        {/* ── GALLERY — masonry columns, each image at its natural ratio ──── */}
        <section className="pb-6">
          <div
            className="mx-auto [column-fill:_balance]"
            style={{ columnGap: '0.75rem' }}
          >
            <style>{`
              .model-masonry { columns: 1; }
              @media (min-width: 768px) { .model-masonry { columns: 2; } }
            `}</style>
            <div className="model-masonry">
              {galleryImages.map(img => (
                <div key={img.id} className="break-inside-avoid">
                  <GalleryPhoto img={img} onOpen={openLightbox} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROFILE ───────────────────────────────────────────────────── */}
        <section className="pt-12 pb-10 mx-auto" style={{ borderTop: `1px solid ${LINE}` }}>
          <Reveal>
            <p className="font-mono text-[8px] tracking-[0.5em] uppercase mb-8" style={{ color: DIM }}>
              Profile
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 py-4">
              {/* Left Column: Measurements */}
              <div>
                <p className="font-mono text-[8px] tracking-[0.4em] uppercase mb-6" style={{ color: DIM }}>
                  Measurements
                </p>
                <div className="space-y-1">
                  {([
                    ['Height', '186 cm'],
                    ['Bust',   '88 cm'],
                    ['Waist',  '72 cm'],
                    ['Hip',    '95 cm'],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="flex gap-6 py-3.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                      <span className="font-mono text-[8px] tracking-[0.35em] uppercase shrink-0 pt-0.5" style={{ color: DIM, width: 80 }}>
                        {label}
                      </span>
                      <span className="text-[13px] leading-relaxed" style={{ color: MUTED }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Markets & Agency */}
              <div>
                <p className="font-mono text-[8px] tracking-[0.4em] uppercase mb-6" style={{ color: DIM }}>
                  Markets & Details
                </p>
                <div className="space-y-1">
                  {([
                    ['Markets', 'Tokyo · Paris · Milan · Hong Kong · Seoul'],
                    ['Agency',  'Bravo, BANANAS, The lab, Primo, Directors'],
                    ['Active',  '2018 — 2025'],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="flex gap-6 py-3.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                      <span className="font-mono text-[8px] tracking-[0.35em] uppercase shrink-0 pt-0.5" style={{ color: DIM, width: 80 }}>
                        {label}
                      </span>
                      <span className="text-[13px] leading-relaxed" style={{ color: MUTED }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12">
              <a
                href="mailto:shusaku.bbb@gmail.com"
                className="font-mono text-[9px] tracking-[0.3em] transition-opacity duration-200 inline-block"
                style={{ color: '#CBB783' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.5' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                Contact ↗
              </a>
            </div>
          </Reveal>
        </section>

      </main>

      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc('')} />
        )}
      </AnimatePresence>
    </>
  )
}
