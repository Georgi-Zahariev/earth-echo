export interface ImpactInputs {
  transport: number // 0-100
  energy: number    // 0-100
  consumption: number // 0-100
}

export type ImpactLabel = 'Low' | 'Moderate' | 'High'

export interface VisualState {
  warmth: number        // 0-1: color temperature shift (blue to red)
  smogOpacity: number   // 0-1: atmospheric haze layer
  iceScale: number      // 0.7-1: polar ice cap size
  treeGlow: number      // 0-1: forest/vegetation intensity
}

export interface ImpactResult {
  score: number         // 0-100
  label: ImpactLabel
  visualState: VisualState
}

/**
 * Clamp value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Linear interpolation from input range to output range
 */
function lerp(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const normalized = clamp((value - inMin) / (inMax - inMin), 0, 1)
  return outMin + normalized * (outMax - outMin)
}

/**
 * Calculate environmental impact score and visual parameters
 * Higher inputs = higher impact = worse for environment
 */
export function calculateImpact(inputs: ImpactInputs): ImpactResult {
  // Weighted sum (transport has highest impact)
  const weights = {
    transport: 0.4,
    energy: 0.35,
    consumption: 0.25,
  }

  const score = clamp(
    inputs.transport * weights.transport +
    inputs.energy * weights.energy +
    inputs.consumption * weights.consumption,
    0,
    100
  )

  // Determine label based on score thresholds
  let label: ImpactLabel
  if (score < 33) {
    label = 'Low'
  } else if (score < 67) {
    label = 'Moderate'
  } else {
    label = 'High'
  }

  // Map score to visual parameters
  const visualState: VisualState = {
    // Higher score = warmer colors (more red)
    warmth: lerp(score, 0, 100, 0, 1),
    
    // Higher score = more smog
    smogOpacity: lerp(score, 0, 100, 0, 0.8),
    
    // Higher score = less ice (smaller ice caps)
    iceScale: lerp(score, 0, 100, 1, 0.7),
    
    // Higher score = less tree glow (dying forests)
    treeGlow: lerp(score, 0, 100, 1, 0),
  }

  return {
    score: Math.round(score),
    label,
    visualState,
  }
}
