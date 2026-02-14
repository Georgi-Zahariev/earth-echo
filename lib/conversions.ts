/**
 * Conversions between real-world inputs and slider values (0-100)
 */

export interface RealWorldInputs {
  drivingHours: number    // hours per week, 0-40
  electricityKwh: number  // kWh per month, 0-2000
  ordersPerWeek: number   // orders per week, 0-20
}

export interface TypicalValues {
  driving: number
  electricity: number
  orders: number
}

export const TYPICAL: TypicalValues = {
  driving: 10,      // 10 hours/week
  electricity: 900, // 900 kWh/month
  orders: 3,        // 3 orders/week
}

// Convert real-world inputs to slider values (0-100)
export function realWorldToSliders(inputs: RealWorldInputs) {
  return {
    transport: Math.min(100, Math.round((inputs.drivingHours / 40) * 100)),
    energy: Math.min(100, Math.round((inputs.electricityKwh / 2000) * 100)),
    consumption: Math.min(100, Math.round((inputs.ordersPerWeek / 20) * 100)),
  }
}

// Convert slider values (0-100) back to real-world inputs
export function slidersToRealWorld(sliders: { transport: number; energy: number; consumption: number }): RealWorldInputs {
  return {
    drivingHours: Math.round((sliders.transport / 100) * 40),
    electricityKwh: Math.round((sliders.energy / 100) * 2000),
    ordersPerWeek: Math.round((sliders.consumption / 100) * 20),
  }
}

// Get comparison label (Below/Typical/Above)
export function getComparisonLabel(value: number, typical: number): string {
  const ratio = value / typical
  if (ratio < 0.85) return 'Below typical'
  if (ratio > 1.15) return 'Above typical'
  return 'Typical'
}

// Get comparison color class
export function getComparisonColor(value: number, typical: number): string {
  const ratio = value / typical
  if (ratio < 0.85) return 'text-green-400'
  if (ratio > 1.15) return 'text-orange-400'
  return 'text-slate-400'
}
