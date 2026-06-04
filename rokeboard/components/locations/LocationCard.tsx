'use client'
import { useState } from 'react'
import type { Location, LocationStatus } from '@/lib/types'
import { LOCATION_STATUS_LABELS, FACILITY_LABELS, RAIN_SUPPORT_LABELS, SOUND_ALLOWED_LABELS } from '@/lib/types'
import { LocationStatusBadge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface LocationCardProps {
  location: Location
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: LocationStatus) => void
}

export function LocationCard({ location, onEdit, onDelete, onStatusChange }: LocationCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const statuses: LocationStatus[] = ['none', 'inquired', 'waiting', 'hold', 'confirmed', 'ng', 'pending']

  const facilityItems = [
    { label: '駐車場', value: FACILITY_LABELS[location.parking] },
    { label: '控室', value: FACILITY_LABELS[location.waitingRoom] },
    { label: '電源', value: FACILITY_LABELS[location.power] },
    { label: '雨天', value: RAIN_SUPPORT_LABELS[location.rainSupport] },
    { label: '音出し', value: SOUND_ALLOWED_LABELS[location.soundAllowed] },
  ]

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-slate-900 text-[15px]">{location.name}</h3>
              <LocationStatusBadge status={location.status} />
            </div>
            {location.address && (
              <p className="text-xs text-slate-500 truncate">{location.address}</p>
            )}
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <IconButton title="ステータス変更" onClick={() => setShowStatusMenu(!showStatusMenu)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.5 3.5h1v4.25l2.62 1.56-.5.87L7.5 9.25V4.5z" />
              </svg>
            </IconButton>
            <IconButton title="編集" onClick={onEdit}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.146.854a.5.5 0 0 1 .707 0l2.293 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z" />
              </svg>
            </IconButton>
            <IconButton title="削除" onClick={onDelete}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-red-400 hover:text-red-600">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1H14.5a1 1 0 0 1 0 2zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
              </svg>
            </IconButton>
          </div>
        </div>
      </div>

      {/* Status change menu */}
      {showStatusMenu && (
        <div className="mx-4 mb-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500 mb-2 px-1">ステータスを変更</p>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => { onStatusChange(s); setShowStatusMenu(false) }}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  location.status === s
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {LOCATION_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key Info */}
      <div className="px-4 pb-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
        {location.price && (
          <InfoRow label="料金" value={location.price} />
        )}
        {location.availableTime && (
          <InfoRow label="利用時間" value={location.availableTime} />
        )}
        {location.contactName && (
          <InfoRow label="担当者" value={location.contactName} />
        )}
        {location.lastContactDate && (
          <InfoRow label="最終連絡" value={formatDate(location.lastContactDate)} />
        )}
      </div>

      {/* Facility chips */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {facilityItems.map(({ label, value }) => (
          <span
            key={label}
            className={`text-[11px] px-2 py-0.5 rounded border ${
              value === 'あり' || value === '可' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : value === 'なし' || value === '不可' ? 'bg-slate-50 text-slate-500 border-slate-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {label}：{value}
          </span>
        ))}
      </div>

      {/* Quick actions - mobile friendly */}
      <div className="px-4 pb-4 flex gap-2">
        {location.phone && (
          <a
            href={`tel:${location.phone}`}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" />
            </svg>
            電話
          </a>
        )}
        {location.mapUrl && (
          <a
            href={location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
            地図
          </a>
        )}
        {location.email && (
          <a
            href={`mailto:${location.email}`}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2z" />
            </svg>
            メール
          </a>
        )}
      </div>

      {/* Expandable memo */}
      {location.memo && (
        <div className="border-t border-slate-100 px-4 py-2.5">
          <p className={`text-xs text-slate-600 leading-relaxed ${!expanded ? 'truncate-2' : ''}`}>
            {location.memo}
          </p>
          {location.memo.length > 80 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-600 hover:text-blue-700 mt-1"
            >
              {expanded ? '折りたたむ' : 'もっと見る'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[11px] text-slate-400 shrink-0">{label}</span>
      <span className="text-xs text-slate-700 font-medium truncate">{value}</span>
    </div>
  )
}
