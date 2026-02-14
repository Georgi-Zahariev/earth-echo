'use client'

import React from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Slider = React.memo<SliderProps>(function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm text-gray-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
      />
    </div>
  )
})
