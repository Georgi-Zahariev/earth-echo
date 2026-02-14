'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlanetHero } from './components/PlanetHero'
import { ImpactPanel } from './components/ImpactPanel'
import { ReactiveBackground } from './components/ReactiveBackground'
import { useRafState } from './hooks/useRafState'
import { calculateImpact } from '@/lib/impact'

export default function Home() {
  const [transport, setTransport] = useRafState(50)
  const [energy, setEnergy] = useRafState(50)
  const [consumption, setConsumption] = useRafState(50)
  const [isLearnOpen, setIsLearnOpen] = useState(false)

  const impact = calculateImpact({ transport, energy, consumption })

  // Auto-scroll when learn more opens/closes
  useEffect(() => {
    if (isLearnOpen) {
      // Scroll to bottom to show the content
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
    } else {
      // Scroll back to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isLearnOpen])

  return (
    <main className="min-h-screen w-full text-white relative">
      {/* Reactive background with vignette */}
      <ReactiveBackground 
        warmth={impact.visualState.warmth}
        smogOpacity={impact.visualState.smogOpacity}
      />

      {/* Title Area */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          EarthEcho
        </h1>
      </header>

      {/* Main Layout Grid */}
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 lg:p-6 pt-24 pb-20">
        {/* Center Area - Planet Hero */}
        <div className="flex items-center justify-center py-4">
          <PlanetHero impact={impact} />
        </div>

        {/* Right/Bottom Area - Impact Panel */}
        <div className="flex items-center justify-center py-4">
          <ImpactPanel
            transport={transport}
            energy={energy}
            consumption={consumption}
            impact={impact}
            onTransportChange={setTransport}
            onEnergyChange={setEnergy}
            onConsumptionChange={setConsumption}
          />
        </div>
      </div>

      {/* Learn More Section - In Flow */}
      <div className="w-full flex justify-center px-4 pb-24">
        <motion.div
          initial={false}
          animate={{ 
            maxHeight: isLearnOpen ? '500px' : '0px',
            opacity: isLearnOpen ? 1 : 0,
            y: isLearnOpen ? 0 : -20,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden w-full max-w-2xl"
        >
          <div className="border border-white/10 rounded-2xl bg-slate-900/95 backdrop-blur-md shadow-2xl p-8">
            <div className="space-y-4">
              <h3 className="text-base font-medium text-slate-300">How it works</h3>
              <ul className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-slate-600 mt-1">•</span>
                  <span>Carbon Score is a simple estimate based on driving, home energy, and deliveries.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-600 mt-1">•</span>
                  <span>Higher values generally mean more emissions and resource use.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-600 mt-1">•</span>
                  <span>Small changes (less driving, lower energy use, fewer deliveries) reduce impact.</span>
                </li>
              </ul>
              <p className="text-xs text-slate-600 italic pt-2">
                This is an educational estimate — not a scientific audit.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toggle Button - Bottom Center */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsLearnOpen(!isLearnOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800/90 hover:border-white/20 transition-all duration-300 shadow-lg text-xs text-slate-400 hover:text-slate-200"
        >
          <span>{isLearnOpen ? 'Hide' : 'Learn about Carbon Score'}</span>
          <motion.svg
            animate={{ rotate: isLearnOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </button>
      </div>
    </main>
  )
}
