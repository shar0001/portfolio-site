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
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  hint?: string
  error?: string
}

export function Input({ label, required, hint, error, className = '', ...props }: InputProps) {
  const input = (
    <input
      className={`h-10 w-full rounded-lg border ${error ? 'border-red-400' : 'border-slate-200'} bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className}`}
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
      className={`w-full rounded-lg border ${error ? 'border-red-400' : 'border-slate-200'} bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${className}`}
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
    <select
      className={`h-10 w-full rounded-lg border ${error ? 'border-red-400' : 'border-slate-200'} bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className}`}
      {...props}
    >
      {children}
    </select>
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

export function ToggleGroup({ label, value, onChange, options, hint }: ToggleGroupProps) {
  const group = (
    <div className="flex gap-1 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`h-8 px-3 text-sm rounded-lg border transition-colors font-medium ${
            value === opt.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
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
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{title}</h3>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
  )
}
