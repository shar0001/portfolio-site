'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { ProjectForm } from '@/components/projects/ProjectForm'
import type { ProjectStatus, Project } from '@/lib/types'
import { PROJECT_STATUS_LABELS } from '@/lib/types'

export default function HomePage() {
  const { state, dispatch } = useStore()
  const { addToast } = useToast()
  const [showNewModal, setShowNewModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const filtered = statusFilter === 'all'
    ? state.projects
    : state.projects.filter(p => p.status === statusFilter)

  const sorted = [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const handleCreate = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_PROJECT', payload: data })
    setShowNewModal(false)
    addToast('案件を作成しました')
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    dispatch({ type: 'DELETE_PROJECT', payload: deleteTarget.id })
    setDeleteTarget(null)
    addToast('案件を削除しました')
  }

  const statusCounts = state.projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {} as Record<ProjectStatus, number>)

  const hasProjects = state.projects.length > 0

  return (
    <div className="min-h-screen bg-[#F2F2F7]">

      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F2F2F7]/90 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#007AFF] rounded-[9px] flex items-center justify-center shadow-[0_2px_6px_rgba(0,122,255,0.4)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
            </div>
            <h1 className="text-[18px] font-bold tracking-tight text-[#1D1D1F]">ロケボード</h1>
          </div>
          {hasProjects && (
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 h-9 px-4 bg-[#007AFF] text-white text-[14px] font-semibold rounded-full hover:bg-[#0062CC] active:scale-[0.96] transition-all shadow-[0_2px_6px_rgba(0,122,255,0.35)]"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
              </svg>
              新規案件
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-16">

        {/* ── Empty State ──────────────────────────────────────────── */}
        {!hasProjects && (
          <div className="flex flex-col items-center text-center pt-20 pb-8">
            <div className="w-20 h-20 bg-[#007AFF]/10 rounded-[22px] flex items-center justify-center mb-5">
              <svg width="36" height="36" viewBox="0 0 16 16" fill="#007AFF">
                <path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
            </div>
            <h2 className="text-[24px] font-bold text-[#1D1D1F] mb-2">最初の案件を作成</h2>
            <p className="text-[15px] text-[#8E8E93] mb-8 max-w-xs leading-relaxed">
              ロケ地候補・候補日・タスクを一か所で管理できます。
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="h-14 px-8 bg-[#007AFF] text-white text-[17px] font-semibold rounded-[14px] hover:bg-[#0062CC] active:scale-[0.97] transition-all shadow-[0_4px_14px_rgba(0,122,255,0.4)]"
            >
              案件を作成する
            </button>
          </div>
        )}

        {/* ── Summary Strip ────────────────────────────────────────── */}
        {hasProjects && (
          <div className="grid grid-cols-4 gap-2.5 mb-6">
            {[
              { label: '進行中', value: state.projects.filter(p => !['shot','archived'].includes(p.status)).length, color: '#007AFF', bg: '#EBF5FF' },
              { label: '仮キープ', value: state.locations.filter(l => l.status === 'hold').length, color: '#AF52DE', bg: '#F5EEFF' },
              { label: '返信待ち', value: state.locations.filter(l => l.status === 'waiting').length, color: '#FF9500', bg: '#FFF5E5' },
              { label: '未タスク', value: state.tasks.filter(t => t.status === 'todo').length, color: '#3C3C43', bg: '#F2F2F7' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-[12px] border border-[#E5E5EA] p-3 flex flex-col items-center gap-1 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <span className="text-[22px] font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[10px] font-medium text-[#8E8E93] text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter Pills ─────────────────────────────────────────── */}
        {hasProjects && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-0.5">
            <FilterPill
              label="すべて"
              count={state.projects.length}
              active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            />
            {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[])
              .filter(s => statusCounts[s])
              .map(s => (
                <FilterPill
                  key={s}
                  label={PROJECT_STATUS_LABELS[s]}
                  count={statusCounts[s]}
                  active={statusFilter === s}
                  onClick={() => setStatusFilter(s)}
                />
              ))}
          </div>
        )}

        {/* ── Project List ─────────────────────────────────────────── */}
        {hasProjects && sorted.length === 0 && (
          <p className="text-center text-[14px] text-[#8E8E93] py-16">
            このフィルターに該当する案件はありません
          </p>
        )}

        {sorted.length > 0 && (
          <div className="space-y-3">
            {sorted.map(project => (
              <div key={project.id} className="relative group">
                <ProjectCard
                  project={project}
                  locations={state.locations.filter(l => l.projectId === project.id)}
                  tasks={state.tasks.filter(t => t.projectId === project.id)}
                />
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full text-[#C6C6C8] hover:text-[#FF3B30] hover:bg-[#FFF0EE] transition-colors opacity-0 group-hover:opacity-100"
                  title="案件を削除"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1H14.5a1 1 0 0 1 0 2z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="新規案件を作成" size="lg">
        <ProjectForm onSubmit={handleCreate} onCancel={() => setShowNewModal(false)} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="案件を削除しますか？"
        message={`「${deleteTarget?.title}」を削除すると、関連するロケ地とタスクもすべて削除されます。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

function FilterPill({
  label, count, active, onClick,
}: {
  label: string; count: number; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 shrink-0 h-8 px-3.5 text-[13px] font-medium rounded-full transition-all ${
        active
          ? 'bg-[#1D1D1F] text-white shadow-[0_1px_4px_rgba(0,0,0,0.15)]'
          : 'bg-white text-[#3C3C43] border border-[#E5E5EA] hover:bg-[#F7F7F7]'
      }`}
    >
      {label}
      <span className={`text-[11px] ${active ? 'text-white/60' : 'text-[#8E8E93]'}`}>{count}</span>
    </button>
  )
}
