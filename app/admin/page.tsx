'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { defaultWorks, type Work, type WorkCategory, type MediaType } from '@/content/works'

const DRAFT_KEY = 'portfolio_draft'
type Tab = 'all' | WorkCategory

function loadDraft(): Work[] {
  try {
    const s = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_KEY) : null
    return s ? (JSON.parse(s) as Work[]) : defaultWorks
  } catch { return defaultWorks }
}

function saveDraft(works: Work[]) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(works))
}

function newWork(): Work {
  return {
    id: `work-${Date.now()}`,
    title: 'New Work',
    category: 'movie',
    year: new Date().getFullYear().toString(),
    tag: '',
    role: '',
    tools: [],
    description: '',
    mediaType: 'placeholder',
    visible: false,
    featured: false,
    order: 9999,
  }
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%',
  padding: '11px 12px',
  fontFamily: 'var(--font-geist-mono)',
  fontSize: '13px',
  color: '#c9d1e6',
  background: 'rgba(155,184,255,0.05)',
  border: '1px solid rgba(155,184,255,0.12)',
  outline: 'none',
  borderRadius: 0,
  WebkitAppearance: 'none',
}
const ta: React.CSSProperties = { ...inp, resize: 'vertical', minHeight: 80 }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest mb-1.5" style={{ color: '#5a6490' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 pt-5">
        <p className="font-mono text-[8px] tracking-[0.4em] uppercase shrink-0" style={{ color: '#9bb8ff' }}>
          {label}
        </p>
        <div className="flex-1 h-px" style={{ background: 'rgba(155,184,255,0.12)' }} />
      </div>
      {children}
    </div>
  )
}

function Toggle({ label, value, onChange, accent = '#9bb8ff' }: {
  label: string; value: boolean; onChange: (v: boolean) => void; accent?: string
}) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid rgba(155,184,255,0.07)' }}>
      <span className="font-mono text-[10px]" style={{ color: '#6878a8' }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative shrink-0"
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: value ? `rgba(155,184,255,0.18)` : 'rgba(255,255,255,0.05)',
          transition: 'background 0.2s',
        }}
      >
        <span
          className="absolute top-1"
          style={{
            width: 16, height: 16, borderRadius: 8,
            background: value ? accent : '#3a4470',
            left: value ? 24 : 4,
            transition: 'left 0.2s, background 0.2s',
          }}
        />
      </button>
    </div>
  )
}

// ── Edit form ─────────────────────────────────────────────────────────────────

function EditForm({ work, onSave, onDelete, onCancel }: {
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
    <div className="min-h-screen pb-10" style={{ background: '#0e1220' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 h-14"
        style={{ background: 'rgba(14,18,32,0.96)', borderBottom: '1px solid rgba(155,184,255,0.10)', backdropFilter: 'blur(8px)' }}
      >
        <button type="button" onClick={onCancel} className="font-mono text-[10px]" style={{ color: '#6878a8' }}>
          ← Back
        </button>
        <span className="font-mono text-[9px] tracking-[0.3em]" style={{ color: '#5a6490' }}>EDIT</span>
        <button type="button" onClick={() => onSave(form)} className="font-mono text-[10px]" style={{ color: '#9bb8ff' }}>
          Done ✓
        </button>
      </div>

      <div className="px-5 pb-5">
        {/* ── タイトル ── */}
        <Section label="タイトル">
          <Field label="Title">
            <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select style={inp} value={form.category} onChange={e => set('category', e.target.value as WorkCategory)}>
                <option value="movie">Movie</option>
                <option value="apps">Apps</option>
                <option value="model">Model</option>
                <option value="marketing">Marketing</option>
                <option value="experiment">Experiment</option>
              </select>
            </Field>
            <Field label="Year">
              <input style={inp} value={form.year} onChange={e => set('year', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tag">
              <input style={inp} value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Motion Graphics" />
            </Field>
            <Field label="Status">
              <input style={inp} value={form.status ?? ''} onChange={e => set('status', e.target.value || undefined)} placeholder="Released" />
            </Field>
          </div>
        </Section>

        {/* ── 内容 ── */}
        <Section label="内容">
          <Field label="説明">
            <textarea style={ta} rows={5} value={form.description} onChange={e => set('description', e.target.value)} />
          </Field>
          <Field label="制作過程 / Insight">
            <textarea style={ta} rows={3} value={form.process ?? ''} onChange={e => set('process', e.target.value)} />
          </Field>
        </Section>

        {/* ── メディア ── */}
        <Section label="メディア">
          <Field label="Role">
            <input style={inp} value={form.role} onChange={e => set('role', e.target.value)} placeholder="Direction / Motion Design" />
          </Field>
          <Field label="Tools (comma separated)">
            <input
              style={inp}
              value={form.tools.join(', ')}
              onChange={e => set('tools', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="After Effects, Figma"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Media Type">
              <select style={inp} value={form.mediaType} onChange={e => set('mediaType', e.target.value as MediaType)}>
                <option value="placeholder">Placeholder</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="embed">Embed</option>
              </select>
            </Field>
            <Field label="Media URL">
              <input style={inp} value={form.mediaUrl ?? ''} onChange={e => set('mediaUrl', e.target.value || undefined)} placeholder="/media/file.mp4" />
            </Field>
          </div>
          <Field label="Thumbnail URL">
            <input style={inp} value={form.thumbnailUrl ?? ''} onChange={e => set('thumbnailUrl', e.target.value || undefined)} placeholder="/media/thumb.jpg" />
          </Field>
          <Field label="Store / External URL">
            <input style={inp} value={form.storeUrl ?? ''} onChange={e => set('storeUrl', e.target.value || undefined)} placeholder="https://apps.apple.com/..." />
          </Field>
        </Section>

        {/* ── Toggles ── */}
        <div className="pt-5">
          <Toggle label="Visible on public site" value={form.visible}  onChange={v => set('visible', v)}  accent="#9bb8ff" />
          <Toggle label="Featured (shown first)"  value={form.featured} onChange={v => set('featured', v)} accent="#c8b6ff" />
        </div>

        {/* ── Delete ── */}
        <div className="pt-6">
          {confirmDelete ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { onDelete(form.id); onCancel() }}
                className="flex-1 py-3 font-mono text-[10px]"
                style={{ background: 'rgba(200,80,80,0.12)', border: '1px solid rgba(200,80,80,0.22)', color: '#e08080' }}
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 font-mono text-[10px]"
                style={{ border: '1px solid rgba(155,184,255,0.10)', color: '#5a6490' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full py-3 font-mono text-[10px] transition-colors"
              style={{ color: '#5a5070', border: '1px solid rgba(200,80,80,0.12)' }}
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
  const [works,     setWorks]     = useState<Work[]>([])
  const [hasDraft,  setHasDraft]  = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tab,       setTab]       = useState<Tab>('all')
  const [copied,    setCopied]    = useState(false)
  const [savedMsg,  setSavedMsg]  = useState(false)
  const exportRef = useRef<HTMLTextAreaElement>(null)

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
    } catch {
      if (exportRef.current) {
        exportRef.current.value = json
        exportRef.current.select()
        document.execCommand('copy')
      }
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const toggleVisible  = (id: string) => setWorks(p => p.map(w => w.id === id ? { ...w, visible:  !w.visible  } : w))
  const toggleFeatured = (id: string) => setWorks(p => p.map(w => w.id === id ? { ...w, featured: !w.featured } : w))

  const moveUp = (id: string) => {
    const s = [...works].sort((a, b) => a.order - b.order)
    const i = s.findIndex(w => w.id === id)
    if (i <= 0) return
    setWorks(s.map((w, j) => j === i ? { ...w, order: s[i-1].order } : j === i-1 ? { ...w, order: s[i].order } : w))
  }

  const moveDown = (id: string) => {
    const s = [...works].sort((a, b) => a.order - b.order)
    const i = s.findIndex(w => w.id === id)
    if (i >= s.length - 1) return
    setWorks(s.map((w, j) => j === i ? { ...w, order: s[i+1].order } : j === i+1 ? { ...w, order: s[i].order } : w))
  }

  if (editingId) {
    const work = works.find(w => w.id === editingId)
    if (work) return (
      <EditForm
        work={work}
        onSave={updated => { setWorks(p => p.map(w => w.id === updated.id ? updated : w)); setEditingId(null) }}
        onDelete={id => setWorks(p => p.filter(w => w.id !== id))}
        onCancel={() => setEditingId(null)}
      />
    )
  }

  const TABS: Tab[] = ['all', 'movie', 'apps', 'model']
  const filtered = works.filter(w => tab === 'all' || w.category === tab).sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen" style={{ background: '#0e1220' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 h-14"
        style={{ background: 'rgba(14,18,32,0.96)', borderBottom: '1px solid rgba(155,184,255,0.10)', backdropFilter: 'blur(8px)' }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: '#6878a8' }}>ADMIN</span>
        <Link href="/" className="font-mono text-[10px]" style={{ color: '#5060a0' }}>
          ← Site
        </Link>
      </div>

      {/* Draft notice */}
      {hasDraft && (
        <div
          className="flex items-center gap-4 px-5 py-2.5"
          style={{ background: 'rgba(155,184,255,0.05)', borderBottom: '1px solid rgba(155,184,255,0.08)' }}
        >
          <span className="font-mono text-[9px]" style={{ color: '#9bb8ff' }}>● Draft saved locally</span>
          <button
            type="button"
            onClick={() => { localStorage.removeItem(DRAFT_KEY); setWorks(defaultWorks); setHasDraft(false) }}
            className="font-mono text-[9px]"
            style={{ color: '#5060a0' }}
          >
            Reset to published
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center px-5 pt-4">
        {TABS.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest transition-colors"
            style={{
              color: tab === t ? '#c9d1e6' : '#4a5480',
              borderBottom: tab === t ? '1px solid rgba(155,184,255,0.40)' : '1px solid transparent',
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
            style={{ background: 'rgba(155,184,255,0.03)', border: '1px solid rgba(155,184,255,0.08)' }}
          >
            {/* Order */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button type="button" onClick={() => moveUp(work.id)}   className="w-6 h-5 font-mono text-[11px] flex items-center justify-center" style={{ color: '#4a5480' }}>↑</button>
              <button type="button" onClick={() => moveDown(work.id)} className="w-6 h-5 font-mono text-[11px] flex items-center justify-center" style={{ color: '#4a5480' }}>↓</button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-tight truncate" style={{ color: work.visible ? '#c9d1e6' : '#4a5480' }}>
                {work.title}
              </p>
              <p className="font-mono text-[8px] mt-0.5" style={{ color: '#4a5480' }}>
                {work.category} · {work.year}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button" onClick={() => toggleVisible(work.id)}
                className="w-9 h-9 flex items-center justify-center text-base transition-colors"
                style={{ color: work.visible ? '#9bb8ff' : '#3a4470' }}
                title={work.visible ? 'Hide' : 'Show'}
              >
                {work.visible ? '◉' : '○'}
              </button>
              <button
                type="button" onClick={() => toggleFeatured(work.id)}
                className="w-9 h-9 flex items-center justify-center text-base transition-colors"
                style={{ color: work.featured ? '#c8b6ff' : '#3a4470' }}
                title={work.featured ? 'Unfeature' : 'Feature'}
              >
                ★
              </button>
              <button
                type="button" onClick={() => setEditingId(work.id)}
                className="px-3 h-9 font-mono text-[9px] transition-colors"
                style={{ color: '#7080b0', border: '1px solid rgba(155,184,255,0.12)' }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}

        <button
          type="button" onClick={() => { const w = newWork(); setWorks(p => [...p, w]); setEditingId(w.id) }}
          className="w-full py-4 font-mono text-[10px] tracking-widest transition-colors"
          style={{ color: '#4a5480', border: '1px dashed rgba(155,184,255,0.10)' }}
        >
          + Add Work
        </button>
      </div>

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center gap-2.5 px-5 py-4"
        style={{ background: 'rgba(14,18,32,0.96)', borderTop: '1px solid rgba(155,184,255,0.10)', backdropFilter: 'blur(8px)' }}
      >
        <button
          type="button" onClick={handleSaveDraft}
          className="flex-1 py-3.5 font-mono text-[10px] tracking-widest transition-colors"
          style={{
            background: savedMsg ? 'rgba(155,184,255,0.12)' : 'rgba(155,184,255,0.06)',
            border: '1px solid rgba(155,184,255,0.15)',
            color: savedMsg ? '#c9d1e6' : '#7888b8',
          }}
        >
          {savedMsg ? '✓ Saved' : 'Save Draft'}
        </button>
        <button
          type="button" onClick={handleExport}
          className="flex-1 py-3.5 font-mono text-[10px] tracking-widest transition-colors"
          style={{
            background: 'rgba(155,184,255,0.03)',
            border: '1px solid rgba(155,184,255,0.10)',
            color: copied ? '#c8b6ff' : '#5a6490',
          }}
        >
          {copied ? '✓ Copied!' : 'Export JSON'}
        </button>
      </div>

      <textarea ref={exportRef} className="sr-only" readOnly aria-hidden="true" />
    </div>
  )
}
