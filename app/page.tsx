'use client'

import { PlanetHero } from './components/PlanetHero'
import { ImpactPanel } from './components/ImpactPanel'
import { useRafState } from './hooks/useRafState'
import { calculateImpact } from '@/lib/impact'

export default function Home() {
  const [transport, setTransport] = useRafState(50)
  const [energy, setEnergy] = useRafState(50)
  const [consumption, setConsumption] = useRafState(50)

  const impact = calculateImpact({ transport, energy, consumption })

  return (
    <main className="min-h-screen w-full bg-slate-950 text-white">
      {/* Title Area */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          EarthEcho
        </h1>
      </header>

      {/* Main Layout Grid */}
      <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-24">
        {/* Center Area - Planet Hero */}
        <div className="flex items-center justify-center">
          <PlanetHero impact={impact} />
        </div>

        {/* Right/Bottom Area - Impact Panel */}
        <div className="flex items-center justify-center">
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
    </main>
  )
}
