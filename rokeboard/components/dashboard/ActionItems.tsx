'use client'
import type { Location, Task, CandidateDate } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ActionItemsProps {
  locations: Location[]
  tasks: Task[]
  today: Date
  candidateDates: CandidateDate[]
}

type Level = 'urgent' | 'warning' | 'info'

interface ActionItem {
  level: Level
  text: string
}

export function ActionItems({ locations, tasks, today, candidateDates }: ActionItemsProps) {
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7)

  const items: ActionItem[] = []

  const overdueCount = tasks.filter(t =>
    t.status !== 'done' && t.status !== 'unnecessary' &&
    t.dueDate && new Date(t.dueDate) < today
  ).length
  if (overdueCount > 0) {
    items.push({ level: 'urgent', text: `期限切れのタスクが ${overdueCount}件 あります` })
  }

  const dueTodayCount = tasks.filter(t => {
    if (t.status === 'done' || t.status === 'unnecessary') return false
    if (!t.dueDate) return false
    const due = new Date(t.dueDate); due.setHours(0, 0, 0, 0)
    return due.getTime() === today.getTime()
  }).length
  if (dueTodayCount > 0) {
    items.push({ level: 'warning', text: `今日期限のタスクが ${dueTodayCount}件 あります` })
  }

  const followUpCount = locations.filter(l => {
    if (!l.nextFollowUpDate) return false
    const d = new Date(l.nextFollowUpDate); d.setHours(0, 0, 0, 0)
    return d <= tomorrow
  }).length
  if (followUpCount > 0) {
    items.push({ level: 'warning', text: `確認期限を迎えるロケ地が ${followUpCount}件 あります` })
  }

  const waitingCount = locations.filter(l => l.status === 'waiting').length
  if (waitingCount > 0) {
    items.push({ level: 'info', text: `返信待ちのロケ地が ${waitingCount}件 あります` })
  }

  const holdCount = locations.filter(l => l.status === 'hold').length
  if (holdCount > 0) {
    items.push({ level: 'info', text: `仮キープ中のロケ地が ${holdCount}件 あります — 本確認を忘れずに` })
  }

  const noAvailableDates = candidateDates.filter(cd => {
    const availableCount = locations.filter(l => {
      const avail = l.dateAvailability[cd.id]
      return avail === 'available' || avail === 'checking'
    }).length
    return availableCount === 0
  })
  for (const cd of noAvailableDates.slice(0, 2)) {
    const dt = new Date(cd.date)
    const dow = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()]
    items.push({
      level: 'info',
      text: `${dt.getMonth() + 1}/${dt.getDate()}(${dow}) は使えるロケ地がまだ確認されていません`,
    })
  }

  if (items.length === 0) return null

  const levelStyle: Record<Level, { border: string; bg: string; dot: string; text: string }> = {
    urgent: { border: '#FF3B30', bg: '#FFF0EE', dot: '#FF3B30', text: '#C0392B' },
    warning: { border: '#FF9500', bg: '#FFF7EB', dot: '#FF9500', text: '#9A5700' },
    info: { border: '#007AFF', bg: '#EBF5FF', dot: '#007AFF', text: '#005DC0' },
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#F2F2F7]">
        <p className="text-[13px] font-semibold text-[#1D1D1F]">今日やること</p>
      </div>
      <div className="divide-y divide-[#F2F2F7]">
        {items.map((item, i) => {
          const s = levelStyle[item.level]
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
              <p className="text-[13px]" style={{ color: s.text }}>{item.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
