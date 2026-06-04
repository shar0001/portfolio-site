'use client'
import { useState, useEffect } from 'react'
import type { Location, LocationStatus } from '@/lib/types'
import { LOCATION_STATUS_LABELS, FACILITY_LABELS, RAIN_SUPPORT_LABELS, SOUND_ALLOWED_LABELS } from '@/lib/types'
import { LocationStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface LocationDetailPanelProps {
  location: Location
  onClose: () => void
  onEdit: () => void
  onStatusChange: (status: LocationStatus) => void
}

const statuses: LocationStatus[] = ['none', 'inquired', 'waiting', 'hold', 'confirmed', 'ng', 'pending']

export function LocationDetailPanel({ location, onClose, onEdit, onStatusChange }: LocationDetailPanelProps) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const photos = location.photos ?? []

  useEffect(() => {
    setPhotoIndex(0)
  }, [location.id])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setPhotoIndex(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setPhotoIndex(i => Math.min(photos.length - 1, i + 1))
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handler)
    }
  }, [onClose, photos.length])

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

  const currentPhoto = photos[photoIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="animate-modal-in relative bg-white w-full max-w-5xl max-h-[95dvh] md:max-h-[90vh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        {/* Left: Photo Gallery */}
        <div className="md:w-[42%] bg-slate-900 shrink-0 flex flex-col min-h-[220px] md:min-h-0">
          <div className="relative flex-1 aspect-video md:aspect-auto overflow-hidden">
            {photos.length > 0 && currentPhoto ? (
              <>
                <img
                  key={photoIndex}
                  src={currentPhoto.url}
                  alt={currentPhoto.label}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full">
                  {currentPhoto.label}
                </span>
                {currentPhoto.caption && (
                  <span className="absolute bottom-10 left-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded truncate">
                    {currentPhoto.caption}
                  </span>
                )}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setPhotoIndex(i => Math.max(0, i - 1))}
                      disabled={photoIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center disabled:opacity-20 transition-colors text-lg leading-none"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setPhotoIndex(i => Math.min(photos.length - 1, i + 1))}
                      disabled={photoIndex === photos.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center disabled:opacity-20 transition-colors text-lg leading-none"
                    >
                      ›
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-full">
                  {photoIndex + 1} / {photos.length}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 gap-3">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M3 9h3l2-3h4l2 3h3" />
                </svg>
                <p className="text-xs text-slate-400 text-center">写真が登録されていません<br />編集から写真URLを追加できます</p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-1.5 p-2 overflow-x-auto bg-slate-800 shrink-0">
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setPhotoIndex(idx)}
                  className={`w-14 h-10 rounded overflow-hidden border-2 shrink-0 transition-all ${
                    idx === photoIndex ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col">
          {/* Sticky header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900 leading-snug">{location.name}</h2>
                  <LocationStatusBadge status={location.status} />
                </div>
                {location.address && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{location.address}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={onEdit}
                  className="h-7 px-3 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  編集
                </button>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="閉じる"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Status chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-2.5">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors shrink-0 ${
                    location.status === s
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {LOCATION_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5 flex-1">
            {/* Quick actions */}
            {(location.phone || location.mapUrl || location.email) && (
              <div className="flex gap-2">
                {location.phone && (
                  <a href={`tel:${location.phone}`}
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" /></svg>
                    電話
                  </a>
                )}
                {location.mapUrl && (
                  <a href={location.mapUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>
                    地図
                  </a>
                )}
                {location.email && (
                  <a href={`mailto:${location.email}`}
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2z" /></svg>
                    メール
                  </a>
                )}
              </div>
            )}

            {/* Key info grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {location.price && <InfoRow label="料金" value={location.price} />}
              {location.availableTime && <InfoRow label="利用時間" value={location.availableTime} />}
              {location.contactName && <InfoRow label="担当者" value={location.contactName} />}
              {location.extensionFee && <InfoRow label="延長" value={location.extensionFee} />}
              {location.cancellationPolicy && <InfoRow label="キャンセル" value={location.cancellationPolicy} className="col-span-2" />}
              {location.paymentTerms && <InfoRow label="支払い" value={location.paymentTerms} className="col-span-2" />}
              {location.lastContactDate && <InfoRow label="最終連絡" value={formatDate(location.lastContactDate)} />}
              {location.nextFollowUpDate && <InfoRow label="次回確認" value={formatDate(location.nextFollowUpDate)} />}
            </div>

            {/* Facilities */}
            <div>
              <SectionLabel>設備・条件</SectionLabel>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {facilityItems.map(({ label, value }) => (
                  <span key={label} className={`text-[11px] px-2 py-0.5 rounded border ${
                    value === 'あり' || value === '可' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : value === 'なし' || value === '不可' ? 'bg-slate-50 text-slate-400 border-slate-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {label}：{value}
                  </span>
                ))}
              </div>
            </div>

            {/* Shooting conditions */}
            {(location.ngRules || location.loadingRules || location.vehicleLimit || location.peopleLimit || location.usableArea || location.permissionStatus) && (
              <div>
                <SectionLabel>撮影条件</SectionLabel>
                <div className="mt-2 space-y-1.5">
                  {location.permissionStatus && <CondRow label="撮影許可" value={location.permissionStatus} />}
                  {location.usableArea && <CondRow label="使用エリア" value={location.usableArea} />}
                  {location.vehicleLimit && <CondRow label="車両" value={location.vehicleLimit} />}
                  {location.peopleLimit && <CondRow label="人数" value={location.peopleLimit} />}
                  {location.ngRules && <CondRow label="NG事項" value={location.ngRules} />}
                  {location.loadingRules && <CondRow label="搬入条件" value={location.loadingRules} />}
                </div>
              </div>
            )}

            {/* Memo */}
            {location.memo && (
              <div>
                <SectionLabel>メモ</SectionLabel>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line">{location.memo}</p>
              </div>
            )}

            {/* Contact history */}
            {location.contactHistory.length > 0 && (
              <div>
                <SectionLabel>連絡履歴</SectionLabel>
                <div className="mt-2 space-y-2.5">
                  {[...location.contactHistory].reverse().map(ch => (
                    <div key={ch.id} className="flex gap-3">
                      <div className="shrink-0 text-[11px] text-slate-400 pt-0.5 whitespace-nowrap">
                        {formatDate(ch.date)}・{ch.method}
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed">{ch.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{children}</p>
  )
}

function InfoRow({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-baseline gap-1.5 ${className}`}>
      <span className="text-[11px] text-slate-400 shrink-0">{label}</span>
      <span className="text-xs text-slate-800 font-medium">{value}</span>
    </div>
  )
}

function CondRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-slate-400 shrink-0 min-w-[4.5rem]">{label}</span>
      <span className="text-slate-700">{value}</span>
    </div>
  )
}
