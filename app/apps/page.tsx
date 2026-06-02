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

  // Active slide index for Pitanko Wari-kan showcase (0: Top/Bear, 1: Diagram, 2: Input, 3: Room)
  const [activeTab, setActiveTab] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto rotate mockup screen every 4.5 seconds, paused when hovering
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4)
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
                    background: activeTab === 2 ? 'rgba(155,184,255,0.05)' : 'transparent',
                    border: activeTab === 2 ? '1px solid rgba(0, 189, 166, 0.2)' : '1px solid transparent',
                    opacity: activeTab === 0 ? 0.85 : (activeTab === 2 ? 1 : 0.5)
                  }}
                  onClick={() => setActiveTab(2)}
                >
                  <span className="text-[#00bda6] font-mono text-xs mt-0.5">{activeTab === 2 ? '🟢' : '👇'}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#ffffff] uppercase tracking-wide">タップでかんたん入力</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: activeTab === 2 ? '#b0c0e8' : '#7080a8' }}>
                      誰の分か、誰が払ったかをタップするだけのスムーズ入力。メンバーを選ぶだけで、複雑な立て替えも割り勘もスムーズに登録完了。
                    </p>
                  </div>
                </div>

                {/* 3. Room Creation */}
                <div 
                  className="flex gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: activeTab === 3 ? 'rgba(155,184,255,0.05)' : 'transparent',
                    border: activeTab === 3 ? '1px solid rgba(0, 189, 166, 0.2)' : '1px solid transparent',
                    opacity: activeTab === 0 ? 0.85 : (activeTab === 3 ? 1 : 0.5)
                  }}
                  onClick={() => setActiveTab(3)}
                >
                  <span className="text-[#00bda6] font-mono text-xs mt-0.5">{activeTab === 3 ? '🟢' : '🏠'}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#ffffff] uppercase tracking-wide">部屋を作ってすぐスタート</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: activeTab === 3 ? '#b0c0e8' : '#7080a8' }}>
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

                  {/* Reflection Screen Overlay */}
                  <div className="absolute inset-0 rounded-[34px] overflow-hidden pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(115deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)'
                    }}
                  />

                  {/* App Screen Content (Mocked via pure CSS/HTML) */}
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full rounded-[30px] overflow-hidden flex flex-col justify-between select-none relative cursor-pointer"
                    onClick={() => setActiveTab((prev) => (prev + 1) % 4)}
                    style={{
                      background: activeTab === 0 
                        ? 'linear-gradient(to bottom, #d2f7f1 0%, #ffffff 100%)' 
                        : '#f4fcf9', // Light pastel mint background to match official app branding
                      padding: '16px 12px 10px 12px',
                    }}
                  >
                    {/* ──── Slide 0: Top (Bear Character Welcome) ──── */}
                    {activeTab === 0 && (
                      <div className="w-full h-full flex flex-col justify-between animate-fadeIn">
                        {/* Upper space under dynamic island */}
                        <div className="h-4" />
                        
                        {/* Logo */}
                        <div className="text-center">
                          <div className="flex justify-center items-center gap-0.5">
                            <span className="text-[15px] font-black" style={{ color: '#ff9d00' }}>ピ</span>
                            <span className="text-[15px] font-black" style={{ color: '#ff4d6a' }}>タ</span>
                            <span className="text-[15px] font-black" style={{ color: '#00bda6' }}>ン</span>
                            <span className="text-[15px] font-black" style={{ color: '#1a80ff' }}>コ</span>
                          </div>
                          <p className="text-[9px] font-medium text-[#8ea19c] mt-0.5 tracking-wider">わりかん</p>
                        </div>

                        {/* Title Copy */}
                        <div className="text-center space-y-1 my-2">
                          <p className="text-[10px] font-extrabold text-[#333] leading-snug">
                            グループの割り勘を、<br />かんたん・正確に。
                          </p>
                          <p className="text-[7.5px] text-[#6d7c78] font-medium leading-relaxed">
                            誰が誰にいくら？<br />がひと目でわかる
                          </p>
                        </div>

                        {/* White Bear & Gold Coin Illustrator (CSS / SVG) */}
                        <div className="relative flex-grow flex flex-col items-center justify-center -mt-2">
                          {/* Sparkles */}
                          <div className="absolute top-2 left-6 text-[8px] animate-pulse">✨</div>
                          <div className="absolute top-10 right-8 text-[8px] animate-pulse">✨</div>
                          <div className="absolute bottom-8 left-10 text-[6px] opacity-40">🫧</div>
                          <div className="absolute bottom-4 right-12 text-[6px] opacity-40">🫧</div>
                          
                          <svg width="110" height="95" viewBox="0 0 120 110" className="drop-shadow-sm scale-95">
                            {/* Ears */}
                            <circle cx="42" cy="40" r="11" fill="white" />
                            <circle cx="42" cy="40" r="7" fill="#ffccd5" />
                            <circle cx="78" cy="40" r="11" fill="white" />
                            <circle cx="78" cy="40" r="7" fill="#ffccd5" />
                            
                            {/* Body / Arms */}
                            <ellipse cx="60" cy="75" rx="24" ry="20" fill="white" />
                            <circle cx="46" cy="74" r="8" fill="white" />
                            <circle cx="74" cy="74" r="8" fill="white" />
                            
                            {/* Head */}
                            <circle cx="60" cy="52" r="21" fill="white" />
                            
                            {/* Eyes */}
                            <circle cx="52" cy="49" r="2" fill="#333" />
                            <circle cx="68" cy="49" r="2" fill="#333" />
                            
                            {/* Cheeks */}
                            <circle cx="47" cy="55" r="3.5" fill="#ff9da7" opacity="0.7" />
                            <circle cx="73" cy="55" r="3.5" fill="#ff9da7" opacity="0.7" />
                            
                            {/* Snout & Nose */}
                            <ellipse cx="60" cy="54" rx="5" ry="3.5" fill="#f1f5f9" />
                            <polygon points="58,52 62,52 60,54" fill="#333" />
                            <path d="M 58 55 Q 60 57 62 55" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" />
                            
                            {/* Gold Coin */}
                            <circle cx="60" cy="78" r="14" fill="#ffb703" stroke="#fb8500" strokeWidth="1.5" />
                            <circle cx="60" cy="78" r="11" fill="#ffb703" stroke="#f1a900" strokeWidth="1" />
                            <text x="60" y="83" fill="white" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">¥</text>
                          </svg>
                          
                          <div className="text-[12px] font-black text-white tracking-[0.25em] mt-1" style={{ textShadow: '0 1.5px 3px rgba(0,189,166,0.3)' }}>
                            PITANKO
                          </div>
                        </div>

                        {/* Bottom Tab Bar Mock */}
                        <div className="border-t pt-2 pb-0.5 flex justify-around items-center bg-white rounded-b-[16px]" style={{ borderColor: '#eaf2ee', margin: '0 -12px -10px -12px', padding: '8px 12px 6px 12px' }}>
                          <div className="flex flex-col items-center gap-0.5 text-[#00bda6] relative scale-90">
                            <span className="text-[9px]">🏠</span>
                            <span className="text-[6.5px] font-bold">ホーム</span>
                            <div className="absolute -bottom-1 w-0.5 h-0.5 rounded-full bg-[#00bda6]" />
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">🖊️</span>
                            <span className="text-[6.5px] font-medium text-[#777]">わりかん</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">💵</span>
                            <span className="text-[6.5px] font-medium text-[#777]">精算結果</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">⚙️</span>
                            <span className="text-[6.5px] font-medium text-[#777]">設定</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ──── Slide 1: Diagram (相関図) ──── */}
                    {activeTab === 1 && (
                      <div className="w-full h-full flex flex-col justify-between animate-fadeIn">
                        {/* Header */}
                        <div className="flex justify-between items-center mt-4 px-1">
                          <span className="text-[8px] text-[#8ea19c] font-medium flex items-center gap-0.5">
                            <span className="inline-block" style={{ transform: 'rotate(90deg) scaleY(1.4)' }}>▾</span> 戻る
                          </span>
                          <div className="text-center">
                            <span className="text-[10px] font-bold text-[#00bda6]">ピタンコ</span>
                            <span className="text-[9px] text-[#8ea19c] ml-0.5">わりかん</span>
                          </div>
                          <span className="w-6" /> {/* Spacer */}
                        </div>

                        {/* Tab Selection */}
                        <div className="flex justify-between items-center mt-2 px-1 gap-2">
                          <div className="flex bg-[#edf3f0] p-0.5 rounded-lg flex-1">
                            <div className="bg-white rounded-md text-[8px] font-bold text-[#333] py-1 px-3 text-center flex-1 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                              相関図
                            </div>
                            <div className="text-[8px] text-[#8ea19c] py-1 px-3 text-center flex-1">
                              リスト
                            </div>
                          </div>
                          <div className="border border-[#00bda6] bg-white text-[#00bda6] rounded-md text-[7px] font-bold py-1 px-2 flex items-center gap-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] shrink-0">
                            <span>📤</span> 結果をコピー
                          </div>
                        </div>

                        {/* Split Diagram Card (Interactive Visual) */}
                        <div className="relative bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-[#eaf2ee] flex-1 my-3 flex flex-col justify-between p-2.5 overflow-hidden">
                          
                          {/* Interactive Diagram Space */}
                          <div className="relative flex-1 w-full min-h-[190px]">
                            
                            {/* SVG Connection Arrows */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 216 190">
                              <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
                                  <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#cbd5e1" />
                                </marker>
                              </defs>
                              
                              {/* タナ -> ホン */}
                              <line x1="48" y1="36" x2="88" y2="120" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="3 2" />
                              {/* サト -> ホン */}
                              <line x1="168" y1="46" x2="112" y2="120" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="3 2" />
                              {/* ホン -> スズ */}
                              <line x1="108" y1="135" x2="152" y2="160" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="3 2" />
                            </svg>

                            {/* Avatars */}
                            {/* タナ */}
                            <div className="absolute flex flex-col items-center" style={{ left: '30px', top: '15px' }}>
                              <div className="w-7 h-7 rounded-full bg-[#ffe3e6] flex items-center justify-center text-[9px] font-bold text-[#ff4d6a] shadow-[0_2px_4px_rgba(255,77,106,0.12)]">
                                タナ
                              </div>
                              <span className="text-[7px] text-[#6d7c78] mt-0.5 font-medium scale-90 origin-top">タナカ</span>
                            </div>

                            {/* サト */}
                            <div className="absolute flex flex-col items-center" style={{ right: '30px', top: '25px' }}>
                              <div className="w-7 h-7 rounded-full bg-[#e3f0ff] flex items-center justify-center text-[9px] font-bold text-[#1a80ff] shadow-[0_2px_4px_rgba(26,128,255,0.12)]">
                                サト
                              </div>
                              <span className="text-[7px] text-[#6d7c78] mt-0.5 font-medium scale-90 origin-top">サトウ</span>
                            </div>

                            {/* ホン */}
                            <div className="absolute flex flex-col items-center" style={{ left: '88px', top: '115px' }}>
                              <div className="w-7 h-7 rounded-full bg-[#e3ffe8] flex items-center justify-center text-[9px] font-bold text-[#00b33c] shadow-[0_2px_4px_rgba(0,179,60,0.12)]">
                                ホン
                              </div>
                              <span className="text-[7px] text-[#6d7c78] mt-0.5 font-medium scale-90 origin-top">ホンダ</span>
                            </div>

                            {/* スズ */}
                            <div className="absolute flex flex-col items-center" style={{ right: '30px', top: '145px' }}>
                              <div className="w-7 h-7 rounded-full bg-[#fff7e3] flex items-center justify-center text-[9px] font-bold text-[#ffaa00] shadow-[0_2px_4px_rgba(255,170,0,0.12)]">
                                スズ
                              </div>
                              <span className="text-[7px] text-[#6d7c78] mt-0.5 font-medium scale-90 origin-top">スズキ</span>
                            </div>

                            {/* Amount Labels */}
                            <div className="absolute bg-white px-1 py-0.5 rounded-full text-[6px] font-bold text-[#333] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#e2e8f0] scale-90" style={{ left: '38px', top: '70px' }}>
                              ¥10,000
                            </div>
                            <div className="absolute bg-white px-1 py-0.5 rounded-full text-[6px] font-bold text-[#333] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#e2e8f0] scale-90" style={{ right: '52px', top: '80px' }}>
                              ¥10,000
                            </div>
                            <div className="absolute bg-white px-1 py-0.5 rounded-full text-[6px] font-bold text-[#333] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#e2e8f0] scale-90" style={{ left: '108px', top: '135px' }}>
                              ¥10,000
                            </div>

                          </div>

                          {/* Helper texts */}
                          <div className="text-center space-y-0.5 mt-1 border-t border-[#f4fcf9] pt-2">
                            <p className="text-[6.5px] text-[#90a29d] flex items-center justify-center gap-0.5">
                              <span className="inline-block border rounded-full w-2.5 h-2.5 leading-[9px] text-[6px]">?</span> アイコンをドラッグして自由に配置できます
                            </p>
                            <p className="text-[6.5px] text-[#00bda6] font-bold">
                              矢印をタップして完了！
                            </p>
                          </div>

                        </div>

                        {/* Bottom Tab Bar Mock */}
                        <div className="border-t pt-2 pb-0.5 flex justify-around items-center bg-white rounded-b-[16px]" style={{ borderColor: '#eaf2ee', margin: '0 -12px -10px -12px', padding: '8px 12px 6px 12px' }}>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">🏠</span>
                            <span className="text-[6.5px] font-medium text-[#777]">ホーム</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">🖊️</span>
                            <span className="text-[6.5px] font-medium text-[#777]">わりかん</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 text-[#00bda6] relative scale-90">
                            <span className="text-[9px]">💵</span>
                            <span className="text-[6.5px] font-bold">精算結果</span>
                            <div className="absolute -bottom-1 w-0.5 h-0.5 rounded-full bg-[#00bda6]" />
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">⚙️</span>
                            <span className="text-[6.5px] font-medium text-[#777]">設定</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ──── Slide 2: Input (タップでかんたん選択) ──── */}
                    {activeTab === 2 && (
                      <div className="w-full h-full flex flex-col justify-between animate-fadeIn">
                        {/* Header */}
                        <div className="flex justify-between items-center mt-4 px-1">
                          <span className="text-[8px] text-[#8ea19c] font-medium flex items-center gap-0.5">
                            <span className="inline-block" style={{ transform: 'rotate(90deg) scaleY(1.4)' }}>▾</span> 戻る
                          </span>
                          <span className="text-[9px] font-bold text-[#333]">飲み会</span>
                          <span className="w-6" />
                        </div>

                        {/* Content Area */}
                        <div className="relative bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-[#eaf2ee] flex-1 my-3 flex flex-col p-2.5 space-y-2 overflow-hidden justify-start">
                          
                          {/* 1. Price Input Block */}
                          <div className="flex items-center gap-2 border-b border-[#f1f6f4] pb-2">
                            <div className="w-4 h-4 rounded-full bg-[#00bda6] flex items-center justify-center text-[7px] text-white">✓</div>
                            <div className="flex-1">
                              <span className="text-[6.5px] text-[#90a29d] block">いくら払った？</span>
                              <span className="text-[14px] font-black text-[#333] leading-none">¥40,000</span>
                            </div>
                          </div>

                          {/* 2. Target Select Block */}
                          <div className="flex items-start gap-2 border-b border-[#f1f6f4] pb-2">
                            <div className="w-4 h-4 rounded-full bg-[#00bda6] flex items-center justify-center text-[7px] text-white mt-1">✓</div>
                            <div className="flex-1 space-y-1">
                              <span className="text-[6.5px] text-[#90a29d] block">誰の分？ (4人)</span>
                              <div className="flex flex-wrap gap-1">
                                <span className="text-[7.5px] bg-[#edf2f0] text-[#788a85] px-1.5 py-0.5 rounded-full scale-90 origin-left">タナカ</span>
                                <span className="text-[7.5px] bg-[#1a80ff] text-white px-1.5 py-0.5 rounded-full font-bold scale-90 origin-left">サトウ</span>
                                <span className="text-[7.5px] bg-[#ffaa00] text-white px-1.5 py-0.5 rounded-full font-bold scale-90 origin-left">スズキ</span>
                                <span className="text-[7.5px] bg-[#00b33c] text-white px-1.5 py-0.5 rounded-full font-bold scale-90 origin-left">ホンダ</span>
                                <span className="text-[7.5px] border border-dashed border-[#cbd5e1] text-[#94a3b8] px-1.5 py-0.5 rounded-full scale-90 origin-left">+ 追加</span>
                              </div>
                              <span className="text-[5.5px] text-[#90a29d] block leading-none">※複数選択できます（グレーは支払者）</span>
                            </div>
                          </div>

                          {/* 3. Payer Select Block */}
                          <div className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#00bda6] flex items-center justify-center text-[7px] text-white mt-1 font-bold">3</div>
                            <div className="flex-1 space-y-1">
                              <span className="text-[6.5px] text-[#90a29d] block">誰が払った？</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="bg-[#ff4d6a] text-white text-[7.5px] text-center py-1 rounded-md font-bold shadow-sm shadow-[#ff4d6a]/20">タナカ</div>
                                <div className="bg-[#edf2f0] text-[#788a85] text-[7.5px] text-center py-1 rounded-md">サトウ</div>
                                <div className="bg-[#edf2f0] text-[#788a85] text-[7.5px] text-center py-1 rounded-md">スズキ</div>
                                <div className="bg-[#edf2f0] text-[#788a85] text-[7.5px] text-center py-1 rounded-md">ホンダ</div>
                              </div>
                              <span className="text-[5.5px] text-[#90a29d] block leading-none">※1人だけ選択してください</span>
                            </div>
                          </div>

                        </div>

                        {/* Bottom Tab Bar Mock */}
                        <div className="border-t pt-2 pb-0.5 flex justify-around items-center bg-white rounded-b-[16px]" style={{ borderColor: '#eaf2ee', margin: '0 -12px -10px -12px', padding: '8px 12px 6px 12px' }}>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">🏠</span>
                            <span className="text-[6.5px] font-medium text-[#777]">ホーム</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 text-[#00bda6] relative scale-90">
                            <span className="text-[9px]">🖊️</span>
                            <span className="text-[6.5px] font-bold">わりかん</span>
                            <div className="absolute -bottom-1 w-0.5 h-0.5 rounded-full bg-[#00bda6]" />
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">💵</span>
                            <span className="text-[6.5px] font-medium text-[#777]">精算結果</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">⚙️</span>
                            <span className="text-[6.5px] font-medium text-[#777]">設定</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ──── Slide 3: Room Creation (部屋を作ってすぐスタート) ──── */}
                    {activeTab === 3 && (
                      <div className="w-full h-full flex flex-col justify-between animate-fadeIn">
                        {/* Header */}
                        <div className="flex justify-center items-center mt-4">
                          <span className="text-[9px] font-bold text-[#00bda6]">ピタンコ</span>
                          <span className="text-[8px] text-[#8ea19c] ml-0.5">わりかん</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-1.5 mt-2">
                          <div className="bg-[#00bda6] text-white text-[7.5px] font-bold text-center py-1.5 rounded-lg shadow-sm">＋ 新しい部屋を作る</div>
                          <div className="bg-white border border-[#cbd5e1] text-[#64748b] text-[7.5px] font-bold text-center py-1.5 rounded-lg">コード / リンクで参加</div>
                        </div>

                        {/* Room list and Mini Card */}
                        <div className="relative flex-grow my-2.5 flex flex-col space-y-2 overflow-hidden justify-start">
                          <span className="text-[6.5px] text-[#90a29d] font-bold block">参加中の部屋一覧</span>
                          
                          {/* Active Room Card */}
                          <div className="bg-white border border-[#eaf2ee] rounded-xl p-2 shadow-sm space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-bold text-[#333]">🍻 飲み会</span>
                              <span className="bg-[#00bda6]/10 text-[#00bda6] text-[5.5px] px-1 rounded font-bold scale-90">進行中</span>
                            </div>
                            <div className="flex justify-between items-center text-[5.5px] text-[#8ea19c]">
                              <span>記録 1件</span>
                              <span>4人 · 5/26</span>
                            </div>
                            
                            {/* Invite Code Block */}
                            <div className="bg-[#f4fcf9] p-1 rounded flex justify-between items-center border border-[#e2ebd9]">
                              <span className="text-[6px] text-[#555] font-semibold">招待コード : <strong className="text-[#00bda6]">DK7SPJ</strong></span>
                              <span className="text-[5px] text-[#00bda6] border border-[#00bda6] px-1 rounded bg-white">コピー</span>
                            </div>
                            
                            <div className="border border-[#00bda6]/20 text-[#00bda6] text-[6.5px] font-bold text-center py-0.5 rounded-md bg-[#00bda6]/5">
                              👤 招待する
                            </div>
                            
                            <div className="flex justify-between items-center text-[6px] border-t border-[#f8fcfb] pt-1 mt-1 font-semibold">
                              <span className="text-[#8ea19c]">合計 ¥40,000</span>
                              <span className="text-[#333]">1人あたり ¥10,000</span>
                            </div>
                          </div>

                          {/* Bear Wink Character banner */}
                          <div className="bg-[#e9fbf6] rounded-xl p-1.5 flex items-center gap-1.5 border border-[#d2f7ed]">
                            <svg width="22" height="22" viewBox="0 0 100 100" className="shrink-0">
                              <circle cx="50" cy="50" r="48" fill="white" />
                              <circle cx="34" cy="45" r="5" fill="#333" />
                              {/* Wink eye */}
                              <path d="M 60 48 Q 66 42 70 48" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
                              <circle cx="28" cy="55" r="8" fill="#ff9da7" opacity="0.6" />
                              <circle cx="72" cy="55" r="8" fill="#ff9da7" opacity="0.6" />
                              <circle cx="50" cy="50" r="10" fill="#00bda6" />
                              {/* Small Tie */}
                              <path d="M 44 80 L 56 80 L 50 90 z" fill="#00bda6" />
                            </svg>
                            <p className="text-[5.5px] text-[#4ea08d] font-bold leading-tight">
                              あとからメンバーや<br />内容の編集もらくらく♪
                            </p>
                          </div>
                        </div>

                        {/* Bottom Tab Bar Mock */}
                        <div className="border-t pt-2 pb-0.5 flex justify-around items-center bg-white rounded-b-[16px]" style={{ borderColor: '#eaf2ee', margin: '0 -12px -10px -12px', padding: '8px 12px 6px 12px' }}>
                          <div className="flex flex-col items-center gap-0.5 text-[#00bda6] relative scale-90">
                            <span className="text-[9px]">🏠</span>
                            <span className="text-[6.5px] font-bold">ホーム</span>
                            <div className="absolute -bottom-1 w-0.5 h-0.5 rounded-full bg-[#00bda6]" />
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">🖊️</span>
                            <span className="text-[6.5px] font-medium text-[#777]">わりかん</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">💵</span>
                            <span className="text-[6.5px] font-medium text-[#777]">精算結果</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 opacity-35 scale-90">
                            <span className="text-[9px]">⚙️</span>
                            <span className="text-[6.5px] font-medium text-[#777]">設定</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
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
