import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const STORAGE_KEY = "datacrawlr:saved"

interface SavedStore {
  ids: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  isSaved: (id: string) => boolean
  clear: () => void
}

export const useSaved = create<SavedStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id)
            ? s.ids.filter((x) => x !== id)
            : [...s.ids, id],
        })),
      remove: (id) =>
        set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      isSaved: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
