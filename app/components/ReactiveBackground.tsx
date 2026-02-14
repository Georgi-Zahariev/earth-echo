'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ReactiveBackgroundProps {
  warmth: number
  smogOpacity: number
}

export const ReactiveBackground = React.memo<ReactiveBackgroundProps>(
  function ReactiveBackground({ warmth, smogOpacity }) {
    // Interpolate background colors based on warmth
    const getBackgroundColor = () => {
      // Cool: deep blue-black -> Warm: reddish-black
      const r = Math.round(15 + warmth * 25)  // 15 -> 40
      const g = Math.round(20 + warmth * -10) // 20 -> 10
      const b = Math.round(35 + warmth * -20) // 35 -> 15
      return `rgb(${r}, ${g}, ${b})`
    }

    const getAccentColor = () => {
      // Cool: darker blue -> Warm: darker orange-red
      const r = Math.round(8 + warmth * 35)   // 8 -> 43
      const g = Math.round(15 + warmth * -8)  // 15 -> 7
      const b = Math.round(28 + warmth * -18) // 28 -> 10
      return `rgb(${r}, ${g}, ${b})`
    }

    // Vignette strength increases with smog
    const vignetteOpacity = 0.4 + smogOpacity * 0.3 // 0.4 -> 0.7

    return (
      <>
        {/* Base reactive gradient background */}
        <motion.div
          className="fixed inset-0 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getBackgroundColor()}, ${getAccentColor()})`,
            willChange: 'opacity',
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Vignette overlay - darkens edges, reacts to smog */}
        <motion.div
          className="fixed inset-0 -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 40%, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
            willChange: 'opacity',
          }}
          animate={{ opacity: vignetteOpacity }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </>
    )
  }
)
