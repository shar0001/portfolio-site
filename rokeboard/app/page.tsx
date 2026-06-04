'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { EmptyState } from '@/components/ui/EmptyState'
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

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5EA]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#007AFF] rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                <path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
            </div>
            <span className="font-bold text-[#1D1D1F] text-[17px]">ロケボード</span>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="h-9 px-4 bg-[#007AFF] text-white text-[13px] font-medium rounded-xl hover:bg-[#0051D4] transition-colors flex items-center gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
            </svg>
            <span className="hidden sm:inline">新規案件</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Summary bar */}
        {state.projects.length > 0 && (
          <div className="mb-6 grid grid-cols-4 gap-3">
            {[
              { label: '進行中', count: state.projects.filter(p => !['shot','archived'].includes(p.status)).length, color: '#007AFF' },
              { label: '仮キープ', count: state.locations.filter(l => l.status === 'hold').length, color: '#AF52DE' },
              { label: '返信待ち', count: state.locations.filter(l => l.status === 'waiting').length, color: '#FF9500' },
              { label: '未タスク', count: state.tasks.filter(t => t.status === 'todo').length, color: '#3C3C43' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[#E5E5EA] p-3 text-center">
                <div className="text-xl font-bold leading-none" style={{ color: s.color }}>{s.count}</div>
                <div className="text-[11px] text-[#8E8E93] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter bar */}
        {state.projects.length > 0 && (
          <div className="mb-4 flex gap-1.5 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`h-7 px-3 text-[12px] font-medium rounded-full border transition-colors ${statusFilter === 'all' ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]' : 'bg-white text-[#3C3C43] border-[#E5E5EA] hover:bg-[#F2F2F7]'}`}
            >
              すべて（{state.projects.length}）
            </button>
            {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[])
              .filter(s => statusCounts[s])
              .map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`h-7 px-3 text-[12px] font-medium rounded-full border transition-colors ${statusFilter === s ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]' : 'bg-white text-[#3C3C43] border-[#E5E5EA] hover:bg-[#F2F2F7]'}`}
                >
                  {PROJECT_STATUS_LABELS[s]}（{statusCounts[s]}）
                </button>
              ))}
          </div>
        )}

        {/* Project list */}
        {state.projects.length === 0 ? (
          <EmptyState
            icon="🎬"
            title="案件がまだありません"
            description="新しい案件を作成して、ロケ地候補の管理を始めましょう。"
            action={
              <button
                onClick={() => setShowNewModal(true)}
                className="h-11 px-6 bg-[#007AFF] text-white text-[15px] font-semibold rounded-[12px] hover:bg-[#0062CC] active:bg-[#0051D4] transition-colors"
              >
                最初の案件を作成
              </button>
            }
          />
        ) : sorted.length === 0 ? (
          <p className="text-center text-[13px] text-[#8E8E93] py-12">このフィルターに該当する案件はありません</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map(project => (
              <div key={project.id} className="relative group">
                <ProjectCard
                  project={project}
                  locations={state.locations.filter(l => l.projectId === project.id)}
                  tasks={state.tasks.filter(t => t.projectId === project.id)}
                />
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-[8px] text-[#C6C6C8] hover:text-[#FF3B30] hover:bg-[#FFF0EE] transition-colors opacity-0 group-hover:opacity-100"
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

      {/* New project modal */}
      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="新規案件を作成" size="lg">
        <ProjectForm onSubmit={handleCreate} onCancel={() => setShowNewModal(false)} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="案件を削除しますか？"
        message={`「${deleteTarget?.title}」を削除すると、関連するロケ地とタスクもすべて削除されます。この操作は元に戻せません。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
