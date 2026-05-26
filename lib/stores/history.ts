import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const STORAGE_KEY = "datacrawlr:history"
export const HISTORY_MAX = 50

export interface HistoryEntry {
  id: string
  viewedAt: string
}

interface HistoryStore {
  entries: HistoryEntry[]
  record: (id: string) => void
  clear: () => void
}

export const useHistory = create<HistoryStore>()(
  persist(
    (set) => ({
      entries: [],
      record: (id) =>
        set((s) => {
          const now = new Date().toISOString()
          const filtered = s.entries.filter((e) => e.id !== id)
          const next = [{ id, viewedAt: now }, ...filtered].slice(0, HISTORY_MAX)
          return { entries: next }
        }),
      clear: () => set({ entries: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
