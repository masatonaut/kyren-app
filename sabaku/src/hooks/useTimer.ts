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
  const startTimeRef = useRef<number>(0)
  const accumulatedRef = useRef(initialSeconds)
  const onTickRef = useRef(onTick)
  onTickRef.current = onTick

  useEffect(() => {
    setSeconds(initialSeconds)
    accumulatedRef.current = initialSeconds
  }, [initialSeconds])

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const total = accumulatedRef.current + elapsed
        setSeconds(total)
        onTickRef.current?.(total)
      }, 1000)
    } else {
      if (intervalRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        accumulatedRef.current += elapsed
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
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
    accumulatedRef.current = initialSeconds
    setSeconds(initialSeconds)
  }, [initialSeconds])

  return { seconds, isRunning, start, pause, toggle, reset }
}
