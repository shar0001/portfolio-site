'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { WorkModal, type WorkDetail } from '@/components/ui/WorkModal'
import { defaultWorks, type Work } from '@/content/works'
import { pmSkills } from '@/content/apps'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'

function toWorkDetail(w: Work): WorkDetail {
  return { ...w, type: 'photo', tools: w.tools, insight: w.process }
}

export default function AppsPage() {
  const [selected, setSelected] = useState<WorkDetail | null>(null)
  
  // 3D Card Parallax States for iPhone Mockup
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    setRotateX(-y / 18) // Adjust tilt sensitivity
    setRotateY(x / 18)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  const allWorks = defaultWorks
    .filter(w => w.category === 'apps' && w.visible)
    .sort((a, b) => a.order - b.order)

  // Find featured app ("ピタンコ わりかん" or fallback)
  const featured = allWorks.find(w => w.featured) ?? allWorks[0]
  const rest      = allWorks.filter(w => w.id !== featured?.id)

  return (
    <main
      className="relative mx-auto min-h-screen w-full max-w-[1180px] px-7 md:px-12 lg:px-16 pt-24 pb-20 md:pt-28 md:pb-28"
      style={{ zIndex: 1 }}
    >
      {/* Page Title */}
      <div className="mb-10 md:mb-16">
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
          style={{ color: '#96a0bd', maxWidth: 420, lineHeight: 1.8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          iOS・Webアプリケーション開発。プロダクトマネジメント視点での企画立案から、Figma設計、SwiftUI/React実装、リリースまでをシームレスに手がけます。
        </motion.p>
      </div>

      {/* ── 1. Featured App Showplace ("ピタンコ わりかん") ── */}
      {featured && (
        <motion.div
          className="relative mb-16 p-8 md:p-12 lg:p-14 overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, rgba(20,28,58,0.4) 0%, rgba(13,18,36,0.7) 100%)',
            border: '1px solid rgba(155, 184, 255, 0.08)',
            boxShadow: '0 30px 60px -15px rgba(5,8,20,0.8)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Subtle Ambient Background Light */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-40" style={{ background: '#9bb8ff' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-20" style={{ background: '#c8b6ff' }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Product Information */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: '#9bb8ff' }}>
                  Featured iOS App · {featured.year}
                </span>
                <h2 
                  style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}
                  className="text-[#f0f4ff] mt-2 mb-4 leading-tight tracking-tight"
                >
                  {featured.title}
                </h2>
                <p className="text-sm md:text-[15px] leading-relaxed" style={{ color: '#a0aed0', lineHeight: 1.85 }}>
                  {featured.description}
                </p>
              </div>

              {/* Highlight Features list */}
              <div className="space-y-4 py-2 border-y" style={{ borderColor: 'rgba(155,184,255,0.08)' }}>
                <div className="flex gap-3">
                  <span className="text-[#9bb8ff] font-mono text-xs mt-0.5">⚡</span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#c9d1e6] uppercase tracking-wide">ワンタップ精算</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: '#7080a8' }}>グループ全体の複雑な貸し借りを自動相殺し、誰が誰にいくら送金すべきか最小ルートで算出します。</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#9bb8ff] font-mono text-xs mt-0.5">👥</span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#c9d1e6] uppercase tracking-wide">グループ別管理</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: '#7080a8' }}>旅行や合宿、毎月の生活費など、イベントごとにメンバーを分けて複数の割り勘履歴をまとめて清算可能。</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#9bb8ff] font-mono text-xs mt-0.5">📊</span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#c9d1e6] uppercase tracking-wide">カスタム比率 (傾斜) 対応</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: '#7080a8' }}>均等なワリカンだけでなく、「多めに払う人」「比率（パーセント）」など自由度の高い割り振りに対応。</p>
                  </div>
                </div>
              </div>

              {/* Metadata (Role, Tools) */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-widest mb-1.5" style={{ color: '#5a6490' }}>Role</p>
                  <p className="text-xs text-[#b0bcd8]">{featured.role}</p>
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-widest mb-1.5" style={{ color: '#5a6490' }}>Technology</p>
                  <div className="flex flex-wrap gap-1.5">
                    {featured.tools.map(t => (
                      <span key={t} className="font-mono text-[9px] text-[#8090b8]" style={{ padding: '2px 6px', background: 'rgba(155,184,255,0.04)', border: '1px solid rgba(155,184,255,0.08)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {featured.storeUrl && (
                  <a
                    href={featured.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #18264d, #253366)',
                      border: '1px solid rgba(155,184,255,0.3)',
                      color: '#ffffff',
                      boxShadow: '0 4px 20px rgba(24,38,77,0.4)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(24,38,77,0.6)'
                      e.currentTarget.style.borderColor = 'rgba(155,184,255,0.5)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(24,38,77,0.4)'
                      e.currentTarget.style.borderColor = 'rgba(155,184,255,0.3)'
                    }}
                  >
                    <span> App Store で入手</span>
                  </a>
                )}
                <button
                  onClick={() => setSelected(toWorkDetail(featured))}
                  className="font-mono text-[9px] tracking-widest uppercase py-3 px-6 rounded-full transition-colors"
                  style={{ border: '1px solid rgba(155,184,255,0.12)', color: '#9bb8ff' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(155,184,255,0.05)'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#9bb8ff'
                  }}
                >
                  制作詳細・プロセス →
                </button>
              </div>
            </div>

            {/* Right Column: 3D Interactive Device Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                className="perspective-container cursor-grab active:cursor-grabbing"
                style={{ perspective: 1000 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  className="phone-frame relative w-[260px] h-[520px] rounded-[42px] p-2.5 bg-[#090d1a]"
                  style={{
                    border: '8px solid #202b4d',
                    boxShadow: '0 30px 60px -15px rgba(0,0,0,0.9), inset 0 0 10px rgba(255,255,255,0.05)',
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  {/* Dynamic Island (iPhone Notch) */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4.5 bg-black rounded-full z-20 flex items-center justify-end px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" style={{ boxShadow: 'inset 0 0 2px rgba(255,255,255,0.4)' }} />
                  </div>

                  {/* Reflection Screen Overlay */}
                  <div className="absolute inset-0 rounded-[34px] overflow-hidden pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(115deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)'
                    }}
                  />

                  {/* App Screen Content (Mocked via pure CSS/HTML) */}
                  <div className="w-full h-full rounded-[30px] overflow-hidden flex flex-col p-4 select-none"
                    style={{
                      background: 'radial-gradient(circle at top, #141c3a 0%, #0d1224 100%)'
                    }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mt-4 mb-5 px-1">
                      <span className="text-[9px] font-mono text-[#5a6490]">PITTANKO</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#9bb8ff]/10 text-[#9bb8ff] font-mono">Active</span>
                    </div>

                    {/* Total Amount Display */}
                    <div className="text-center py-3 rounded-xl mb-4" style={{ background: 'rgba(155,184,255,0.03)', border: '1px solid rgba(155,184,255,0.06)' }}>
                      <p className="text-[8px] font-mono uppercase tracking-widest text-[#5a6490]">Total Expenses</p>
                      <p style={{ fontFamily: SERIF }} className="text-2xl font-light text-[#f0f4ff] mt-0.5">¥48,000</p>
                    </div>

                    {/* Members List */}
                    <div className="flex-1 space-y-2.5 overflow-hidden">
                      <p className="text-[8px] font-mono uppercase tracking-widest text-[#5a6490] px-1">Split Details</p>
                      
                      {/* Member 1 */}
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#141b36]/60 border border-[#1f2952]/40">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#9bb8ff]/20 flex items-center justify-center text-[10px] text-[#9bb8ff]">A</div>
                          <span className="text-[11px] text-[#c9d1e6]">A-kun</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono text-[#f0f4ff]">¥16,000</span>
                          <span className="block text-[8px] text-[#5a6490]">33.3%</span>
                        </div>
                      </div>

                      {/* Member 2 */}
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#141b36]/60 border border-[#1f2952]/40">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#c8b6ff]/20 flex items-center justify-center text-[10px] text-[#c8b6ff]">B</div>
                          <span className="text-[11px] text-[#c9d1e6]">B-san</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono text-[#f0f4ff] font-medium" style={{ color: '#9bb8ff' }}>¥20,000</span>
                          <span className="block text-[8px] text-[#9bb8ff]">41.7% (傾斜)</span>
                        </div>
                      </div>

                      {/* Member 3 */}
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#141b36]/60 border border-[#1f2952]/40">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#a7efff]/20 flex items-center justify-center text-[10px] text-[#a7efff]">C</div>
                          <span className="text-[11px] text-[#c9d1e6]">C-kun</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono text-[#f0f4ff]">¥12,000</span>
                          <span className="block text-[8px] text-[#5a6490]">25.0%</span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Chart Graphic (Pure CSS UI) */}
                    <div className="h-10 flex items-center gap-1 mb-4 px-1">
                      <div className="h-2 rounded-full flex-1" style={{ background: '#9bb8ff' }} />
                      <div className="h-2 rounded-full flex-1" style={{ background: '#c8b6ff' }} />
                      <div className="h-2 rounded-full flex-[0.7]" style={{ background: '#a7efff' }} />
                    </div>

                    {/* Bottom Tab Bar Mock */}
                    <div className="border-t pt-3 flex justify-around items-center" style={{ borderColor: 'rgba(155,184,255,0.08)' }}>
                      <span className="text-[9px] text-[#9bb8ff]">● 精算</span>
                      <span className="text-[9px] text-[#4a5480]">履歴</span>
                      <span className="text-[9px] text-[#4a5480]">設定</span>
                    </div>

                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* ── 2. Other Products and PM Skills Grid (Bottom Section) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid: PM / Production Skills */}
        <div 
          className="lg:col-span-6 p-6 md:p-8 rounded-xl" 
          style={{ border: '1px solid rgba(155,184,255,0.08)', background: 'rgba(15,20,38,0.2)' }}
        >
          <div className="mb-6">
            <p className="font-mono text-[8px] tracking-[0.4em] uppercase mb-1.5" style={{ color: '#5a6490' }}>
              Product Management & Design
            </p>
            <h3 style={{ fontFamily: SERIF }} className="text-xl font-light text-[#c9d1e6]">
              企画・設計から実装・運用まで
            </h3>
            <p className="text-xs leading-relaxed mt-2" style={{ color: '#6878a8', lineHeight: 1.8 }}>
              単なるコード実装にとどまらず、PMとしてのプロダクト仕様設計、UI/UX設計（Figma）、開発後のApp Store申請やユーザー検証まで包括的に担当するからこそ、一貫性のあるスマートなプロダクト体験を提供できます。
            </p>
          </div>
          
          <div className="space-y-4">
            {pmSkills.map((s, i) => (
              <div
                key={s.label}
                className="pt-4"
                style={{ borderTop: i > 0 ? '1px solid rgba(155,184,255,0.06)' : undefined }}
              >
                <h4 className="text-xs font-semibold text-[#b0bcd8] uppercase tracking-wide mb-1">{s.label}</h4>
                <p className="text-[11px] leading-relaxed" style={{ color: '#7080a8', lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Grid: Other Apps List */}
        <div className="lg:col-span-6 space-y-4">
          <p className="font-mono text-[8px] tracking-[0.4em] uppercase mb-1 px-1" style={{ color: '#5a6490' }}>
            Other Projects
          </p>

          {rest.length === 0 ? (
            <div className="p-8 text-center rounded-xl" style={{ border: '1px dashed rgba(155,184,255,0.08)', background: 'rgba(15,20,38,0.1)' }}>
              <p className="text-xs font-mono" style={{ color: '#4a5480' }}>他のプロジェクトは現在準備中です</p>
            </div>
          ) : (
            rest.map(app => (
              <div
                key={app.id}
                className="p-6 cursor-pointer group rounded-xl transition-all duration-300 hover:translate-x-1"
                style={{ border: '1px solid rgba(155,184,255,0.08)', background: 'rgba(15,20,38,0.2)' }}
                onClick={() => setSelected(toWorkDetail(app))}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(155,184,255,0.15)'
                  e.currentTarget.style.background = 'rgba(20,28,58,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(155,184,255,0.08)'
                  e.currentTarget.style.background = 'rgba(15,20,38,0.2)'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-[8px] tracking-widest text-[#5a6490]">{app.year}</span>
                    <h3 className="text-base font-medium text-[#c0ccee] mt-0.5 group-hover:text-[#e8eeff] transition-colors duration-300">
                      {app.title}
                    </h3>
                  </div>
                  {app.status && (
                    <span
                      className="font-mono text-[9px] px-2.5 py-0.5 shrink-0"
                      style={{ color: '#6878a8', border: '1px solid rgba(155,184,255,0.10)' }}
                    >
                      {app.status}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: '#8090b8', lineHeight: 1.75 }}>{app.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {app.tools.map(t => (
                      <span
                        key={t}
                        className="font-mono text-[9px] px-1.5 py-0.5"
                        style={{ color: '#7080a8', background: 'rgba(155,184,255,0.04)', border: '1px solid rgba(155,184,255,0.08)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-[#5060a0] group-hover:text-[#9bb8ff] transition-colors duration-300">
                    詳細 →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Work Detail Modal */}
      <WorkModal work={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
