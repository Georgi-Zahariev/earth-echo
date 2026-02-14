'use client'

import { useRef, useCallback, useState } from 'react'

/**
 * State hook with RAF-throttled updates
 * Updates are batched into next animation frame to maintain 60fps
 */
export function useRafState<T>(initialValue: T) {
  const [state, setState] = useState(initialValue)
  const rafIdRef = useRef<number | null>(null)
  const pendingValueRef = useRef<T | null>(null)

  const setRafState = useCallback((value: T) => {
    pendingValueRef.current = value

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        if (pendingValueRef.current !== null) {
          setState(pendingValueRef.current)
          pendingValueRef.current = null
        }
        rafIdRef.current = null
      })
    }
  }, [])

  return [state, setRafState] as const
}
