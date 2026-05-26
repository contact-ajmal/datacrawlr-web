// ----------------------------------------------------------------------------
// Live API client for the Datacrawlr backend.
//
// Endpoints live under `${NEXT_PUBLIC_API_BASE_URL}/v1`. Responses use camelCase
// aliases (set in the FastAPI schemas), so the wire shape lines up with the TS
// types in `./types.ts` and we can hand the parsed JSON straight to the UI.
//
// Caching strategy:
//   * Server-side fetches opt into Next.js's data cache via `next.revalidate`
//     so popular pages can be served from the cache while still picking up
//     fresh data within the revalidation window.
//   * Each function is wrapped with React's `cache()` so multiple awaits of
//     the same path within a single server render dedupe to one HTTP call
//     (e.g. the search page's synthesis + results panes both reading the
//     same query).
//
// On 404 we return `null` so callers can fall through to `notFound()`; every
// other non-2xx throws so the route's error boundary catches it.
// ----------------------------------------------------------------------------

import { cache } from "react"

import type {
  Dataset,
  DatasetSuggestion,
  DomainStat,
  GraphEdge,
  GraphNode,
  Modality,
  SearchFilters,
  SearchResponse,
  SearchResult,
} from "./types"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
const API_BASE = `${BASE_URL}/v1`

// Freshness windows per endpoint type, tuned to how often the underlying
// data actually changes. Short for query-driven things (search, related),
// long for site-wide counters.
const REVALIDATE = {
  search: 60,
  trending: 300,
  recent: 60,
  graph: 120,
  dataset: 60,
  related: 60,
  list: 300,
  stats: 600,
  collection: 300,
  // Suggestion/domain endpoints are cached on the backend (Redis) so we
  // can keep these short on the Next.js side and lean on the upstream
  // cache for de-duping bursts.
  suggest: 30,
  domains: 300,
} as const

export interface PublicStats {
  totalDatasets: number
  totalSources: number
  totalRelationships: number
  lastUpdatedAt: string | null
}

async function apiFetch<T>(
  path: string,
  revalidate: number,
  init?: RequestInit
): Promise<T | null> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    next: { revalidate },
  })
  if (!res.ok) {
    if (res.status === 404) return null
    const body = await res.text().catch(() => "")
    throw new Error(`API ${res.status} ${path}: ${body}`)
  }
  return (await res.json()) as T
}

export const searchDatasets = cache(
  async (
    q: string,
    filters?: SearchFilters,
    page = 1,
    pageSize = 20
  ): Promise<SearchResponse> => {
    const params = new URLSearchParams({ q })
    filters?.modality?.forEach((m) => params.append("modality", m))
    filters?.license?.forEach((l) => params.append("license_type", l))
    filters?.source?.forEach((s) => params.append("source", s))
    if (filters?.minSize !== undefined)
      params.set("minSize", String(filters.minSize))
    if (filters?.maxSize !== undefined)
      params.set("maxSize", String(filters.maxSize))
    if (filters?.minQuality !== undefined)
      params.set("minQuality", String(filters.minQuality))
    if (filters?.updatedWithin)
      params.set("updatedWithin", filters.updatedWithin)
    params.set("page", String(Math.max(1, page)))
    // Backend caps pageSize at 100; clamp here so the URL is always legal.
    params.set("pageSize", String(Math.min(100, Math.max(1, pageSize))))

    const data = await apiFetch<{
      results: SearchResult[]
      total: number
    }>(`/search/?${params}`, REVALIDATE.search)
    return {
      results: data?.results ?? [],
      total: data?.total ?? 0,
      page: Math.max(1, page),
      pageSize: Math.min(100, Math.max(1, pageSize)),
    }
  }
)

export const getDatasetBySlug = cache(
  async (slug: string): Promise<Dataset | null> => {
    return apiFetch<Dataset>(
      `/datasets/${encodeURIComponent(slug)}`,
      REVALIDATE.dataset
    )
  }
)

export const getRelatedDatasets = cache(
  async (slug: string, limit = 10): Promise<Dataset[]> => {
    const data = await apiFetch<{ items: Dataset[]; total: number }>(
      `/datasets/${encodeURIComponent(slug)}/related?limit=${limit}`,
      REVALIDATE.related
    )
    return data?.items ?? []
  }
)

export const getGraph = cache(
  async (
    focusSlug?: string,
    maxNodes = 150
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> => {
    const params = new URLSearchParams()
    if (focusSlug) params.set("focus", focusSlug)
    params.set("maxNodes", String(maxNodes))
    const data = await apiFetch<{ nodes: GraphNode[]; edges: GraphEdge[] }>(
      `/graph/?${params}`,
      REVALIDATE.graph
    )
    return data ?? { nodes: [], edges: [] }
  }
)

export const getTrendingDatasets = cache(
  async (limit = 8): Promise<Dataset[]> => {
    const data = await apiFetch<{ items: Dataset[]; total: number }>(
      `/search/trending?limit=${limit}`,
      REVALIDATE.trending
    )
    return data?.items ?? []
  }
)

export const getRecentlyUpdated = cache(async (limit = 6): Promise<Dataset[]> => {
  const data = await apiFetch<{ items: Dataset[]; total: number }>(
    `/search/recent?limit=${limit}`,
    REVALIDATE.recent
  )
  return data?.items ?? []
})

export const getDatasets = cache(async (limit = 100): Promise<Dataset[]> => {
  // Backend caps /datasets/ at 100 per page. Clamp here so callers can
  // ask for a generous number without worrying about 422.
  const safeLimit = Math.min(Math.max(limit, 1), 100)
  const data = await apiFetch<{ items: Dataset[]; total: number }>(
    `/datasets/?limit=${safeLimit}&sort=popular`,
    REVALIDATE.list
  )
  return data?.items ?? []
})

export const getStats = cache(async (): Promise<PublicStats | null> => {
  return apiFetch<PublicStats>(`/stats`, REVALIDATE.stats)
})

// Type-ahead suggestions are not wrapped with `cache()` — they're called per
// keystroke from a client component, so React's per-request dedupe doesn't
// help. Server-side revalidate + Redis on the backend handle the burst.
export async function suggestDatasets(
  q: string,
  limit = 8
): Promise<DatasetSuggestion[]> {
  if (q.length < 2) return []
  const params = new URLSearchParams({ q, limit: String(limit) })
  const data = await apiFetch<DatasetSuggestion[]>(
    `/search/suggest?${params}`,
    REVALIDATE.suggest
  )
  return data ?? []
}

export const getDatasetsByModality = cache(
  async (modality: Modality, limit = 6): Promise<Dataset[]> => {
    const safeLimit = Math.min(Math.max(limit, 1), 100)
    const data = await apiFetch<{ results: Dataset[]; total: number }>(
      `/search/?modality=${encodeURIComponent(modality)}&pageSize=${safeLimit}`,
      REVALIDATE.search
    )
    return data?.results ?? []
  }
)

export interface MLTaskStat {
  task: string
  count: number
}

export interface CatalogFacets {
  modality: Record<string, number>
  licenseType: Record<string, number>
  sourcePlatform: Record<string, number>
  language: Record<string, number>
  mlTask: Record<string, number>
}

export interface SourceSummary {
  platform: string
  name: string
  description: string
  totalDatasets: number
  lastRunAt: string | null
  status: "active" | "degraded" | "failing" | "unknown"
  sampleDatasetSlugs: string[]
}

/** Backend `/v1/stats/freshness` isn't built yet — fields kept loose so we
 *  can wire it once the endpoint lands without another type churn. */
export interface FreshnessSnapshot {
  buckets: { label: string; count: number; sampleSlugs: string[] }[]
  timeline: { month: string; count: number }[]
  activeSources: { platform: string; updatesLast30d: number }[]
}

export const getMLTaskStats = cache(async (): Promise<MLTaskStat[]> => {
  // No dedicated /v1/stats/ml-tasks endpoint yet — read the facets that
  // the global search aggregation already produces. The backend returns
  // a {bucket: count} dict (camelCase under `mlTask`), which we project
  // into an array sorted by count desc.
  const data = await apiFetch<{
    facets?: { mlTask?: Record<string, number> }
  }>(`/search/?q=&pageSize=1`, REVALIDATE.search)
  const buckets = data?.facets?.mlTask ?? {}
  return Object.entries(buckets)
    .map(([task, count]) => ({ task, count }))
    .sort((a, b) => b.count - a.count)
})

export const getCatalogFacets = cache(async (): Promise<CatalogFacets> => {
  const data = await apiFetch<{ facets?: Partial<CatalogFacets> }>(
    `/search/?q=&pageSize=1`,
    REVALIDATE.stats
  )
  const f = data?.facets ?? {}
  return {
    modality: f.modality ?? {},
    licenseType: f.licenseType ?? {},
    sourcePlatform: f.sourcePlatform ?? {},
    language: f.language ?? {},
    mlTask: f.mlTask ?? {},
  }
})

export const getSourcesSummary = cache(
  async (): Promise<SourceSummary[]> => {
    const data = await apiFetch<SourceSummary[]>(
      `/sources/summary`,
      REVALIDATE.stats
    )
    return data ?? []
  }
)

// Approximation until /v1/stats/freshness ships: we hit /search/recent for
// the bucket samples and read the rest from existing facets. The timeline
// uses a coarse "most-recent N" sample bucketed by month, which is enough
// for a visual.
//
// TODO: replace with the dedicated endpoint when the backend exposes it.
export const getFreshnessSnapshot = cache(
  async (): Promise<FreshnessSnapshot> => {
    const recent = await apiFetch<{ items: Dataset[]; total: number }>(
      `/search/recent?limit=100`,
      REVALIDATE.recent
    )
    const items = recent?.items ?? []
    const now = Date.now()
    const DAY = 24 * 60 * 60 * 1000

    const ageMs = (iso: string | undefined | null) => {
      if (!iso) return Number.POSITIVE_INFINITY
      const t = new Date(iso).getTime()
      return Number.isFinite(t) ? now - t : Number.POSITIVE_INFINITY
    }

    const inWindow = (d: Dataset, maxAgeDays: number) =>
      ageMs(d.lastUpdated) <= maxAgeDays * DAY

    const sampleSlugs = (rows: Dataset[]) =>
      rows.slice(0, 3).map((d) => d.slug)

    const week = items.filter((d) => inWindow(d, 7))
    const month = items.filter((d) => !inWindow(d, 7) && inWindow(d, 30))
    const year = items.filter((d) => !inWindow(d, 30) && inWindow(d, 365))
    const older = items.filter((d) => !inWindow(d, 365))

    const buckets = [
      { label: "Updated this week", count: week.length, sampleSlugs: sampleSlugs(week) },
      { label: "This month", count: month.length, sampleSlugs: sampleSlugs(month) },
      { label: "This year", count: year.length, sampleSlugs: sampleSlugs(year) },
      { label: "Older than 1 year", count: older.length, sampleSlugs: sampleSlugs(older) },
    ]

    // Monthly histogram over the last 24 months.
    const months: { month: string; count: number }[] = []
    const today = new Date()
    for (let i = 23; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const key = d.toISOString().slice(0, 7) // YYYY-MM
      months.push({ month: key, count: 0 })
    }
    const index = new Map(months.map((m, i) => [m.month, i]))
    for (const it of items) {
      if (!it.lastUpdated) continue
      const key = it.lastUpdated.slice(0, 7)
      const slot = index.get(key)
      if (slot !== undefined) months[slot].count += 1
    }

    // Per-source recent-update count. We re-use the same sample.
    const perSource = new Map<string, number>()
    for (const it of items) {
      for (const s of it.sources) {
        perSource.set(s.provider, (perSource.get(s.provider) ?? 0) + 1)
      }
    }
    const activeSources = Array.from(perSource.entries())
      .map(([platform, updatesLast30d]) => ({ platform, updatesLast30d }))
      .sort((a, b) => b.updatesLast30d - a.updatesLast30d)
      .slice(0, 5)

    return { buckets, timeline: months, activeSources }
  }
)

export const getDomainStats = cache(async (): Promise<DomainStat[]> => {
  const data = await apiFetch<DomainStat[]>(
    `/stats/domains`,
    REVALIDATE.domains
  )
  return data ?? []
})

// --------------------------------------------------------------------------
// Models
//
// The backend's /v1/models surface is being scaffolded alongside this
// frontend. Until it lands the helpers below throw on a 404, which the
// data-layer wrappers catch and fall through to the mock fixtures for.
// --------------------------------------------------------------------------

const MODEL_REVALIDATE = REVALIDATE.list

export const listModels = cache(
  async (
    filters?: import("./types").ModelFilters,
    page = 1,
    pageSize = 25,
    sort?: string
  ): Promise<{
    items: import("./types").Model[]
    total: number
    page: number
    pageSize: number
  }> => {
    const params = new URLSearchParams()
    filters?.accessType?.forEach((v) => params.append("accessType", v))
    filters?.organization?.forEach((v) => params.append("organization", v))
    filters?.sourcePlatform?.forEach((v) => params.append("sourcePlatform", v))
    filters?.licenseType?.forEach((v) => params.append("licenseType", v))
    filters?.modality?.forEach((v) => params.append("modality", v))
    if (filters?.minParameters !== undefined)
      params.set("minParameters", String(filters.minParameters))
    if (filters?.maxParameters !== undefined)
      params.set("maxParameters", String(filters.maxParameters))
    if (filters?.commercialUseOnly) params.set("commercialUseOnly", "true")
    if (filters?.freeTierOnly) params.set("freeTierOnly", "true")
    if (filters?.minCompositeScore !== undefined)
      params.set("minCompositeScore", String(filters.minCompositeScore))
    if (filters?.search) params.set("search", filters.search)
    // Backend caps page size at 100; clamp here so the URL stays legal.
    const safeSize = Math.min(100, Math.max(1, pageSize))
    const safePage = Math.max(1, page)
    params.set("limit", String(safeSize))
    params.set("offset", String((safePage - 1) * safeSize))
    if (sort) params.set("sort", sort)
    const qs = params.toString()
    const data = await apiFetch<{
      items: import("./types").Model[]
      total: number
    }>(`/models/${qs ? `?${qs}` : ""}`, MODEL_REVALIDATE)
    return {
      items: data?.items ?? [],
      total: data?.total ?? 0,
      page: safePage,
      pageSize: safeSize,
    }
  }
)

export const getModelBySlug = cache(
  async (slug: string): Promise<import("./types").Model | null> => {
    return apiFetch<import("./types").Model>(
      `/models/${encodeURIComponent(slug)}`,
      MODEL_REVALIDATE
    )
  }
)

export const getRelatedModels = cache(
  async (slug: string, limit = 6): Promise<import("./types").Model[]> => {
    const data = await apiFetch<{ items: import("./types").Model[] }>(
      `/models/${encodeURIComponent(slug)}/related?limit=${limit}`,
      MODEL_REVALIDATE
    )
    return data?.items ?? []
  }
)

export const getTrainingDatasetsForModel = cache(
  async (slug: string): Promise<Dataset[]> => {
    const data = await apiFetch<{ items: Dataset[] }>(
      `/models/${encodeURIComponent(slug)}/training-datasets`,
      MODEL_REVALIDATE
    )
    return data?.items ?? []
  }
)

export const getLeaderboard = cache(
  async (
    benchmark: import("./types").BenchmarkName,
    limit = 25,
    accessType?: import("./types").ModelAccessType[]
  ): Promise<import("./types").LeaderboardEntry[]> => {
    const params = new URLSearchParams({
      benchmark,
      limit: String(limit),
    })
    accessType?.forEach((v) => params.append("accessType", v))
    const data = await apiFetch<{
      items: import("./types").LeaderboardEntry[]
    }>(`/models/leaderboard?${params}`, MODEL_REVALIDATE)
    return data?.items ?? []
  }
)

export const getModelStats = cache(
  async (): Promise<import("./types").ModelStats | null> => {
    return apiFetch<import("./types").ModelStats>(
      `/stats/models`,
      REVALIDATE.stats
    )
  }
)

export async function compareModels(
  slugs: string[]
): Promise<import("./types").Model[]> {
  if (slugs.length === 0) return []
  const params = new URLSearchParams()
  slugs.forEach((s) => params.append("slug", s))
  const data = await apiFetch<{ items: import("./types").Model[] }>(
    `/models/compare?${params}`,
    MODEL_REVALIDATE
  )
  return data?.items ?? []
}

/**
 * Models known to have been trained, fine-tuned, or evaluated on the
 * given dataset. The endpoint isn't on the backend yet — the data
 * wrapper catches and falls back to a client-side scan of the model
 * index.
 */
export const getModelsTrainedOnDataset = cache(
  async (
    datasetSlug: string,
    limit = 12
  ): Promise<import("./types").ModelTrainingLink[]> => {
    const data = await apiFetch<{
      items: import("./types").ModelTrainingLink[]
    }>(
      `/datasets/${encodeURIComponent(datasetSlug)}/models?limit=${limit}`,
      MODEL_REVALIDATE
    )
    return data?.items ?? []
  }
)

/**
 * Cross-entity search that returns both datasets and models in one
 * round-trip. Backend endpoint `/v1/search/cross` is planned but not
 * yet shipped — the data-layer wrapper handles the fallback.
 */
export interface CrossSearchResult {
  datasets: import("./types").DatasetSuggestion[]
  models: import("./types").Model[]
}

export async function searchCross(
  q: string,
  limit = 6
): Promise<CrossSearchResult> {
  if (q.length < 2) return { datasets: [], models: [] }
  const params = new URLSearchParams({ q, limit: String(limit) })
  const data = await apiFetch<CrossSearchResult>(
    `/search/cross?${params}`,
    REVALIDATE.suggest
  )
  return data ?? { datasets: [], models: [] }
}
