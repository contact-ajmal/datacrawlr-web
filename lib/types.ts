export type Modality =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "tabular"
  | "multimodal"
  | "graph"
  | "time_series"
  | "other"

export type SourceProvider =
  | "huggingface"
  | "kaggle"
  | "github"
  | "paper"
  | "blog"

// The backend's full source enum is wider than the legacy frontend list.
// We accept any string (so unknown platforms render gracefully) and surface
// the common ones for autocomplete.
export type SourcePlatform =
  | "huggingface"
  | "kaggle"
  | "openml"
  | "zenodo"
  | "figshare"
  | "dataverse"
  | "ckan"
  | "github"
  | "schema_org"
  | "arxiv"
  | "other"
  | (string & {})

export type WarningLevel = "info" | "warn" | "danger"

export interface Source {
  provider: SourceProvider
  url: string
  title: string
}

export interface Warning {
  level: WarningLevel
  title: string
  body: string
}

export interface SchemaField {
  name: string
  type: string
  description?: string
  nullable?: boolean
}

export interface Citation {
  title: string
  authors: string[]
  venue: string
  year: number
  url: string
}

export type DatasetModelRelation =
  | "trained-on"
  | "finetuned-on"
  | "evaluated-on"

export interface ModelTrainingLink {
  modelSlug: string
  modelName: string
  organization?: string
  relation: DatasetModelRelation
  /** "high" | "medium" | "low" — defaults to "high" when we have an explicit
   *  declaration in the model card, lower when inferred. */
  confidence?: "high" | "medium" | "low"
  compositeScore?: number
  accessType?: ModelAccessType
}

export interface Dataset {
  id: string
  slug: string
  name: string
  description: string
  longDescription: string
  tags: string[]
  modality: Modality
  size: { rows: number; bytes: number }
  license: string
  sources: Source[]
  lastUpdated: string
  popularity: number
  quality: number
  warnings: Warning[]
  aiSummary: string
  schema?: SchemaField[]
  citations?: Citation[]
  downloads?: number
  /** Models known to have been trained, fine-tuned, or evaluated on this
   *  dataset. Optional — populated by `/v1/datasets/{slug}` once the
   *  backend ships the field; computed client-side from the model index
   *  in the meantime. */
  trainedBy?: ModelTrainingLink[]
}

export interface GraphNode {
  id: string
  slug: string
  label: string
  modality: Modality
  size: number
}

export interface GraphEdge {
  source: string
  target: string
  kind: "derived" | "similar" | "benchmark" | "cites"
  weight: number
}

export interface SearchFilters {
  modality?: Modality[]
  license?: string[]
  source?: SourceProvider[]
  minSize?: number
  maxSize?: number
  minQuality?: number
  updatedWithin?: "24h" | "7d" | "30d" | "6mo" | "any"
}

export type SearchResult = Dataset & {
  matchExplanation: string
  matchScore: number
}

/**
 * One page of search results plus enough metadata to render a pager.
 * `total` is the full count across all pages; the component layer
 * derives `Math.ceil(total / pageSize)` for page-count.
 */
export interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  pageSize: number
}

// --------------------------------------------------------------------------
// Models — added in M2.x.
// Mirrors the backend's canonical Model schema; the wire format uses
// camelCase aliases so these field names match the JSON 1:1.
// --------------------------------------------------------------------------

export interface Creator {
  name: string
  affiliation?: string
  orcid?: string
}

export type LicenseType =
  | "permissive"
  | "copyleft"
  | "non_commercial"
  | "restrictive"
  | "proprietary"
  | "public_domain"
  | "unknown"

export interface LicenseIntelligence {
  commercialUse?: boolean | null
  attributionRequired?: boolean | null
  redistributionAllowed?: boolean | null
  modificationAllowed?: boolean | null
  /** "low" | "medium" | "high" | "unknown" */
  riskLevel: string
  notes?: string | null
}

export type ModelAccessType =
  | "open-weights"
  | "open-source"
  | "commercial-api"
  | "closed-weights"

export type BenchmarkName =
  | "mmlu-pro"
  | "gpqa"
  | "humaneval"
  | "math"
  | "ifeval"
  | "musr"
  | "bfcl"
  | "arena-elo"
  | "mmlu"
  | "aime"
  | "swe-bench-verified"
  | "livecodebench"

export type BenchmarkSource =
  | "open-llm-leaderboard"
  | "artificial-analysis"
  | "lmsys-arena"
  | "vendor-reported"
  | "paper-reported"
  | "other"

export type ModelSourcePlatform =
  | "huggingface"
  | "openrouter"
  | "anthropic"
  | "openai"
  | "google"
  | "meta"
  | "mistral"
  | "deepseek"
  | "qwen"
  | "other"

export interface ModelPricing {
  inputPerMillionTokens: number | null
  outputPerMillionTokens: number | null
  cachedInputPerMillionTokens: number | null
  imagePerMillion: number | null
  provider: string
  currency: string
  freeTierAvailable: boolean
  freeTierNotes?: string
}

export interface BenchmarkScore {
  benchmark: BenchmarkName
  score: number
  scoreFormat: string
  rank?: number
  measuredAt: string
  source: BenchmarkSource
  notes?: string
}

export interface Model {
  modelId: string
  slug: string
  name: string
  shortDescription: string
  longDescription?: string
  sourcePlatform: ModelSourcePlatform
  sourceUrl: string
  huggingfaceRepo?: string
  paperUrl?: string
  blogUrl?: string
  architecture?: string
  parameters?: number
  activeParameters?: number
  contextWindow?: number
  maxOutputTokens?: number
  modalitiesInput: Modality[]
  modalitiesOutput: Modality[]
  languages: string[]
  creators: Creator[]
  organization?: string
  baseModel?: string
  trainedOnDatasetSlugs: string[]
  finetunedOnDatasetSlugs: string[]
  releasedAt?: string
  lastUpdated?: string
  accessType: ModelAccessType
  license?: string
  licenseType: LicenseType
  // Null when the license-intelligence enricher hasn't run yet —
  // freshly indexed models stay in this state until the nightly
  // enrichment pass tags them. Components must guard before
  // dereferencing.
  licenseIntelligence: LicenseIntelligence | null
  commercialUseAllowed?: boolean
  weightsAvailable: boolean
  weightsUrl?: string
  pricing?: ModelPricing
  benchmarkScores: BenchmarkScore[]
  compositeScore?: number
  compositeRank?: number
  downloadsCount?: number
  likesCount?: number
  popularityScore: number
  qualityScore: number
  freshnessScore: number
  aiSummary?: string
  aiInsights: string[]
  warnings: Warning[]
  tags: string[]
  indexedAt: string
  lastSeenAt: string
}

export interface ModelFilters {
  accessType?: ModelAccessType[]
  organization?: string[]
  sourcePlatform?: ModelSourcePlatform[]
  minParameters?: number
  maxParameters?: number
  licenseType?: LicenseType[]
  commercialUseOnly?: boolean
  freeTierOnly?: boolean
  modality?: Modality[]
  minCompositeScore?: number
  search?: string
}

export interface LeaderboardEntry {
  rank: number
  model: Model
  score: number
  scoreFormat: string
  rankDelta?: number
}

export interface ModelStats {
  totalModels: number
  byAccessType: Record<string, number>
  byOrganization: Record<string, number>
  topBenchmarks: { benchmark: BenchmarkName; medianScore: number; topScore: number }[]
  lastUpdatedAt: string | null
}

export interface DatasetSuggestion {
  slug: string
  name: string
  modality: Modality
  sourcePlatform: SourcePlatform
  description: string
  popularityScore: number
}

export interface DomainStat {
  slug: string
  label: string
  /** Lucide icon name as a string (resolved client-side via a registry). */
  icon: string
  count: number
  modalities: Modality[]
}
