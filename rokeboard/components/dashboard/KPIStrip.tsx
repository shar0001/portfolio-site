'use client'
import type { Location, Task, LocationStatus } from '@/lib/types'

interface KPIStripProps {
  locations: Location[]
  tasks: Task[]
  statusFilter: LocationStatus | 'all'
  onStatusFilter: (s: LocationStatus | 'all') => void
  onTaskFilter: (type: 'incomplete' | 'overdue' | null) => void
  taskFilter: 'incomplete' | 'overdue' | null
}

export function KPIStrip({
  locations, tasks, statusFilter, onStatusFilter, onTaskFilter, taskFilter,
}: KPIStripProps) {
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const holdCount = locations.filter(l => l.status === 'hold').length
  const confirmedCount = locations.filter(l => l.status === 'confirmed').length
  const waitingCount = locations.filter(l => l.status === 'waiting').length
  const incompleteTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary').length
  const overdueCount = tasks.filter(t =>
    t.status !== 'done' && t.status !== 'unnecessary' && t.dueDate && new Date(t.dueDate) < today
  ).length

  const kpis: {
    label: string
    value: number
    sublabel?: string
    color: string
    bg: string
    active: boolean
    onClick: () => void
  }[] = [
    {
      label: 'ロケ地', value: locations.length, sublabel: '候補',
      color: '#007AFF', bg: '#EBF5FF',
      active: statusFilter === 'all',
      onClick: () => onStatusFilter('all'),
    },
    {
      label: '仮キープ', value: holdCount, sublabel: '件',
      color: '#AF52DE', bg: '#F5EEFF',
      active: statusFilter === 'hold',
      onClick: () => onStatusFilter(statusFilter === 'hold' ? 'all' : 'hold'),
    },
    {
      label: '決定', value: confirmedCount, sublabel: '件',
      color: '#34C759', bg: '#EDFFF3',
      active: statusFilter === 'confirmed',
      onClick: () => onStatusFilter(statusFilter === 'confirmed' ? 'all' : 'confirmed'),
    },
    {
      label: '返信待ち', value: waitingCount, sublabel: '件',
      color: '#FF9500', bg: '#FFF7EB',
      active: statusFilter === 'waiting',
      onClick: () => onStatusFilter(statusFilter === 'waiting' ? 'all' : 'waiting'),
    },
    {
      label: '未完了', value: incompleteTasks, sublabel: 'タスク',
      color: '#3C3C43', bg: '#F2F2F7',
      active: taskFilter === 'incomplete',
      onClick: () => onTaskFilter(taskFilter === 'incomplete' ? null : 'incomplete'),
    },
    {
      label: '期限超過', value: overdueCount, sublabel: '件',
      color: '#FF3B30', bg: '#FFF0EE',
      active: taskFilter === 'overdue',
      onClick: () => onTaskFilter(taskFilter === 'overdue' ? null : 'overdue'),
    },
  ]

  return (
    <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
      {kpis.map(kpi => (
        <button
          key={kpi.label}
          onClick={kpi.onClick}
          className={`shrink-0 rounded-xl px-4 py-3 text-left transition-all border ${
            kpi.active
              ? 'shadow-sm scale-[1.02]'
              : 'hover:shadow-sm hover:scale-[1.01]'
          }`}
          style={{
            backgroundColor: kpi.active ? kpi.color : 'white',
            borderColor: kpi.active ? kpi.color : '#E5E5EA',
            minWidth: '100px',
          }}
        >
          <div className={`text-2xl font-bold leading-none ${kpi.active ? 'text-white' : ''}`}
            style={kpi.active ? {} : { color: kpi.color }}>
            {kpi.value}
          </div>
          <div className={`text-[11px] mt-1 font-medium ${kpi.active ? 'text-white/80' : 'text-[#8E8E93]'}`}>
            {kpi.label}
          </div>
        </button>
      ))}
    </div>
  )
}
