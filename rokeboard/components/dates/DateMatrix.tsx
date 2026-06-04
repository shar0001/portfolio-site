'use client'
import type { Location, CandidateDate, DateAvailability } from '@/lib/types'
import { EmptyState } from '@/components/ui/EmptyState'

interface DateMatrixProps {
  candidateDates: CandidateDate[]
  locations: Location[]
  onUpdate: (locationId: string, dateId: string, value: DateAvailability) => void
}

const order: DateAvailability[] = ['available', 'checking', 'unavailable', 'unknown']

const cellStyle: Record<DateAvailability, string> = {
  available: 'bg-[#EDFFF3] text-[#1A8C3B] font-bold',
  checking: 'bg-[#FFF7EB] text-[#9A5700] font-bold',
  unavailable: 'bg-[#FFF0EE] text-[#C0392B] font-bold',
  unknown: 'bg-[#F2F2F7] text-[#8E8E93]',
}

const label: Record<DateAvailability, string> = {
  available: '○', checking: '△', unavailable: '×', unknown: 'ー',
}

export function DateMatrix({ candidateDates, locations, onUpdate }: DateMatrixProps) {
  if (candidateDates.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="撮影候補日が未設定です"
        description="案件情報の編集から撮影候補日を追加すると、ロケ地ごとの可否を比較できます。"
      />
    )
  }

  if (locations.length === 0) {
    return (
      <EmptyState
        icon="📍"
        title="ロケ地が未登録です"
        description="ロケ地を追加すると候補日ごとの可否を管理できます。"
      />
    )
  }

  const sorted = [...candidateDates].sort((a, b) => a.date.localeCompare(b.date))

  const cycle = (cur: DateAvailability): DateAvailability =>
    order[(order.indexOf(cur) + 1) % order.length]

  return (
    <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-[#F2F2F7]">
              <th className="text-left text-[11px] font-semibold text-[#8E8E93] px-4 py-2.5 min-w-[140px] sticky left-0 bg-white/95 backdrop-blur-sm">
                ロケ地
              </th>
              {sorted.map(d => {
                const dt = new Date(d.date)
                const dow = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()]
                const isWknd = dt.getDay() === 0 || dt.getDay() === 6
                return (
                  <th key={d.id} className="px-3 py-2.5 text-center min-w-[52px]">
                    <div className="text-[12px] font-semibold text-[#1D1D1F]">
                      {dt.getMonth() + 1}/{dt.getDate()}
                    </div>
                    <div className={`text-[11px] ${isWknd ? 'text-[#FF3B30]' : 'text-[#8E8E93]'}`}>
                      ({dow})
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F2F7]">
            {locations.map(loc => (
              <tr key={loc.id} className="hover:bg-[#F2F2F7]/50 transition-colors">
                <td className="px-4 py-2.5 sticky left-0 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    {(loc.photos ?? []).length > 0 && (
                      <img
                        src={(loc.photos ?? [])[0].url}
                        alt=""
                        className="w-8 h-6 rounded object-cover shrink-0 bg-[#F2F2F7]"
                      />
                    )}
                    <span className="text-[13px] font-medium text-[#1D1D1F] truncate max-w-[110px]">{loc.name}</span>
                  </div>
                </td>
                {sorted.map(d => {
                  const avail = loc.dateAvailability[d.id] ?? 'unknown'
                  return (
                    <td key={d.id} className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => onUpdate(loc.id, d.id, cycle(avail))}
                        className={`w-9 h-9 rounded-lg text-[14px] transition-all hover:scale-110 active:scale-95 ${cellStyle[avail]}`}
                        title={`タップして変更: ${label[avail]}`}
                      >
                        {label[avail]}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 border-t border-[#F2F2F7] flex flex-wrap gap-3">
        {order.map(a => (
          <span key={a} className={`text-[11px] px-2 py-0.5 rounded ${cellStyle[a]}`}>
            {label[a]}：{a === 'available' ? '可能' : a === 'checking' ? '確認中' : a === 'unavailable' ? '不可' : '未確認'}
          </span>
        ))}
        <span className="text-[11px] text-[#8E8E93] ml-auto">タップして変更</span>
      </div>
    </div>
  )
}
