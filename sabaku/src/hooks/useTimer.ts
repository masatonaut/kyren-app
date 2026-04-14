'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTimerOptions {
  initialSeconds?: number
  onTick?: (seconds: number) => void
}

export function useTimer({ initialSeconds = 0, onTick }: UseTimerOptions = {}) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTickRef = useRef(onTick)
  onTickRef.current = onTick

  useEffect(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1
          onTickRef.current?.(next)
          return next
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const toggle = useCallback(() => setIsRunning(prev => !prev), [])
  const reset = useCallback(() => {
    setIsRunning(false)
    setSeconds(initialSeconds)
  }, [initialSeconds])

  return { seconds, isRunning, start, pause, toggle, reset }
}
