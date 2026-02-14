'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Count up animation using requestAnimationFrame
 * @param target - Target number to count up to
 * @param duration - Duration in milliseconds (default 500ms)
 */
export function useCountUp(target: number, duration: number = 500) {
  const [count, setCount] = useState(target)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(target)

  useEffect(() => {
    // Cancel any ongoing animation
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    startValueRef.current = count
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      const currentValue = startValueRef.current + (target - startValueRef.current) * easeProgress
      setCount(Math.round(currentValue))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [target, duration])

  return count
}
