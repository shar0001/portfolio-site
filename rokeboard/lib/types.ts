export type ProjectStatus =
  | 'preparing'
  | 'location_search'
  | 'on_hold'
  | 'location_fixed'
  | 'pre_shoot'
  | 'shot'
  | 'archived'

export type LocationStatus =
  | 'none'
  | 'inquired'
  | 'waiting'
  | 'hold'
  | 'confirmed'
  | 'ng'
  | 'pending'

export type DateAvailability = 'available' | 'checking' | 'unavailable' | 'unknown'

export type TaskStatus = 'todo' | 'checking' | 'arranged' | 'done' | 'unnecessary'

export type TaskCategory =
  | 'location'
  | 'permit'
  | 'vehicle'
  | 'catering'
  | 'art'
  | 'costume'
  | 'makeup'
  | 'equipment'
  | 'staff'
  | 'cast'
  | 'document'
  | 'other'

export type FacilityStatus = 'yes' | 'no' | 'unknown'
export type RainSupport = 'yes' | 'no' | 'partial' | 'unknown'
export type SoundAllowed = 'yes' | 'no' | 'confirm' | 'unknown'

export interface CandidateDate {
  id: string
  date: string
}

export interface ContactHistory {
  id: string
  date: string
  method: string
  content: string
}

export type PhotoLabel = '外観' | '内観' | '控室' | '駐車場' | '搬入導線' | '雨天避難' | '周辺' | 'その他'

export const PHOTO_LABELS: PhotoLabel[] = ['外観', '内観', '控室', '駐車場', '搬入導線', '雨天避難', '周辺', 'その他']

export interface LocationPhoto {
  id: string
  url: string
  label: PhotoLabel
  caption: string
}

export interface Location {
  id: string
  projectId: string
  name: string
  address: string
  mapUrl: string
  officialUrl: string
  contactName: string
  phone: string
  email: string
  price: string
  availableTime: string
  extensionFee: string
  cancellationPolicy: string
  paymentTerms: string
  parking: FacilityStatus
  waitingRoom: FacilityStatus
  power: FacilityStatus
  toilet: FacilityStatus
  makeupRoom: FacilityStatus
  rainSupport: RainSupport
  soundAllowed: SoundAllowed
  fireAllowed: FacilityStatus
  permissionStatus: string
  ngRules: string
  loadingRules: string
  vehicleLimit: string
  peopleLimit: string
  usableArea: string
  status: LocationStatus
  dateAvailability: Record<string, DateAvailability>
  lastContactDate: string
  nextFollowUpDate: string
  memo: string
  photos?: LocationPhoto[]
  contactHistory: ContactHistory[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  category: TaskCategory
  assignee: string
  dueDate: string
  status: TaskStatus
  memo: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  title: string
  clientName: string
  shootDescription: string
  shootDates: string[]
  candidateDates: CandidateDate[]
  budget: string
  requirements: string
  pmName: string
  directorName: string
  memo: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

export interface AppState {
  projects: Project[]
  locations: Location[]
  tasks: Task[]
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  preparing: '準備中',
  location_search: 'ロケ地調整中',
  on_hold: '仮キープ中',
  location_fixed: 'ロケ地決定',
  pre_shoot: '撮影前',
  shot: '撮影済み',
  archived: 'アーカイブ',
}

export const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  none: '未連絡',
  inquired: '問い合わせ済み',
  waiting: '返信待ち',
  hold: '仮キープ中',
  confirmed: '決定',
  ng: 'NG',
  pending: '保留',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '未着手',
  checking: '確認中',
  arranged: '手配済み',
  done: '完了',
  unnecessary: '不要',
}

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  location: 'ロケ地',
  permit: '撮影許可',
  vehicle: '車両',
  catering: 'ケータリング',
  art: '美術',
  costume: '衣装',
  makeup: 'メイク',
  equipment: '機材',
  staff: 'スタッフ',
  cast: 'キャスト',
  document: '資料',
  other: 'その他',
}

export const FACILITY_LABELS: Record<FacilityStatus, string> = {
  yes: 'あり',
  no: 'なし',
  unknown: '確認中',
}

export const RAIN_SUPPORT_LABELS: Record<RainSupport, string> = {
  yes: 'あり',
  no: 'なし',
  partial: '一部あり',
  unknown: '確認中',
}

export const SOUND_ALLOWED_LABELS: Record<SoundAllowed, string> = {
  yes: '可',
  no: '不可',
  confirm: '要確認',
  unknown: '確認中',
}

export const DATE_AVAILABILITY_LABELS: Record<DateAvailability, string> = {
  available: '○',
  checking: '△',
  unavailable: '×',
  unknown: 'ー',
}
