'use client'

export type MobileSection = 'overview' | 'locations' | 'dates' | 'tasks' | 'share'

interface BottomNavProps {
  active: MobileSection
  onChange: (s: MobileSection) => void
  locationCount: number
  taskCount: number
}

export function BottomNav({ active, onChange, locationCount, taskCount }: BottomNavProps) {
  const items: { id: MobileSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: '概要', icon: <HomeIcon /> },
    { id: 'locations', label: 'ロケ地', icon: <PinIcon />, badge: locationCount || undefined },
    { id: 'dates', label: '候補日', icon: <CalIcon /> },
    { id: 'tasks', label: 'タスク', icon: <CheckIcon />, badge: taskCount || undefined },
    { id: 'share', label: '共有', icon: <ShareIcon /> },
  ]

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-[#E5E5EA]">
      <div className="flex pb-safe">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 relative transition-colors ${
              active === item.id ? 'text-[#007AFF]' : 'text-[#8E8E93]'
            }`}
          >
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-1.5 right-1/2 translate-x-3 -translate-y-0.5 text-[10px] min-w-[16px] h-4 bg-[#FF3B30] text-white rounded-full flex items-center justify-center px-1 font-medium">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
            <span className={`w-5 h-5 flex items-center justify-center ${active === item.id ? 'text-[#007AFF]' : 'text-[#8E8E93]'}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  )
}
function CalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
    </svg>
  )
}
function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
    </svg>
  )
}
