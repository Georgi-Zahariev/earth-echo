'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ImpactResult } from '@/lib/impact'

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
        className="border border-slate-600/50 rounded-lg p-6 space-y-6 backdrop-blur-md bg-slate-900/40"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Impact Controls</h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{impact.score}</span>
            <span className={`text-sm font-medium px-3 py-1 rounded ${
              impact.label === 'Low' ? 'bg-green-900/50 text-green-300' :
              impact.label === 'Moderate' ? 'bg-yellow-900/50 text-yellow-300' :
              'bg-red-900/50 text-red-300'
            }`}>
              {impact.label}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <SliderControl
            id="transport"
            label="Transport"
            value={transport}
            onChange={(e) => onTransportChange(Number(e.target.value))}
          />

          <SliderControl
            id="energy"
            label="Energy"
            value={energy}
            onChange={(e) => onEnergyChange(Number(e.target.value))}
          />

          <SliderControl
            id="consumption"
            label="Consumption"
            value={consumption}
            onChange={(e) => onConsumptionChange(Number(e.target.value))}
          />
        </div>

        <div className="pt-4 border-t border-slate-700 space-y-3">
          <div className="text-sm text-slate-400 space-y-1">
            <p>Warmth: {impact.visualState.warmth.toFixed(2)}</p>
            <p>Smog: {impact.visualState.smogOpacity.toFixed(2)}</p>
            <p>Ice: {impact.visualState.iceScale.toFixed(2)}</p>
            <p>Trees: {impact.visualState.treeGlow.toFixed(2)}</p>
          </div>
          
          <motion.button
            onClick={handleReset}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm font-medium"
          >
            Reset to Default
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
})

interface SliderControlProps {
  id: string
  label: string
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SliderControl({ id, label, value, onChange }: SliderControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
        <span className="text-sm text-slate-400 font-mono w-12 text-right">
          {value}
        </span>
      </div>
      <input
        type="range"
        id={id}
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-400
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
          [&::-moz-range-thumb]:bg-slate-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        aria-label={`${label} level from 0 to 100`}
      />
    </div>
  )
}
