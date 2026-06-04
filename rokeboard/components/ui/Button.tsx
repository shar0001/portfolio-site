import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-[#007AFF] text-white hover:bg-[#0062CC] active:bg-[#0051D4] shadow-[0_1px_2px_rgba(0,0,0,0.08)]',
  secondary: 'bg-[#F2F2F7] text-[#007AFF] hover:bg-[#E5E5EA] active:bg-[#D7D7DC]',
  ghost:     'bg-transparent text-[#007AFF] hover:bg-[#007AFF]/[0.08] active:bg-[#007AFF]/[0.14]',
  danger:    'bg-[#FF3B30] text-white hover:bg-[#E5352B] active:bg-[#CB2E25] shadow-[0_1px_2px_rgba(0,0,0,0.08)]',
  outline:   'bg-white text-[#1D1D1F] border border-[#D1D1D6] hover:bg-[#F2F2F7] active:bg-[#E5E5EA]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-[9px]',
  md: 'h-11 px-5 text-[15px] gap-2 rounded-[11px]',
  lg: 'h-[50px] px-6 text-[16px] gap-2 rounded-[13px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  )
}

export function IconButton({
  children,
  className = '',
  title,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { title: string }) {
  return (
    <button
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-[8px] text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F2F2F7] transition-colors disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
