import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const STORAGE_KEY = "datacrawlr:model-comparison"
export const MODEL_COMPARISON_MAX = 4

interface ModelComparisonStore {
  slugs: string[]
  add: (slug: string) => void
  remove: (slug: string) => void
  clear: () => void
}

/**
 * Parallel to the dataset comparison store — same semantics, separate
 * localStorage key so the two trays don't trample each other.
 */
export const useModelComparison = create<ModelComparisonStore>()(
  persist(
    (set) => ({
      slugs: [],
      add: (slug) =>
        set((s) => {
          if (s.slugs.includes(slug)) return s
          const next = [...s.slugs, slug]
          return {
            slugs:
              next.length > MODEL_COMPARISON_MAX
                ? next.slice(-MODEL_COMPARISON_MAX)
                : next,
          }
        }),
      remove: (slug) =>
        set((s) => ({ slugs: s.slugs.filter((x) => x !== slug) })),
      clear: () => set({ slugs: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
