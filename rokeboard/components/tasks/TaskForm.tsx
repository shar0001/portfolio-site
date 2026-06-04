'use client'
import { useState } from 'react'
import type { Task, TaskCategory, TaskStatus } from '@/lib/types'
import { TASK_CATEGORY_LABELS, TASK_STATUS_LABELS } from '@/lib/types'

type TaskFormData = Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>

interface TaskFormProps {
  initial?: Partial<Task>
  onSubmit: (data: TaskFormData) => void
  onCancel: () => void
  submitLabel?: string
}

export function TaskForm({ initial, onSubmit, onCancel, submitLabel = '追加する' }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState<TaskCategory>(initial?.category ?? 'other')
  const [assignee, setAssignee] = useState(initial?.assignee ?? '')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'todo')
  const [memo, setMemo] = useState(initial?.memo ?? '')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('タスク名を入力してください'); return }
    setError('')
    onSubmit({ title: title.trim(), category, assignee, dueDate, status, memo })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex-1 px-5 py-5 space-y-6">

        {/* タスク名 */}
        <div>
          <p className="text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2 px-1">
            タスク名<span className="text-[#FF3B30] ml-0.5">*</span>
          </p>
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="例：機材車（2tトラック）手配"
            className={`ios-input ${error ? 'border-[#FF3B30]' : ''}`}
          />
          {error && <p className="text-[12px] text-[#FF3B30] mt-1.5">{error}</p>}
        </div>

        {/* 詳細 */}
        <div>
          <p className="text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2 px-1">詳細</p>
          <div className="bg-white rounded-[12px] border border-[#E5E5EA] overflow-hidden divide-y divide-[#F2F2F7]">
            <LabelRow label="カテゴリ">
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="ios-inline-select"
              >
                {(Object.keys(TASK_CATEGORY_LABELS) as TaskCategory[]).map(c => (
                  <option key={c} value={c}>{TASK_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </LabelRow>
            <LabelRow label="ステータス">
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="ios-inline-select"
              >
                {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map(s => (
                  <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </LabelRow>
            <LabelRow label="担当者">
              <input
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                placeholder="例：田中 美咲"
                className="ios-inline-input"
              />
            </LabelRow>
            <LabelRow label="期限" last>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="ios-inline-input"
              />
            </LabelRow>
          </div>
        </div>

        {/* メモ */}
        <div>
          <p className="text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2 px-1">メモ</p>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="補足メモ"
            rows={3}
            className="ios-textarea"
          />
        </div>

      </div>

      {/* Sticky footer */}
      <div className="shrink-0 px-5 py-4 border-t border-[#E5E5EA] flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 rounded-[12px] bg-[#F2F2F7] text-[#007AFF] text-[15px] font-semibold hover:bg-[#E5E5EA] transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="flex-1 h-12 rounded-[12px] bg-[#007AFF] text-white text-[15px] font-semibold hover:bg-[#0062CC] active:bg-[#0051D4] transition-colors shadow-[0_2px_8px_rgba(0,122,255,0.35)]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function LabelRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 h-12">
      <span className="w-20 shrink-0 text-[14px] font-medium text-[#1D1D1F]">{label}</span>
      <div className="flex-1 min-w-0 flex justify-end">{children}</div>
    </div>
  )
}
