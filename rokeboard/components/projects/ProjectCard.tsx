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

  const dates = project.candidateDates.map(d => {
    const d_ = new Date(d.date)
    return `${d_.getMonth() + 1}/${d_.getDate()}`
  })

  return (
    <Link href={`/project?id=${project.id}`} className="block">
      <div className="bg-white rounded-[14px] border border-[#E5E5EA] p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#D1D1D6] transition-all group">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#1D1D1F] text-[15px] group-hover:text-[#007AFF] transition-colors truncate">
              {project.title}
            </h3>
            {project.clientName && (
              <p className="text-[12px] text-[#8E8E93] mt-0.5 truncate">{project.clientName}</p>
            )}
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        {/* Dates */}
        {dates.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#C6C6C8]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 1a1 1 0 0 1 1 1v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 0 1 1-1zm7 4H4v1h8V5z" />
              </svg>
            </span>
            <span className="text-[12px] text-[#6E6E73] font-medium">候補日：{dates.join('・')}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <StatChip label="ロケ地" value={locations.length} color="blue" />
          <StatChip label="仮キープ" value={holdCount} color="purple" />
          <StatChip label="返信待ち" value={waitingCount} color="amber" highlight={waitingCount > 0} />
          <StatChip label="タスク" value={incompleteTasks} color="slate" highlight={incompleteTasks > 0} />
        </div>

        {/* Alerts */}
        {(waitingCount > 0 || incompleteTasks > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {waitingCount > 0 && (
              <span className="text-[11px] font-medium bg-[#FF9500]/12 text-[#9A5E00] rounded-md px-2 py-0.5">
                ⏳ 返信待ち {waitingCount}件
              </span>
            )}
            {incompleteTasks > 0 && (
              <span className="text-[11px] font-medium bg-[#8E8E93]/12 text-[#6E6E73] rounded-md px-2 py-0.5">
                ✓ 未完了タスク {incompleteTasks}件
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[#F2F2F7] flex items-center justify-between">
          <span className="text-[11px] text-[#B0B0B5]">
            更新：{formatDate(project.updatedAt)}
          </span>
          {confirmedCount > 0 && (
            <span className="text-[11px] text-[#1F8F3B] font-medium">
              ✓ {confirmedCount}件決定
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function StatChip({
  label,
  value,
  color,
  highlight,
}: {
  label: string
  value: number
  color: string
  highlight?: boolean
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-[#007AFF]',
    purple: 'text-[#AF52DE]',
    amber: 'text-[#FF9500]',
    slate: 'text-[#3C3C43]',
  }
  return (
    <div className={`flex flex-col items-center bg-[#F2F2F7] rounded-[10px] py-1.5 ${highlight ? 'ring-1 ring-[#FF9500]/30' : ''}`}>
      <span className={`text-[17px] font-bold leading-none ${colorMap[color] || 'text-[#3C3C43]'}`}>
        {value}
      </span>
      <span className="text-[10px] text-[#8E8E93] mt-0.5">{label}</span>
    </div>
  )
}
