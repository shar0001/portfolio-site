import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

interface FieldWrapperProps {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}

export function FieldWrapper({ label, required, hint, error, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#1D1D1F]">
        {label}
        {required && <span className="text-[#FF3B30] ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] text-[#8E8E93] leading-snug">{hint}</p>}
      {error && <p className="text-[12px] text-[#FF3B30] leading-snug">{error}</p>}
    </div>
  )
}

// Shared Apple-style field classes — crisp white field, visible separator border,
// 44px height (touch target), 15px text (prevents iOS focus-zoom), blue focus glow.
const fieldBase =
  'w-full rounded-[10px] border bg-white text-[15px] text-[#1D1D1F] placeholder:text-[#B0B0B5] ' +
  'focus:outline-none transition-[border-color,box-shadow] duration-150'
const fieldBorder = (error?: string) =>
  error
    ? 'border-[#FF3B30] focus:border-[#FF3B30] focus:ring-[3px] focus:ring-[#FF3B30]/15'
    : 'border-[#D1D1D6] focus:border-[#007AFF] focus:ring-[3px] focus:ring-[#007AFF]/18'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  hint?: string
  error?: string
}

export function Input({ label, required, hint, error, className = '', ...props }: InputProps) {
  const input = (
    <input
      className={`${fieldBase} ${fieldBorder(error)} h-11 px-3.5 ${className}`}
      {...props}
    />
  )
  if (!label) return input
  return (
    <FieldWrapper label={label} required={required} hint={hint} error={error}>
      {input}
    </FieldWrapper>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  hint?: string
  error?: string
}

export function Textarea({ label, required, hint, error, className = '', ...props }: TextareaProps) {
  const textarea = (
    <textarea
      className={`${fieldBase} ${fieldBorder(error)} px-3.5 py-3 leading-relaxed resize-none ${className}`}
      {...props}
    />
  )
  if (!label) return textarea
  return (
    <FieldWrapper label={label} required={required} hint={hint} error={error}>
      {textarea}
    </FieldWrapper>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  hint?: string
  error?: string
}

export function Select({ label, required, hint, error, className = '', children, ...props }: SelectProps) {
  const select = (
    <div className="relative">
      <select
        className={`${fieldBase} ${fieldBorder(error)} h-11 pl-3.5 pr-9 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      {/* Apple-style up/down chevron */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6.5 8 3.5l3 3" />
          <path d="M5 9.5 8 12.5l3-3" />
        </svg>
      </span>
    </div>
  )
  if (!label) return select
  return (
    <FieldWrapper label={label} required={required} hint={hint} error={error}>
      {select}
    </FieldWrapper>
  )
}

interface ToggleGroupProps {
  label?: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  hint?: string
}

// Faithful iOS segmented control — translucent track, white selected segment with shadow.
export function ToggleGroup({ label, value, onChange, options, hint }: ToggleGroupProps) {
  const group = (
    <div className="inline-flex w-full bg-[#EFEFF0] rounded-[9px] p-[2px] gap-[2px]">
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 h-8 px-2 text-[13px] rounded-[7px] font-medium transition-all whitespace-nowrap ${
              active
                ? 'bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.10),0_1px_1px_rgba(0,0,0,0.04)]'
                : 'text-[#3C3C43] hover:text-[#1D1D1F]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
  if (!label) return group
  return (
    <FieldWrapper label={label} hint={hint}>
      {group}
    </FieldWrapper>
  )
}

interface SectionHeaderProps {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-3">
      <h3 className="text-[15px] font-semibold text-[#1D1D1F]">{title}</h3>
      {description && <p className="text-[12px] text-[#8E8E93] mt-0.5 leading-snug">{description}</p>}
    </div>
  )
}

// Apple-styled native date input — reuse across forms for consistency.
interface DateFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function DateField({ label, className = '', ...props }: DateFieldProps) {
  const input = (
    <input
      type="date"
      className={`${fieldBase} ${fieldBorder()} h-11 px-3.5 min-w-0 ${className}`}
      {...props}
    />
  )
  if (!label) return input
  return (
    <FieldWrapper label={label}>
      {input}
    </FieldWrapper>
  )
}
