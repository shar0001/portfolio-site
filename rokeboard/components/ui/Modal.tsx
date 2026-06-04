'use client'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-3xl',
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`animate-modal-in relative bg-white w-full ${sizeClasses[size]} rounded-t-2xl sm:rounded-[16px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.35)] flex flex-col max-h-[94dvh] sm:max-h-[88vh] overflow-hidden`}
      >
        {/* Mobile grabber */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="w-9 h-1 bg-[#C6C6C8] rounded-full" />
        </div>

        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-[#E5E5EA] shrink-0">
          <h2 className="text-[17px] font-semibold text-[#1D1D1F] truncate">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E8E8ED] text-[#8E8E93] hover:bg-[#DCDCE1] hover:text-[#3C3C43] transition-colors shrink-0"
            aria-label="閉じる"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

// Faithful iOS alert — frosted vibrancy surface, centered text, split action row.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '削除',
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-fade-in" onClick={onCancel} />
      <div className="animate-modal-in relative w-full max-w-[272px] rounded-[14px] overflow-hidden bg-white/85 backdrop-blur-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.4)]">
        <div className="px-5 pt-5 pb-4 text-center">
          <h3 className="text-[17px] font-semibold text-[#1D1D1F] leading-snug">{title}</h3>
          <p className="mt-1.5 text-[13px] text-[#3C3C43] leading-relaxed">{message}</p>
        </div>
        <div className="grid grid-cols-2 border-t border-[#3C3C43]/15 divide-x divide-[#3C3C43]/15">
          <button
            onClick={onCancel}
            className="h-11 text-[17px] text-[#007AFF] hover:bg-black/[0.03] active:bg-black/[0.06] transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className={`h-11 text-[17px] font-semibold hover:bg-black/[0.03] active:bg-black/[0.06] transition-colors ${danger ? 'text-[#FF3B30]' : 'text-[#007AFF]'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
