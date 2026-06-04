'use client'
import { useState } from 'react'
import type { Task, TaskCategory } from '@/lib/types'
import { TASK_CATEGORY_LABELS } from '@/lib/types'
import { TaskStatusBadge, TaskCategoryBadge } from '@/components/ui/Badge'
import { Button, IconButton } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate, isDateNear, isDatePast } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
  onAdd: () => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleDone: (task: Task) => void
}

export function TaskList({ tasks, onAdd, onEdit, onDelete, onToggleDone }: TaskListProps) {
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all')
  const [showDone, setShowDone] = useState(false)

  const categories = Array.from(new Set(tasks.map(t => t.category)))

  const active = tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary')
  const done = tasks.filter(t => t.status === 'done' || t.status === 'unnecessary')

  const filterTasks = (list: Task[]) =>
    categoryFilter === 'all' ? list : list.filter(t => t.category === categoryFilter)

  const sortedActive = [...filterTasks(active)].sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate.localeCompare(b.dueDate)
  })
  const sortedDone = filterTasks(done)

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="✓"
        title="タスクがまだありません"
        description="撮影準備に必要なタスクを追加できます。車両、ケータリング、撮影許可などを登録しておくと便利です。"
        action={
          <Button onClick={onAdd}>タスクを追加</Button>
        }
      />
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`h-7 px-3 text-xs rounded-full border transition-colors ${categoryFilter === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            すべて
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`h-7 px-3 text-xs rounded-full border transition-colors ${categoryFilter === cat ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {TASK_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={onAdd}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
          </svg>
          タスク追加
        </Button>
      </div>

      {/* Active tasks */}
      {sortedActive.length === 0 && sortedDone.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">このカテゴリにタスクはありません</p>
      ) : (
        <div className="space-y-2">
          {sortedActive.map(task => (
            <TaskRow key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggleDone={onToggleDone} />
          ))}
        </div>
      )}

      {/* Done tasks */}
      {sortedDone.length > 0 && (
        <div>
          <button
            onClick={() => setShowDone(!showDone)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-2"
          >
            <svg
              width="12" height="12" viewBox="0 0 16 16" fill="currentColor"
              className={`transition-transform ${showDone ? 'rotate-90' : ''}`}
            >
              <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
            完了・不要（{sortedDone.length}件）
          </button>
          {showDone && (
            <div className="space-y-2 opacity-60">
              {sortedDone.map(task => (
                <TaskRow key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggleDone={onToggleDone} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TaskRow({
  task,
  onEdit,
  onDelete,
  onToggleDone,
}: {
  task: Task
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
  onToggleDone: (t: Task) => void
}) {
  const isDone = task.status === 'done' || task.status === 'unnecessary'
  const isNear = !isDone && isDateNear(task.dueDate)
  const isPast = !isDone && isDatePast(task.dueDate)

  return (
    <div className={`flex items-start gap-3 p-3 bg-white rounded-xl border transition-colors ${isPast ? 'border-red-200 bg-red-50/30' : isNear ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'}`}>
      <button
        onClick={() => onToggleDone(task)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-blue-400'}`}
      >
        {isDone && (
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
            {task.title}
          </span>
          <TaskCategoryBadge category={task.category} />
          <TaskStatusBadge status={task.status} />
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {task.assignee && (
            <span className="text-xs text-slate-500">{task.assignee}</span>
          )}
          {task.dueDate && (
            <span className={`text-xs font-medium ${isPast ? 'text-red-600' : isNear ? 'text-amber-600' : 'text-slate-500'}`}>
              {isPast ? '⚠️ ' : isNear ? '⏰ ' : ''}期限：{formatDate(task.dueDate)}
            </span>
          )}
        </div>
        {task.memo && (
          <p className="text-xs text-slate-500 mt-1 truncate">{task.memo}</p>
        )}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <IconButton title="編集" onClick={() => onEdit(task)}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.146.854a.5.5 0 0 1 .707 0l2.293 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z" />
          </svg>
        </IconButton>
        <IconButton title="削除" onClick={() => onDelete(task.id)}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-red-400">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1H14.5a1 1 0 0 1 0 2zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
          </svg>
        </IconButton>
      </div>
    </div>
  )
}
