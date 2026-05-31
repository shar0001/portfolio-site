'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { VideoModal } from '@/components/ui/VideoModal'
import { CursorParticles } from '@/components/ui/CursorParticles'
import { modelImages } from '@/content/model'

// ─────────────────────────── Design tokens ───────────────────────────────────
const SERIF   = 'var(--font-cormorant), "EB Garamond", Georgia, serif'
const JA      = '"Hiragino Mincho ProN", "Yu Mincho", serif'
const TEXT    = '#E7E0CF'
const MUTED   = '#9C9586'
const DIM     = '#6B6350'
const LINE    = '#3A352B'
const SURFACE = '#131310'
const ACCENT  = '#D8C48A'
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
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionHead({ num, label }: { num: string; label: string }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4 mb-10"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7 }}
    >
      <span className="font-mono text-[9px] tracking-[0.5em]" style={{ color: DIM }}>{num}</span>
      <div className="h-px w-8 shrink-0" style={{ background: LINE }} />
      <span className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: DIM }}>{label}</span>
      <div className="h-px flex-1" style={{ background: LINE }} />
    </motion.div>
  )
}

interface FrameProps {
  src?: string
  alt?: string
  topLabel?: string
  bottomLabel?: string
  className?: string
  priority?: boolean
  isVideo?: boolean
  onClick?: () => void
}

function Frame({
  src,
  alt = '',
  topLabel,
  bottomLabel,
  className = '',
  priority,
  isVideo,
  onClick,
}: FrameProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ background: SURFACE, border: `1px solid ${LINE}` }}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      onClick={onClick}
    >
      {/* Real image */}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE}${src}`}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-[40%] group-hover:scale-[1.025]"
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {/* Editorial placeholder */}
      {!src && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.008) 3px,rgba(255,255,255,0.008) 4px)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t border-l" style={{ borderColor: LINE }} />
          <div className="absolute top-4 right-4 w-5 h-5 border-t border-r" style={{ borderColor: LINE }} />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l" style={{ borderColor: LINE }} />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r" style={{ borderColor: LINE }} />
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-10 h-10">
              <div className="absolute top-1/2 inset-x-0 h-px" style={{ background: LINE }} />
              <div className="absolute left-1/2 inset-y-0 w-px" style={{ background: LINE }} />
            </div>
          </div>
        </div>
      )}

      {/* Video play indicator */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ borderColor: DIM, background: 'rgba(8,8,6,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <div
              className="ml-0.5"
              style={{
                width: 0, height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: `9px solid ${DIM}`,
              }}
            />
          </div>
        </div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[rgba(8,8,6,0.55)]" />

      {topLabel && (
        <div className="absolute top-0 left-0 right-0 p-3">
          <span className="font-mono text-[8px] tracking-[0.35em] uppercase" style={{ color: DIM }}>
            {topLabel}
          </span>
        </div>
      )}
      {bottomLabel && (
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <span className="font-mono text-[8px] tracking-[0.35em] uppercase" style={{ color: MUTED }}>
            {bottomLabel}
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
      <CursorParticles />

      <main className="min-h-screen pb-32">

        {/* ══════════════════════════════════════════════════════════════════
            HERO — split: image left (60%) / editorial copy right (40%)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-5 min-h-screen">

          {/* Left — hero image, bleeds behind nav */}
          <div
            className="relative col-span-1 md:col-span-3 min-h-[65vw] md:min-h-screen overflow-hidden"
            style={{ background: SURFACE, borderRight: `1px solid ${LINE}` }}
          >
            {modelImages.hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${BASE}${modelImages.hero}`}
                alt="Shusaku Nishiura — model archive"
                className="absolute inset-0 w-full h-full object-cover grayscale"
                loading="eager"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.008) 3px,rgba(255,255,255,0.008) 4px)',
                }}
              >
                <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2" style={{ borderColor: LINE }} />
                <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2" style={{ borderColor: LINE }} />
                <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2" style={{ borderColor: LINE }} />
                <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2" style={{ borderColor: LINE }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute top-1/2 inset-x-0 h-px" style={{ background: LINE }} />
                    <div className="absolute left-1/2 inset-y-0 w-px" style={{ background: LINE }} />
                    <div
                      className="absolute inset-0 border rotate-45"
                      style={{ borderColor: LINE, margin: '14px' }}
                    />
                  </div>
                  <p className="font-mono text-[8px] tracking-[0.45em] uppercase" style={{ color: DIM }}>
                    /media/model-hero.jpg
                  </p>
                </div>
              </div>
            )}
            {/* Atmospheric overlay — top and bottom fade */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/50" />
            {/* Small coordinate tag */}
            <div className="absolute top-20 left-6">
              <span className="font-mono text-[8px] tracking-[0.45em] uppercase" style={{ color: DIM }}>
                P.Archive_01
              </span>
            </div>
          </div>

          {/* Right — editorial copy */}
          <div
            className="col-span-1 md:col-span-2 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-20 md:py-28"
            style={{ background: 'rgba(8,8,6,0.82)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
            >
              {/* Section number */}
              <p className="font-mono text-[9px] tracking-[0.6em] mb-6" style={{ color: DIM }}>03</p>

              {/* Concept label */}
              <p
                className="text-xs tracking-[0.18em] uppercase mb-4 italic"
                style={{ color: DIM, fontFamily: SERIF }}
              >
                Body / Image
              </p>

              {/* Main heading — Cormorant Garamond */}
              <h1
                className="leading-none mb-8"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
                  color: TEXT,
                  letterSpacing: '-0.02em',
                }}
              >
                Model<br />Archive
              </h1>

              {/* Thin horizontal rule */}
              <div className="mb-8 h-px w-10" style={{ background: LINE }} />

              {/* Lead copy */}
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: MUTED, maxWidth: 260, lineHeight: 1.75 }}
              >
                Body as interface. Visual direction through presence, movement, and atmosphere.
              </p>

              {/* Japanese supporting line */}
              <p
                className="text-[11px] leading-loose mb-12"
                style={{ color: DIM, fontFamily: JA }}
              >
                身体表現、現場での判断、<br />
                ビジュアルディレクションの記録。
              </p>

              {/* Metadata block */}
              <div className="pt-6 space-y-2.5" style={{ borderTop: `1px solid ${LINE}` }}>
                <p className="font-mono text-[10px] tracking-[0.3em]" style={{ color: MUTED }}>
                  Tokyo / Paris / Milan
                </p>
                <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: DIM }}>
                  Runway · Campaign · Editorial
                </p>
                <p className="font-mono text-[10px]" style={{ color: '#4A4035', lineHeight: 1.7 }}>
                  International casting and<br />commercial visual work
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CONTENT
        ══════════════════════════════════════════════════════════════════ */}
        <div className="px-6 md:px-12 lg:px-20 mt-24 space-y-28">

          {/* ── 01 · Selected Visuals ─────────────────────────────────────── */}
          <section>
            <SectionHead num="01" label="Selected Visuals" />

            {/* Row A: large left + 2 small right */}
            <div className="grid grid-cols-2 md:grid-cols-12 gap-3 mb-3">
              <Frame
                src={modelImages.editorial01}
                alt="Paris editorial, 2023"
                bottomLabel="Paris, 2023 · Editorial"
                className="col-span-2 md:col-span-7 min-h-[320px] md:min-h-[520px]"
                priority
              />
              <div className="col-span-2 md:col-span-5 grid gap-3" style={{ gridTemplateRows: '1fr 1fr' }}>
                <Frame
                  src={modelImages.milan01}
                  alt="Milan runway, 2023"
                  bottomLabel="Milan · Runway"
                  className="min-h-[155px] md:min-h-0"
                />
                <Frame
                  src={modelImages.commercial01}
                  alt="Commercial, 2024"
                  bottomLabel="Commercial · 2024"
                  className="min-h-[155px] md:min-h-0"
                />
              </div>
            </div>

            {/* Row B: editorial text + portrait */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
              <Reveal className="py-8 md:pr-12">
                <p
                  className="text-lg mb-4 leading-relaxed italic"
                  style={{ fontFamily: SERIF, fontWeight: 300, color: MUTED }}
                >
                  "Six years. Three countries.<br />
                  Still learning what the camera wants."
                </p>
                <p className="font-mono text-[9px] tracking-[0.45em]" style={{ color: DIM }}>
                  — Ongoing
                </p>
              </Reveal>
              <Frame
                src={modelImages.portrait01}
                alt="Portrait"
                bottomLabel="Portrait · 2022"
                className="min-h-[260px]"
              />
            </div>
          </section>

          {/* ── 02 · International Experience ────────────────────────────── */}
          <section>
            <SectionHead num="02" label="International Experience" />
            <div className="max-w-2xl">
              {[
                {
                  loc: 'Paris', year: '2023',
                  heading: 'Casting, runway, negotiation, and survival.',
                  body: 'A record of moving alone through an unfamiliar fashion system. Visa, agency, booking — every step managed without a Japanese support structure.',
                  ja: 'パリ・コレクションへの参加。エージェントとの交渉からビザ申請まで、すべてを自力でマネジメントした。',
                },
                {
                  loc: 'Milan', year: '2023',
                  heading: 'Runway presence and backstage pressure.',
                  body: 'Fitting into a production system that moves fast and communicates in fragments. Directorial decisions made in real time, under backstage conditions.',
                  ja: 'ミラノでのランウェイ。高速で動く現場への適応と、プレッシャー下での即興的な判断。',
                },
              ].map(({ loc, year, heading, body, ja }, i) => (
                <Reveal key={loc} delay={i * 0.1}>
                  <div className="py-8" style={{ borderTop: `1px solid ${LINE}` }}>
                    <p className="font-mono text-[10px] tracking-[0.4em] mb-3 uppercase" style={{ color: DIM }}>
                      {loc}, {year}
                    </p>
                    <h3
                      className="text-xl mb-3 leading-snug italic"
                      style={{ fontFamily: SERIF, fontWeight: 400, color: TEXT }}
                    >
                      {heading}
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: MUTED, maxWidth: 420 }}>
                      {body}
                    </p>
                    <p className="text-[11px] leading-loose" style={{ color: DIM, fontFamily: JA }}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

              {/* Left — text entries */}
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
                    body: 'Product-focused image direction. Understanding the gap between a designer\'s intention and what the camera will read.',
                  },
                ].map(({ year, category, heading, body }, i) => (
                  <Reveal key={category} delay={i * 0.1}>
                    <div className="py-7" style={{ borderTop: `1px solid ${LINE}` }}>
                      <p className="font-mono text-[10px] tracking-[0.35em] mb-3 uppercase" style={{ color: DIM }}>
                        {category} — {year}
                      </p>
                      <h3
                        className="text-lg mb-2.5 leading-snug"
                        style={{ fontFamily: SERIF, fontWeight: 400, color: TEXT }}
                      >
                        {heading}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                        {body}
                      </p>
                    </div>
                  </Reveal>
                ))}
                <div className="h-px" style={{ background: LINE }} />
              </div>

              {/* Right — image frames */}
              <div className="flex flex-col gap-3">
                <Frame
                  src={modelImages.commercial01}
                  alt="Commercial campaign shoot"
                  bottomLabel="Commercial · Campaign"
                  className="min-h-[240px]"
                />
                <Frame
                  src={modelImages.lookbook01}
                  alt="Lookbook shoot"
                  bottomLabel="Lookbook · 2024"
                  className="min-h-[170px]"
                />
              </div>
            </div>
          </section>

          {/* ── 04 · Portrait Archive ─────────────────────────────────────── */}
          <section>
            <SectionHead num="04" label="Portrait Archive" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              <Frame
                src={modelImages.portrait01}
                alt="Portrait 2022"
                bottomLabel="2022"
                className="min-h-[360px] md:min-h-[480px]"
              />
              <Frame
                src={modelImages.portrait02}
                alt="Portrait 2023"
                bottomLabel="2023"
                className="min-h-[360px] md:min-h-[480px]"
              />
              <Frame
                src={modelImages.portrait03}
                alt="Portrait 2024"
                bottomLabel="2024"
                className="min-h-[360px] md:min-h-[480px]"
              />
            </div>
            <Reveal className="text-center">
              <p
                className="text-base mx-auto italic"
                style={{ fontFamily: SERIF, fontWeight: 300, color: DIM, maxWidth: 360 }}
              >
                "Stillness, tension, and the small distance between camera and subject."
              </p>
            </Reveal>
          </section>

          {/* ── 05 · Motion / Runway Film ─────────────────────────────────── */}
          <section>
            <SectionHead num="05" label="Motion / Runway Film" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
              <Frame
                src={modelImages.runwayFilmThumb}
                alt="Runway film — Paris 2023"
                bottomLabel="Runway Film · 2023"
                isVideo
                className="min-h-[280px] md:min-h-[360px]"
                onClick={() =>
                  openVideo(modelImages.runwayFilm, {
                    title: 'Runway Film',
                    tag: 'Film',
                    year: '2023',
                  })
                }
              />
              <Reveal className="py-4 md:pl-4">
                <p
                  className="text-xl mb-5 leading-snug italic"
                  style={{ fontFamily: SERIF, fontWeight: 300, color: TEXT }}
                >
                  "Movement as a visual system."
                </p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: MUTED, maxWidth: 340 }}>
                  Documentary footage from Paris and Milan runway seasons. Shot while performing — the camera perspective belongs to the participant, not the observer.
                </p>
                <p className="text-[11px] leading-loose" style={{ color: DIM, fontFamily: JA }}>
                  参加者の視点で記録したランウェイドキュメンタリー。
                </p>
              </Reveal>
            </div>
          </section>

          {/* ── 06 · Profile ──────────────────────────────────────────────── */}
          <section>
            <SectionHead num="06" label="Profile" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl">

              {/* Info table */}
              <Reveal>
                <div className="space-y-0">
                  {(
                    [
                      ['Name',       'Shusaku Nishiura'],
                      ['Base',       'Tokyo, Japan'],
                      ['Active',     '2018 — Present'],
                      ['Markets',    'Japan / France / Italy'],
                      ['Categories', 'Runway, Editorial, Campaign, Lookbook'],
                    ] as [string, string][]
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="flex gap-6 py-4"
                      style={{ borderBottom: `1px solid ${LINE}` }}
                    >
                      <span
                        className="font-mono text-[9px] tracking-[0.35em] uppercase shrink-0 pt-0.5"
                        style={{ color: DIM, width: 80 }}
                      >
                        {label}
                      </span>
                      <span className="text-sm" style={{ color: MUTED }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Short bio + contact */}
              <Reveal delay={0.1} className="flex flex-col justify-between">
                <p
                  className="text-base leading-relaxed italic mb-8"
                  style={{ fontFamily: SERIF, fontWeight: 300, color: MUTED }}
                >
                  Started from body.<br />
                  Moved into images.<br />
                  Now builds the systems behind them.
                </p>
                <div className="space-y-3" style={{ borderTop: `1px solid ${LINE}`, paddingTop: 24 }}>
                  <p className="font-mono text-[10px] tracking-[0.3em]" style={{ color: DIM }}>
                    Self-managed · Open to selected work
                  </p>
                  <a
                    href="mailto:hello@example.com"
                    className="font-mono text-[10px] tracking-[0.2em] transition-opacity duration-200 inline-block"
                    style={{ color: ACCENT }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.6' }}
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
