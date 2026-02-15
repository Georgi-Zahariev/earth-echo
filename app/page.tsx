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
  const [aiFeedback, setAiFeedback] = useState<string>('')
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)

  const impact = calculateImpact({ transport, energy, consumption })

  // Fetch AI feedback
  const fetchFeedback = () => {
    setIsLoadingFeedback(true)
    setAiFeedback('')
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transport, energy, consumption }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAiFeedback(data.feedback || '')
        setIsLoadingFeedback(false)
      })
      .catch(() => {
        setAiFeedback('Unable to generate personalized feedback at this time.')
        setIsLoadingFeedback(false)
      })
  }

  // Fetch AI feedback when learn more opens
  useEffect(() => {
    if (isLearnOpen && !aiFeedback) {
      fetchFeedback()
    }
  }, [isLearnOpen])

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
            maxHeight: isLearnOpen ? '800px' : '0px',
            opacity: isLearnOpen ? 1 : 0,
            y: isLearnOpen ? 0 : -20,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden w-full max-w-2xl"
        >
          <div className="border border-white/10 rounded-2xl bg-slate-900/95 backdrop-blur-md shadow-2xl p-8 space-y-6 relative">
            {/* What is Carbon Score */}
            <div className="space-y-3">
              <h3 className="text-base font-medium text-slate-300">What is Carbon Score?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Carbon Score is a simplified metric that estimates your environmental impact based on three key daily habits: 
                driving, home energy consumption, and online shopping. While not a scientific carbon footprint calculator, 
                it helps you understand how your choices affect the planet and identify areas where small changes can make a difference.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.08]" />

            {/* Personalized AI Feedback */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-slate-300">Your Impact Analysis</h3>
                {aiFeedback && !isLoadingFeedback && (
                  <button
                    onClick={fetchFeedback}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs text-slate-400 hover:text-slate-300"
                    title="Regenerate feedback based on current values"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                    Refresh
                  </button>
                )}
              </div>
              {isLoadingFeedback ? (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing your habits...
                </div>
              ) : (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {aiFeedback || 'Open this section to get personalized feedback on your environmental impact.'}
                </p>
              )}
            </div>

            {/* Footer Note */}
            <p className="text-xs text-slate-600 italic pt-2">
              This is an educational estimate — not a scientific audit.
            </p>
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
