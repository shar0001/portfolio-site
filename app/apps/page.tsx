'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WorkModal, type WorkDetail } from '@/components/ui/WorkModal'
import { defaultWorks, type Work } from '@/content/works'
import { pmSkills } from '@/content/apps'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'
const SANS_POP = 'system-ui, -apple-system, BlinkMacSystemFont, "Hiragino Maru Gothic ProN", "Hiragino Kaku Gothic ProN", "BIZ UDPGothic", Meiryo, sans-serif'

function toWorkDetail(w: Work): WorkDetail {
  return { ...w, type: 'photo', tools: w.tools, insight: w.process }
}

export default function AppsPage() {
  const [selected, setSelected] = useState<WorkDetail | null>(null)
  
  // 3D Card Parallax States for iPhone Mockup
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  // Active slide index for Pitanko Wari-kan showcase (0: Top/Bear, 1: Diagram, 2: RoomDetail, 3: RoomCreate, 4: Input)
  const [activeTab, setActiveTab] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto rotate mockup screen every 4.5 seconds, paused when hovering
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 5)
    }, 4500)
    return () => clearInterval(timer)
  }, [isHovered])

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
    setIsHovered(false)
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
                  style={{ 
                    fontFamily: SANS_POP, 
                    fontWeight: 800, 
                    fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                    color: '#f0f4ff',
                    letterSpacing: '-0.02em',
                    cursor: 'pointer'
                  }}
                  className="mt-2 mb-4 leading-tight tracking-tight hover:text-[#00bda6] transition-colors duration-300"
                  onClick={() => setActiveTab(0)}
                  title="トップ（キャラクター画面）を表示"
                >
                  {featured.title}
                </h2>
                <p className="text-sm md:text-[15px] leading-relaxed" style={{ color: '#a0aed0', lineHeight: 1.85 }}>
                  {featured.description}
                </p>
              </div>

              {/* Highlight Features list (Interactive Slide Selection) */}
              <div className="space-y-4 py-2 border-y" style={{ borderColor: 'rgba(155,184,255,0.08)' }}>
                {/* 1. Diagram */}
                <div 
                  className="flex gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: activeTab === 1 ? 'rgba(155,184,255,0.05)' : 'transparent',
                    border: activeTab === 1 ? '1px solid rgba(0, 189, 166, 0.2)' : '1px solid transparent',
                    opacity: activeTab === 0 ? 0.85 : (activeTab === 1 ? 1 : 0.5)
                  }}
                  onClick={() => setActiveTab(1)}
                >
                  <span className="text-[#00bda6] font-mono text-xs mt-0.5">{activeTab === 1 ? '🟢' : '✨'}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#ffffff] uppercase tracking-wide">「割り勘、もう迷わない。」相関図で可視化</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: activeTab === 1 ? '#b0c0e8' : '#7080a8' }}>
                      誰が誰にいくら払うか、ひと目でわかる相関図。アイコンをドラッグして直感的に配置・確認でき、無駄な送金回数を自動で最小化します。
                    </p>
                  </div>
                </div>

                {/* 2. Input */}
                <div 
                  className="flex gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: activeTab === 4 ? 'rgba(155,184,255,0.05)' : 'transparent',
                    border: activeTab === 4 ? '1px solid rgba(0, 189, 166, 0.2)' : '1px solid transparent',
                    opacity: activeTab === 0 ? 0.85 : (activeTab === 4 ? 1 : 0.5)
                  }}
                  onClick={() => setActiveTab(4)}
                >
                  <span className="text-[#00bda6] font-mono text-xs mt-0.5">{activeTab === 4 ? '🟢' : '👇'}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#ffffff] uppercase tracking-wide">タップでかんたん入力</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: activeTab === 4 ? '#b0c0e8' : '#7080a8' }}>
                      誰の分か、誰が払ったかをタップするだけのスムーズ入力。メンバーを選ぶだけで、複雑な立て替えも割り勘もスムーズに登録完了。
                    </p>
                  </div>
                </div>

                {/* 3. Room Creation */}
                <div 
                  className="flex gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: (activeTab === 2 || activeTab === 3) ? 'rgba(155,184,255,0.05)' : 'transparent',
                    border: (activeTab === 2 || activeTab === 3) ? '1px solid rgba(0, 189, 166, 0.2)' : '1px solid transparent',
                    opacity: activeTab === 0 ? 0.85 : ((activeTab === 2 || activeTab === 3) ? 1 : 0.5)
                  }}
                  onClick={() => setActiveTab(3)}
                >
                  <span className="text-[#00bda6] font-mono text-xs mt-0.5">{(activeTab === 2 || activeTab === 3) ? '🟢' : '🏠'}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#ffffff] uppercase tracking-wide">部屋を作ってすぐスタート</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: (activeTab === 2 || activeTab === 3) ? '#b0c0e8' : '#7080a8' }}>
                      飲み会・旅行・同棲など、シーンに合わせてかんたん作成。招待コードを共有すれば、ダウンロード不要（Web版）でもすぐ集まれます。
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata (Role Only - Removed Technology) */}
              <div className="pt-1">
                <p className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: '#5a6490' }}>Role</p>
                <p className="text-xs text-[#b0bcd8]">{featured.role}</p>
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
                onMouseEnter={() => setIsHovered(true)}
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

                  {/* App Screen Content (Images loaded from local folder) */}
                  <div className="w-full h-full rounded-[30px] overflow-hidden select-none relative cursor-pointer bg-white"
                    onClick={() => setActiveTab((prev) => (prev + 1) % 5)}
                  >
                    <motion.img 
                      key={activeTab}
                      src={`/アプリ画像/%230${activeTab + 1}.png`}
                      alt={`ピタンコ わりかん 画面 ${activeTab + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover object-top"
                    />
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
