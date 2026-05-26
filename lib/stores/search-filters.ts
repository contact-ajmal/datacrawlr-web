import { create } from "zustand"

import type { Modality, SearchFilters, SourceProvider } from "@/lib/types"

export const SIZE_MIN = 1_000
export const SIZE_MAX = 1_000_000_000

export type UpdatedWithin = NonNullable<SearchFilters["updatedWithin"]>

interface SearchFiltersStore {
  modality: Modality[]
  license: string[]
  source: SourceProvider[]
  minSize: number
  maxSize: number
  minQuality: number
  updatedWithin: UpdatedWithin

  toggleModality: (m: Modality) => void
  toggleLicense: (l: string) => void
  toggleSource: (s: SourceProvider) => void
  setSizeRange: (min: number, max: number) => void
  setMinQuality: (q: number) => void
  setUpdatedWithin: (w: UpdatedWithin) => void
  clearAll: () => void
}

const INITIAL = {
  modality: [] as Modality[],
  license: [] as string[],
  source: [] as SourceProvider[],
  minSize: SIZE_MIN,
  maxSize: SIZE_MAX,
  minQuality: 0,
  updatedWithin: "any" as UpdatedWithin,
}

export const useSearchFilters = create<SearchFiltersStore>((set) => ({
  ...INITIAL,
  toggleModality: (m) =>
    set((s) => ({
      modality: s.modality.includes(m)
        ? s.modality.filter((x) => x !== m)
        : [...s.modality, m],
    })),
  toggleLicense: (l) =>
    set((s) => ({
      license: s.license.includes(l)
        ? s.license.filter((x) => x !== l)
        : [...s.license, l],
    })),
  toggleSource: (sp) =>
    set((s) => ({
      source: s.source.includes(sp)
        ? s.source.filter((x) => x !== sp)
        : [...s.source, sp],
    })),
  setSizeRange: (minSize, maxSize) => set({ minSize, maxSize }),
  setMinQuality: (minQuality) => set({ minQuality }),
  setUpdatedWithin: (updatedWithin) => set({ updatedWithin }),
  clearAll: () => set(INITIAL),
}))

export function toSearchFilters(s: {
  modality: Modality[]
  license: string[]
  source: SourceProvider[]
  minSize: number
  maxSize: number
  minQuality: number
  updatedWithin: UpdatedWithin
}): SearchFilters {
  const out: SearchFilters = {}
  if (s.modality.length) out.modality = s.modality
  if (s.license.length) out.license = s.license
  if (s.source.length) out.source = s.source
  if (s.minSize !== SIZE_MIN) out.minSize = s.minSize
  if (s.maxSize !== SIZE_MAX) out.maxSize = s.maxSize
  if (s.minQuality > 0) out.minQuality = s.minQuality
  if (s.updatedWithin !== "any") out.updatedWithin = s.updatedWithin
  return out
}

export function countActiveFilters(s: {
  modality: Modality[]
  license: string[]
  source: SourceProvider[]
  minSize: number
  maxSize: number
  minQuality: number
  updatedWithin: UpdatedWithin
}): number {
  let n = 0
  n += s.modality.length
  n += s.license.length
  n += s.source.length
  if (s.minSize !== SIZE_MIN || s.maxSize !== SIZE_MAX) n++
  if (s.minQuality > 0) n++
  if (s.updatedWithin !== "any") n++
  return n
}
