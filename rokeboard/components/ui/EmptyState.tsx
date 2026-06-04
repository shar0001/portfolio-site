interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon = '📋', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-[44px] mb-3 opacity-90">{icon}</div>
      <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-1.5">{title}</h3>
      {description && (
        <p className="text-[13px] text-[#8E8E93] mb-6 max-w-xs leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  )
}
