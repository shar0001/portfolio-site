'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { VideoModal }  from '@/components/ui/VideoModal'
import { modelImages } from '@/content/model'

// ─────────────────────────── Design tokens ───────────────────────────────────
// Refined palette — art/fashion archive, not sci-fi terminal
const SERIF   = 'var(--font-cormorant), "EB Garamond", Georgia, serif'
const JA      = '"Hiragino Mincho ProN", "Yu Mincho", serif'
const TEXT    = '#E8E0CE'
const MUTED   = '#9A9283'
const DIM     = '#6B6350'
const LINE    = 'rgba(232, 224, 206, 0.10)'   // very faint — editorial, not HUD
const SURFACE = 'rgba(20, 19, 15, 0.50)'       // semi-transparent dark
const ACCENT  = '#CBB783'
const BASE    = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// ─────────────────────────── Micro-components ────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Section header — editorial: number · thin line · label · thin line
function SectionHead({ num, label }: { num: string; label: string }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-5 mb-6 md:mb-10"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <span className="font-mono text-[8px] tracking-[0.6em]" style={{ color: DIM }}>{num}</span>
      <div className="h-px w-6 shrink-0" style={{ background: LINE }} />
      <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: DIM }}>{label}</span>
      <div className="h-px flex-1" style={{ background: LINE }} />
    </motion.div>
  )
}

// ── Editorial image frame ─────────────────────────────────────────────────────
// No corner brackets (HUD). Placeholder = dark mat + quiet label.
interface FrameProps {
  src?: string
  alt?: string
  label?: string
  className?: string
  priority?: boolean
  isVideo?: boolean
  onClick?: () => void
}

function Frame({ src, alt = '', label, className = '', priority, isVideo, onClick }: FrameProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        border: '1px solid rgba(232,224,206,0.07)',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      onClick={onClick}
    >
      {/* Real image — grayscale, slight desaturation on hover */}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE}${src}`}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-[30%] group-hover:scale-[1.02]"
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {/* Placeholder — editorial mat, no geometric HUD decoration */}
      {!src && (
        <div className="absolute inset-0 flex items-end justify-start p-3.5">
          <span
            className="font-mono text-[7px] tracking-[0.3em] uppercase leading-none"
            style={{ color: 'rgba(232,224,206,0.15)' }}
          >
            {label ?? '—'}
          </span>
        </div>
      )}

      {/* Video play marker — minimal, not game-like */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex items-center justify-center transition-all duration-400 group-hover:scale-105"
            style={{
              width: 42, height: 42,
              borderRadius: '50%',
              border: `1px solid rgba(232,224,206,0.20)`,
              background: 'rgba(10,10,8,0.55)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div style={{
              width: 0, height: 0, marginLeft: 2,
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              borderLeft: `8px solid rgba(232,224,206,0.45)`,
            }} />
          </div>
        </div>
      )}

      {/* Vignette — bottom fade */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[rgba(5,5,4,0.5)]" />

      {/* Bottom label — quiet, small */}
      {label && src && (
        <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3">
          <span
            className="font-mono text-[7px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(232,224,206,0.30)' }}
          >
            {label}
          </span>
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────── Page ────────────────────────────────────────────

export default function ModelPage() {
  const [videoSrc,  setVideoSrc]  = useState<string | undefined>()
  const [videoMeta, setVideoMeta] = useState<{ title?: string; tag?: string; year?: string } | null>(null)

  const openVideo = (
    src: string | undefined,
    meta?: { title?: string; tag?: string; year?: string },
  ) => {
    if (!src) return
    setVideoSrc(src)
    setVideoMeta(meta ?? null)
  }

  return (
    <>
      <main
        className="min-h-screen pb-32"
        style={{ position: 'relative', zIndex: 1 }}
      >

        {/* ══════════════════════════════════════════════════════════════════
            HERO — full-screen split
            Left (60%): large image or dark atmospheric placeholder
            Right (40%): editorial copy, frosted glass panel
        ══════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-5 min-h-screen">

          {/* Left — hero image */}
          <div
            className="relative col-span-1 md:col-span-3 min-h-[65vw] md:min-h-screen overflow-hidden"
            style={{
              borderRight: `1px solid ${LINE}`,
              // subtle dark base; ambient background shows through
              background: 'rgba(10,10,8,0.35)',
            }}
          >
            {modelImages.hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${BASE}${modelImages.hero}`}
                alt="Shusaku Nishiura — model archive"
                className="absolute inset-0 w-full h-full object-cover grayscale"
                loading="eager"
              />
            ) : null /* ambient background provides atmosphere when no image */ }

            {/* Gradient overlays */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,5,4,0.35)] via-transparent to-[rgba(5,5,4,0.45)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(5,5,4,0.25)]" />
            </div>
          </div>

          {/* Right — editorial copy panel */}
          <div
            className="col-span-1 md:col-span-2 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 md:py-28"
            style={{
              background: 'rgba(12,11,9,0.94)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            >
              {/* Section number — very small */}
              <p
                className="font-mono text-[8px] tracking-[0.7em] mb-7"
                style={{ color: DIM }}
              >
                03
              </p>

              {/* Conceptual sub-label */}
              <p
                className="text-[11px] tracking-[0.2em] uppercase mb-5 italic"
                style={{ color: DIM, fontFamily: SERIF }}
              >
                Body / Image
              </p>

              {/* Main heading — Cormorant Garamond, light weight */}
              <h1
                className="leading-none mb-8"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: 'clamp(2.6rem, 5vw, 4.8rem)',
                  color: TEXT,
                  letterSpacing: '-0.025em',
                }}
              >
                Model<br />Archive
              </h1>

              {/* Thin rule — faint */}
              <div className="mb-8 h-px w-8" style={{ background: LINE }} />

              {/* Lead copy */}
              <p
                className="text-[13px] leading-relaxed mb-6"
                style={{ color: MUTED, maxWidth: 255, lineHeight: 1.8 }}
              >
                Body as interface. Visual direction through presence, movement, and atmosphere.
              </p>

              {/* Japanese line — supporting, quiet */}
              <p
                className="text-[10px] leading-loose mb-12"
                style={{ color: DIM, fontFamily: JA }}
              >
                身体表現、現場での判断、<br />
                ビジュアルディレクションの記録。
              </p>

              {/* Metadata block */}
              <div
                className="pt-6 space-y-2"
                style={{ borderTop: `1px solid ${LINE}` }}
              >
                <p className="font-mono text-[9px] tracking-[0.3em]" style={{ color: MUTED }}>
                  Van Cleef &amp; Arpels · MIKIMOTO
                </p>
                <p className="font-mono text-[9px] tracking-[0.2em]" style={{ color: DIM }}>
                  Campaign · Editorial · Jewelry
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CONTENT SECTIONS
        ══════════════════════════════════════════════════════════════════ */}
        <div className="px-5 md:px-12 lg:px-20 mt-10 md:mt-24 space-y-16 md:space-y-28">

          {/* ── 01 · Selected Visuals ─────────────────────────────────────── */}
          <section>
            <SectionHead num="01" label="Selected Visuals" />

            {/* Asymmetric grid: large left + two small right */}
            <div className="grid grid-cols-2 md:grid-cols-12 gap-2.5 mb-2.5">
              <Frame
                src={modelImages.editorial01}
                alt="Van Cleef & Arpels — スー レ ゼトワール"
                label="Van Cleef &amp; Arpels · 2024"
                className="col-span-2 md:col-span-7 min-h-[240px] md:min-h-[500px]"
                priority
              />
              <div
                className="col-span-2 md:col-span-5 grid gap-2.5"
                style={{ gridTemplateRows: '1fr 1fr' }}
              >
                <Frame
                  src={modelImages.milan01}
                  alt="Van Cleef & Arpels — スー レ ゼトワール"
                  label="VCA · Jewelry"
                  className="min-h-[148px] md:min-h-0"
                />
                <Frame
                  src={modelImages.commercial01}
                  alt="MIKIMOTO Lucky Arrows"
                  label="MIKIMOTO · Campaign"
                  className="min-h-[148px] md:min-h-0"
                />
              </div>
            </div>

            {/* Row 2: editorial quote + portrait */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
              <Reveal className="py-10 md:pr-14">
                <p
                  className="leading-relaxed mb-5 italic"
                  style={{ fontFamily: SERIF, fontWeight: 300, color: MUTED, fontSize: '1.1rem' }}
                >
                  "Six years. Three countries.<br />
                  Still learning what the camera wants."
                </p>
                <p className="font-mono text-[8px] tracking-[0.5em]" style={{ color: DIM }}>
                  — Ongoing
                </p>
              </Reveal>
              <Frame
                src={modelImages.portrait01}
                alt="Van Cleef & Arpels portrait"
                label="VCA · 2024"
                className="min-h-[260px]"
              />
            </div>
          </section>

          {/* ── 02 · International Experience ────────────────────────────── */}
          <section>
            <SectionHead num="02" label="International Experience" />
            <div className="max-w-xl">
              {[
                {
                  loc: 'Paris', year: '2023',
                  heading: 'Casting, runway, negotiation, and survival.',
                  body: 'A record of moving alone through an unfamiliar fashion system. Visa, agency, booking — every step managed without a Japanese support structure.',
                  ja: 'パリ・コレクションへの参加。すべてを自力でマネジメントした。',
                },
                {
                  loc: 'Milan', year: '2023',
                  heading: 'Runway presence and backstage pressure.',
                  body: 'Fitting into a production system that moves fast and communicates in fragments. Directorial decisions made in real time.',
                  ja: 'ミラノでのランウェイ。高速で動く現場への適応と即興的な判断。',
                },
              ].map(({ loc, year, heading, body, ja }, i) => (
                <Reveal key={loc} delay={i * 0.08}>
                  <div className="py-8" style={{ borderTop: `1px solid ${LINE}` }}>
                    <p
                      className="font-mono text-[9px] tracking-[0.45em] mb-4 uppercase"
                      style={{ color: DIM }}
                    >
                      {loc}, {year}
                    </p>
                    <h3
                      className="text-lg mb-3 leading-snug italic"
                      style={{ fontFamily: SERIF, fontWeight: 400, color: TEXT }}
                    >
                      {heading}
                    </h3>
                    <p className="text-[13px] leading-relaxed mb-3" style={{ color: MUTED, maxWidth: 400 }}>
                      {body}
                    </p>
                    <p className="text-[10px] leading-loose" style={{ color: DIM, fontFamily: JA }}>
                      {ja}
                    </p>
                  </div>
                </Reveal>
              ))}
              <div className="h-px" style={{ background: LINE }} />
            </div>
          </section>

          {/* ── 03 · Commercial / Campaign ───────────────────────────────── */}
          <section>
            <SectionHead num="03" label="Commercial / Campaign" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start">

              {/* Text entries */}
              <div>
                {[
                  {
                    year: '2024', category: 'Commercial',
                    heading: 'Translating direction into posture, gaze, and tone.',
                    body: 'Domestic commercial production. Interpreting creative briefs on location, minimising correction rounds through proactive visual communication.',
                  },
                  {
                    year: '2024', category: 'Lookbook',
                    heading: 'Brand image as architecture.',
                    body: "Product-focused image direction. Understanding the gap between a designer's intention and what the camera will read.",
                  },
                ].map(({ year, category, heading, body }, i) => (
                  <Reveal key={category} delay={i * 0.08}>
                    <div className="py-7" style={{ borderTop: `1px solid ${LINE}` }}>
                      <p
                        className="font-mono text-[9px] tracking-[0.38em] mb-3 uppercase"
                        style={{ color: DIM }}
                      >
                        {category} — {year}
                      </p>
                      <h3
                        className="text-[1.05rem] mb-2.5 leading-snug"
                        style={{ fontFamily: SERIF, fontWeight: 400, color: TEXT }}
                      >
                        {heading}
                      </h3>
                      <p className="text-[13px] leading-relaxed" style={{ color: MUTED }}>
                        {body}
                      </p>
                    </div>
                  </Reveal>
                ))}
                <div className="h-px" style={{ background: LINE }} />
              </div>

              {/* Image frames */}
              <div className="flex flex-col gap-2.5">
                <Frame
                  src={modelImages.commercial01}
                  alt="Commercial campaign"
                  label="Campaign"
                  className="min-h-[240px]"
                />
                <Frame
                  src={modelImages.lookbook01}
                  alt="Lookbook"
                  label="Lookbook"
                  className="min-h-[165px]"
                />
              </div>
            </div>
          </section>

          {/* ── 04 · Portrait Archive ─────────────────────────────────────── */}
          <section>
            <SectionHead num="04" label="Portrait Archive" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-10">
              {[
                { src: modelImages.portrait01, alt: 'Van Cleef & Arpels', label: 'VCA · 2024' },
                { src: modelImages.portrait02, alt: 'MIKIMOTO Lucky Arrows', label: 'MIKIMOTO · 2024' },
                { src: modelImages.portrait03, alt: 'Editorial', label: 'Editorial · 2024' },
              ].map(({ src, alt, label }) => (
                <Frame
                  key={label}
                  src={src}
                  alt={alt}
                  label={label}
                  className="min-h-[200px] md:min-h-[460px]"
                />
              ))}
            </div>
            <Reveal className="text-center">
              <p
                className="mx-auto italic text-[1.05rem]"
                style={{ fontFamily: SERIF, fontWeight: 300, color: DIM, maxWidth: 340 }}
              >
                "Stillness, tension, and the small distance<br />
                between camera and subject."
              </p>
            </Reveal>
          </section>

          {/* ── 05 · Motion / Runway Film ─────────────────────────────────── */}
          <section>
            <SectionHead num="05" label="Motion / Runway Film" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
              <Frame
                src={modelImages.runwayFilmThumb}
                alt="Runway film"
                label="Runway Film · 2023"
                isVideo
                className="min-h-[270px] md:min-h-[350px]"
                onClick={() =>
                  openVideo(modelImages.runwayFilm, {
                    title: 'Runway Film',
                    tag: 'Film',
                    year: '2023',
                  })
                }
              />
              <Reveal className="py-4 md:pl-2">
                <p
                  className="text-xl mb-5 leading-snug italic"
                  style={{ fontFamily: SERIF, fontWeight: 300, color: TEXT }}
                >
                  "Movement as a visual system."
                </p>
                <p
                  className="text-[13px] leading-relaxed mb-5"
                  style={{ color: MUTED, maxWidth: 330 }}
                >
                  Documentary footage from Paris and Milan runway seasons. Shot while performing — the camera perspective belongs to the participant, not the observer.
                </p>
                <p className="text-[10px] leading-loose" style={{ color: DIM, fontFamily: JA }}>
                  参加者の視点で記録したランウェイドキュメンタリー。
                </p>
              </Reveal>
            </div>
          </section>

          {/* ── 06 · Profile ──────────────────────────────────────────────── */}
          <section>
            <SectionHead num="06" label="Profile" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-2xl">

              {/* Info table */}
              <Reveal>
                <div>
                  {(
                    [
                      ['Name',       'Shusaku Nishiura'],
                      ['Base',       'Tokyo, Japan'],
                      ['Active',     '2018 — Present'],
                      ['Markets',    'Japan / France / Italy'],
                      ['Categories', 'Runway, Editorial, Campaign'],
                    ] as [string, string][]
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="flex gap-6 py-3.5"
                      style={{ borderBottom: `1px solid ${LINE}` }}
                    >
                      <span
                        className="font-mono text-[8px] tracking-[0.38em] uppercase shrink-0 pt-0.5"
                        style={{ color: DIM, width: 76 }}
                      >
                        {label}
                      </span>
                      <span className="text-[13px]" style={{ color: MUTED }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Bio + contact */}
              <Reveal delay={0.1} className="flex flex-col justify-between">
                <p
                  className="leading-relaxed italic mb-8"
                  style={{ fontFamily: SERIF, fontWeight: 300, color: MUTED, fontSize: '1rem' }}
                >
                  Started from body.<br />
                  Moved into images.<br />
                  Now builds the systems behind them.
                </p>
                <div
                  className="pt-6 space-y-3"
                  style={{ borderTop: `1px solid ${LINE}` }}
                >
                  <p
                    className="font-mono text-[9px] tracking-[0.3em]"
                    style={{ color: DIM }}
                  >
                    Self-managed · Open to selected work
                  </p>
                  <a
                    href="mailto:hello@example.com"
                    className="font-mono text-[9px] tracking-[0.2em] transition-opacity duration-200 inline-block"
                    style={{ color: ACCENT }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.5' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    Contact ↗
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

        </div>{/* /content */}
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
