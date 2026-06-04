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
import { LocationTableView } from '@/components/locations/LocationTableView'
import { LocationRightPanel } from '@/components/locations/LocationRightPanel'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { DateMatrix } from '@/components/dates/DateMatrix'
import { ShareTab } from '@/components/share/ShareTab'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProjectStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { KPIStrip } from '@/components/dashboard/KPIStrip'
import { ActionItems } from '@/components/dashboard/ActionItems'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import type { MobileSection } from '@/components/layout/BottomNav'
import { LOCATION_STATUS_LABELS } from '@/lib/types'
import type { LocationStatus, Location, Task, DateAvailability } from '@/lib/types'

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F2F7]" />}>
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

  // Layout state
  const [mobileSection, setMobileSection] = useState<MobileSection>('overview')
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const selectedLocation = locations.find(l => l.id === selectedLocationId) ?? null

  // Location view
  const [locationView, setLocationView] = useState<'cards' | 'table'>('cards')
  const [statusFilter, setStatusFilter] = useState<LocationStatus | 'all'>('all')
  const [taskFilter, setTaskFilter] = useState<'incomplete' | 'overdue' | null>(null)

  // Modals
  const [showEditProject, setShowEditProject] = useState(false)
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [editLocation, setEditLocation] = useState<Location | null>(null)
  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)

  // Derived
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const incompleteTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary').length

  const filteredLocations = statusFilter === 'all'
    ? locations
    : locations.filter(l => l.status === statusFilter)

  const filteredTasks = taskFilter === null
    ? tasks
    : taskFilter === 'overdue'
    ? tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary' && t.dueDate && new Date(t.dueDate) < today)
    : tasks.filter(t => t.status !== 'done' && t.status !== 'unnecessary')

  // ── Handlers ────────────────────────────────────────────────

  const handleUpdateProject = (data: Omit<typeof project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!project) return
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
    if (selectedLocationId === deleteLocation.id) setSelectedLocationId(null)
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
      payload: { id: locationId, dateAvailability: { ...loc.dateAvailability, [dateId]: value } },
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

  const handleSectionClick = (section: string) => {
    setMobileSection(section as MobileSection)
    const el = document.getElementById(`section-${section}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Not found ────────────────────────────────────────────────

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <EmptyState
          icon="🔍"
          title="案件が見つかりません"
          action={<Link href="/"><Button variant="secondary">ホームに戻る</Button></Link>}
        />
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────

  const isVisible = (section: MobileSection) =>
    mobileSection === 'overview' || mobileSection === section

  return (
    <div className="flex h-dvh overflow-hidden bg-[#F2F2F7]">

      {/* ── Left Sidebar (PC only) ──────────────────────────── */}
      <div className="hidden lg:block shrink-0">
        <AppSidebar
          project={project}
          locations={locations}
          tasks={tasks}
          activeSection={mobileSection}
          onSectionClick={handleSectionClick}
        />
      </div>

      {/* ── Center: Main Content ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Sticky Project Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E5E5EA] shrink-0">
          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-3 px-4 h-14">
            <Link href="/" className="text-[#007AFF] hover:text-[#0051D4] transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-[#1D1D1F] truncate">{project.title}</p>
              {project.clientName && <p className="text-[12px] text-[#8E8E93] truncate">{project.clientName}</p>}
            </div>
            <ProjectStatusBadge status={project.status} />
            <button
              onClick={() => setShowEditProject(true)}
              className="h-7 px-3 text-[12px] font-medium text-[#007AFF] bg-[#EBF5FF] rounded-lg hover:bg-[#D4EAFF] transition-colors shrink-0"
            >
              編集
            </button>
          </div>

          {/* PC */}
          <div className="hidden lg:flex items-center gap-4 px-6 h-14">
            <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
              <h1 className="text-[17px] font-semibold text-[#1D1D1F]">{project.title}</h1>
              <ProjectStatusBadge status={project.status} />
              {project.clientName && <span className="text-[13px] text-[#8E8E93]">{project.clientName}</span>}
            </div>
            {project.candidateDates.length > 0 && (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[12px] text-[#8E8E93]">候補日</span>
                {[...project.candidateDates]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map(d => {
                    const dt = new Date(d.date)
                    const dow = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()]
                    return (
                      <span key={d.id} className="text-[12px] text-[#6E6E73] bg-[#F2F2F7] px-2 py-0.5 rounded-lg border border-[#E5E5EA]">
                        {dt.getMonth() + 1}/{dt.getDate()}({dow})
                      </span>
                    )
                  })}
              </div>
            )}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowEditProject(true)}
                className="h-8 px-4 text-[13px] font-medium text-[#3C3C43] bg-[#F2F2F7] rounded-lg hover:bg-[#E5E5EA] transition-colors"
              >
                編集
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-20 lg:pb-8">

          {/* KPI Strip */}
          <div className="px-4 lg:px-5 pt-4">
            <KPIStrip
              locations={locations}
              tasks={tasks}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
              onTaskFilter={setTaskFilter}
              taskFilter={taskFilter}
            />
          </div>

          {/* Action Items */}
          <div className={`px-4 lg:px-5 pt-3 ${!isVisible('overview') ? 'hidden lg:block' : ''}`}>
            <ActionItems
              locations={locations}
              tasks={tasks}
              today={today}
              candidateDates={project.candidateDates}
            />
          </div>

          {/* ── Locations Section ─────────────────────────── */}
          <div
            id="section-locations"
            className={`px-4 lg:px-5 pt-5 ${!isVisible('locations') ? 'hidden lg:block' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[16px] font-semibold text-[#1D1D1F]">ロケ地候補</h2>
                <span className="text-[12px] text-[#8E8E93] bg-[#F2F2F7] px-2 py-0.5 rounded-full">
                  {locations.length}件
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="flex rounded-lg border border-[#E5E5EA] overflow-hidden">
                  <button
                    onClick={() => setLocationView('cards')}
                    className={`px-2.5 py-1.5 transition-colors ${locationView === 'cards' ? 'bg-[#007AFF] text-white' : 'bg-white text-[#8E8E93] hover:bg-[#F2F2F7]'}`}
                    title="カード表示"
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setLocationView('table')}
                    className={`px-2.5 py-1.5 transition-colors border-l border-[#E5E5EA] ${locationView === 'table' ? 'bg-[#007AFF] text-white' : 'bg-white text-[#8E8E93] hover:bg-[#F2F2F7]'}`}
                    title="テーブル表示"
                  >
                    <TableIcon />
                  </button>
                </div>
                <button
                  onClick={() => setShowAddLocation(true)}
                  className="flex items-center gap-1.5 h-8 px-3.5 text-[13px] font-medium bg-[#007AFF] text-white rounded-xl hover:bg-[#0051D4] transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                  </svg>
                  追加
                </button>
              </div>
            </div>

            {/* Status filter chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
              {(['all', 'none', 'inquired', 'waiting', 'hold', 'confirmed', 'ng', 'pending'] as const).map(s => {
                const count = s === 'all' ? locations.length : locations.filter(l => l.status === s).length
                if (s !== 'all' && !count) return null
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`flex items-center gap-1 text-[12px] px-3 py-1 rounded-full border whitespace-nowrap transition-colors shrink-0 ${
                      statusFilter === s
                        ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                        : 'bg-white text-[#6E6E73] border-[#E5E5EA] hover:bg-[#F2F2F7]'
                    }`}
                  >
                    {s === 'all' ? 'すべて' : LOCATION_STATUS_LABELS[s]}
                    <span className={`text-[10px] ${statusFilter === s ? 'text-white/60' : 'text-[#8E8E93]'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {filteredLocations.length === 0 ? (
              <EmptyState
                icon="📍"
                title={statusFilter !== 'all' ? 'このステータスのロケ地はありません' : 'ロケ地候補がまだありません'}
                description={statusFilter !== 'all' ? 'フィルターを変更してみてください' : 'まずは問い合わせ予定のロケ地を1件追加しましょう。ロケ地名だけでも登録できます。'}
                action={statusFilter === 'all' ? (
                  <button
                    onClick={() => setShowAddLocation(true)}
                    className="h-9 px-5 text-[13px] font-medium bg-[#007AFF] text-white rounded-xl hover:bg-[#0051D4] transition-colors"
                  >
                    ロケ地を追加
                  </button>
                ) : undefined}
              />
            ) : locationView === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredLocations.map(loc => (
                  <LocationCard
                    key={loc.id}
                    location={loc}
                    isSelected={selectedLocationId === loc.id}
                    onSelect={() => setSelectedLocationId(selectedLocationId === loc.id ? null : loc.id)}
                    onEdit={() => setEditLocation(loc)}
                    onDelete={() => setDeleteLocation(loc)}
                    onStatusChange={status => handleLocationStatusChange(loc.id, status)}
                  />
                ))}
              </div>
            ) : (
              <LocationTableView
                locations={filteredLocations}
                selectedId={selectedLocationId}
                onSelect={id => setSelectedLocationId(selectedLocationId === id ? null : id)}
                onEdit={setEditLocation}
                onDelete={setDeleteLocation}
                onStatusChange={handleLocationStatusChange}
              />
            )}
          </div>

          {/* ── Date Matrix ──────────────────────────────── */}
          <div
            id="section-dates"
            className={`px-4 lg:px-5 pt-6 ${!isVisible('dates') ? 'hidden lg:block' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] font-semibold text-[#1D1D1F]">候補日可否</h2>
            </div>
            <DateMatrix
              candidateDates={project.candidateDates}
              locations={locations}
              onUpdate={handleDateAvailabilityUpdate}
            />
          </div>

          {/* ── Tasks ────────────────────────────────────── */}
          <div
            id="section-tasks"
            className={`px-4 lg:px-5 pt-6 ${!isVisible('tasks') ? 'hidden lg:block' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[16px] font-semibold text-[#1D1D1F]">タスク</h2>
                {incompleteTasks > 0 && (
                  <span className="text-[12px] text-[#FF9500] bg-[#FFF7EB] border border-[#FFD9A0] px-2 py-0.5 rounded-full font-medium">
                    未完了 {incompleteTasks}件
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-1.5 h-8 px-3.5 text-[13px] font-medium bg-[#007AFF] text-white rounded-xl hover:bg-[#0051D4] transition-colors"
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                </svg>
                追加
              </button>
            </div>
            <TaskList
              tasks={filteredTasks}
              onAdd={() => setShowAddTask(true)}
              onEdit={setEditTask}
              onDelete={setDeleteTaskId}
              onToggleDone={handleToggleTaskDone}
            />
          </div>

          {/* ── Share (mobile only — PC has right panel) ── */}
          <div
            id="section-share"
            className={`px-4 pt-6 lg:hidden ${mobileSection !== 'share' ? 'hidden' : ''}`}
          >
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] mb-3">共有・文面生成</h2>
            <ShareTab project={project} locations={locations} />
          </div>

        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav
          active={mobileSection}
          onChange={setMobileSection}
          locationCount={locations.length}
          taskCount={incompleteTasks}
        />

      </div>

      {/* ── Right Detail Panel (PC) ─────────────────────── */}
      {selectedLocation && (
        <div className="hidden lg:flex w-[340px] xl:w-[380px] flex-col bg-white border-l border-[#E5E5EA] shrink-0">
          <LocationRightPanel
            location={selectedLocation}
            project={project}
            allLocations={locations}
            onClose={() => setSelectedLocationId(null)}
            onEdit={() => { setEditLocation(selectedLocation); setSelectedLocationId(null) }}
            onStatusChange={status => handleLocationStatusChange(selectedLocation.id, status)}
          />
        </div>
      )}

      {/* ── Mobile Bottom Sheet ─────────────────────────── */}
      {selectedLocation && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedLocationId(null)} />
          <div className="relative bg-white rounded-t-2xl shadow-2xl animate-slide-up" style={{ maxHeight: '90dvh', display: 'flex', flexDirection: 'column' }}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-[#C6C6C8] rounded-full" />
            </div>
            <div className="flex-1 overflow-hidden">
              <LocationRightPanel
                location={selectedLocation}
                project={project}
                allLocations={locations}
                onClose={() => setSelectedLocationId(null)}
                onEdit={() => { setEditLocation(selectedLocation); setSelectedLocationId(null) }}
                onStatusChange={status => handleLocationStatusChange(selectedLocation.id, status)}
                isBottomSheet
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────── */}

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

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z" />
    </svg>
  )
}

function TableIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
    </svg>
  )
}
