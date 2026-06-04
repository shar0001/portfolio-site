'use client'
import { useState } from 'react'
import type { Location, LocationStatus } from '@/lib/types'
import { LOCATION_STATUS_LABELS, FACILITY_LABELS, RAIN_SUPPORT_LABELS, SOUND_ALLOWED_LABELS } from '@/lib/types'
import { LocationStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface LocationCardProps {
  location: Location
  isSelected?: boolean
  onSelect?: () => void
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: LocationStatus) => void
}

export function LocationCard({
  location, isSelected, onSelect, onEdit, onDelete, onStatusChange,
}: LocationCardProps) {
  const photos = location.photos ?? []
  const mainPhoto = photos[0]

  const facilities = [
    { label: '駐車場', value: FACILITY_LABELS[location.parking] },
    { label: '控室', value: FACILITY_LABELS[location.waitingRoom] },
    { label: '電源', value: FACILITY_LABELS[location.power] },
    { label: '雨天', value: RAIN_SUPPORT_LABELS[location.rainSupport] },
    { label: '音出し', value: SOUND_ALLOWED_LABELS[location.soundAllowed] },
  ]

  return (
    <div
      className={`bg-white rounded-xl border transition-all overflow-hidden ${
        isSelected
          ? 'border-[#007AFF] shadow-md shadow-[#007AFF]/10 ring-1 ring-[#007AFF]/20'
          : 'border-[#E5E5EA] hover:shadow-sm hover:border-[#C6C6C8]'
      }`}
    >
      {/* Photo Hero */}
      {mainPhoto ? (
        <button
          onClick={onSelect}
          className="block w-full overflow-hidden bg-[#F2F2F7] relative"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src={mainPhoto.url}
            alt={mainPhoto.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded-full">
            {mainPhoto.label}
          </span>
          {photos.length > 1 && (
            <span className="absolute bottom-2 right-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded-full">
              +{photos.length - 1}
            </span>
          )}
        </button>
      ) : (
        <button
          onClick={onSelect}
          className="block w-full bg-[#F9F9FB] border-b border-[#F2F2F7] relative"
          style={{ aspectRatio: '16/6' }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="#C6C6C8" strokeWidth="0.8">
              <rect x="1" y="3" width="14" height="10" rx="2" />
              <circle cx="8" cy="8" r="2.5" />
              <path d="M1 6h3l1.5-2h5L12 6h3" />
            </svg>
          </div>
        </button>
      )}

      {/* Card Body */}
      <button
        onClick={onSelect}
        className="w-full text-left px-3.5 pt-3 pb-0"
      >
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={`text-[14px] font-semibold leading-snug ${isSelected ? 'text-[#007AFF]' : 'text-[#1D1D1F]'}`}>
              {location.name}
            </h3>
            {location.address && (
              <p className="text-[11px] text-[#8E8E93] mt-0.5 truncate">{location.address}</p>
            )}
          </div>
          <LocationStatusBadge status={location.status} />
        </div>

        {/* Key info */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2">
          {location.price && <InfoRow label="料金" value={location.price} />}
          {location.availableTime && <InfoRow label="時間" value={location.availableTime} />}
          {location.contactName && <InfoRow label="担当" value={location.contactName} />}
          {location.lastContactDate && <InfoRow label="連絡" value={formatDate(location.lastContactDate)} />}
        </div>

        {/* Facility chips */}
        <div className="flex flex-wrap gap-1 pb-2.5">
          {facilities.map(({ label: lb, value }) => (
            <span
              key={lb}
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                value === 'あり' || value === '可' ? 'bg-[#EDFFF3] text-[#1A8C3B] border-[#C0ECCC]'
                : value === 'なし' || value === '不可' ? 'bg-[#F2F2F7] text-[#8E8E93] border-[#E5E5EA]'
                : 'bg-[#FFF7EB] text-[#9A5700] border-[#FFD9A0]'
              }`}
            >
              {lb}：{value}
            </span>
          ))}
        </div>
      </button>

      {/* Action row */}
      <div className="border-t border-[#F2F2F7] flex">
        {location.phone && (
          <a
            href={`tel:${location.phone}`}
            onClick={e => e.stopPropagation()}
            className="flex-1 h-9 flex items-center justify-center gap-1 text-[11px] text-[#007AFF] hover:bg-[#EBF5FF] transition-colors"
          >
            <PhoneIcon /> 電話
          </a>
        )}
        {location.mapUrl && (
          <a
            href={location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex-1 h-9 flex items-center justify-center gap-1 text-[11px] text-[#34C759] hover:bg-[#EDFFF3] transition-colors border-l border-[#F2F2F7]"
          >
            <MapIcon /> 地図
          </a>
        )}
        <button
          onClick={e => { e.stopPropagation(); onEdit() }}
          className="flex-1 h-9 flex items-center justify-center gap-1 text-[11px] text-[#8E8E93] hover:bg-[#F2F2F7] hover:text-[#1D1D1F] transition-colors border-l border-[#F2F2F7]"
        >
          <EditIcon /> 編集
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="h-9 w-9 flex items-center justify-center text-[#8E8E93] hover:bg-[#FFF0EE] hover:text-[#FF3B30] transition-colors border-l border-[#F2F2F7]"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[10px] text-[#8E8E93] shrink-0">{label}</span>
      <span className="text-[11px] text-[#3C3C43] font-medium truncate">{value}</span>
    </div>
  )
}

function PhoneIcon() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" /></svg>
}
function MapIcon() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>
}
function EditIcon() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M12.146.854a.5.5 0 0 1 .707 0l2.293 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z" /></svg>
}
function TrashIcon() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1H14.5a1 1 0 0 1 0 2z"/></svg>
}
