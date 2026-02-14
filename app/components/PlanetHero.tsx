'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ImpactResult } from '@/lib/impact'
import { ScoreDisplay } from './ScoreDisplay'

interface PlanetHeroProps {
  impact: ImpactResult
}

export const PlanetHero = React.memo<PlanetHeroProps>(function PlanetHero({ impact }) {
  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Hero Scene Container - Fixed Height */}
      <div className="relative w-full h-[520px] flex items-center justify-center">
        {/* Planet - Centered in scene */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] lg:w-[460px] lg:h-[460px]">
          <PlanetSphere 
            warmth={impact.visualState.warmth} 
            smogOpacity={impact.visualState.smogOpacity}
          />
        </div>

        {/* Score Display - Positioned left of center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ScoreDisplay score={impact.score} label={impact.label} />
        </div>
      </div>
    </motion.div>
  )
})

interface PlanetSphereProps {
  warmth: number
  smogOpacity: number
}

const PlanetSphere = React.memo<PlanetSphereProps>(function PlanetSphere({ warmth, smogOpacity }) {
  // Interpolate colors based on warmth (0 = cool blue, 1 = hot red)
  const getCoolColor = () => {
    const r = Math.round(30 + warmth * 170)  // 30 -> 200
    const g = Math.round(100 - warmth * 70)  // 100 -> 30
    const b = Math.round(200 - warmth * 100) // 200 -> 100
    return `rgb(${r}, ${g}, ${b})`
  }
  
  const getWarmColor = () => {
    const r = Math.round(10 + warmth * 90)   // 10 -> 100
    const g = Math.round(50 - warmth * 30)   // 50 -> 20
    const b = Math.round(120 - warmth * 80)  // 120 -> 40
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Atmospheric halo ring - outermost layer with gentle pulse */}
      <AtmosphericHalo color={getCoolColor()} />

      {/* Main rotating planet container */}
      <motion.div
        className="absolute w-full h-full"
        style={{
          willChange: 'transform',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Layer 1: Base sphere */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${getCoolColor()}, ${getWarmColor()})`,
            opacity: 0.5,
            willChange: 'opacity',
          }}
        />

        {/* Layer 2: Drifting clouds */}
        <CloudLayer />

        {/* Layer 3: Smog overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(139, 92, 46, 0.9), rgba(80, 60, 40, 0.7) 50%, transparent 75%)`,
            opacity: smogOpacity,
            willChange: 'opacity',
          }}
        />
      </motion.div>
    </div>
  )
})

// Separate component for atmospheric halo to prevent re-animation on prop changes
const AtmosphericHalo = React.memo<{ color: string }>(function AtmosphericHalo({ color }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        width: '100%',
        height: '100%',
        border: `2px solid ${color}`,
        willChange: 'opacity',
        transform: 'scale(1.25)',
      }}
      animate={{
        opacity: [0.1, 0.25, 0.1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
})

// Separate component for cloud layer to keep animation independent
const CloudLayer = React.memo(function CloudLayer() {
  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background: `radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.4), transparent 60%)`,
        willChange: 'transform, opacity',
      }}
      animate={{
        opacity: [0.08, 0.18, 0.08],
        x: [0, 8, 0],
        y: [0, -6, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
})

