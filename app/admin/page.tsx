'use client'
/**
 * /admin — Portfolio content editor
 *
 * All changes are saved to localStorage (key: "portfolio_draft").
 * To publish: click "Export JSON", copy the output, replace
 * the `defaultWorks` array in content/works.ts, then git push.
 *
 * To connect a real backend later:
 *   - Replace loadDraft() with a GET /api/works
 *   - Replace saveDraft() with a PATCH /api/works
 *   - The Work type stays the same — just swap the persistence layer
 */
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { defaultWorks, type Work, type WorkCategory, type MediaType } from '@/content/works'

const DRAFT_KEY = 'portfolio_draft'
type Tab = 'all' | WorkCategory

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadDraft(): Work[] {
  try {
    const s = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_KEY) : null
    return s ? (JSON.parse(s) as Work[]) : defaultWorks
  } catch {
    return defaultWorks
  }
}

function saveDraft(works: Work[]) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(works))
}

function newWork(): Work {
  return {
    id:          `work-${Date.now()}`,
    title:       'New Work',
    category:    'movie',
    year:        new Date().getFullYear().toString(),
    tag:         '',
    role:        '',
    tools:       [],
    description: '',
    mediaType:   'placeholder',
    visible:     false,
    featured:    false,
    order:       9999,
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 12px',
  fontFamily: 'var(--font-geist-mono)',
  fontSize: '13px',
  color: '#c0b8a0',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  outline: 'none',
  borderRadius: 0,
  WebkitAppearance: 'none',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 80,
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest mb-1.5" style={{ color: '#444' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function Toggle({
  label, value, onChange, color = '#c0b8a0',
}: {
  label: string; value: boolean; onChange: (v: boolean) => void; color?: string
}) {
  return (
    <div className="flex items-center justify-between py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="font-mono text-[10px]" style={{ color: '#555' }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative shrink-0"
        style={{
          width: 44, height: 24,
          borderRadius: 12,
          background: value ? `${color}30` : 'rgba(255,255,255,0.06)',
          transition: 'background 0.2s',
        }}
      >
        <span
          className="absolute top-1"
          style={{
            width: 16, height: 16,
            borderRadius: 8,
            background: value ? color : '#333',
            left: value ? 24 : 4,
            transition: 'left 0.2s, background 0.2s',
          }}
        />
      </button>
    </div>
  )
}

// ── Edit form ─────────────────────────────────────────────────────────────────

function EditForm({
  work,
  onSave,
  onDelete,
  onCancel,
}: {
  work: Work
  onSave: (w: Work) => void
  onDelete: (id: string) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Work>({ ...work })
  const [confirmDelete, setConfirmDelete] = useState(false)

  function set<K extends keyof Work>(key: K, value: Work[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: '#080807' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 h-14"
        style={{ background: '#0a0a08', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-[10px] transition-colors"
          style={{ color: '#555' }}
        >
          ← Back
        </button>
        <span className="font-mono text-[9px] tracking-[0.3em]" style={{ color: '#666' }}>EDIT</span>
        <button
          type="button"
          onClick={() => onSave(form)}
          className="font-mono text-[10px] transition-colors"
          style={{ color: '#c0b8a0' }}
        >
          Done ✓
        </button>
      </div>

      <div className="px-5 pt-5 space-y-4">
        <Field label="Title">
          <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select
              style={selectStyle}
              value={form.category}
              onChange={e => set('category', e.target.value as WorkCategory)}
            >
              <option value="movie">Movie</option>
              <option value="apps">Apps</option>
              <option value="model">Model</option>
              <option value="marketing">Marketing</option>
              <option value="experiment">Experiment</option>
            </select>
          </Field>
          <Field label="Year">
            <input style={inputStyle} value={form.year} onChange={e => set('year', e.target.value)} />
          </Field>
        </div>

        <Field label="Tag">
          <input
            style={inputStyle}
            value={form.tag}
            onChange={e => set('tag', e.target.value)}
            placeholder="Motion Graphics"
          />
        </Field>

        <Field label="Role">
          <input style={inputStyle} value={form.role} onChange={e => set('role', e.target.value)} placeholder="Direction / Motion Design" />
        </Field>

        <Field label="Tools (comma separated)">
          <input
            style={inputStyle}
            value={form.tools.join(', ')}
            onChange={e => set('tools', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="After Effects, Figma"
          />
        </Field>

        <Field label="Description">
          <textarea
            style={textareaStyle}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
          />
        </Field>

        <Field label="Process / Insight">
          <textarea
            style={textareaStyle}
            value={form.process ?? ''}
            onChange={e => set('process', e.target.value)}
            rows={3}
          />
        </Field>

        <Field label="Media Type">
          <select
            style={selectStyle}
            value={form.mediaType}
            onChange={e => set('mediaType', e.target.value as MediaType)}
          >
            <option value="placeholder">Placeholder (no media yet)</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="embed">Embed</option>
          </select>
        </Field>

        <Field label="Media URL">
          <input
            style={inputStyle}
            value={form.mediaUrl ?? ''}
            onChange={e => set('mediaUrl', e.target.value || undefined)}
            placeholder="/media/my-video.mp4"
          />
        </Field>

        <Field label="Thumbnail URL">
          <input
            style={inputStyle}
            value={form.thumbnailUrl ?? ''}
            onChange={e => set('thumbnailUrl', e.target.value || undefined)}
            placeholder="/media/thumb.jpg"
          />
        </Field>

        <Field label="Status (optional, for Apps)">
          <input
            style={inputStyle}
            value={form.status ?? ''}
            onChange={e => set('status', e.target.value || undefined)}
            placeholder="Released"
          />
        </Field>

        <Field label="Store / External URL">
          <input
            style={inputStyle}
            value={form.storeUrl ?? ''}
            onChange={e => set('storeUrl', e.target.value || undefined)}
            placeholder="https://apps.apple.com/..."
          />
        </Field>

        {/* Toggles */}
        <div className="pt-2">
          <Toggle label="Visible on public site" value={form.visible}  onChange={v => set('visible',  v)} color="#c0b8a0" />
          <Toggle label="Featured (shown first)"  value={form.featured} onChange={v => set('featured', v)} color="#c0a870" />
        </div>

        {/* Delete */}
        <div className="pt-4">
          {confirmDelete ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { onDelete(form.id); onCancel() }}
                className="flex-1 py-3 font-mono text-[10px]"
                style={{ background: 'rgba(200,60,60,0.15)', border: '1px solid rgba(200,60,60,0.25)', color: '#c07070' }}
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 font-mono text-[10px]"
                style={{ border: '1px solid rgba(255,255,255,0.06)', color: '#555' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full py-3 font-mono text-[10px] transition-colors"
              style={{ color: '#554040', border: '1px solid rgba(200,60,60,0.1)' }}
            >
              Delete Work
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main admin page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [works,    setWorks]    = useState<Work[]>([])
  const [hasDraft, setHasDraft] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tab,      setTab]      = useState<Tab>('all')
  const [copied,   setCopied]   = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const exportRef = useRef<HTMLTextAreaElement>(null)

  // Load on client only (localStorage not available during SSR)
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    setWorks(draft ? JSON.parse(draft) : defaultWorks)
    setHasDraft(!!draft)
  }, [])

  const handleSaveDraft = () => {
    saveDraft(works)
    setHasDraft(true)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 1800)
  }

  const handleExport = async () => {
    const json = JSON.stringify(works, null, 2)
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback: select the textarea content
      if (exportRef.current) {
        exportRef.current.value = json
        exportRef.current.select()
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      }
    }
  }

  const handleResetDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setWorks(defaultWorks)
    setHasDraft(false)
  }

  const toggleVisible  = (id: string) => setWorks(p => p.map(w => w.id === id ? { ...w, visible:  !w.visible  } : w))
  const toggleFeatured = (id: string) => setWorks(p => p.map(w => w.id === id ? { ...w, featured: !w.featured } : w))

  const moveUp = (id: string) => {
    const sorted = [...works].sort((a, b) => a.order - b.order)
    const idx    = sorted.findIndex(w => w.id === id)
    if (idx <= 0) return
    const updated = sorted.map((w, i) => {
      if (i === idx)   return { ...w, order: sorted[idx-1].order }
      if (i === idx-1) return { ...w, order: sorted[idx].order   }
      return w
    })
    setWorks(updated)
  }

  const moveDown = (id: string) => {
    const sorted = [...works].sort((a, b) => a.order - b.order)
    const idx    = sorted.findIndex(w => w.id === id)
    if (idx >= sorted.length - 1) return
    const updated = sorted.map((w, i) => {
      if (i === idx)   return { ...w, order: sorted[idx+1].order }
      if (i === idx+1) return { ...w, order: sorted[idx].order   }
      return w
    })
    setWorks(updated)
  }

  const handleSaveWork = (updated: Work) => {
    setWorks(p => p.map(w => w.id === updated.id ? updated : w))
    setEditingId(null)
  }

  const handleDeleteWork = (id: string) => {
    setWorks(p => p.filter(w => w.id !== id))
  }

  const handleAddWork = () => {
    const w = newWork()
    setWorks(p => [...p, w])
    setEditingId(w.id)
  }

  // ── Edit view ──
  if (editingId) {
    const work = works.find(w => w.id === editingId)
    if (work) {
      return (
        <EditForm
          work={work}
          onSave={handleSaveWork}
          onDelete={handleDeleteWork}
          onCancel={() => setEditingId(null)}
        />
      )
    }
  }

  const TABS: Tab[] = ['all', 'movie', 'apps', 'model']
  const filtered = works
    .filter(w => tab === 'all' || w.category === tab)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen" style={{ background: '#080807' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 h-14"
        style={{ background: '#0a0a08', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: '#666' }}>ADMIN</span>
        <Link
          href="/"
          className="font-mono text-[10px] transition-colors"
          style={{ color: '#444' }}
        >
          ← Site
        </Link>
      </div>

      {/* Draft status */}
      {hasDraft && (
        <div
          className="flex items-center gap-4 px-5 py-2.5"
          style={{ background: 'rgba(192,184,160,0.05)', borderBottom: '1px solid rgba(192,184,160,0.08)' }}
        >
          <span className="font-mono text-[9px]" style={{ color: '#c0a870' }}>● Draft saved locally</span>
          <button
            type="button"
            onClick={handleResetDraft}
            className="font-mono text-[9px] transition-colors"
            style={{ color: '#444' }}
          >
            Reset to published
          </button>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex items-center px-5 pt-4">
        {TABS.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest transition-colors"
            style={{
              color: tab === t ? '#c0b8a0' : '#333',
              borderBottom: tab === t ? '1px solid rgba(192,184,160,0.35)' : '1px solid transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Work list */}
      <div className="px-5 pt-3 pb-28 space-y-2">
        {filtered.map(work => (
          <div
            key={work.id}
            className="flex items-center gap-3 p-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {/* Order buttons */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button type="button" onClick={() => moveUp(work.id)}   className="w-6 h-5 font-mono text-[10px] flex items-center justify-center transition-colors" style={{ color: '#333' }}>↑</button>
              <button type="button" onClick={() => moveDown(work.id)} className="w-6 h-5 font-mono text-[10px] flex items-center justify-center transition-colors" style={{ color: '#333' }}>↓</button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-tight truncate" style={{ color: work.visible ? '#888278' : '#383430' }}>
                {work.title}
              </p>
              <p className="font-mono text-[8px] mt-0.5" style={{ color: '#333' }}>
                {work.category} · {work.year}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Visible */}
              <button
                type="button"
                onClick={() => toggleVisible(work.id)}
                title={work.visible ? 'Hide' : 'Show'}
                className="w-9 h-9 flex items-center justify-center text-base transition-colors"
                style={{ color: work.visible ? '#c0b8a0' : '#2e2c2a' }}
              >
                {work.visible ? '◉' : '○'}
              </button>

              {/* Featured */}
              <button
                type="button"
                onClick={() => toggleFeatured(work.id)}
                title={work.featured ? 'Unfeature' : 'Feature'}
                className="w-9 h-9 flex items-center justify-center text-base transition-colors"
                style={{ color: work.featured ? '#c0a870' : '#2e2c2a' }}
              >
                ★
              </button>

              {/* Edit */}
              <button
                type="button"
                onClick={() => setEditingId(work.id)}
                className="px-3 h-9 font-mono text-[9px] transition-colors"
                style={{ color: '#484440', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}

        {/* Add work */}
        <button
          type="button"
          onClick={handleAddWork}
          className="w-full py-4 font-mono text-[10px] tracking-widest transition-colors"
          style={{ color: '#2e2c2a', border: '1px dashed rgba(255,255,255,0.06)' }}
        >
          + Add Work
        </button>
      </div>

      {/* Fixed bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center gap-2.5 px-5 py-4"
        style={{ background: '#0a0a08', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          type="button"
          onClick={handleSaveDraft}
          className="flex-1 py-3.5 font-mono text-[10px] tracking-widest transition-colors"
          style={{
            background: savedMsg ? 'rgba(192,184,160,0.12)' : 'rgba(192,184,160,0.06)',
            border: '1px solid rgba(192,184,160,0.12)',
            color: savedMsg ? '#c0b8a0' : '#888278',
          }}
        >
          {savedMsg ? '✓ Saved' : 'Save Draft'}
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="flex-1 py-3.5 font-mono text-[10px] tracking-widest transition-colors"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: copied ? '#c0a870' : '#484440',
          }}
        >
          {copied ? '✓ Copied!' : 'Export JSON'}
        </button>
      </div>

      {/* Hidden textarea for clipboard fallback */}
      <textarea ref={exportRef} className="sr-only" readOnly aria-hidden="true" />
    </div>
  )
}
