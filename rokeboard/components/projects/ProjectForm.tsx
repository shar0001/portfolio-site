'use client'
import { useState } from 'react'
import type { Project, CandidateDate, ProjectStatus } from '@/lib/types'
import { PROJECT_STATUS_LABELS } from '@/lib/types'
import { Input, Textarea, Select, DateField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { generateId } from '@/lib/utils'

type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

interface ProjectFormProps {
  initial?: Partial<Project>
  onSubmit: (data: ProjectFormData) => void
  onCancel?: () => void
  submitLabel?: string
}

export function ProjectForm({ initial, onSubmit, onCancel, submitLabel = '作成する' }: ProjectFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [clientName, setClientName] = useState(initial?.clientName ?? '')
  const [shootDescription, setShootDescription] = useState(initial?.shootDescription ?? '')
  const [candidateDates, setCandidateDates] = useState<CandidateDate[]>(initial?.candidateDates ?? [])
  const [budget, setBudget] = useState(initial?.budget ?? '')
  const [requirements, setRequirements] = useState(initial?.requirements ?? '')
  const [pmName, setPmName] = useState(initial?.pmName ?? '')
  const [directorName, setDirectorName] = useState(initial?.directorName ?? '')
  const [memo, setMemo] = useState(initial?.memo ?? '')
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? 'preparing')
  const [newDate, setNewDate] = useState('')
  const [error, setError] = useState('')

  const addDate = () => {
    if (!newDate) return
    if (candidateDates.find(d => d.date === newDate)) return
    setCandidateDates(prev => [...prev, { id: generateId(), date: newDate }])
    setNewDate('')
  }

  const removeDate = (id: string) => {
    setCandidateDates(prev => prev.filter(d => d.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('案件名は必須です')
      return
    }
    setError('')
    onSubmit({
      title: title.trim(),
      clientName,
      shootDescription,
      shootDates: [],
      candidateDates,
      budget,
      requirements,
      pmName,
      directorName,
      memo,
      status,
    })
  }

  const sortedDates = [...candidateDates].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* 基本情報 */}
      <section className="space-y-4">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] pb-2.5 border-b border-[#E5E5EA]">基本情報</h3>
        <Input
          label="案件名"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="例：男性アイドル MV、コスメSNS広告、企業VP撮影"
          error={error}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="クライアント名"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            placeholder="例：スターレコード株式会社"
          />
          <Select
            label="ステータス"
            value={status}
            onChange={e => setStatus(e.target.value as ProjectStatus)}
          >
            {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map(s => (
              <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
            ))}
          </Select>
        </div>
        <Textarea
          label="撮影内容"
          value={shootDescription}
          onChange={e => setShootDescription(e.target.value)}
          placeholder="例：前向きで軽快な新曲のMV。屋外・自然光・開放感のあるロケーションを検討。"
          rows={3}
        />
      </section>

      {/* 撮影候補日 */}
      <section className="space-y-3">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] pb-2.5 border-b border-[#E5E5EA]">撮影候補日</h3>
        <div className="flex gap-2">
          <DateField
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="secondary" onClick={addDate} size="md" className="shrink-0">
            追加
          </Button>
        </div>
        {sortedDates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sortedDates.map(d => {
              const dt = new Date(d.date)
              const label = `${dt.getMonth() + 1}/${dt.getDate()}（${['日','月','火','水','木','金','土'][dt.getDay()]}）`
              return (
                <span key={d.id} className="inline-flex items-center gap-1.5 bg-[#007AFF]/10 text-[#0066CC] text-[13px] font-medium pl-3 pr-2 py-1 rounded-full border border-[#007AFF]/15">
                  {label}
                  <button type="button" onClick={() => removeDate(d.id)} className="text-[#007AFF]/50 hover:text-[#007AFF] text-[15px] leading-none">×</button>
                </span>
              )
            })}
          </div>
        )}
      </section>

      {/* 制作情報 */}
      <section className="space-y-4">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] pb-2.5 border-b border-[#E5E5EA]">制作情報</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="担当PM"
            value={pmName}
            onChange={e => setPmName(e.target.value)}
            placeholder="例：田中 美咲"
          />
          <Input
            label="監督"
            value={directorName}
            onChange={e => setDirectorName(e.target.value)}
            placeholder="例：鈴木 大輔"
          />
        </div>
        <Input
          label="予算感"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          placeholder="例：200万円、応相談"
        />
        <Textarea
          label="必要条件"
          value={requirements}
          onChange={e => setRequirements(e.target.value)}
          placeholder="例：夕景、控室あり、車両2台、音出し確認、雨天時の代替案"
          rows={2}
        />
        <Textarea
          label="メモ"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="自由メモ"
          rows={2}
        />
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            キャンセル
          </Button>
        )}
        <Button type="submit" className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
