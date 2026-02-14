'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ImpactResult } from '@/lib/impact'
import { ScoreDisplay } from './ScoreDisplay'
import { Globe } from './Globe'

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
        {/* 3D Globe - Centered in scene */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[546px] h-[546px] lg:w-[598px] lg:h-[598px]">
          <Globe 
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
