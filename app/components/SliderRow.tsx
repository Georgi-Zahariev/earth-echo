'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SliderRowProps {
  id: string
  label: string
  icon: string
  value: number
  min?: number
  max?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SliderRow = React.memo<SliderRowProps>(function SliderRow({
  id,
  label,
  icon,
  value,
  min = 0,
  max = 100,
  onChange,
}) {
  const fillProgress = (value - min) / (max - min)

  return (
    <div className="space-y-2.5">
      {/* Label row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <label htmlFor={id} className="text-sm font-medium text-slate-200">
            {label}
          </label>
        </div>
        <span className="text-xs text-slate-500 font-mono tabular-nums min-w-[2.5rem] text-right">
          {value}
        </span>
      </div>

      {/* Track container */}
      <div className="relative h-2 rounded-full bg-slate-800/40">
        {/* Filled track with scaleX animation */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400"
          style={{
            transformOrigin: 'left',
            willChange: 'transform',
          }}
          animate={{ scaleX: fillProgress }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />

        {/* Actual input range (invisible but interactive) */}
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step="1"
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
          aria-label={`${label} level from ${min} to ${max}`}
        />

        {/* Thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white pointer-events-none"
          style={{
            left: `calc(${fillProgress * 100}% - 7px)`,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15)',
          }}
        />
      </div>
    </div>
  )
})
