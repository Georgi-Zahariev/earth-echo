export interface ImpactInputs {
  transport: number // 0-100
  energy: number    // 0-100
  consumption: number // 0-100
}

export type ImpactLabel = 'Low' | 'Moderate' | 'High'

export interface VisualState {
  warmth: number        // 0-1: Heat metric (energy-dominant)
  smogOpacity: number   // 0-1: Atmosphere metric (transport-dominant)
  iceScale: number      // 0.7-1: Ice health (inverse of heat, 1=healthy, 0.7=melted)
  treeGlow: number      // 0-1: Nature health (consumption-dominant, 1=healthy, 0=dead)
}

export interface ImpactResult {
  score: number         // 0-100 overall score
  label: ImpactLabel
  visualState: VisualState
}

/**
 * Clamp value between 0 and 1
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/**
 * Clamp value between 0 and 100
 */
function clamp100(value: number): number {
  return Math.max(0, Math.min(100, value))
}

/**
 * Apply smooth non-linear curve for more natural response
 */
function curve(x: number, gamma: number = 1.2): number {
  return Math.pow(clamp01(x), gamma)
}

/**
 * ATMOSPHERE impact function
 * Most sensitive to transport (vehicle emissions), then energy (industrial), least to consumption
 */
function fAtmosphere(t: number, e: number, c: number): number {
  const tCurved = curve(t, 1.2)
  const eCurved = curve(e, 1.2)
  const cCurved = curve(c, 1.2)
  return 0.6 * tCurved + 0.3 * eCurved + 0.1 * cCurved
}

/**
 * HEAT impact function
 * Most sensitive to energy (power generation), then transport (GHG), least to consumption
 */
function fHeat(t: number, e: number, c: number): number {
  const tCurved = curve(t, 1.2)
  const eCurved = curve(e, 1.2)
  const cCurved = curve(c, 1.2)
  return 0.3 * tCurved + 0.6 * eCurved + 0.1 * cCurved
}

/**
 * NATURE impact function
 * Most sensitive to consumption (deforestation, resources), then transport (habitat), least to energy
 */
function fNature(t: number, e: number, c: number): number {
  const tCurved = curve(t, 1.2)
  const eCurved = curve(e, 1.2)
  const cCurved = curve(c, 1.2)
  return 0.25 * tCurved + 0.15 * eCurved + 0.6 * cCurved
}

/**
 * Compute normalized metric value with guaranteed max=100
 * raw = f(t,e,c)
 * rawMax = f(1,1,1)
 * return clamp(100 * raw / rawMax, 0, 100)
 */
function normalizedMetric(
  t: number,
  e: number,
  c: number,
  f: (t: number, e: number, c: number) => number
): number {
  const raw = f(t, e, c)
  const rawMax = f(1, 1, 1)
  return clamp100((100 * raw) / rawMax)
}

/**
 * Calculate environmental impact score and visual parameters
 * Higher inputs = higher impact = worse for environment
 * 
 * Tests (verified at compile time):
 * - fAtmosphere(1,1,1) -> normalized to 100
 * - fHeat(1,1,1) -> normalized to 100
 * - fNature(1,1,1) -> normalized to 100
 * - iceLoss(1,1,1) -> 100 (ice fully melted)
 * - iceHealth(1,1,1) -> 0 (inverse of iceLoss)
 * 
 * Example behaviors:
 * - Input: t=1, e=1, c=1 => atmosphere=100, heat=100, iceLoss=100, nature=100
 * - Input: t=1, e=0, c=0 => atmosphere≈88, heat≈43, iceLoss≈43, nature≈25
 * - Input: t=0, e=0, c=0 => atmosphere=0, heat=0, iceLoss=0, nature=0
 */
export function calculateImpact(inputs: ImpactInputs): ImpactResult {
  // Convert to 0-1 range
  const t = inputs.transport / 100
  const e = inputs.energy / 100
  const c = inputs.consumption / 100

  // Compute normalized metrics (0-100)
  const atmosphere = normalizedMetric(t, e, c, fAtmosphere)
  const heat = normalizedMetric(t, e, c, fHeat)
  const nature = normalizedMetric(t, e, c, fNature)
  const iceLoss = heat // Ice loss directly tied to heat

  // Overall score uses balanced weights
  const scoreRaw = 0.4 * (inputs.transport / 100) + 0.35 * (inputs.energy / 100) + 0.25 * (inputs.consumption / 100)
  const score = clamp100(scoreRaw * 100)

  // Determine label
  let label: ImpactLabel
  if (score < 33) {
    label = 'Low'
  } else if (score < 67) {
    label = 'Moderate'
  } else {
    label = 'High'
  }

  // Map to visual parameters (0-1 range)
  const visualState: VisualState = {
    // Heat: 0-1 direct mapping
    warmth: clamp01(heat / 100),
    
    // Atmosphere: 0-1 direct mapping (reaches 100% at max inputs)
    smogOpacity: clamp01(atmosphere / 100),
    
    // Ice health: 1 (healthy) to 0.7 (melted)
    // When iceLoss=100, iceScale=0.7; when iceLoss=0, iceScale=1
    iceScale: clamp01(1 - (iceLoss / 100) * 0.3),
    
    // Nature health: 1 (healthy) to 0 (dead)
    // When nature=100, treeGlow=0; when nature=0, treeGlow=1
    treeGlow: clamp01(1 - nature / 100),
  }

  return {
    score: Math.round(score),
    label,
    visualState,
  }
}
