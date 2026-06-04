'use client'
import Link from 'next/link'
import type { Project, Location, Task } from '@/lib/types'
import { ProjectStatusBadge } from '@/components/ui/Badge'

interface AppSidebarProps {
  project: Project
  locations: Location[]
  tasks: Task[]
  activeSection: string
  onSectionClick: (id: string) => void
}

export function AppSidebar({ project, locations, tasks, activeSection, onSectionClick }: AppSidebarProps) {
  const incompleteTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary').length
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const overdueCount = tasks.filter(t =>
    t.status !== 'done' && t.status !== 'unnecessary' &&
    t.dueDate && new Date(t.dueDate) < today
  ).length

  const navItems = [
    { id: 'overview', label: 'ダッシュボード', icon: <DashIcon /> },
    { id: 'locations', label: 'ロケ地', icon: <PinIcon />, badge: locations.length || undefined },
    { id: 'dates', label: '候補日', icon: <CalIcon /> },
    {
      id: 'tasks', label: 'タスク', icon: <CheckIcon />,
      badge: incompleteTasks || undefined,
      badgeRed: overdueCount > 0,
    },
    { id: 'share', label: '共有・文面生成', icon: <ShareIcon /> },
  ]

  const sortedDates = [...project.candidateDates].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <aside className="w-[220px] flex flex-col h-full bg-white border-r border-[#E5E5EA]">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-[#E5E5EA] shrink-0">
        <div className="w-7 h-7 bg-[#007AFF] rounded-lg flex items-center justify-center">
          <PinIcon color="white" size={14} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-[#1D1D1F]">ロケボード</span>
      </div>

      {/* Back to home */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-[13px] text-[#007AFF] hover:bg-[#F2F2F7] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
          </svg>
          案件一覧
        </Link>
      </div>

      {/* Current project card */}
      <div className="mx-3 mb-3 p-3 bg-[#F2F2F7] rounded-xl shrink-0">
        <p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1.5">現在の案件</p>
        <p className="text-[13px] font-semibold text-[#1D1D1F] leading-snug line-clamp-2">{project.title}</p>
        {project.clientName && (
          <p className="text-[12px] text-[#6E6E73] mt-0.5 truncate">{project.clientName}</p>
        )}
        <div className="mt-1.5">
          <ProjectStatusBadge status={project.status} />
        </div>
        {sortedDates.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {sortedDates.slice(0, 4).map(d => {
              const dt = new Date(d.date)
              const dow = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()]
              return (
                <span key={d.id} className="text-[11px] text-[#6E6E73] bg-white px-1.5 py-0.5 rounded border border-[#E5E5EA]">
                  {dt.getMonth() + 1}/{dt.getDate()}({dow})
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionClick(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 mb-0.5 rounded-lg text-[13px] transition-colors text-left ${
              activeSection === item.id
                ? 'bg-[#007AFF]/10 text-[#007AFF] font-medium'
                : 'text-[#3C3C43] hover:bg-[#F2F2F7]'
            }`}
          >
            <span className="w-4 shrink-0 flex items-center justify-center text-current opacity-70">
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.badge !== undefined && (
              <span className={`text-[11px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-medium ${
                item.badgeRed
                  ? 'bg-[#FF3B30] text-white'
                  : activeSection === item.id
                  ? 'bg-[#007AFF]/20 text-[#007AFF]'
                  : 'bg-[#E5E5EA] text-[#6E6E73]'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function DashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
      <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13z" />
    </svg>
  )
}

function PinIcon({ color = 'currentColor', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
      <path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  )
}

function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
    </svg>
  )
}
