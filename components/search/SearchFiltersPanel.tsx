"use client"

import { toast } from "sonner"

import { WhisperCard } from "@/components/shared/Cards"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import {
  countActiveFilters,
  SIZE_MAX,
  SIZE_MIN,
  type UpdatedWithin,
  useSearchFilters,
} from "@/lib/stores/search-filters"
import type { Modality, SourceProvider } from "@/lib/types"
import { cn, formatNumber } from "@/lib/utils"

const MODALITIES: { value: Modality; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "tabular", label: "Tabular" },
  { value: "multimodal", label: "Multimodal" },
]

const LICENSES = [
  "MIT",
  "Apache-2.0",
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "GPL",
  "custom",
  "Proprietary",
]

const SOURCES: { value: SourceProvider; label: string }[] = [
  { value: "huggingface", label: "HuggingFace" },
  { value: "kaggle", label: "Kaggle" },
  { value: "github", label: "GitHub" },
  { value: "paper", label: "Papers" },
  { value: "blog", label: "Blogs" },
]

const UPDATED_OPTIONS: { value: UpdatedWithin; label: string }[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "6mo", label: "Last 6 months" },
  { value: "any", label: "Any time" },
]

const SIZE_LOG_MIN = Math.log10(SIZE_MIN)
const SIZE_LOG_MAX = Math.log10(SIZE_MAX)
const SIZE_LOG_RANGE = SIZE_LOG_MAX - SIZE_LOG_MIN

function pctToRows(pct: number): number {
  return Math.round(Math.pow(10, SIZE_LOG_MIN + (pct / 100) * SIZE_LOG_RANGE))
}

function rowsToPct(rows: number): number {
  return ((Math.log10(rows) - SIZE_LOG_MIN) / SIZE_LOG_RANGE) * 100
}

interface SearchFiltersPanelProps {
  className?: string
  inSheet?: boolean
}

export function SearchFiltersPanel({
  className,
  inSheet = false,
}: SearchFiltersPanelProps) {
  const filters = useSearchFilters()
  const activeCount = countActiveFilters(filters)

  const sizePct: [number, number] = [
    rowsToPct(filters.minSize),
    rowsToPct(filters.maxSize),
  ]

  const Wrapper = inSheet ? "div" : WhisperCard

  return (
    <Wrapper className={cn("space-y-6 p-5", className)}>
      <header className="flex items-center justify-between">
        <h2 className="text-h4 font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            filters.clearAll()
            toast("Filters cleared")
          }}
          disabled={activeCount === 0}
        >
          Clear all
        </Button>
      </header>

      <Section title="Modality">
        <div className="flex flex-col gap-2">
          {MODALITIES.map((m) => (
            <CheckboxRow
              key={m.value}
              checked={filters.modality.includes(m.value)}
              onCheckedChange={() => filters.toggleModality(m.value)}
              label={m.label}
            />
          ))}
        </div>
      </Section>

      <Section title="Size">
        <div className="space-y-3">
          <Slider
            value={sizePct}
            onValueChange={([a, b]) =>
              filters.setSizeRange(pctToRows(a), pctToRows(b))
            }
            min={0}
            max={100}
            step={1}
            minStepsBetweenThumbs={2}
          />
          <div className="text-tertiary text-micro flex items-center justify-between font-mono">
            <span>{formatNumber(filters.minSize)} rows</span>
            <span className="opacity-50">–</span>
            <span>{formatNumber(filters.maxSize)} rows</span>
          </div>
        </div>
      </Section>

      <Section title="License">
        <div className="flex flex-col gap-2">
          {LICENSES.map((l) => (
            <CheckboxRow
              key={l}
              checked={filters.license.includes(l)}
              onCheckedChange={() => filters.toggleLicense(l)}
              label={l}
            />
          ))}
        </div>
      </Section>

      <Section title="Source">
        <div className="flex flex-col gap-2">
          {SOURCES.map((s) => (
            <CheckboxRow
              key={s.value}
              checked={filters.source.includes(s.value)}
              onCheckedChange={() => filters.toggleSource(s.value)}
              label={s.label}
            />
          ))}
        </div>
      </Section>

      <Section title="Quality">
        <div className="space-y-3">
          <Slider
            value={[filters.minQuality]}
            onValueChange={([v]) => filters.setMinQuality(v)}
            min={0}
            max={100}
            step={1}
          />
          <div className="text-tertiary text-micro font-mono">
            ≥ {filters.minQuality}
          </div>
        </div>
      </Section>

      <Section title="Updated within">
        <RadioGroup
          value={filters.updatedWithin}
          onValueChange={(v) => filters.setUpdatedWithin(v as UpdatedWithin)}
          className="flex flex-col gap-2"
        >
          {UPDATED_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="text-secondary hover:text-primary text-caption flex cursor-pointer items-center gap-2 transition-colors"
            >
              <RadioGroupItem value={opt.value} />
              <span>{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </Section>
    </Wrapper>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-primary text-caption mb-3 font-semibold uppercase tracking-wider">
        {title}
      </div>
      {children}
    </div>
  )
}

function CheckboxRow({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean
  onCheckedChange: () => void
  label: string
}) {
  return (
    <label className="text-secondary hover:text-primary text-caption flex cursor-pointer items-center gap-2 transition-colors">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <span>{label}</span>
    </label>
  )
}
