'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ImpactResult } from '@/lib/impact'
import { SliderRow } from './SliderRow'

interface ImpactPanelProps {
  transport: number
  energy: number
  consumption: number
  impact: ImpactResult
  onTransportChange: (value: number) => void
  onEnergyChange: (value: number) => void
  onConsumptionChange: (value: number) => void
}

export const ImpactPanel = React.memo<ImpactPanelProps>(function ImpactPanel({
  transport,
  energy,
  consumption,
  impact,
  onTransportChange,
  onEnergyChange,
  onConsumptionChange,
}) {
  const handleReset = () => {
    onTransportChange(50)
    onEnergyChange(50)
    onConsumptionChange(50)
  }

  return (
    <motion.div
      className="w-full max-w-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
    >
      <div 
        className="border border-slate-700/40 rounded-3xl p-8 space-y-7 backdrop-blur-md relative overflow-hidden"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        {/* Subtle gradient background */}
        <div 
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 100%)',
          }}
        />

        {/* Header Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">Impact Controls</h2>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold tabular-nums">{impact.score}</span>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              impact.label === 'Low' ? 'bg-green-900/50 text-green-300' :
              impact.label === 'Moderate' ? 'bg-yellow-900/50 text-yellow-300' :
              'bg-red-900/50 text-red-300'
            }`}>
              {impact.label} Impact
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

        {/* Sliders Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inputs</h3>
          <div className="space-y-5">
            <SliderRow
              id="transport"
              label="Transport"
              icon="🚗"
              value={transport}
              onChange={(e) => onTransportChange(Number(e.target.value))}
            />

            <SliderRow
              id="energy"
              label="Energy"
              icon="⚡"
              value={energy}
              onChange={(e) => onEnergyChange(Number(e.target.value))}
            />

            <SliderRow
              id="consumption"
              label="Consumption"
              icon="🛒"
              value={consumption}
              onChange={(e) => onConsumptionChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

        {/* Impact Indicators Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Environmental Impact</h3>
          <div className="space-y-3">
            <ImpactMeter 
              label="Atmosphere" 
              value={impact.visualState.smogOpacity} 
            />
            <ImpactMeter 
              label="Heat" 
              value={impact.visualState.warmth} 
            />
            <ImpactMeter 
              label="Ice" 
              value={(1 - impact.visualState.iceScale) / 0.3} 
            />
            <ImpactMeter 
              label="Nature" 
              value={1 - impact.visualState.treeGlow} 
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-1">
          <motion.button
            onClick={handleReset}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Reset
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
})

interface ImpactMeterProps {
  label: string
  value: number // 0-1
}

const ImpactMeter = React.memo<ImpactMeterProps>(function ImpactMeter({ label, value }) {
  const percentage = Math.round(value * 100)
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-300 w-24">{label}</span>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: value < 0.33 ? 'rgb(74, 222, 128)' : 
                           value < 0.67 ? 'rgb(251, 191, 36)' : 
                           'rgb(248, 113, 113)',
            transformOrigin: 'left',
            willChange: 'transform',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs text-slate-500 w-10 text-right font-mono">
        {percentage}%
      </span>
    </div>
  )
})
