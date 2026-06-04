'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useStore, useProject, useProjectLocations, useProjectTasks } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { LocationCard } from '@/components/locations/LocationCard'
import { LocationForm } from '@/components/locations/LocationForm'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { DateTable } from '@/components/dates/DateTable'
import { ShareTab } from '@/components/share/ShareTab'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProjectStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import type { LocationStatus, Location, Task, DateAvailability } from '@/lib/types'

type Tab = 'overview' | 'locations' | 'dates' | 'tasks' | 'share'

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ProjectDetail />
    </Suspense>
  )
}

function ProjectDetail() {
  const id = useSearchParams().get('id') ?? ''
  const { dispatch } = useStore()
  const { addToast } = useToast()
  const project = useProject(id)
  const locations = useProjectLocations(id)
  const tasks = useProjectTasks(id)

  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // Modals
  const [showEditProject, setShowEditProject] = useState(false)
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [editLocation, setEditLocation] = useState<Location | null>(null)
  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <EmptyState
          icon="🔍"
          title="案件が見つかりません"
          action={<Link href="/"><Button variant="secondary">ホームに戻る</Button></Link>}
        />
      </div>
    )
  }

  // Stats
  const holdCount = locations.filter(l => l.status === 'hold').length
  const confirmedCount = locations.filter(l => l.status === 'confirmed').length
  const waitingCount = locations.filter(l => l.status === 'waiting').length
  const incompleteTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary').length

  // Handlers
  const handleUpdateProject = (data: Omit<typeof project, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, ...data } })
    setShowEditProject(false)
    addToast('案件を更新しました')
  }

  const handleAddLocation = (data: Omit<Location, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_LOCATION', payload: { ...data, projectId: id } })
    setShowAddLocation(false)
    addToast('ロケ地を追加しました')
  }

  const handleEditLocation = (data: Omit<Location, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    if (!editLocation) return
    dispatch({ type: 'UPDATE_LOCATION', payload: { id: editLocation.id, ...data } })
    setEditLocation(null)
    addToast('ロケ地を更新しました')
  }

  const handleDeleteLocation = () => {
    if (!deleteLocation) return
    dispatch({ type: 'DELETE_LOCATION', payload: deleteLocation.id })
    setDeleteLocation(null)
    addToast('ロケ地を削除しました')
  }

  const handleLocationStatusChange = (locationId: string, status: LocationStatus) => {
    dispatch({ type: 'UPDATE_LOCATION', payload: { id: locationId, status } })
    addToast('ステータスを変更しました')
  }

  const handleDateAvailabilityUpdate = (locationId: string, dateId: string, value: DateAvailability) => {
    const loc = locations.find(l => l.id === locationId)
    if (!loc) return
    dispatch({
      type: 'UPDATE_LOCATION',
      payload: {
        id: locationId,
        dateAvailability: { ...loc.dateAvailability, [dateId]: value },
      },
    })
  }

  const handleAddTask = (data: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: { ...data, projectId: id } })
    setShowAddTask(false)
    addToast('タスクを追加しました')
  }

  const handleEditTask = (data: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    if (!editTask) return
    dispatch({ type: 'UPDATE_TASK', payload: { id: editTask.id, ...data } })
    setEditTask(null)
    addToast('タスクを更新しました')
  }

  const handleDeleteTask = () => {
    if (!deleteTaskId) return
    dispatch({ type: 'DELETE_TASK', payload: deleteTaskId })
    setDeleteTaskId(null)
    addToast('タスクを削除しました')
  }

  const handleToggleTaskDone = (task: Task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, status: newStatus } })
    addToast(newStatus === 'done' ? '完了にしました' : '未着手に戻しました')
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'overview', label: '概要' },
    { id: 'locations', label: 'ロケ地', badge: locations.length },
    { id: 'dates', label: '候補日' },
    { id: 'tasks', label: 'タスク', badge: incompleteTasks || undefined },
    { id: 'share', label: '共有' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="h-14 flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-slate-900 truncate">{project.title}</h1>
                <ProjectStatusBadge status={project.status} />
              </div>
              {project.clientName && (
                <p className="text-xs text-slate-500 truncate">{project.clientName}</p>
              )}
            </div>
            <Button size="sm" variant="secondary" onClick={() => setShowEditProject(true)}>
              編集
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 overflow-x-auto no-scrollbar pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700'
                }`}
              >
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-4 md:p-6 space-y-5 animate-fade-in">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'ロケ地候補', value: locations.length, color: 'text-blue-600', action: () => setActiveTab('locations') },
                { label: '仮キープ', value: holdCount, color: 'text-purple-600', action: () => setActiveTab('locations') },
                { label: 'ロケ地決定', value: confirmedCount, color: 'text-emerald-600', action: () => setActiveTab('locations') },
                { label: '未完了タスク', value: incompleteTasks, color: 'text-slate-600', action: () => setActiveTab('tasks') },
              ].map(s => (
                <button
                  key={s.label}
                  onClick={s.action}
                  className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-sm hover:border-slate-300 transition-all"
                >
                  <div className={`text-2xl font-bold leading-none ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1.5">{s.label}</div>
                </button>
              ))}
            </div>

            {/* Next action suggestions */}
            {(waitingCount > 0 || incompleteTasks > 0) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-amber-800">次にやるべきこと</p>
                {waitingCount > 0 && (
                  <button
                    onClick={() => setActiveTab('locations')}
                    className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900"
                  >
                    <span>⏳</span> 返信待ちのロケ地が {waitingCount}件 あります
                  </button>
                )}
                {incompleteTasks > 0 && (
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900"
                  >
                    <span>✓</span> 未完了タスクが {incompleteTasks}件 あります
                  </button>
                )}
              </div>
            )}

            {/* Project info */}
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              <div className="px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">案件情報</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <InfoRow label="撮影内容" value={project.shootDescription} />
                  <InfoRow label="クライアント" value={project.clientName} />
                  <InfoRow label="予算感" value={project.budget} />
                  <InfoRow label="担当PM" value={project.pmName} />
                  <InfoRow label="監督" value={project.directorName} />
                  <InfoRow
                    label="必要条件"
                    value={project.requirements}
                    className="md:col-span-2"
                  />
                </dl>
              </div>

              {/* Candidate dates */}
              {project.candidateDates.length > 0 && (
                <div className="px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900 mb-2">撮影候補日</h2>
                  <div className="flex flex-wrap gap-2">
                    {[...project.candidateDates]
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map(d => {
                        const dt = new Date(d.date)
                        const dow = ['日','月','火','水','木','金','土'][dt.getDay()]
                        return (
                          <span key={d.id} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                            {dt.getMonth() + 1}/{dt.getDate()}（{dow}）
                          </span>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Memo */}
              {project.memo && (
                <div className="px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900 mb-2">メモ</h2>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{project.memo}</p>
                </div>
              )}

              <div className="px-5 py-3">
                <p className="text-xs text-slate-400">最終更新：{formatDate(project.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <div className="p-4 md:p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {(['none','inquired','waiting','hold','confirmed','ng','pending'] as LocationStatus[]).map(s => {
                  const count = locations.filter(l => l.status === s).length
                  if (!count) return null
                  const colorMap: Record<string, string> = {
                    none: 'bg-slate-100 text-slate-600',
                    inquired: 'bg-blue-100 text-blue-700',
                    waiting: 'bg-amber-100 text-amber-700',
                    hold: 'bg-purple-100 text-purple-700',
                    confirmed: 'bg-emerald-100 text-emerald-700',
                    ng: 'bg-red-100 text-red-600',
                    pending: 'bg-stone-100 text-stone-600',
                  }
                  const labelMap: Record<string, string> = {
                    none: '未連絡', inquired: '問い合わせ済み', waiting: '返信待ち',
                    hold: '仮キープ', confirmed: '決定', ng: 'NG', pending: '保留',
                  }
                  return (
                    <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${colorMap[s]}`}>
                      {labelMap[s]} {count}
                    </span>
                  )
                })}
              </div>
              <Button size="sm" onClick={() => setShowAddLocation(true)}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                </svg>
                ロケ地追加
              </Button>
            </div>

            {locations.length === 0 ? (
              <EmptyState
                icon="📍"
                title="ロケ地候補がまだありません"
                description="まずは問い合わせ予定のロケ地を1件追加しましょう。ロケ地名だけでも登録できます。"
                action={<Button onClick={() => setShowAddLocation(true)}>ロケ地を追加</Button>}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map(loc => (
                  <LocationCard
                    key={loc.id}
                    location={loc}
                    onEdit={() => setEditLocation(loc)}
                    onDelete={() => setDeleteLocation(loc)}
                    onStatusChange={status => handleLocationStatusChange(loc.id, status)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dates Tab */}
        {activeTab === 'dates' && (
          <div className="animate-fade-in">
            <DateTable
              candidateDates={project.candidateDates}
              locations={locations}
              onUpdate={handleDateAvailabilityUpdate}
            />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="animate-fade-in">
            <TaskList
              tasks={tasks}
              onAdd={() => setShowAddTask(true)}
              onEdit={setEditTask}
              onDelete={setDeleteTaskId}
              onToggleDone={handleToggleTaskDone}
            />
          </div>
        )}

        {/* Share Tab */}
        {activeTab === 'share' && (
          <div className="animate-fade-in">
            <ShareTab project={project} locations={locations} />
          </div>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────────── */}

      <Modal open={showEditProject} onClose={() => setShowEditProject(false)} title="案件を編集" size="lg">
        <ProjectForm
          initial={project}
          onSubmit={handleUpdateProject}
          onCancel={() => setShowEditProject(false)}
          submitLabel="保存する"
        />
      </Modal>

      <Modal open={showAddLocation} onClose={() => setShowAddLocation(false)} title="ロケ地を追加" size="xl">
        <LocationForm onSubmit={handleAddLocation} onCancel={() => setShowAddLocation(false)} />
      </Modal>

      <Modal open={!!editLocation} onClose={() => setEditLocation(null)} title="ロケ地を編集" size="xl">
        {editLocation && (
          <LocationForm
            initial={editLocation}
            onSubmit={handleEditLocation}
            onCancel={() => setEditLocation(null)}
            submitLabel="保存する"
          />
        )}
      </Modal>

      <Modal open={showAddTask} onClose={() => setShowAddTask(false)} title="タスクを追加">
        <TaskForm onSubmit={handleAddTask} onCancel={() => setShowAddTask(false)} />
      </Modal>

      <Modal open={!!editTask} onClose={() => setEditTask(null)} title="タスクを編集">
        {editTask && (
          <TaskForm
            initial={editTask}
            onSubmit={handleEditTask}
            onCancel={() => setEditTask(null)}
            submitLabel="保存する"
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteLocation}
        title="ロケ地を削除しますか？"
        message={`「${deleteLocation?.name}」を削除します。この操作は元に戻せません。`}
        onConfirm={handleDeleteLocation}
        onCancel={() => setDeleteLocation(null)}
      />

      <ConfirmDialog
        open={!!deleteTaskId}
        title="タスクを削除しますか？"
        message="このタスクを削除します。この操作は元に戻せません。"
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteTaskId(null)}
      />
    </div>
  )
}

function InfoRow({
  label,
  value,
  className = '',
}: {
  label: string
  value?: string
  className?: string
}) {
  if (!value) return null
  return (
    <div className={className}>
      <dt className="text-xs text-slate-500 mb-0.5">{label}</dt>
      <dd className="text-sm text-slate-800">{value}</dd>
    </div>
  )
}
