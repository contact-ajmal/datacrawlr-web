// ----------------------------------------------------------------------------
// Data access layer.
//
// Every UI surface imports its data helpers from this module rather than
// touching `@/lib/mock-data` or `@/lib/api-client` directly. The runtime flag
// `NEXT_PUBLIC_USE_MOCK_DATA` decides which implementation answers each call,
// so we can develop the UI against fixtures and ship against the live backend
// without changing component code.
//
// Every dataset helper is async (returns a Promise) regardless of source — the
// mock variants resolve synchronously, the API variants over the network — so
// callers can `await` uniformly.
//
// Models are wired in as of M2.x — the helpers throw on a missing backend
// and we fall through to the mock fixtures so the UI keeps working while
// the /v1/models endpoints catch up.
// ----------------------------------------------------------------------------

import * as api from "./api-client"
import * as mock from "./mock-data"
import type {
  CatalogFacets,
  CrossSearchResult,
  FreshnessSnapshot,
  MLTaskStat,
  SourceSummary,
} from "./api-client"
import type {
  BenchmarkName,
  Dataset,
  DatasetSuggestion,
  DomainStat,
  GraphEdge,
  GraphNode,
  LeaderboardEntry,
  Modality,
  Model,
  ModelAccessType,
  ModelFilters,
  ModelStats,
  ModelTrainingLink,
  SearchFilters,
  SearchResponse,
} from "./types"

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"

export interface PublicStats {
  totalDatasets: number
  totalSources: number
  totalRelationships: number
  lastUpdatedAt: string | null
}

export async function searchDatasets(
  q: string,
  filters?: SearchFilters,
  page = 1,
  pageSize = 20
): Promise<SearchResponse> {
  if (useMock) return mock.searchDatasets(q, filters, page, pageSize)
  return api.searchDatasets(q, filters, page, pageSize)
}

export async function getDatasetBySlug(slug: string): Promise<Dataset | null> {
  if (useMock) return mock.getDatasetBySlug(slug)
  // Live-only path: never substitute the mock fixture for a missing
  // upstream row. A null return tells the page to render notFound().
  return api.getDatasetBySlug(slug)
}

export async function getRelatedDatasets(
  slug: string,
  limit = 6
): Promise<Dataset[]> {
  if (useMock) return mock.getRelatedDatasets(slug, limit)
  return api.getRelatedDatasets(slug, limit)
}

export async function getGraph(
  focusSlug?: string
): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  if (useMock) return mock.getGraph(focusSlug)
  return api.getGraph(focusSlug)
}

export async function getTrendingDatasets(limit = 8): Promise<Dataset[]> {
  if (useMock) return mock.getTrendingDatasets(limit)
  return api.getTrendingDatasets(limit)
}

export async function getRecentlyUpdated(limit = 6): Promise<Dataset[]> {
  if (useMock) return mock.getRecentlyUpdated(limit)
  return api.getRecentlyUpdated(limit)
}

export async function getDatasets(limit = 100): Promise<Dataset[]> {
  if (useMock) return mock.datasets.slice(0, limit)
  return api.getDatasets(limit)
}

export async function suggestDatasets(
  q: string,
  limit = 8
): Promise<DatasetSuggestion[]> {
  if (q.length < 2) return []
  if (useMock) {
    const needle = q.trim().toLowerCase()
    return mock.datasets
      .filter(
        (d) =>
          d.name.toLowerCase().includes(needle) ||
          d.tags.some((t) => t.toLowerCase().includes(needle))
      )
      .slice(0, limit)
      .map((d) => ({
        slug: d.slug,
        name: d.name,
        modality: d.modality,
        sourcePlatform: d.sources[0]?.provider ?? "other",
        description: d.description,
        popularityScore: d.popularity,
      }))
  }
  return api.suggestDatasets(q, limit)
}

export async function getDatasetsByModality(
  modality: Modality,
  limit = 6
): Promise<Dataset[]> {
  if (useMock) {
    return mock.datasets
      .filter((d) => d.modality === modality)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
  }
  return api.getDatasetsByModality(modality, limit)
}

export async function getMLTaskStats(): Promise<MLTaskStat[]> {
  if (useMock) {
    // Mock fixtures don't carry an ml_task field, so synthesise a small
    // plausible distribution. Numbers are illustrative; ordering matches
    // what the production API returns.
    return [
      { task: "classification", count: 28 },
      { task: "generation", count: 19 },
      { task: "qa", count: 14 },
      { task: "summarization", count: 12 },
      { task: "translation", count: 10 },
      { task: "object_detection", count: 8 },
      { task: "ner", count: 6 },
      { task: "segmentation", count: 5 },
    ]
  }
  return api.getMLTaskStats()
}

export async function getCatalogFacets(): Promise<CatalogFacets> {
  if (useMock) {
    const modality: Record<string, number> = {}
    const licenseType: Record<string, number> = {}
    const sourcePlatform: Record<string, number> = {}
    for (const d of mock.datasets) {
      modality[d.modality] = (modality[d.modality] ?? 0) + 1
      licenseType[d.license] = (licenseType[d.license] ?? 0) + 1
      for (const s of d.sources)
        sourcePlatform[s.provider] = (sourcePlatform[s.provider] ?? 0) + 1
    }
    return { modality, licenseType, sourcePlatform, language: {}, mlTask: {} }
  }
  return api.getCatalogFacets()
}

export async function getSourcesSummary(): Promise<SourceSummary[]> {
  if (useMock) {
    const byPlatform = new Map<string, SourceSummary>()
    for (const d of mock.datasets) {
      for (const s of d.sources) {
        const existing = byPlatform.get(s.provider) ?? {
          platform: s.provider,
          name: s.provider,
          description: `${s.provider} (mock)`,
          totalDatasets: 0,
          lastRunAt: null,
          status: "active" as const,
          sampleDatasetSlugs: [],
        }
        existing.totalDatasets += 1
        if (existing.sampleDatasetSlugs.length < 5)
          existing.sampleDatasetSlugs.push(d.slug)
        byPlatform.set(s.provider, existing)
      }
    }
    return Array.from(byPlatform.values()).sort(
      (a, b) => b.totalDatasets - a.totalDatasets
    )
  }
  return api.getSourcesSummary()
}

export async function getFreshnessSnapshot(): Promise<FreshnessSnapshot> {
  if (useMock) {
    // Cheap stub: bucket the mock fixture by lastUpdated age.
    const now = Date.now()
    const DAY = 24 * 60 * 60 * 1000
    const bucketize = (max: number, min?: number) =>
      mock.datasets.filter((d) => {
        const age = (now - +new Date(d.lastUpdated)) / DAY
        return age <= max && (min === undefined || age > min)
      })
    const samples = (rows: typeof mock.datasets) =>
      rows.slice(0, 3).map((d) => d.slug)
    const week = bucketize(7)
    const month = bucketize(30, 7)
    const year = bucketize(365, 30)
    const older = mock.datasets.filter(
      (d) => (now - +new Date(d.lastUpdated)) / DAY > 365
    )
    return {
      buckets: [
        { label: "Updated this week", count: week.length, sampleSlugs: samples(week) },
        { label: "This month", count: month.length, sampleSlugs: samples(month) },
        { label: "This year", count: year.length, sampleSlugs: samples(year) },
        { label: "Older than 1 year", count: older.length, sampleSlugs: samples(older) },
      ],
      timeline: [],
      activeSources: [],
    }
  }
  return api.getFreshnessSnapshot()
}

export async function getDomainStats(): Promise<DomainStat[]> {
  if (useMock) {
    // Cheap rollup over the fixture dataset so the UI has real numbers in
    // mock mode. Mirrors the static grouping the backend exposes.
    const byModality = new Map<string, number>()
    for (const d of mock.datasets) {
      byModality.set(d.modality, (byModality.get(d.modality) ?? 0) + 1)
    }
    const get = (m: string) => byModality.get(m) ?? 0
    return [
      { slug: "nlp", label: "NLP", icon: "file-text", count: get("text"), modalities: ["text"] },
      { slug: "cv", label: "Computer Vision", icon: "image", count: get("image") + get("video"), modalities: ["image", "video"] },
      { slug: "audio", label: "Audio & Speech", icon: "mic", count: get("audio"), modalities: ["audio"] },
      { slug: "tabular", label: "Tabular", icon: "table", count: get("tabular"), modalities: ["tabular"] },
      { slug: "multimodal", label: "Multimodal", icon: "layers", count: get("multimodal"), modalities: ["multimodal"] },
      { slug: "time-series", label: "Time series", icon: "activity", count: get("time_series"), modalities: ["time_series"] },
      { slug: "graph", label: "Graph", icon: "git-branch", count: get("graph"), modalities: ["graph"] },
    ]
  }
  return api.getDomainStats()
}

export async function getStats(): Promise<PublicStats | null> {
  if (useMock) {
    const sources = new Set<string>()
    for (const d of mock.datasets) for (const s of d.sources) sources.add(s.provider)
    const latest = mock.datasets
      .map((d) => +new Date(d.lastUpdated))
      .reduce((a, b) => (a > b ? a : b), 0)
    return {
      totalDatasets: mock.datasets.length,
      totalSources: sources.size,
      totalRelationships: mock.edges.length,
      lastUpdatedAt: latest ? new Date(latest).toISOString() : null,
    }
  }
  return api.getStats()
}

// --------------------------------------------------------------------------
// Models — scaffolded in M2.x.
//
// The backend's /v1/models endpoints aren't live yet. Each wrapper tries
// the API first and falls through to the mock fixtures on failure so the
// new pages can be built against realistic data immediately.
// --------------------------------------------------------------------------

export async function listModels(
  filters?: ModelFilters,
  page = 1,
  pageSize = 25,
  sort?: string
): Promise<{ items: Model[]; total: number; page: number; pageSize: number }> {
  if (useMock) {
    // The mock fixture doesn't carry a paginated list helper —
    // wrap whatever it returns in the same shape so callers can
    // read .total without a discriminator.
    const out = await mock.listModels(filters)
    return { items: out.items, total: out.total, page: 1, pageSize: out.total }
  }
  return api.listModels(filters, page, pageSize, sort)
}

export async function getModelBySlug(slug: string): Promise<Model | null> {
  if (useMock) return mock.getModelBySlug(slug)
  return api.getModelBySlug(slug)
}

export async function getRelatedModels(
  slug: string,
  limit = 6
): Promise<Model[]> {
  if (useMock) return mock.getRelatedModels(slug, limit)
  return api.getRelatedModels(slug, limit)
}

export async function getTrainingDatasetsForModel(
  slug: string
): Promise<Dataset[]> {
  if (useMock) return mock.getTrainingDatasetsForModel(slug)
  return api.getTrainingDatasetsForModel(slug)
}

export async function getLeaderboard(
  benchmark: BenchmarkName,
  limit = 25,
  accessType?: ModelAccessType[]
): Promise<LeaderboardEntry[]> {
  if (useMock) return mock.getLeaderboard(benchmark, limit, accessType)
  return api.getLeaderboard(benchmark, limit, accessType)
}

export async function getModelStats(): Promise<ModelStats | null> {
  if (useMock) return mock.getModelStats()
  return api.getModelStats()
}

export async function compareModels(slugs: string[]): Promise<Model[]> {
  if (useMock) return mock.compareModels(slugs)
  return api.compareModels(slugs)
}

function scanModelsForDataset(
  datasetSlug: string,
  limit: number
): ModelTrainingLink[] {
  const out: ModelTrainingLink[] = []
  for (const m of mock.models) {
    const trained = m.trainedOnDatasetSlugs.includes(datasetSlug)
    const finetuned = m.finetunedOnDatasetSlugs.includes(datasetSlug)
    if (!trained && !finetuned) continue
    out.push({
      modelSlug: m.slug,
      modelName: m.name,
      organization: m.organization,
      relation: trained ? "trained-on" : "finetuned-on",
      confidence: "high",
      compositeScore: m.compositeScore,
      accessType: m.accessType,
    })
  }
  // Highest composite first — surfaces frontier models above mid-tier.
  return out
    .sort((a, b) => (b.compositeScore ?? 0) - (a.compositeScore ?? 0))
    .slice(0, limit)
}

export async function getModelsTrainedOnDataset(
  datasetSlug: string,
  limit = 12
): Promise<ModelTrainingLink[]> {
  if (useMock) return scanModelsForDataset(datasetSlug, limit)
  return api.getModelsTrainedOnDataset(datasetSlug, limit)
}

export async function searchCross(
  q: string,
  limit = 6
): Promise<CrossSearchResult> {
  if (q.length < 2) return { datasets: [], models: [] }
  if (useMock) {
    return {
      datasets: await mock_searchDatasetsLite(q, limit),
      models: scanModelsByQuery(q, limit),
    }
  }
  // Live-only path. If the cross endpoint isn't shipped yet the user
  // sees the empty state — that's truthful; we don't fill it with
  // mock rows.
  return api.searchCross(q, limit)
}

function scanModelsByQuery(q: string, limit: number): Model[] {
  const needle = q.trim().toLowerCase()
  return mock.models
    .filter((m) => {
      const hay = `${m.name} ${m.organization ?? ""} ${m.shortDescription} ${m.tags.join(" ")}`.toLowerCase()
      return hay.includes(needle)
    })
    .sort((a, b) => (b.compositeScore ?? 0) - (a.compositeScore ?? 0))
    .slice(0, limit)
}

async function mock_searchDatasetsLite(
  q: string,
  limit: number
): Promise<DatasetSuggestion[]> {
  const needle = q.trim().toLowerCase()
  return mock.datasets
    .filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.tags.some((t) => t.toLowerCase().includes(needle))
    )
    .slice(0, limit)
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      modality: d.modality,
      sourcePlatform: d.sources[0]?.provider ?? "other",
      description: d.description,
      popularityScore: d.popularity,
    }))
}
