'use client'
import { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast }: { toast: ToastItem }) {
  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'i',
  }
  const colors: Record<ToastType, string> = {
    success: 'bg-[#34C759]',
    error: 'bg-[#FF3B30]',
    info: 'bg-[#007AFF]',
  }
  return (
    <div className="animate-slide-in flex items-center gap-2.5 bg-[#1D1D1F]/95 backdrop-blur-xl text-white text-[14px] font-medium px-4 py-3 rounded-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.25)] pointer-events-auto max-w-xs">
      <span className={`w-5 h-5 rounded-full ${colors[toast.type]} flex items-center justify-center text-[11px] font-bold shrink-0`}>
        {icons[toast.type]}
      </span>
      {toast.message}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be within ToastProvider')
  return ctx
}
