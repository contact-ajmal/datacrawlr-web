const RECENT_KEY = "datacrawlr:recent-searches"
const MAX_RECENT = 5

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === "string").slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

export function pushRecentSearch(query: string): string[] {
  if (typeof window === "undefined") return []
  const trimmed = query.trim()
  if (!trimmed) return getRecentSearches()
  const filtered = getRecentSearches().filter((q) => q !== trimmed)
  const next = [trimmed, ...filtered].slice(0, MAX_RECENT)
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // localStorage may be disabled — silently no-op
  }
  return next
}
