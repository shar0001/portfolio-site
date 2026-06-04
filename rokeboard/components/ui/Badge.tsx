import type { LocationStatus, ProjectStatus, TaskStatus, TaskCategory } from '@/lib/types'

type BadgeVariant = 'gray' | 'blue' | 'amber' | 'purple' | 'green' | 'red' | 'stone' | 'slate' | 'indigo' | 'orange' | 'teal' | 'pink' | 'lime'

const variantClasses: Record<BadgeVariant, string> = {
  gray:   'bg-[#8E8E93]/15 text-[#6E6E73]',
  blue:   'bg-[#007AFF]/12 text-[#0066CC]',
  amber:  'bg-[#FF9500]/15 text-[#9A5E00]',
  purple: 'bg-[#AF52DE]/14 text-[#8E3AB8]',
  green:  'bg-[#34C759]/16 text-[#1F8F3B]',
  red:    'bg-[#FF3B30]/12 text-[#D70015]',
  stone:  'bg-[#8E8E93]/12 text-[#6E6E73]',
  slate:  'bg-[#8E8E93]/15 text-[#6E6E73]',
  indigo: 'bg-[#5856D6]/13 text-[#4341B5]',
  orange: 'bg-[#FF9500]/15 text-[#9A5E00]',
  teal:   'bg-[#30B0C7]/15 text-[#1A7E91]',
  pink:   'bg-[#FF2D55]/12 text-[#D70036]',
  lime:   'bg-[#9ACD32]/20 text-[#5E7A1A]',
}

const dotVariantClasses: Record<BadgeVariant, string> = {
  gray:   'bg-[#8E8E93]',
  blue:   'bg-[#007AFF]',
  amber:  'bg-[#FF9500]',
  purple: 'bg-[#AF52DE]',
  green:  'bg-[#34C759]',
  red:    'bg-[#FF3B30]',
  stone:  'bg-[#8E8E93]',
  slate:  'bg-[#8E8E93]',
  indigo: 'bg-[#5856D6]',
  orange: 'bg-[#FF9500]',
  teal:   'bg-[#30B0C7]',
  pink:   'bg-[#FF2D55]',
  lime:   'bg-[#9ACD32]',
}

interface BadgeProps {
  label: string
  variant: BadgeVariant
  dot?: boolean
  size?: 'sm' | 'md'
}

export function Badge({ label, variant, dot = false, size = 'md' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClass} ${variantClasses[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotVariantClasses[variant]}`} />}
      {label}
    </span>
  )
}

// ─── Status → Badge props ─────────────────────────────────────────────────────

export function LocationStatusBadge({ status }: { status: LocationStatus }) {
  const map: Record<LocationStatus, { label: string; variant: BadgeVariant }> = {
    none:     { label: '未連絡',       variant: 'gray' },
    inquired: { label: '問い合わせ済み', variant: 'blue' },
    waiting:  { label: '返信待ち',     variant: 'amber' },
    hold:     { label: '仮キープ中',   variant: 'purple' },
    confirmed:{ label: '決定',         variant: 'green' },
    ng:       { label: 'NG',           variant: 'red' },
    pending:  { label: '保留',         variant: 'stone' },
  }
  const { label, variant } = map[status]
  return <Badge label={label} variant={variant} dot />
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const map: Record<ProjectStatus, { label: string; variant: BadgeVariant }> = {
    preparing:      { label: '準備中',       variant: 'gray' },
    location_search:{ label: 'ロケ地調整中', variant: 'blue' },
    on_hold:        { label: '仮キープ中',   variant: 'purple' },
    location_fixed: { label: 'ロケ地決定',   variant: 'green' },
    pre_shoot:      { label: '撮影前',       variant: 'indigo' },
    shot:           { label: '撮影済み',     variant: 'teal' },
    archived:       { label: 'アーカイブ',   variant: 'stone' },
  }
  const { label, variant } = map[status]
  return <Badge label={label} variant={variant} />
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { label: string; variant: BadgeVariant }> = {
    todo:        { label: '未着手',  variant: 'gray' },
    checking:    { label: '確認中',  variant: 'amber' },
    arranged:    { label: '手配済み', variant: 'blue' },
    done:        { label: '完了',    variant: 'green' },
    unnecessary: { label: '不要',    variant: 'stone' },
  }
  const { label, variant } = map[status]
  return <Badge label={label} variant={variant} size="sm" />
}

export function TaskCategoryBadge({ category }: { category: TaskCategory }) {
  const map: Record<TaskCategory, { label: string; variant: BadgeVariant }> = {
    location:  { label: 'ロケ地',   variant: 'blue' },
    permit:    { label: '撮影許可', variant: 'orange' },
    vehicle:   { label: '車両',     variant: 'teal' },
    catering:  { label: 'ケータリング', variant: 'lime' },
    art:       { label: '美術',     variant: 'pink' },
    costume:   { label: '衣装',     variant: 'purple' },
    makeup:    { label: 'メイク',   variant: 'pink' },
    equipment: { label: '機材',     variant: 'slate' },
    staff:     { label: 'スタッフ', variant: 'indigo' },
    cast:      { label: 'キャスト', variant: 'amber' },
    document:  { label: '資料',     variant: 'gray' },
    other:     { label: 'その他',   variant: 'stone' },
  }
  const { label, variant } = map[category]
  return <Badge label={label} variant={variant} size="sm" />
}
