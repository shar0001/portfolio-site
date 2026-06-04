'use client'
import type { Location, LocationStatus } from '@/lib/types'
import { LOCATION_STATUS_LABELS, FACILITY_LABELS, RAIN_SUPPORT_LABELS } from '@/lib/types'
import { LocationStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface LocationTableViewProps {
  locations: Location[]
  selectedId: string | null
  onSelect: (id: string) => void
  onEdit: (loc: Location) => void
  onDelete: (loc: Location) => void
  onStatusChange: (locId: string, status: LocationStatus) => void
}

export function LocationTableView({
  locations, selectedId, onSelect, onEdit, onDelete, onStatusChange,
}: LocationTableViewProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden mt-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-[#E5E5EA] bg-[#F9F9FB]">
              {['ロケ地名', '料金', '時間', '駐車', '控室', '電源', '雨天', '最終連絡', '次回確認', '操作'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-[#8E8E93] px-3 py-2.5 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F2F7]">
            {locations.map(loc => (
              <tr
                key={loc.id}
                onClick={() => onSelect(loc.id === selectedId ? '' : loc.id)}
                className={`cursor-pointer transition-colors ${
                  loc.id === selectedId
                    ? 'bg-[#EBF5FF]'
                    : 'hover:bg-[#F9F9FB]'
                }`}
              >
                {/* Name + Status */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {(loc.photos ?? []).length > 0 && (
                      <img
                        src={(loc.photos ?? [])[0].url}
                        alt=""
                        className="w-8 h-6 rounded object-cover shrink-0 bg-[#F2F2F7]"
                      />
                    )}
                    <div>
                      <div className="text-[13px] font-medium text-[#1D1D1F] whitespace-nowrap">{loc.name}</div>
                      <LocationStatusBadge status={loc.status} />
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-3 py-2.5 text-[12px] text-[#3C3C43] whitespace-nowrap max-w-[120px]">
                  <span className="truncate block">{loc.price || '—'}</span>
                </td>

                {/* Time */}
                <td className="px-3 py-2.5 text-[12px] text-[#3C3C43] whitespace-nowrap">
                  {loc.availableTime || '—'}
                </td>

                {/* Facilities */}
                {[loc.parking, loc.waitingRoom, loc.power].map((fac, i) => (
                  <td key={i} className="px-3 py-2.5 text-center">
                    <FacilityDot value={FACILITY_LABELS[fac]} />
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center">
                  <FacilityDot value={RAIN_SUPPORT_LABELS[loc.rainSupport]} />
                </td>

                {/* Dates */}
                <td className="px-3 py-2.5 text-[12px] text-[#8E8E93] whitespace-nowrap">
                  {loc.lastContactDate ? formatDate(loc.lastContactDate) : '—'}
                </td>
                <td className="px-3 py-2.5 text-[12px] whitespace-nowrap">
                  {loc.nextFollowUpDate ? (
                    <span className={isNear(loc.nextFollowUpDate) ? 'text-[#FF9500] font-medium' : 'text-[#8E8E93]'}>
                      {formatDate(loc.nextFollowUpDate)}
                    </span>
                  ) : '—'}
                </td>

                {/* Actions */}
                <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <TableActionBtn title="編集" onClick={() => onEdit(loc)}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M12.146.854a.5.5 0 0 1 .707 0l2.293 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z" />
                      </svg>
                    </TableActionBtn>
                    <TableActionBtn title="削除" onClick={() => onDelete(loc)} danger>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1H14.5a1 1 0 0 1 0 2z" />
                      </svg>
                    </TableActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FacilityDot({ value }: { value: string }) {
  const color = value === 'あり' || value === '可' ? '#34C759'
    : value === 'なし' || value === '不可' ? '#C6C6C8'
    : '#FF9500'
  const symbol = value === 'あり' || value === '可' ? '●'
    : value === 'なし' || value === '不可' ? '○'
    : '△'
  return <span className="text-[13px] font-bold" style={{ color }}>{symbol}</span>
}

function TableActionBtn({ title, onClick, danger, children }: {
  title: string; onClick: () => void; danger?: boolean; children: React.ReactNode
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
        danger ? 'text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FFF0EE]' : 'text-[#8E8E93] hover:text-[#007AFF] hover:bg-[#EBF5FF]'
      }`}
    >
      {children}
    </button>
  )
}

function isNear(dateStr: string): boolean {
  const d = new Date(dateStr)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 3
}
