// Deep, low-saturation gradients keyed off a stable hash of the seed.
// We pre-bake them rather than generating in HSL so the visual rhythm of
// the marketing surfaces stays consistent across deploys.

const GRADIENTS = [
  "linear-gradient(135deg, #1A2238 0%, #0E1014 100%)",
  "linear-gradient(135deg, #2A1F38 0%, #0E1014 100%)",
  "linear-gradient(135deg, #1F2A38 0%, #0E1014 100%)",
  "linear-gradient(135deg, #1A2A1F 0%, #0E1014 100%)",
  "linear-gradient(135deg, #2A1F1F 0%, #0E1014 100%)",
  "linear-gradient(135deg, #1F1A2A 0%, #0E1014 100%)",
  "linear-gradient(135deg, #1A222A 0%, #0E1014 100%)",
  "linear-gradient(135deg, #25201A 0%, #0E1014 100%)",
] as const

export function gradientFor(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  }
  return GRADIENTS[Math.abs(h) % GRADIENTS.length]
}
