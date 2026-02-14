'use client'

import { useRef, useCallback, useEffect } from 'react'

interface UseRAFSliderProps {
  initialValue: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function useRAFSlider({ initialValue, min, max, onChange }: UseRAFSliderProps) {
  const rafIdRef = useRef<number | null>(null)
  const pendingValueRef = useRef<number | null>(null)
  const currentValueRef = useRef(initialValue)

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    pendingValueRef.current = value

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        if (pendingValueRef.current !== null) {
          currentValueRef.current = pendingValueRef.current
          onChange(pendingValueRef.current)
          pendingValueRef.current = null
        }
        rafIdRef.current = null
      })
    }
  }, [onChange])

  return {
    value: currentValueRef.current,
    min,
    max,
    onChange: handleChange,
  }
}
