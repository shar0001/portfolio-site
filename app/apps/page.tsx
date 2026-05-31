'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { WorkModal, type WorkDetail } from '@/components/ui/WorkModal'
import { defaultWorks, type Work } from '@/content/works'
import { pmSkills } from '@/content/apps'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'
const BASE  = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function toWorkDetail(w: Work): WorkDetail {
  return { ...w, type: 'photo', tools: w.tools, insight: w.process }
}

export default function AppsPage() {
  const [selected, setSelected] = useState<WorkDetail | null>(null)

  const allWorks = defaultWorks
    .filter(w => w.category === 'apps' && w.visible)
    .sort((a, b) => a.order - b.order)

  const featured = allWorks.find(w => w.featured) ?? allWorks[0]
  const rest      = allWorks.filter(w => w.id !== featured?.id)

  return (
    <main
      className="min-h-screen px-5 md:px-12 lg:px-20 pt-20 pb-24"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="mb-10 md:mb-14">
        <motion.p
          className="font-mono text-[8px] tracking-[0.55em] uppercase mb-5"
          style={{ color: '#5a6490' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          02
        </motion.p>
        <motion.h1
          style={{
            fontFamily: SERIF,
            fontWeight: 300,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            color: '#f0f4ff',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
        >
          Apps
        </motion.h1>
        <motion.div
          className="mt-6 mb-5 h-px w-8 origin-left"
          style={{ background: 'rgba(155,184,255,0.18)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        <motion.p
          className="text-sm leading-relaxed"
          style={{ color: '#96a0bd', maxWidth: 380, lineHeight: 1.8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          iOS・Webアプリケーション開発。企画から設計・実装・リリースまでをエンドツーエンドで担当。
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-12 gap-2.5"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
      >
        {featured && (
          <div
            className="col-span-1 md:col-span-7 flex flex-col cursor-pointer group"
            style={{ border: '1px solid rgba(155,184,255,0.10)' }}
            onClick={() => setSelected(toWorkDetail(featured))}
          >
            <div className="relative min-h-[200px] md:min-h-[260px] bg-[#10152a] flex-1">
              {featured.mediaUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${BASE}${featured.mediaUrl}`}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: '#3a4470' }}>
                    {featured.tag}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 md:p-6" style={{ borderTop: '1px solid rgba(155,184,255,0.08)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-[8px] tracking-widest mb-1.5" style={{ color: '#5a6490' }}>
                    {featured.year} · {featured.tag}
                  </p>
                  <h2 className="text-lg font-medium transition-colors duration-300" style={{ color: '#c9d1e6' }}>
                    {featured.title}
                  </h2>
                </div>
                {featured.status && (
                  <span
                    className="font-mono text-[9px] px-2 py-1 shrink-0"
                    style={{ color: '#6878a8', border: '1px solid rgba(155,184,255,0.12)' }}
                  >
                    {featured.status}
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: '#8090b8', lineHeight: 1.8 }}>
                {featured.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {featured.tools.map(t => (
                  <span
                    key={t}
                    className="font-mono text-[9px] px-2 py-0.5"
                    style={{ color: '#7888b8', background: 'rgba(155,184,255,0.05)', border: '1px solid rgba(155,184,255,0.10)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p
                className="font-mono text-[9px] tracking-widest transition-colors duration-300 group-hover:text-[#9bb8ff]"
                style={{ color: '#5060a0' }}
              >
                詳細を見る →
              </p>
            </div>
          </div>
        )}

        <div className="col-span-1 md:col-span-5 flex flex-col gap-2.5">
          <div className="flex-1 p-5 md:p-6" style={{ border: '1px solid rgba(155,184,255,0.10)' }}>
            <p className="font-mono text-[8px] tracking-[0.4em] uppercase mb-1" style={{ color: '#5a6490' }}>
              PM / Production
            </p>
            <p className="text-[11px] leading-relaxed mb-5" style={{ color: '#6878a8', lineHeight: 1.8 }}>
              映像もコードも自分で作るからこそ、無理のないスケジュールと精度の高い仕様が出せます。
            </p>
            <div>
              {pmSkills.map((s, i) => (
                <div
                  key={s.label}
                  className="py-3.5"
                  style={{ borderTop: i > 0 ? '1px solid rgba(155,184,255,0.07)' : undefined }}
                >
                  <p className="text-sm mb-1 font-medium" style={{ color: '#b0bcd8' }}>{s.label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#7080a8', lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {rest.map(app => (
            <div
              key={app.id}
              className="p-5 cursor-pointer group"
              style={{ border: '1px solid rgba(155,184,255,0.10)' }}
              onClick={() => setSelected(toWorkDetail(app))}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-medium transition-colors duration-300 group-hover:text-[#e8eeff]" style={{ color: '#c0ccee' }}>
                  {app.title}
                </h3>
                {app.status && (
                  <span
                    className="font-mono text-[9px] px-2 py-0.5 shrink-0"
                    style={{ color: '#6878a8', border: '1px solid rgba(155,184,255,0.10)' }}
                  >
                    {app.status}
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#8090b8', lineHeight: 1.75 }}>{app.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {app.tools.map(t => (
                  <span
                    key={t}
                    className="font-mono text-[9px] px-1.5 py-0.5"
                    style={{ color: '#7080a8', background: 'rgba(155,184,255,0.04)', border: '1px solid rgba(155,184,255,0.09)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <WorkModal work={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
