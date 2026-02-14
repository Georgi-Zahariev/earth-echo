'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ImpactResult } from '@/lib/impact'
import { useCountUp } from '../hooks/useCountUp'

interface PlanetHeroProps {
  impact: ImpactResult
}

export const PlanetHero = React.memo<PlanetHeroProps>(function PlanetHero({ impact }) {
  const animatedScore = useCountUp(impact.score, 400)

  return (
    <motion.div
      className="w-full max-w-2xl aspect-square flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="relative flex items-center justify-center">
        {/* Score Display */}
        <div className="relative z-10 text-center">
          <div className="text-8xl md:text-9xl font-bold tracking-tight">
            {animatedScore}
          </div>
          <div className="text-lg md:text-xl text-slate-400 tracking-wider">
            Carbon Score
          </div>
        </div>

        {/* Planet with rotation and halo */}
        <PlanetSphere 
          warmth={impact.visualState.warmth} 
          smogOpacity={impact.visualState.smogOpacity}
        />
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
    <>
      {/* Halo pulse - behind planet */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          width: '450px',
          height: '450px',
          background: `radial-gradient(circle, ${getCoolColor()}, transparent 70%)`,
          willChange: 'opacity',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Planet container with rotation */}
      <motion.div
        className="absolute inset-0"
        style={{
          width: '400px',
          height: '400px',
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
            opacity: 0.4,
          }}
        />

        {/* Layer 2: Clouds overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 50%, rgba(255, 255, 255, 0.3), transparent 60%)`,
            opacity: 0.2,
          }}
        />

        {/* Layer 3: Smog overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(139, 92, 46, 0.8), rgba(80, 60, 40, 0.6) 60%, transparent 80%)`,
            opacity: smogOpacity,
            willChange: 'opacity',
          }}
        />
      </motion.div>
    </>
  )
})

