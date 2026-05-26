import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const STORAGE_KEY = "datacrawlr:comparison"
export const COMPARISON_MAX = 4

interface ComparisonStore {
  ids: string[]
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useComparison = create<ComparisonStore>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) =>
        set((s) => {
          if (s.ids.includes(id)) return s
          const next = [...s.ids, id]
          // Cap at MAX — drop the oldest when exceeding
          return { ids: next.length > COMPARISON_MAX ? next.slice(-COMPARISON_MAX) : next }
        }),
      remove: (id) =>
        set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
