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
    title: '新規プロジェクト名',
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

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: '#5a6490' }}>
        {label}
      </p>
      {children}
      {hint && (
        <p className="text-[10px] leading-relaxed" style={{ color: '#4a5480' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3.5 pt-1">
      <div className="flex items-center gap-3 pt-5">
        <p className="font-mono text-[8px] tracking-[0.4em] uppercase shrink-0" style={{ color: '#9bb8ff' }}>
          {label}
        </p>
        <div className="flex-1 h-px" style={{ background: 'rgba(155,184,255,0.12)' }} />
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange, accent = '#9bb8ff' }: {
  label: string; value: boolean; onChange: (v: boolean) => void; accent?: string
}) {
  return (
    <div className="flex items-center justify-between py-3.5" style={{ borderTop: '1px solid rgba(155,184,255,0.07)' }}>
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
    <div className="min-h-screen pb-24" style={{ background: '#0e1220' }}>
      {/* Header (Width limited & Centered) */}
      <div
        className="sticky top-0 z-10 flex items-center h-14 px-5"
        style={{ background: 'rgba(14,18,32,0.96)', borderBottom: '1px solid rgba(155,184,255,0.10)', backdropFilter: 'blur(8px)' }}
      >
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between">
          <button type="button" onClick={onCancel} className="font-mono text-[10px] py-2" style={{ color: '#6878a8' }}>
            ← Back
          </button>
          <span className="font-mono text-[9px] tracking-[0.3em]" style={{ color: '#5a6490' }}>EDIT DETAILS</span>
          <button type="button" onClick={() => onSave(form)} className="font-mono text-[10px] py-2" style={{ color: '#9bb8ff' }}>
            Save ✓
          </button>
        </div>
      </div>

      {/* Main form container (Width limited & Centered) */}
      <div className="max-w-2xl mx-auto px-5 pb-10 space-y-6">
        {/* ── 基本情報 ── */}
        <Section label="基本情報">
          <Field label="作品名 / プロジェクトタイトル (Title)">
            <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} placeholder="例: マンガ PR 動画" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="カテゴリー (Category)">
              <select style={inp} value={form.category} onChange={e => set('category', e.target.value as WorkCategory)}>
                <option value="movie">Movie</option>
                <option value="apps">Apps</option>
                <option value="model">Model</option>
                <option value="marketing">Marketing</option>
                <option value="experiment">Experiment</option>
              </select>
            </Field>
            <Field label="制作年 (Year)">
              <input style={inp} value={form.year} onChange={e => set('year', e.target.value)} placeholder="例: 2026" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ジャンル / タグ (Tag)">
              <input style={inp} value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="例: Motion Graphics / AI" />
            </Field>
            <Field label="ステータス (Status)" hint="※Appsのみ有効">
              <input style={inp} value={form.status ?? ''} onChange={e => set('status', e.target.value || undefined)} placeholder="例: Released / WIP" />
            </Field>
          </div>
        </Section>

        {/* ── 作品解説 ── */}
        <Section label="作品解説">
          <Field label="概要説明 (Description)" hint="一覧やモーダルのメイン部分に表示されます。">
            <textarea style={ta} rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="作品の概要や概要文を入力してください。" />
          </Field>
          <Field label="制作プロセス / こだわり (Insight)" hint="モーダルの詳細タブ（プロセス）に表示されます。">
            <textarea style={ta} rows={3} value={form.process ?? ''} onChange={e => set('process', e.target.value)} placeholder="静と動のコントラスト、タイムリマップの適用など、制作プロセスや独自の工夫を入力してください。" />
          </Field>
        </Section>

        {/* ── 制作・ツール ── */}
        <Section label="制作・ツール">
          <Field label="担当役割 (Role)">
            <input style={inp} value={form.role} onChange={e => set('role', e.target.value)} placeholder="例: Direction / Motion Design" />
          </Field>
          <Field label="使用ツール (Tools)" hint="半角カンマ ( , ) で区切って入力してください。">
            <input
              style={inp}
              value={form.tools.join(', ')}
              onChange={e => set('tools', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="例: After Effects, Photoshop, Figma"
            />
          </Field>
        </Section>

        {/* ── メディア設定 ── */}
        <Section label="メディア設定">
          <div className="grid grid-cols-2 gap-3">
            <Field label="表示形式 (Media Type)">
              <select style={inp} value={form.mediaType} onChange={e => set('mediaType', e.target.value as MediaType)}>
                <option value="video">Video (動画ファイル / YouTube)</option>
                <option value="image">Image (画像)</option>
                <option value="placeholder">Placeholder (プレースホルダー)</option>
                <option value="embed">Embed (埋め込み)</option>
              </select>
            </Field>
            <Field label="メディアのURL (Media URL)" hint="YouTube等の動画URL、またはローカル動画のパス。">
              <input style={inp} value={form.mediaUrl ?? ''} onChange={e => set('mediaUrl', e.target.value || undefined)} placeholder="例: https://youtu.be/... または /media/file.mp4" />
            </Field>
          </div>
          <Field label="サムネイル画像のURL (Thumbnail URL)" hint="YouTube動画の場合は「https://img.youtube.com/vi/【動画ID】/sddefault.jpg」を入力してください。">
            <input style={inp} value={form.thumbnailUrl ?? ''} onChange={e => set('thumbnailUrl', e.target.value || undefined)} placeholder="例: https://img.youtube.com/vi/haIGEgohfM4/sddefault.jpg" />
          </Field>
          <Field label="ストア / 外部リンク (Store URL)" hint="※Appsなどで外部リンクがある場合に入力。">
            <input style={inp} value={form.storeUrl ?? ''} onChange={e => set('storeUrl', e.target.value || undefined)} placeholder="例: https://apps.apple.com/..." />
          </Field>
        </Section>

        {/* ── トグルスイッチ ── */}
        <div className="pt-4 space-y-1">
          <Toggle label="Visible on public site (ポートフォリオ上で一般公開する)" value={form.visible}  onChange={v => set('visible', v)}  accent="#9bb8ff" />
          <Toggle label="Featured (最上部に優先して大きく表示する)"  value={form.featured} onChange={v => set('featured', v)} accent="#c8b6ff" />
        </div>

        {/* ── 削除 ── */}
        <div className="pt-6">
          {confirmDelete ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { onDelete(form.id); onCancel() }}
                className="flex-1 py-3 font-mono text-[10px]"
                style={{ background: 'rgba(200,80,80,0.12)', border: '1px solid rgba(200,80,80,0.22)', color: '#e08080' }}
              >
                Confirm Delete (削除する)
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 font-mono text-[10px]"
                style={{ border: '1px solid rgba(155,184,255,0.10)', color: '#5a6490' }}
              >
                Cancel (キャンセル)
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => confirmDelete ? null : setConfirmDelete(true)}
              className="w-full py-3.5 font-mono text-[10px] transition-colors"
              style={{ color: '#5a5070', border: '1px solid rgba(200,80,80,0.12)' }}
            >
              Delete Work (この作品を削除)
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
    <div className="min-h-screen pb-28" style={{ background: '#0e1220' }}>
      {/* Header (Width limited & Centered) */}
      <div
        className="sticky top-0 z-10 flex items-center h-14 px-5"
        style={{ background: 'rgba(14,18,32,0.96)', borderBottom: '1px solid rgba(155,184,255,0.10)', backdropFilter: 'blur(8px)' }}
      >
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: '#6878a8' }}>PORTFOLIO ADMIN</span>
          <Link href="/" className="font-mono text-[10px] py-2" style={{ color: '#5060a0' }}>
            ← View Site
          </Link>
        </div>
      </div>

      {/* Main container (Width limited & Centered) */}
      <div className="max-w-2xl mx-auto px-5 pt-3">
        {/* Draft notice */}
        {hasDraft && (
          <div
            className="flex items-center justify-between px-3 py-2 mb-4"
            style={{ background: 'rgba(155,184,255,0.05)', border: '1px dashed rgba(155,184,255,0.15)' }}
          >
            <span className="font-mono text-[9px]" style={{ color: '#9bb8ff' }}>● Draft saved locally (一時保存中)</span>
            <button
              type="button"
              onClick={() => { if(confirm('ローカル下書きをクリアして公開済みの状態に戻しますか？')) { localStorage.removeItem(DRAFT_KEY); setWorks(defaultWorks); setHasDraft(false) } }}
              className="font-mono text-[9px] hover:underline"
              style={{ color: '#e08080' }}
            >
              Reset to published (初期化)
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 border-b" style={{ borderColor: 'rgba(155,184,255,0.08)' }}>
          {TABS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest transition-colors"
              style={{
                color: tab === t ? '#c9d1e6' : '#4a5480',
                borderBottom: tab === t ? '2px solid rgba(155,184,255,0.40)' : '2px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Work list */}
        <div className="space-y-2.5">
          {filtered.map(work => (
            <div
              key={work.id}
              className="flex items-center gap-3 p-3.5"
              style={{ background: 'rgba(155,184,255,0.03)', border: '1px solid rgba(155,184,255,0.08)' }}
            >
              {/* Order */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button type="button" onClick={() => moveUp(work.id)}   className="w-6 h-5 font-mono text-[11px] flex items-center justify-center hover:text-white transition-colors" style={{ color: '#4a5480' }}>↑</button>
                <button type="button" onClick={() => moveDown(work.id)} className="w-6 h-5 font-mono text-[11px] flex items-center justify-center hover:text-white transition-colors" style={{ color: '#4a5480' }}>↓</button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate" style={{ color: work.visible ? '#c9d1e6' : '#4a5480' }}>
                  {work.title}
                </p>
                <p className="font-mono text-[8px] mt-1" style={{ color: '#4a5480' }}>
                  {work.category.toUpperCase()} · {work.year}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button" onClick={() => toggleVisible(work.id)}
                  className="w-9 h-9 flex items-center justify-center text-sm transition-colors"
                  style={{ color: work.visible ? '#9bb8ff' : '#3a4470' }}
                  title={work.visible ? '公開中' : '非公開'}
                >
                  {work.visible ? '◉ 公開' : '○ 非公'}
                </button>
                <button
                  type="button" onClick={() => toggleFeatured(work.id)}
                  className="w-9 h-9 flex items-center justify-center text-sm transition-colors"
                  style={{ color: work.featured ? '#c8b6ff' : '#3a4470' }}
                  title={work.featured ? '注目作品解除' : '注目作品に設定'}
                >
                  {work.featured ? '★ 注目' : '☆ 通常'}
                </button>
                <button
                  type="button" onClick={() => setEditingId(work.id)}
                  className="px-3 h-9 font-mono text-[9px] hover:text-white transition-colors"
                  style={{ color: '#7080b0', border: '1px solid rgba(155,184,255,0.12)' }}
                >
                  Edit (編集)
                </button>
              </div>
            </div>
          ))}

          <button
            type="button" onClick={() => { const w = newWork(); setWorks(p => [...p, w]); setEditingId(w.id) }}
            className="w-full py-4 font-mono text-[10px] tracking-widest hover:text-white transition-colors"
            style={{ color: '#4a5480', border: '1px dashed rgba(155,184,255,0.10)' }}
          >
            + Add New Work (新規作品を追加)
          </button>
        </div>
      </div>

      {/* Bottom bar (Width limited & Centered) */}
      <div
        className="fixed bottom-0 left-0 right-0 py-4 z-10"
        style={{ background: 'rgba(14,18,32,0.96)', borderTop: '1px solid rgba(155,184,255,0.10)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-2xl mx-auto px-5 flex items-center gap-2.5">
          <button
            type="button" onClick={handleSaveDraft}
            className="flex-1 py-3.5 font-mono text-[10px] tracking-widest transition-all duration-300"
            style={{
              background: savedMsg ? 'rgba(155,184,255,0.18)' : 'rgba(155,184,255,0.06)',
              border: '1px solid rgba(155,184,255,0.15)',
              color: savedMsg ? '#ffffff' : '#7888b8',
            }}
          >
            {savedMsg ? '✓ Saved (下書きを保存しました)' : 'Save Draft (一時保存)'}
          </button>
          <button
            type="button" onClick={handleExport}
            className="flex-1 py-3.5 font-mono text-[10px] tracking-widest transition-all duration-300"
            style={{
              background: 'rgba(155,184,255,0.03)',
              border: '1px solid rgba(155,184,255,0.10)',
              color: copied ? '#c8b6ff' : '#5a6490',
            }}
          >
            {copied ? '✓ JSON Copied! (コピー完了)' : 'Export JSON (JSON出力)'}
          </button>
        </div>
      </div>

      <textarea ref={exportRef} className="sr-only" readOnly aria-hidden="true" />
    </div>
  )
}
