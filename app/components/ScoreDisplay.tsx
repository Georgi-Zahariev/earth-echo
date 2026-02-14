'use client'

import React from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { ImpactLabel } from '@/lib/impact'

interface ScoreDisplayProps {
  score: number
  label: ImpactLabel
}

export const ScoreDisplay = React.memo<ScoreDisplayProps>(function ScoreDisplay({ score, label }) {
  const animatedScore = useCountUp(score, 400)

  return (
    <div className="relative z-10 text-center">
      <div className="text-8xl md:text-9xl font-bold tracking-tight tabular-nums">
        {animatedScore}
      </div>
      <div className="mt-2 space-y-2">
        <div className="text-lg md:text-xl text-slate-400 tracking-wider">
          Carbon Score
        </div>
        <div className="flex justify-center">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            label === 'Low' ? 'bg-green-900/50 text-green-300' :
            label === 'Moderate' ? 'bg-yellow-900/50 text-yellow-300' :
            'bg-red-900/50 text-red-300'
          }`}>
            {label} Impact
          </span>
        </div>
      </div>
    </div>
  )
})
