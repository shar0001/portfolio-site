'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { VideoModal } from '@/components/ui/VideoModal'
import { modelImages } from '@/content/model'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'
const TEXT  = '#E8E0CE'
const MUTED = '#9A9283'
const DIM   = '#6B6350'
const LINE  = 'rgba(232, 224, 206, 0.08)'
const BASE  = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Frame({ src, alt = '', label, className = '', priority = false, onClick, isVideo }: {
  src?: string; alt?: string; label?: string; className?: string
  priority?: boolean; onClick?: () => void; isVideo?: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ border: `1px solid ${LINE}`, background: 'rgba(10,9,7,0.6)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      onClick={onClick}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE}${src}`}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02]"
          style={{ filter: 'saturate(0.88)', transition: 'transform 0.7s ease, filter 0.7s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(1.0)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.88)' }}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {!src && (
        <div className="absolute inset-0 flex items-end p-4">
          <span className="font-mono text-[7px] tracking-[0.3em] uppercase" style={{ color: 'rgba(232,224,206,0.12)' }}>
            {label ?? '—'}
          </span>
        </div>
      )}

      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center transition-transform duration-400 group-hover:scale-105"
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(232,224,206,0.22)', background: 'rgba(8,8,6,0.55)', backdropFilter: 'blur(6px)' }}>
            <div style={{ width: 0, height: 0, marginLeft: 2, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '8px solid rgba(232,224,206,0.45)' }} />
          </div>
        </div>
      )}

      {label && src && (
        <div className="absolute bottom-0 inset-x-0 px-4 pb-3.5 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(5,5,4,0.55) 0%, transparent 100%)', paddingTop: '2rem' }}>
          <span className="font-mono text-[7px] tracking-[0.38em] uppercase" style={{ color: 'rgba(232,224,206,0.35)' }}>
            {label}
          </span>
        </div>
      )}
    </motion.div>
  )
}

// ── Credit row ────────────────────────────────────────────────────────────────
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
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

// ─────────────────────────── Page ────────────────────────────────────────────

export default function ModelPage() {
  const [videoSrc,  setVideoSrc]  = useState<string | undefined>()
  const [videoMeta, setVideoMeta] = useState<{ title?: string; tag?: string; year?: string } | null>(null)

  return (
    <>
      <main className="min-h-screen" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO — full-screen image ───────────────────────────────────── */}
        <section className="relative min-h-screen flex items-end">
          {modelImages.hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${BASE}${modelImages.hero}`}
              alt="Shusaku Nishiura"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'saturate(0.92)' }}
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'rgba(10,9,7,0.8)' }} />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(5,5,4,0.72) 0%, rgba(5,5,4,0.12) 40%, transparent 70%)' }}
          />

          {/* Name overlay */}
          <motion.div
            className="relative px-6 md:px-12 pb-12 md:pb-16 w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <p className="font-mono text-[8px] tracking-[0.6em] mb-4" style={{ color: 'rgba(232,224,206,0.38)' }}>
              03 · Model
            </p>
            <h1
              className="leading-none"
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                letterSpacing: '-0.02em',
                color: TEXT,
              }}
            >
              Shusaku<br />Nishiura
            </h1>
            <p className="font-mono text-[9px] tracking-[0.35em] mt-4" style={{ color: 'rgba(232,224,206,0.35)' }}>
              Campaign · Editorial · Jewelry
            </p>
          </motion.div>
        </section>

        {/* ── SELECTED WORK ─────────────────────────────────────────────── */}
        <section className="px-5 md:px-12 lg:px-16 pt-3 pb-3">

          {/* Main grid: large left + stacked right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <Frame
              src={modelImages.editorial01}
              alt="Van Cleef & Arpels"
              label="Van Cleef &amp; Arpels · 2024"
              className="col-span-1 md:col-span-7 min-h-[70vw] md:min-h-[680px]"
              priority
            />
            <div className="col-span-1 md:col-span-5 flex flex-col gap-2.5">
              <Frame
                src={modelImages.milan01}
                alt="Van Cleef & Arpels"
                label="Van Cleef &amp; Arpels · 2024"
                className="flex-1 min-h-[45vw] md:min-h-0"
              />
              <Frame
                src={modelImages.commercial01}
                alt="MIKIMOTO"
                label="MIKIMOTO · 2024"
                className="flex-1 min-h-[45vw] md:min-h-0"
              />
            </div>
          </div>

          {/* Bottom row: single wide frame */}
          <div className="mt-2.5">
            <Frame
              src={modelImages.lookbook01}
              alt="Editorial"
              label="Editorial · 2024"
              className="w-full min-h-[50vw] md:min-h-[420px]"
            />
          </div>
        </section>

        {/* ── CREDITS ───────────────────────────────────────────────────── */}
        <section className="px-5 md:px-12 lg:px-16 pt-16 pb-12">
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
              { role: 'Photo',      name: 'Masanori Akao (white stout)' },
              { role: 'Styling',    name: 'Mika Nagasawa' },
              { role: 'Hair',       name: 'Kenshin (epo tabo)' },
              { role: 'Makeup',     name: 'Asami Taguchi (home agency)' },
              { role: 'Realize',    name: 'Shiho Amano' },
              { role: 'Model',      name: 'Shusaku Nishiura (bravo)' },
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
        <section className="px-5 md:px-12 lg:px-16 py-16" style={{ borderTop: `1px solid ${LINE}` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

            {/* Stats table */}
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
                  <div key={label} className="flex gap-6 py-3.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                    <span className="font-mono text-[8px] tracking-[0.35em] uppercase shrink-0 pt-0.5" style={{ color: DIM, width: 80 }}>
                      {label}
                    </span>
                    <span className="text-[13px] leading-relaxed" style={{ color: MUTED }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <a
                  href="mailto:hello@example.com"
                  className="font-mono text-[9px] tracking-[0.3em] transition-opacity duration-200 inline-block"
                  style={{ color: '#CBB783' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.5' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  Contact ↗
                </a>
              </div>
            </Reveal>

            {/* Portrait image */}
            <Frame
              src={modelImages.portrait01}
              alt="Portrait"
              className="min-h-[80vw] md:min-h-[560px]"
            />
          </div>
        </section>

      </main>

      <VideoModal
        src={videoSrc}
        title={videoMeta?.title}
        tag={videoMeta?.tag}
        year={videoMeta?.year}
        onClose={() => { setVideoSrc(undefined); setVideoMeta(null) }}
      />
    </>
  )
}
