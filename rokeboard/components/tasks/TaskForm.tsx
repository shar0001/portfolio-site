'use client'
import { useState } from 'react'
import type { Task, TaskCategory, TaskStatus } from '@/lib/types'
import { TASK_CATEGORY_LABELS, TASK_STATUS_LABELS } from '@/lib/types'
import { Input, Textarea, Select, DateField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'

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
    if (!title.trim()) {
      setError('タスク名は必須です')
      return
    }
    setError('')
    onSubmit({ title: title.trim(), category, assignee, dueDate, status, memo })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <Input
        label="タスク名"
        required
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="例：機材車（2tトラック）手配"
        error={error}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select label="カテゴリ" value={category} onChange={e => setCategory(e.target.value as TaskCategory)}>
          {(Object.keys(TASK_CATEGORY_LABELS) as TaskCategory[]).map(c => (
            <option key={c} value={c}>{TASK_CATEGORY_LABELS[c]}</option>
          ))}
        </Select>
        <Select label="ステータス" value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
          {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map(s => (
            <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="担当者"
          value={assignee}
          onChange={e => setAssignee(e.target.value)}
          placeholder="例：田中 美咲"
        />
        <DateField
          label="期限"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>
      <Textarea
        label="メモ"
        value={memo}
        onChange={e => setMemo(e.target.value)}
        placeholder="補足メモ"
        rows={2}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          キャンセル
        </Button>
        <Button type="submit" className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
