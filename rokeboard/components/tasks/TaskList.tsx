'use client'
import { useState } from 'react'
import type { Task, TaskCategory } from '@/lib/types'
import { TASK_CATEGORY_LABELS, TASK_STATUS_LABELS } from '@/lib/types'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
  onAdd?: () => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleDone: (task: Task) => void
}

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  location: '#007AFF',
  permit: '#AF52DE',
  vehicle: '#FF9500',
  catering: '#5AC8FA',
  art: '#FF2D55',
  costume: '#FFCC00',
  makeup: '#34C759',
  equipment: '#636366',
  staff: '#5856D6',
  cast: '#FF6B35',
  document: '#8E8E93',
  other: '#8E8E93',
}

function taskPriority(task: Task, today: Date): number {
  if (task.status === 'done' || task.status === 'unnecessary') return 100
  if (!task.dueDate) return 50
  const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0)
  const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  if (diff < 0) return 0
  if (diff === 0) return 1
  if (diff <= 1) return 2
  if (diff <= 7) return 3
  return 4
}

const priorityLabel: Record<number, { label: string; color: string }> = {
  0: { label: '期限超過', color: '#FF3B30' },
  1: { label: '今日まで', color: '#FF9500' },
  2: { label: '明日まで', color: '#FF9500' },
  3: { label: '今週中', color: '#3C3C43' },
  4: { label: '今後', color: '#8E8E93' },
}

export function TaskList({ tasks, onAdd, onEdit, onDelete, onToggleDone }: TaskListProps) {
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all')
  const [showDone, setShowDone] = useState(false)

  const today = new Date(); today.setHours(0, 0, 0, 0)

  const active = tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary')
  const done = tasks.filter(t => t.status === 'done' || t.status === 'unnecessary')
  const categories = Array.from(new Set(tasks.map(t => t.category)))

  const filter = (list: Task[]) =>
    categoryFilter === 'all' ? list : list.filter(t => t.category === categoryFilter)

  const sorted = [...filter(active)].sort((a, b) => taskPriority(a, today) - taskPriority(b, today))
  const sortedDone = filter(done)

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="✓"
        title="タスクがまだありません"
        description="車両、ケータリング、撮影許可など準備タスクを追加できます。"
        action={onAdd ? (
          <button
            onClick={onAdd}
            className="h-9 px-5 text-[13px] font-medium bg-[#007AFF] text-white rounded-xl hover:bg-[#0051D4] transition-colors"
          >
            タスクを追加
          </button>
        ) : undefined}
      />
    )
  }

  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        <FilterChip label="すべて" active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')} />
        {categories.map(cat => (
          <FilterChip
            key={cat}
            label={TASK_CATEGORY_LABELS[cat]}
            active={categoryFilter === cat}
            onClick={() => setCategoryFilter(cat)}
            dot={CATEGORY_COLORS[cat]}
          />
        ))}
      </div>

      {/* Active tasks grouped by priority */}
      {sorted.length === 0 && sortedDone.length > 0 && (
        <p className="text-[13px] text-[#8E8E93] text-center py-4">未完了タスクはありません</p>
      )}

      {sorted.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden divide-y divide-[#F2F2F7]">
          {sorted.map((task, idx) => {
            const p = taskPriority(task, today)
            const prevP = idx > 0 ? taskPriority(sorted[idx - 1], today) : -1
            const showGroup = p !== prevP && p <= 4 && priorityLabel[p]
            return (
              <TaskRow
                key={task.id}
                task={task}
                today={today}
                priority={p}
                groupLabel={showGroup ? priorityLabel[p] : undefined}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleDone={onToggleDone}
              />
            )
          })}
        </div>
      )}

      {/* Done section */}
      {sortedDone.length > 0 && (
        <div>
          <button
            onClick={() => setShowDone(!showDone)}
            className="flex items-center gap-2 text-[12px] text-[#8E8E93] hover:text-[#3C3C43] transition-colors mb-2"
          >
            <svg
              width="10" height="10" viewBox="0 0 16 16" fill="currentColor"
              className={`transition-transform ${showDone ? 'rotate-90' : ''}`}
            >
              <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
            完了・不要（{sortedDone.length}件）
          </button>
          {showDone && (
            <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden divide-y divide-[#F2F2F7] opacity-60">
              {sortedDone.map(task => (
                <TaskRow key={task.id} task={task} today={today} priority={100} onEdit={onEdit} onDelete={onDelete} onToggleDone={onToggleDone} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick, dot }: {
  label: string; active: boolean; onClick: () => void; dot?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 shrink-0 text-[12px] px-3 py-1 rounded-full border transition-colors ${
        active
          ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
          : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:bg-[#F2F2F7]'
      }`}
    >
      {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />}
      {label}
    </button>
  )
}

function TaskRow({
  task, today, priority, groupLabel, onEdit, onDelete, onToggleDone,
}: {
  task: Task
  today: Date
  priority: number
  groupLabel?: { label: string; color: string }
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
  onToggleDone: (t: Task) => void
}) {
  const isDone = task.status === 'done' || task.status === 'unnecessary'
  const isOverdue = priority === 0
  const isToday = priority === 1
  const categoryColor = CATEGORY_COLORS[task.category]

  return (
    <>
      {groupLabel && (
        <div className="px-3 py-1.5 bg-[#F9F9FB] border-b border-[#F2F2F7]">
          <span className="text-[11px] font-semibold" style={{ color: groupLabel.color }}>
            {groupLabel.label}
          </span>
        </div>
      )}
      <div className={`flex items-center gap-3 px-3 py-3 ${isOverdue ? 'bg-[#FFF8F7]' : isToday ? 'bg-[#FFFBF0]' : ''}`}>
        {/* Complete toggle */}
        <button
          onClick={() => onToggleDone(task)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            isDone
              ? 'bg-[#34C759] border-[#34C759] text-white'
              : isOverdue
              ? 'border-[#FF3B30] hover:bg-[#FF3B30]/10'
              : isToday
              ? 'border-[#FF9500] hover:bg-[#FF9500]/10'
              : 'border-[#C6C6C8] hover:border-[#007AFF]'
          }`}
        >
          {isDone && (
            <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
          )}
        </button>

        {/* Category dot */}
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: categoryColor }} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[13px] font-medium ${isDone ? 'line-through text-[#C6C6C8]' : 'text-[#1D1D1F]'}`}>
              {task.title}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
            >
              {TASK_CATEGORY_LABELS[task.category]}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {task.assignee && (
              <span className="text-[11px] text-[#8E8E93]">{task.assignee}</span>
            )}
            {task.dueDate && (
              <span className={`text-[11px] font-medium ${isOverdue ? 'text-[#FF3B30]' : isToday ? 'text-[#FF9500]' : 'text-[#8E8E93]'}`}>
                {isOverdue ? '⚠ ' : ''}期限 {formatDate(task.dueDate)}
              </span>
            )}
            {task.status !== 'todo' && (
              <span className="text-[11px] text-[#8E8E93]">{TASK_STATUS_LABELS[task.status]}</span>
            )}
          </div>
          {task.memo && !isDone && (
            <p className="text-[11px] text-[#8E8E93] mt-0.5 truncate">{task.memo}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 flex items-center justify-center text-[#C6C6C8] hover:text-[#007AFF] hover:bg-[#EBF5FF] rounded-lg transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.146.854a.5.5 0 0 1 .707 0l2.293 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="w-7 h-7 flex items-center justify-center text-[#C6C6C8] hover:text-[#FF3B30] hover:bg-[#FFF0EE] rounded-lg transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1H14.5a1 1 0 0 1 0 2z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
