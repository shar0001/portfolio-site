'use client'
import type { Location, CandidateDate, DateAvailability } from '@/lib/types'
import { DATE_AVAILABILITY_LABELS } from '@/lib/types'
import { EmptyState } from '@/components/ui/EmptyState'

interface DateTableProps {
  candidateDates: CandidateDate[]
  locations: Location[]
  onUpdate: (locationId: string, dateId: string, value: DateAvailability) => void
}

const availabilityOrder: DateAvailability[] = ['available', 'checking', 'unavailable', 'unknown']

const cellStyles: Record<DateAvailability, string> = {
  available:   'bg-emerald-100 text-emerald-700 font-bold',
  checking:    'bg-amber-100 text-amber-700 font-bold',
  unavailable: 'bg-red-100 text-red-600 font-bold',
  unknown:     'bg-slate-100 text-slate-500',
}

export function DateTable({ candidateDates, locations, onUpdate }: DateTableProps) {
  if (candidateDates.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="撮影候補日が未設定です"
        description="案件概要から撮影候補日を追加すると、ロケ地ごとの可否を比較できます。"
      />
    )
  }

  if (locations.length === 0) {
    return (
      <EmptyState
        icon="📍"
        title="ロケ地が未登録です"
        description="ロケ地タブからロケ地を追加すると、候補日ごとの可否を管理できます。"
      />
    )
  }

  const sortedDates = [...candidateDates].sort((a, b) => a.date.localeCompare(b.date))

  const cycleAvailability = (current: DateAvailability): DateAvailability => {
    const idx = availabilityOrder.indexOf(current)
    return availabilityOrder[(idx + 1) % availabilityOrder.length]
  }

  return (
    <div className="p-4 md:p-6">
      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4 min-w-32 sticky left-0 bg-white/90 backdrop-blur-sm">
                ロケ地
              </th>
              {sortedDates.map(d => {
                const dt = new Date(d.date)
                const dow = ['日','月','火','水','木','金','土'][dt.getDay()]
                const isWeekend = dt.getDay() === 0 || dt.getDay() === 6
                return (
                  <th key={d.id} className="pb-3 px-2 min-w-16 text-center">
                    <div className="text-xs font-semibold text-slate-700">
                      {dt.getMonth() + 1}/{dt.getDate()}
                    </div>
                    <div className={`text-[11px] font-medium ${isWeekend ? 'text-red-500' : 'text-slate-500'}`}>
                      ({dow})
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {locations.map(loc => (
              <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 pr-4 sticky left-0 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    {(loc.photos ?? []).length > 0 && (
                      <img
                        src={(loc.photos ?? [])[0].url}
                        alt={(loc.photos ?? [])[0].label}
                        className="w-9 h-6 rounded object-cover shrink-0 bg-slate-200"
                      />
                    )}
                    <div className="text-sm font-medium text-slate-800 truncate max-w-[7rem]">{loc.name}</div>
                  </div>
                </td>
                {sortedDates.map(d => {
                  const availability = loc.dateAvailability[d.id] ?? 'unknown'
                  return (
                    <td key={d.id} className="py-3 px-2 text-center">
                      <button
                        onClick={() => onUpdate(loc.id, d.id, cycleAvailability(availability))}
                        className={`w-10 h-10 rounded-lg text-sm transition-all hover:scale-110 active:scale-95 ${cellStyles[availability]}`}
                        title={`クリックして変更: ${DATE_AVAILABILITY_LABELS[availability]}`}
                      >
                        {DATE_AVAILABILITY_LABELS[availability]}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium w-full mb-1">セルをクリックして可否を変更できます</p>
        {availabilityOrder.map(a => (
          <span key={a} className={`text-xs px-2.5 py-1 rounded-lg ${cellStyles[a]}`}>
            {DATE_AVAILABILITY_LABELS[a]}：{a === 'available' ? '可能' : a === 'checking' ? '確認中' : a === 'unavailable' ? '不可' : '未確認'}
          </span>
        ))}
      </div>
    </div>
  )
}
