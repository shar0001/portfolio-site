'use client'
import { useState } from 'react'
import type { Location, LocationStatus, Project } from '@/lib/types'
import { LOCATION_STATUS_LABELS, FACILITY_LABELS, RAIN_SUPPORT_LABELS, SOUND_ALLOWED_LABELS } from '@/lib/types'
import { LocationStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { copyToClipboard } from '@/lib/utils'
import { generateInquiryEmail, generateHoldRequestEmail, generateLineShareText } from '@/lib/templates'

interface LocationRightPanelProps {
  location: Location
  project: Project
  allLocations: Location[]
  onClose: () => void
  onEdit: () => void
  onStatusChange: (status: LocationStatus) => void
  isBottomSheet?: boolean
}

const allStatuses: LocationStatus[] = ['none', 'inquired', 'waiting', 'hold', 'confirmed', 'ng', 'pending']

const label: Record<DateAvailability, string> = {
  available: '○', checking: '△', unavailable: '×', unknown: 'ー',
}
const daStyle: Record<DateAvailability, string> = {
  available: 'bg-[#EDFFF3] text-[#1A8C3B] font-bold',
  checking: 'bg-[#FFF7EB] text-[#9A5700] font-bold',
  unavailable: 'bg-[#FFF0EE] text-[#C0392B] font-bold',
  unknown: 'bg-[#F2F2F7] text-[#8E8E93]',
}

type DateAvailability = 'available' | 'checking' | 'unavailable' | 'unknown'
type ShareTemplate = 'inquiry' | 'hold' | 'line'

export function LocationRightPanel({
  location, project, allLocations, onClose, onEdit, onStatusChange, isBottomSheet,
}: LocationRightPanelProps) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'info' | 'share'>('info')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const photos = location.photos ?? []

  const handleCopy = async (key: string, text: string) => {
    await copyToClipboard(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const sortedDates = [...project.candidateDates].sort((a, b) => a.date.localeCompare(b.date))

  const facilityItems = [
    { label: '駐車場', value: FACILITY_LABELS[location.parking] },
    { label: '控室', value: FACILITY_LABELS[location.waitingRoom] },
    { label: '電源', value: FACILITY_LABELS[location.power] },
    { label: 'トイレ', value: FACILITY_LABELS[location.toilet] },
    { label: 'メイク', value: FACILITY_LABELS[location.makeupRoom] },
    { label: '雨天', value: RAIN_SUPPORT_LABELS[location.rainSupport] },
    { label: '音出し', value: SOUND_ALLOWED_LABELS[location.soundAllowed] },
    { label: '火気', value: FACILITY_LABELS[location.fireAllowed] },
  ]

  const shareTemplates: { key: ShareTemplate; label: string; gen: () => string }[] = [
    { key: 'inquiry', label: '問い合わせメール', gen: () => generateInquiryEmail(project, location) },
    { key: 'hold', label: '仮キープ依頼メール', gen: () => generateHoldRequestEmail(project, location) },
    { key: 'line', label: 'LINE共有文', gen: () => generateLineShareText(project, allLocations) },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-4 py-3.5 border-b border-[#E5E5EA] bg-white shrink-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] leading-snug truncate">{location.name}</h2>
            {location.address && (
              <p className="text-[12px] text-[#8E8E93] mt-0.5 truncate">{location.address}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <button
              onClick={onEdit}
              className="h-7 px-3 text-[12px] font-medium text-[#007AFF] bg-[#EBF5FF] rounded-lg hover:bg-[#D4EAFF] transition-colors"
            >
              編集
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F2F2F7] rounded-full transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status chips */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar mt-2.5">
          {allStatuses.map(s => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`text-[11px] px-2.5 py-0.5 rounded-full border whitespace-nowrap transition-colors shrink-0 ${
                location.status === s
                  ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                  : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:bg-[#F2F2F7]'
              }`}
            >
              {LOCATION_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Photo strip */}
      {photos.length > 0 && (
        <div className="relative bg-[#1D1D1F] shrink-0" style={{ aspectRatio: '16/7' }}>
          <img
            src={photos[photoIndex]?.url}
            alt={photos[photoIndex]?.label}
            className="w-full h-full object-cover opacity-90"
          />
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIndex(i => Math.max(0, i - 1))}
                disabled={photoIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-base disabled:opacity-20"
              >‹</button>
              <button
                onClick={() => setPhotoIndex(i => Math.min(photos.length - 1, i + 1))}
                disabled={photoIndex === photos.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-base disabled:opacity-20"
              >›</button>
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {photoIndex + 1}/{photos.length}
              </div>
            </>
          )}
          <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {photos[photoIndex]?.label}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#E5E5EA] bg-white shrink-0">
        {(['info', 'share'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-[#007AFF] border-[#007AFF]'
                : 'text-[#8E8E93] border-transparent hover:text-[#3C3C43]'
            }`}
          >
            {tab === 'info' ? '詳細情報' : '共有・文面'}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain bg-[#F2F2F7]">
        {activeTab === 'info' ? (
          <div className="space-y-3 p-3">
            {/* Quick actions */}
            {(location.phone || location.mapUrl || location.email) && (
              <div className="flex gap-2">
                {location.phone && (
                  <a href={`tel:${location.phone}`}
                    className="flex-1 h-10 flex flex-col items-center justify-center bg-white rounded-xl border border-[#E5E5EA] text-[#007AFF] hover:bg-[#EBF5FF] transition-colors gap-0.5">
                    <PhoneIcon />
                    <span className="text-[10px] font-medium">電話</span>
                  </a>
                )}
                {location.mapUrl && (
                  <a href={location.mapUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 h-10 flex flex-col items-center justify-center bg-white rounded-xl border border-[#E5E5EA] text-[#34C759] hover:bg-[#EDFFF3] transition-colors gap-0.5">
                    <MapIcon />
                    <span className="text-[10px] font-medium">地図</span>
                  </a>
                )}
                {location.email && (
                  <a href={`mailto:${location.email}`}
                    className="flex-1 h-10 flex flex-col items-center justify-center bg-white rounded-xl border border-[#E5E5EA] text-[#8E8E93] hover:bg-[#F2F2F7] transition-colors gap-0.5">
                    <MailIcon />
                    <span className="text-[10px] font-medium">メール</span>
                  </a>
                )}
              </div>
            )}

            {/* Key info */}
            <div className="bg-white rounded-xl border border-[#E5E5EA] divide-y divide-[#F2F2F7]">
              {[
                { label: '料金', value: location.price },
                { label: '利用時間', value: location.availableTime },
                { label: '延長料金', value: location.extensionFee },
                { label: '担当者', value: location.contactName },
                { label: '電話', value: location.phone },
                { label: 'メール', value: location.email },
                { label: 'キャンセル規定', value: location.cancellationPolicy },
                { label: '支払い条件', value: location.paymentTerms },
                { label: '最終連絡', value: location.lastContactDate ? formatDate(location.lastContactDate) : '' },
                { label: '次回確認', value: location.nextFollowUpDate ? formatDate(location.nextFollowUpDate) : '' },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex items-baseline gap-3 px-3 py-2">
                  <span className="text-[11px] text-[#8E8E93] shrink-0 min-w-[60px]">{row.label}</span>
                  <span className="text-[13px] text-[#1D1D1F] font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Candidate date availability */}
            {sortedDates.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
                <div className="px-3 py-2 border-b border-[#F2F2F7]">
                  <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">候補日可否</p>
                </div>
                <div className="flex divide-x divide-[#F2F2F7]">
                  {sortedDates.map(d => {
                    const dt = new Date(d.date)
                    const dow = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()]
                    const avail = (location.dateAvailability[d.id] ?? 'unknown') as DateAvailability
                    return (
                      <div key={d.id} className="flex-1 flex flex-col items-center py-2.5 gap-1">
                        <span className="text-[11px] text-[#8E8E93]">{dt.getMonth() + 1}/{dt.getDate()}</span>
                        <span className={`text-[10px] ${dt.getDay() === 0 || dt.getDay() === 6 ? 'text-[#FF3B30]' : 'text-[#8E8E93]'}`}>({dow})</span>
                        <span className={`w-8 h-8 rounded-lg text-[14px] flex items-center justify-center ${daStyle[avail]}`}>
                          {label[avail]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Facilities */}
            <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
              <div className="px-3 py-2 border-b border-[#F2F2F7]">
                <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">設備・条件</p>
              </div>
              <div className="grid grid-cols-2 divide-y divide-[#F2F2F7]">
                {facilityItems.map(({ label: lb, value }) => (
                  <div key={lb} className="flex items-center gap-2 px-3 py-2 even:border-l even:border-[#F2F2F7]">
                    <FacilityDot value={value} />
                    <span className="text-[12px] text-[#3C3C43]">{lb}</span>
                    <span className="text-[11px] text-[#8E8E93] ml-auto">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            {(location.ngRules || location.loadingRules || location.vehicleLimit || location.peopleLimit || location.usableArea || location.permissionStatus) && (
              <div className="bg-white rounded-xl border border-[#E5E5EA] divide-y divide-[#F2F2F7]">
                <div className="px-3 py-2">
                  <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">撮影条件</p>
                </div>
                {[
                  { label: '撮影許可', value: location.permissionStatus },
                  { label: '使用エリア', value: location.usableArea },
                  { label: '車両', value: location.vehicleLimit },
                  { label: '人数', value: location.peopleLimit },
                  { label: 'NG事項', value: location.ngRules },
                  { label: '搬入条件', value: location.loadingRules },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex gap-3 px-3 py-2">
                    <span className="text-[11px] text-[#8E8E93] shrink-0 min-w-[60px] pt-0.5">{row.label}</span>
                    <span className="text-[12px] text-[#1D1D1F]">{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Memo */}
            {location.memo && (
              <div className="bg-white rounded-xl border border-[#E5E5EA] p-3">
                <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1.5">メモ</p>
                <p className="text-[13px] text-[#1D1D1F] leading-relaxed whitespace-pre-line">{location.memo}</p>
              </div>
            )}

            {/* Contact history */}
            {location.contactHistory.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
                <div className="px-3 py-2 border-b border-[#F2F2F7]">
                  <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">連絡履歴</p>
                </div>
                <div className="divide-y divide-[#F2F2F7]">
                  {[...location.contactHistory].reverse().map(ch => (
                    <div key={ch.id} className="px-3 py-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] text-[#8E8E93]">{formatDate(ch.date)}</span>
                        <span className="text-[11px] bg-[#F2F2F7] text-[#6E6E73] px-1.5 py-0.5 rounded">{ch.method}</span>
                      </div>
                      <p className="text-[12px] text-[#3C3C43] leading-relaxed">{ch.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Share Tab */
          <div className="space-y-3 p-3">
            {shareTemplates.map(tmpl => (
              <div key={tmpl.key} className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#F2F2F7]">
                  <span className="text-[13px] font-medium text-[#1D1D1F]">{tmpl.label}</span>
                  <button
                    onClick={() => handleCopy(tmpl.key, tmpl.gen())}
                    className={`flex items-center gap-1 h-7 px-3 text-[12px] font-medium rounded-lg transition-colors ${
                      copiedKey === tmpl.key
                        ? 'bg-[#EDFFF3] text-[#1A8C3B]'
                        : 'bg-[#F2F2F7] text-[#007AFF] hover:bg-[#EBF5FF]'
                    }`}
                  >
                    {copiedKey === tmpl.key ? '✓ コピー済み' : 'コピー'}
                  </button>
                </div>
                <div className="px-3 py-2.5">
                  <pre className="text-[11px] text-[#3C3C43] whitespace-pre-wrap font-sans leading-relaxed line-clamp-6">
                    {tmpl.gen()}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FacilityDot({ value }: { value: string }) {
  const color = value === 'あり' || value === '可' ? '#34C759'
    : value === 'なし' || value === '不可' ? '#C6C6C8'
    : '#FF9500'
  return <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" />
    </svg>
  )
}
function MapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2z" />
    </svg>
  )
}
