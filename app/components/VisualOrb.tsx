'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface VisualOrbProps {
  scale: number
  rotation: number
  opacity: number
}

export const VisualOrb = React.memo<VisualOrbProps>(function VisualOrb({
  scale,
  rotation,
  opacity,
}) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        scale,
        rotate: rotation,
        opacity,
      }}
    >
      <div className="relative">
        {/* Main orb */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
        
        {/* Ring 1 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-blue-400/30" />
        
        {/* Ring 2 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-purple-400/20" />
      </div>
    </motion.div>
  )
})
