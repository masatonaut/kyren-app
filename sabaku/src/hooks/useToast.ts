'use client'

import { useToastContext } from '@/components/ToastProvider'
import { useMemo } from 'react'

export function useToast() {
  const ctx = useToastContext()
  return useMemo(() => ({
    success: (msg: string) => ctx.add(msg, 'success'),
    error: (msg: string) => ctx.add(msg, 'error'),
    info: (msg: string) => ctx.add(msg, 'info'),
    warning: (msg: string) => ctx.add(msg, 'warning'),
  }), [ctx])
}
