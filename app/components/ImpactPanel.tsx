'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ImpactResult } from '@/lib/impact'
import { SliderRow } from './SliderRow'
import { 
  slidersToRealWorld, 
  realWorldToSliders, 
  TYPICAL, 
  getComparisonLabel, 
  getComparisonColor,
  type RealWorldInputs 
} from '@/lib/conversions'

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
  // Track source of updates to avoid loops
  const isUpdatingFromSlider = useRef(false)
  const isUpdatingFromInput = useRef(false)
  
  // Real-world inputs state
  const [realWorld, setRealWorld] = useState<RealWorldInputs>(() => 
    slidersToRealWorld({ transport, energy, consumption })
  )
  
  // Update real-world inputs when sliders change (from external source)
  useEffect(() => {
    if (!isUpdatingFromInput.current) {
      isUpdatingFromSlider.current = true
      setRealWorld(slidersToRealWorld({ transport, energy, consumption }))
      setTimeout(() => { isUpdatingFromSlider.current = false }, 0)
    }
  }, [transport, energy, consumption])
  
  const handleRealWorldChange = (field: keyof RealWorldInputs, value: number) => {
    if (isUpdatingFromSlider.current) return
    
    isUpdatingFromInput.current = true
    const newRealWorld = { ...realWorld, [field]: value }
    setRealWorld(newRealWorld)
    
    const sliders = realWorldToSliders(newRealWorld)
    onTransportChange(sliders.transport)
    onEnergyChange(sliders.energy)
    onConsumptionChange(sliders.consumption)
    
    setTimeout(() => { isUpdatingFromInput.current = false }, 0)
  }

  const handleReset = () => {
    onTransportChange(50)
    onEnergyChange(50)
    onConsumptionChange(50)
  }

  // Determine primary driver
  const getPrimaryDriver = () => {
    const max = Math.max(transport, energy, consumption)
    if (transport === max) return 'Transport'
    if (energy === max) return 'Energy'
    return 'Consumption'
  }

  return (
    <motion.div
      className="w-full max-w-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
    >
      <div 
        className="border border-white/5 rounded-3xl backdrop-blur-sm relative overflow-hidden flex flex-col max-h-[calc(100vh-140px)]"
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03), 0 4px 24px rgba(0, 0, 0, 0.24)',
        }}
      >
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 px-7 pt-5 pb-3 space-y-6">
          {/* Header Section */}
          <div className="space-y-1.5">
            <h2 className="text-xl font-medium tracking-tight text-slate-100">Impact Analysis</h2>
            <div className="flex items-baseline gap-2.5">
              <span className="text-5xl font-light tabular-nums text-slate-50">{impact.score}</span>
              <span className={`text-[10px] font-medium px-2 py-1 rounded ${
                impact.label === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                impact.label === 'Moderate' ? 'bg-amber-500/10 text-amber-400' :
                'bg-rose-500/10 text-rose-400'
              }`}>
                {impact.label.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light">
              Primary driver: <span className="text-slate-400">{getPrimaryDriver()}</span>
            </p>
            <p className="text-sm text-slate-500 font-light leading-relaxed max-w-md mt-2">
              Find out how you influence the planet in your daily routine.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.04]" />

          {/* Real-world Inputs Section */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Real-world Inputs</h3>
            <div className="space-y-3">
              <RealWorldInput
                label="Driving"
                value={realWorld.drivingHours}
                suffix="h/wk"
                min={0}
                max={40}
                typical={TYPICAL.driving}
                onChange={(val: number) => handleRealWorldChange('drivingHours', val)}
              />
              <RealWorldInput
                label="Electricity"
                value={realWorld.electricityKwh}
                suffix="kWh/mo"
                min={0}
                max={2000}
                typical={TYPICAL.electricity}
                onChange={(val: number) => handleRealWorldChange('electricityKwh', val)}
              />
              <RealWorldInput
                label="Online Orders"
                value={realWorld.ordersPerWeek}
                suffix="orders/wk"
                min={0}
                max={20}
                typical={TYPICAL.orders}
                onChange={(val: number) => handleRealWorldChange('ordersPerWeek', val)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.04]" />

          {/* Impact Indicators Section */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Environmental Impact</h3>
            <div className="space-y-2.5">
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
        </div>

        {/* Fixed Footer - Reset */}
        <div className="border-t border-white/[0.04] px-7 py-3 flex justify-end">
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200"
          >
            Reset defaults
          </button>
        </div>
      </div>
    </motion.div>
  )
})

interface RealWorldInputProps {
  label: string
  value: number
  suffix: string
  min: number
  max: number
  typical: number
  onChange: (value: number) => void
}

const RealWorldInput = React.memo<RealWorldInputProps>(function RealWorldInput({
  label,
  value,
  suffix,
  min,
  max,
  typical,
  onChange,
}) {
  const percentage = ((value - min) / (max - min)) * 100
  const typicalPercentage = ((typical - min) / (max - min)) * 100
  
  // Determine color based on value vs typical (lower is better)
  const getColor = () => {
    const ratio = value / typical
    if (ratio < 0.7) return 'bg-emerald-500/80'
    if (ratio < 0.9) return 'bg-emerald-500/60'
    if (ratio <= 1.1) return 'bg-slate-500/60'
    if (ratio <= 1.3) return 'bg-amber-500/60'
    return 'bg-rose-500/70'
  }
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (!isNaN(val)) {
      onChange(Math.max(min, Math.min(max, val)))
    }
  }
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400 w-28 font-light">{label}</span>
        <div className="flex-1 flex items-center gap-3">
          {/* Slider track with typical marker and tick marks */}
          <div className="flex-1 relative h-1.5 rounded-full bg-white/[0.06]">
            {/* Tick marks at 25/50/75 */}
            <div className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-white/[0.06]" style={{ left: '25%' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-white/[0.06]" style={{ left: '50%' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-white/[0.06]" style={{ left: '75%' }} />
            
            {/* Fill indicating current value */}
            <div 
              className={`absolute h-full rounded-full transition-all duration-300 ease-out ${getColor()}`}
              style={{ width: `${percentage}%` }}
            />
            
            {/* Typical/average marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-[1.5px] h-3 bg-slate-400/50"
              style={{ left: `${typicalPercentage}%` }}
            />
            
            {/* Interactive range input */}
            <input
              type="range"
              value={value}
              onChange={handleSliderChange}
              min={min}
              max={max}
              step="1"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              style={{
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            />
          </div>
          
          {/* Number input */}
          <input
            type="number"
            value={value}
            onChange={handleNumberChange}
            min={min}
            max={max}
            className="w-16 px-2 py-1 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-slate-300 focus:outline-none focus:border-white/10 transition-colors tabular-nums"
          />
          <span className="text-xs text-slate-600 w-14 font-light">{suffix}</span>
        </div>
      </div>
    </div>
  )
})

interface ImpactMeterProps {
  label: string
  value: number // 0-1
}

const ImpactMeter = React.memo<ImpactMeterProps>(function ImpactMeter({ label, value }) {
  const percentage = Math.round(value * 100)
  
  // Softer, more muted colors
  const getColor = () => {
    if (value < 0.33) return 'rgba(52, 211, 153, 0.6)' // emerald
    if (value < 0.67) return 'rgba(251, 191, 36, 0.6)' // amber
    return 'rgba(248, 113, 113, 0.6)' // rose
  }
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-400 w-24 font-light">{label}</span>
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: getColor(),
            transformOrigin: 'left',
            willChange: 'transform',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="text-xs text-slate-600 w-9 text-right font-mono tabular-nums">
        {percentage}%
      </span>
    </div>
  )
})
