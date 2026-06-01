'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { modelImages } from '@/content/model'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'
const TEXT  = '#E8E0CE'
const MUTED = '#9A9283'
const DIM   = '#6B6350'
const LINE  = 'rgba(232,224,206,0.08)'
const BASE  = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const enc = (p?: string) =>
  p ? p.split('/').map(encodeURIComponent).join('/') : p

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(3,4,8,0.96)', backdropFilter: 'blur(14px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.img
        // eslint-disable-next-line @next/next/no-img-element
        src={src}
        alt={alt}
        className="max-w-[92vw] max-h-[88vh]"
        style={{ objectFit: 'contain', boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.32 }}
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute top-5 right-6 font-mono text-[10px] tracking-[0.35em] uppercase transition-colors duration-200"
        style={{ color: 'rgba(232,224,206,0.40)' }}
        onClick={onClose}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(232,224,206,0.85)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(232,224,206,0.40)' }}
      >
        Close ✕
      </button>
    </motion.div>
  )
}

// ── Animated reveal ───────────────────────────────────────────────────────────
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

// ── Photo frame ───────────────────────────────────────────────────────────────
function Frame({
  src, alt = '', className = '',
  priority = false, position = 'center center',
  onOpen,
}: {
  src?: string; alt?: string; className?: string
  priority?: boolean; position?: string
  onOpen?: (src: string, alt: string) => void
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const hasSrc = !!src

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden ${className} ${hasSrc && onOpen ? 'cursor-zoom-in' : ''}`}
      style={{ background: 'rgba(8,7,5,0.7)' }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      onClick={() => hasSrc && onOpen?.(enc(src)!, alt)}
    >
      {hasSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE}${enc(src)}`}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          style={{ objectPosition: position, filter: 'saturate(0.90)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(1.0)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.90)' }}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </motion.div>
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
      <main className="min-h-screen" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO — full-screen photo ───────────────────────────────────── */}
        <section
          className="relative min-h-screen flex items-end cursor-zoom-in"
          onClick={() => modelImages.hero && openLightbox(enc(modelImages.hero)!, 'Shusaku Nishiura')}
        >
          {modelImages.hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${BASE}${enc(modelImages.hero)}`}
              alt="Shusaku Nishiura"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 18%', filter: 'saturate(0.90)' }}
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: '#080706' }} />
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(4,4,3,0.78) 0%, rgba(4,4,3,0.06) 44%, transparent 70%)' }}
          />

          <motion.div
            className="relative px-7 md:px-14 pb-14 md:pb-20 w-full pointer-events-none"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
          >
            <h1
              className="leading-none"
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: 'clamp(3.2rem, 8.5vw, 7rem)',
                letterSpacing: '-0.02em',
                color: TEXT,
              }}
            >
              Shusaku<br />Nishiura
            </h1>
            <p className="font-mono text-[9px] tracking-[0.38em] mt-5" style={{ color: 'rgba(232,224,206,0.32)' }}>
              Campaign · Editorial · Jewelry
            </p>
          </motion.div>
        </section>

        {/* ── WORK GRID ─────────────────────────────────────────────────── */}
        <section className="px-4 md:px-10 lg:px-14 pt-4 pb-4">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Large left — portrait orientation, show upper body */}
            <Frame
              src={modelImages.editorial01}
              alt="Van Cleef & Arpels"
              className="col-span-1 md:col-span-7 min-h-[75vw] md:min-h-[700px]"
              priority
              position="center 18%"
              onOpen={openLightbox}
            />

            {/* Right column — two stacked images */}
            <div className="col-span-1 md:col-span-5 flex flex-col gap-3">
              <Frame
                src={modelImages.milan01}
                alt="Van Cleef & Arpels"
                className="flex-1 min-h-[46vw] md:min-h-0"
                position="center 22%"
                onOpen={openLightbox}
              />
              <Frame
                src={modelImages.commercial01}
                alt="MIKIMOTO"
                className="flex-1 min-h-[46vw] md:min-h-0"
                position="center 25%"
                onOpen={openLightbox}
              />
            </div>
          </div>

          {/* Wide bottom — landscape */}
          <div className="mt-3">
            <Frame
              src={modelImages.lookbook01}
              alt="Editorial"
              className="w-full min-h-[52vw] md:min-h-[420px]"
              position="center center"
              onOpen={openLightbox}
            />
          </div>
        </section>

        {/* ── CREDITS ───────────────────────────────────────────────────── */}
        <section className="px-7 md:px-14 lg:px-18 pt-16 pb-10">
          <Reveal>
            <p className="font-mono text-[8px] tracking-[0.5em] uppercase mb-2" style={{ color: DIM }}>
              Credits
            </p>
          </Reveal>

          <CreditBlock
            client="Van Cleef & Arpels"
            campaign="スー レ ゼトワール〈星空の下で〉"
            year="2024"
            credits={[
              { role: 'Photo',   name: 'Masanori Akao (white stout)' },
              { role: 'Styling', name: 'Mika Nagasawa' },
              { role: 'Hair',    name: 'Kenshin (epo tabo)' },
              { role: 'Makeup',  name: 'Asami Taguchi (home agency)' },
              { role: 'Realize', name: 'Shiho Amano' },
              { role: 'Model',   name: 'Shusaku Nishiura (bravo)' },
            ]}
          />

          <CreditBlock
            client="MIKIMOTO"
            campaign="Lucky Arrows"
            year="2024"
            credits={[
              { role: 'Model', name: 'Shusaku Nishiura' },
            ]}
          />
        </section>

        {/* ── PROFILE ───────────────────────────────────────────────────── */}
        <section className="px-7 md:px-14 lg:px-18 py-16" style={{ borderTop: `1px solid ${LINE}` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

            <Reveal>
              <p className="font-mono text-[8px] tracking-[0.5em] uppercase mb-8" style={{ color: DIM }}>
                Profile
              </p>
              <div>
                {([
                  ['Name',       'Shusaku Nishiura'],
                  ['Agency',     'bravo models'],
                  ['Base',       'Tokyo, Japan'],
                  ['Active',     '2018 — Present'],
                  ['Markets',    'Japan · France · Italy'],
                  ['Categories', 'Campaign · Editorial · Runway'],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex gap-6 py-4" style={{ borderBottom: `1px solid ${LINE}` }}>
                    <span className="font-mono text-[8px] tracking-[0.35em] uppercase shrink-0 pt-0.5" style={{ color: DIM, width: 80 }}>
                      {label}
                    </span>
                    <span className="text-[13px] leading-relaxed" style={{ color: MUTED }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-9">
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

            {/* Portrait — show face / upper body */}
            <Frame
              src={modelImages.portrait01}
              alt="Portrait"
              className="min-h-[90vw] md:min-h-[580px]"
              position="center 12%"
              onOpen={openLightbox}
            />
          </div>
        </section>

      </main>

      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox
            src={lightboxSrc}
            alt={lightboxAlt}
            onClose={() => setLightboxSrc('')}
          />
        )}
      </AnimatePresence>
    </>
  )
}
