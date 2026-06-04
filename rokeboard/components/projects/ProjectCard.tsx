'use client'
import Link from 'next/link'
import type { Project, Location, Task } from '@/lib/types'
import { ProjectStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  locations: Location[]
  tasks: Task[]
}

export function ProjectCard({ project, locations, tasks }: ProjectCardProps) {
  const holdCount = locations.filter(l => l.status === 'hold').length
  const waitingCount = locations.filter(l => l.status === 'waiting').length
  const confirmedCount = locations.filter(l => l.status === 'confirmed').length
  const incompleteTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary').length
  const hasAlert = waitingCount > 0 || incompleteTasks > 0

  const candidateDates = [...project.candidateDates]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)
    .map(d => {
      const dt = new Date(d.date)
      return `${dt.getMonth() + 1}/${dt.getDate()}(${['日','月','火','水','木','金','土'][dt.getDay()]})`
    })

  return (
    <Link href={`/project?id=${project.id}`} className="block group">
      <div className="bg-white rounded-[16px] border border-[#E5E5EA] overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#C6C6C8] transition-all duration-200">

        {/* Main row */}
        <div className="px-5 pt-4.5 pb-3" style={{ paddingTop: '18px' }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-semibold text-[#1D1D1F] group-hover:text-[#007AFF] transition-colors leading-snug truncate">
                {project.title}
              </h3>
              {project.clientName && (
                <p className="text-[13px] text-[#8E8E93] mt-0.5 truncate">{project.clientName}</p>
              )}
            </div>
            <div className="shrink-0 mt-0.5">
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>

          {/* Candidate dates */}
          {candidateDates.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="#C6C6C8">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
              </svg>
              <span className="text-[12px] text-[#6E6E73]">{candidateDates.join('・')}</span>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4">
            <Stat label="ロケ地" value={locations.length} color="#007AFF" />
            {holdCount > 0 && <Stat label="仮キープ" value={holdCount} color="#AF52DE" />}
            {confirmedCount > 0 && <Stat label="決定" value={confirmedCount} color="#34C759" />}
            {waitingCount > 0 && <Stat label="返信待ち" value={waitingCount} color="#FF9500" alert />}
            {incompleteTasks > 0 && <Stat label="タスク未完" value={incompleteTasks} color="#3C3C43" />}
          </div>
        </div>

        {/* Alert bar */}
        {hasAlert && (
          <div className="border-t border-[#F2F2F7] px-5 py-2.5 bg-[#FAFAFA] flex items-center gap-3 flex-wrap">
            {waitingCount > 0 && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#9A5E00]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500]" />
                返信待ち {waitingCount}件
              </span>
            )}
            {incompleteTasks > 0 && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#6E6E73]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
                未完了タスク {incompleteTasks}件
              </span>
            )}
            <span className="ml-auto text-[11px] text-[#B0B0B5]">{formatDate(project.updatedAt)}</span>
          </div>
        )}

        {/* Footer (no alert) */}
        {!hasAlert && (
          <div className="border-t border-[#F2F2F7] px-5 py-2.5 flex items-center justify-between">
            <span className="text-[11px] text-[#B0B0B5]">{formatDate(project.updatedAt)}</span>
            {confirmedCount > 0 && (
              <span className="text-[12px] font-medium text-[#1F8F3B]">✓ {confirmedCount}件決定</span>
            )}
          </div>
        )}

      </div>
    </Link>
  )
}

function Stat({ label, value, color, alert }: { label: string; value: number; color: string; alert?: boolean }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className={`text-[20px] font-bold leading-none ${alert ? 'tabular-nums' : ''}`} style={{ color }}>
        {value}
      </span>
      <span className="text-[11px] text-[#8E8E93]">{label}</span>
    </div>
  )
}
