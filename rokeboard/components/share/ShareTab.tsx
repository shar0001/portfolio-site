'use client'
import { useState } from 'react'
import type { Project, Location } from '@/lib/types'
import {
  generateLineShareText,
  generateShareEmail,
  generateLocationComparisonText,
  generateInquiryEmail,
  generateHoldRequestEmail,
  generateReminderEmail,
  generateDeclineEmail,
} from '@/lib/templates'
import { copyToClipboard } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

interface ShareTabProps {
  project: Project
  locations: Location[]
}

type Tab = 'line' | 'email' | 'comparison' | 'ai'
type AiType = 'inquiry' | 'hold' | 'reminder' | 'decline'

export function ShareTab({ project, locations }: ShareTabProps) {
  const [activeTab, setActiveTab] = useState<Tab>('line')
  const [aiType, setAiType] = useState<AiType>('inquiry')
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id ?? '')
  const { addToast } = useToast()

  const selectedLocation = locations.find(l => l.id === selectedLocationId)

  const getContent = (): string => {
    if (activeTab === 'line') return generateLineShareText(project, locations)
    if (activeTab === 'email') return generateShareEmail(project, locations)
    if (activeTab === 'comparison') return generateLocationComparisonText(project, locations)
    if (activeTab === 'ai' && selectedLocation) {
      if (aiType === 'inquiry') return generateInquiryEmail(project, selectedLocation)
      if (aiType === 'hold') return generateHoldRequestEmail(project, selectedLocation)
      if (aiType === 'reminder') return generateReminderEmail(project, selectedLocation)
      if (aiType === 'decline') return generateDeclineEmail(project, selectedLocation)
    }
    return ''
  }

  const handleCopy = () => {
    copyToClipboard(getContent())
      .then(() => addToast('コピーしました'))
      .catch(() => addToast('コピーに失敗しました', 'error'))
  }

  const content = getContent()

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'line', label: 'LINE共有', icon: '💬' },
    { id: 'email', label: 'メール共有', icon: '📧' },
    { id: 'comparison', label: 'ロケ地比較', icon: '📊' },
    { id: 'ai', label: 'AI文面', icon: '✨' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Sub tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`h-9 px-3.5 text-[13px] font-medium rounded-[10px] border transition-colors ${
              activeTab === t.id
                ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                : 'bg-white text-[#3C3C43] border-[#E5E5EA] hover:bg-[#F2F2F7]'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* AI文面 options */}
      {activeTab === 'ai' && (
        <div className="space-y-3 p-4 bg-[#007AFF]/[0.06] rounded-[14px] border border-[#007AFF]/15">
          <p className="text-[12px] font-semibold text-[#0066CC]">ロケ地を選択</p>
          {locations.length === 0 ? (
            <p className="text-[13px] text-[#8E8E93]">ロケ地が登録されていません</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {locations.map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLocationId(l.id)}
                  className={`text-[13px] font-medium px-3 py-1.5 rounded-[9px] border transition-colors ${
                    selectedLocationId === l.id
                      ? 'bg-[#007AFF] text-white border-[#007AFF]'
                      : 'bg-white text-[#3C3C43] border-[#E5E5EA] hover:bg-[#F2F2F7]'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
          <p className="text-[12px] font-semibold text-[#0066CC] mt-3">文面の種類</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'inquiry' as const, label: '問い合わせメール' },
              { id: 'hold' as const, label: '仮キープ依頼' },
              { id: 'reminder' as const, label: 'リマインドメール' },
              { id: 'decline' as const, label: 'お断りメール' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setAiType(opt.id)}
                className={`h-9 text-[13px] font-medium rounded-[9px] border transition-colors ${
                  aiType === opt.id
                    ? 'bg-[#007AFF] text-white border-[#007AFF]'
                    : 'bg-white text-[#3C3C43] border-[#E5E5EA] hover:bg-[#F2F2F7]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#0066CC]/80">
            ✨ 現在はテンプレート生成です。OpenAI/Claude APIに差し替え可能な構造になっています。
          </p>
        </div>
      )}

      {/* Content area */}
      <div className="relative">
        <div className="bg-[#F2F2F7] border border-[#E5E5EA] rounded-[14px] p-4 text-[13px] text-[#1D1D1F] font-mono leading-relaxed whitespace-pre-wrap min-h-48 max-h-96 overflow-y-auto">
          {content || <span className="text-[#B0B0B5]">内容がありません</span>}
        </div>
        <button
          onClick={handleCopy}
          disabled={!content}
          className="absolute top-3 right-3 flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium bg-white text-[#007AFF] border border-[#E5E5EA] rounded-[9px] hover:bg-[#F2F2F7] transition-colors disabled:opacity-40 shadow-sm"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
          </svg>
          コピー
        </button>
      </div>

      {/* Large copy button for mobile */}
      <button
        onClick={handleCopy}
        disabled={!content}
        className="w-full h-12 flex items-center justify-center gap-2 bg-[#007AFF] text-white text-[15px] font-semibold rounded-[12px] hover:bg-[#0062CC] active:bg-[#0051D4] transition-colors disabled:opacity-40"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
        クリップボードにコピー
      </button>

      {activeTab === 'line' && (
        <p className="text-[12px] text-[#8E8E93] text-center">
          コピー後、LINEやSlackにそのまま貼り付けて使えます
        </p>
      )}
    </div>
  )
}
