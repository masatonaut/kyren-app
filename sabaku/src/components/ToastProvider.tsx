'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  add: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider')
  return ctx
}

const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: 'bg-priority-nrm/10 border-green-500/30 text-green-400' },
  error: { icon: AlertCircle, classes: 'bg-priority-urg/10 border-red-500/30 text-red-400' },
  info: { icon: Info, classes: 'bg-accent/10 border-accent/30 text-accent' },
  warning: { icon: AlertTriangle, classes: 'bg-timer-active/10 border-yellow-500/30 text-timer-active' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const add = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => {
          const { icon: Icon, classes } = variantStyles[t.variant]
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                'pointer-events-auto flex items-start gap-2 px-3 py-2 max-w-sm border rounded shadow-lg animate-fade-in text-[13px]',
                classes,
              )}
            >
              <Icon size={14} className="shrink-0 mt-0.5" />
              <span className="flex-1">{t.message}</span>
              <button onClick={() => remove(t.id)} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Close">
                <X size={12} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
