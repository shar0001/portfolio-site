'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MediaCard } from '@/components/ui/MediaCard'
import { WorkModal, type WorkDetail } from '@/components/ui/WorkModal'
import { VideoModal } from '@/components/ui/VideoModal'
import { defaultWorks, type Work } from '@/content/works'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'

// Adapt unified Work to the shape MediaCard + WorkModal expect
function toCard(w: Work) {
  return {
    ...w,
    type:      (w.mediaType === 'video' ? 'video' : 'photo') as 'video' | 'photo',
    src:       w.mediaUrl,
    thumbnail: w.thumbnailUrl,
    insight:   w.process,
  }
}

export default function MoviePage() {
  const [workModal,  setWorkModal]  = useState<WorkDetail | null>(null)
  const [videoModal, setVideoModal] = useState<Work | null>(null)

  const allWorks = defaultWorks
    .filter(w => w.category === 'movie' && w.visible)
    .sort((a, b) => a.order - b.order)

  const featured = allWorks.find(w => w.featured)
  const rest      = allWorks.filter(w => !w.featured)

  const handleClick = (w: Work) => {
    if (w.mediaUrl) setVideoModal(w)
    else            setWorkModal(toCard(w))
  }

  return (
    <main
      className="min-h-screen px-5 md:px-12 lg:px-20 pt-20 pb-24"
      style={{ position: 'relative', zIndex: 1 }}
    >
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="mb-10 md:mb-14">
        <motion.p
          className="font-mono text-[8px] tracking-[0.55em] uppercase mb-5"
          style={{ color: '#333' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          01
        </motion.p>
        <motion.h1
          style={{
            fontFamily: SERIF,
            fontWeight: 300,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            color: '#c0b8a8',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
        >
          Movie
        </motion.h1>
        <motion.div
          className="mt-6 mb-5 h-px w-8 origin-left"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        <motion.p
          className="text-sm leading-relaxed"
          style={{ color: '#545250', maxWidth: 380 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          After Effects を中心とした映像制作。モーショングラフィックス、VFX、タイトルシーケンス。
        </motion.p>
      </div>

      {/* ── Work grid ─────────────────────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-12 gap-2.5"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
      >
        {featured && (
          <MediaCard
            {...toCard(featured)}
            className="col-span-1 md:col-span-8 min-h-[260px] md:min-h-[380px]"
            onClick={() => handleClick(featured)}
          />
        )}

        <div className="col-span-1 md:col-span-4 flex flex-col gap-2.5">
          {rest.slice(0, 2).map(w => (
            <MediaCard
              key={w.id}
              {...toCard(w)}
              className="min-h-[160px] md:min-h-[180px]"
              onClick={() => handleClick(w)}
            />
          ))}
        </div>

        {rest.slice(2).map(w => (
          <MediaCard
            key={w.id}
            {...toCard(w)}
            className="col-span-1 md:col-span-6 min-h-[200px] md:min-h-[220px]"
            onClick={() => handleClick(w)}
          />
        ))}
      </motion.div>

      <p className="mt-6 font-mono text-[8px] text-[#242220] text-center tracking-widest">
        タップで再生 · 動画のないカードは詳細を表示
      </p>

      <WorkModal work={workModal} onClose={() => setWorkModal(null)} />
      <VideoModal
        src={videoModal?.mediaUrl}
        title={videoModal?.title}
        tag={videoModal?.tag}
        year={videoModal?.year}
        onClose={() => setVideoModal(null)}
      />
    </main>
  )
}
