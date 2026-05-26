"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, X } from "lucide-react"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Log-scale slider bounds — 100M (1e8) to 1T (1e12). */
const LOG_MIN = 8
const LOG_MAX = 12

const ACCESS_OPTIONS: { value: string; label: string }[] = [
  { value: "open-weights", label: "Open weights" },
  { value: "open-source", label: "Open source" },
  { value: "commercial-api", label: "Commercial API" },
]

const MODALITY_OPTIONS: { value: string; label: string }[] = [
  { value: "text", label: "Text-only" },
  { value: "image", label: "Vision (image input)" },
  { value: "audio", label: "Audio" },
  { value: "multimodal", label: "Multimodal" },
]

const LICENSE_OPTIONS: { value: string; label: string }[] = [
  { value: "permissive", label: "Permissive" },
  { value: "copyleft", label: "Copyleft" },
  { value: "non_commercial", label: "Non-commercial" },
  { value: "proprietary", label: "Proprietary" },
]

const CONTEXT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Any" },
  { value: "32000", label: "≥32K" },
  { value: "128000", label: "≥128K" },
  { value: "1000000", label: "≥1M" },
]

const COMMERCIAL_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Any" },
  { value: "allowed", label: "Allowed" },
  { value: "restricted", label: "Restricted" },
]

interface ModelFilterPanelProps {
  organizations: string[]
  /** Number of active filters — surfaced in the footer. */
  activeCount: number
}

export function ModelFilterPanel({
  organizations,
  activeCount,
}: ModelFilterPanelProps) {
  const router = useRouter()
  const params = useSearchParams()

  const accessType = params.getAll("access_type")
  const orgs = params.getAll("organization")
  const modality = params.getAll("modality")
  const licenseType = params.getAll("license_type")
  const minParams = params.get("min_params")
  const maxParams = params.get("max_params")
  const minContext = params.get("min_context") ?? ""
  const commercial = params.get("commercial_use") ?? ""
  const hasBenchmarks = params.get("has_benchmarks") === "true"
  const hasFreeTier = params.get("has_free_tier") === "true"

  const sliderRange = useMemo<[number, number]>(() => {
    const lo = minParams ? Math.log10(Number(minParams)) : LOG_MIN
    const hi = maxParams ? Math.log10(Number(maxParams)) : LOG_MAX
    return [
      Number.isFinite(lo) ? Math.min(Math.max(lo, LOG_MIN), LOG_MAX) : LOG_MIN,
      Number.isFinite(hi) ? Math.min(Math.max(hi, LOG_MIN), LOG_MAX) : LOG_MAX,
    ]
  }, [minParams, maxParams])

  const update = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString())
      mutate(next)
      const qs = next.toString()
      router.replace(`/models${qs ? `?${qs}` : ""}`, { scroll: false })
    },
    [params, router]
  )

  const toggleMulti = (key: string, value: string) =>
    update((p) => {
      const existing = p.getAll(key)
      p.delete(key)
      if (existing.includes(value)) {
        existing.filter((v) => v !== value).forEach((v) => p.append(key, v))
      } else {
        existing.forEach((v) => p.append(key, v))
        p.append(key, value)
      }
    })

  const setScalar = (key: string, value: string) =>
    update((p) => {
      if (value) p.set(key, value)
      else p.delete(key)
    })

  const setRange = (lo: number, hi: number) =>
    update((p) => {
      if (lo > LOG_MIN) p.set("min_params", String(Math.round(10 ** lo)))
      else p.delete("min_params")
      if (hi < LOG_MAX) p.set("max_params", String(Math.round(10 ** hi)))
      else p.delete("max_params")
    })

  const clearAll = () => router.replace("/models", { scroll: false })

  return (
    <div className="flex flex-col gap-1">
      <Section title="Access type" defaultOpen>
        <CheckboxGroup
          options={ACCESS_OPTIONS}
          active={accessType}
          onToggle={(v) => toggleMulti("access_type", v)}
        />
      </Section>

      <Section title="Organization" defaultOpen={false}>
        <OrgList
          all={organizations}
          active={orgs}
          onToggle={(v) => toggleMulti("organization", v)}
        />
      </Section>

      <Section title="Parameters" defaultOpen>
        <Slider
          min={LOG_MIN}
          max={LOG_MAX}
          step={0.1}
          value={sliderRange}
          onValueChange={(v) => {
            if (v.length >= 2) setRange(v[0], v[1])
          }}
          className="mt-2"
        />
        <div className="text-tertiary text-micro mt-3 flex items-center justify-between font-mono">
          <span>{formatParamLabel(sliderRange[0])}</span>
          <span>{formatParamLabel(sliderRange[1])}</span>
        </div>
      </Section>

      <Section title="Context window" defaultOpen={false}>
        <RadioGroup
          name="min_context"
          options={CONTEXT_OPTIONS}
          active={minContext}
          onChange={(v) => setScalar("min_context", v)}
        />
      </Section>

      <Section title="Modality" defaultOpen={false}>
        <CheckboxGroup
          options={MODALITY_OPTIONS}
          active={modality}
          onToggle={(v) => toggleMulti("modality", v)}
        />
      </Section>

      <Section title="License" defaultOpen={false}>
        <CheckboxGroup
          options={LICENSE_OPTIONS}
          active={licenseType}
          onToggle={(v) => toggleMulti("license_type", v)}
        />
      </Section>

      <Section title="Commercial use" defaultOpen={false}>
        <RadioGroup
          name="commercial_use"
          options={COMMERCIAL_OPTIONS}
          active={commercial}
          onChange={(v) => setScalar("commercial_use", v)}
        />
      </Section>

      <Section title="Has benchmarks" defaultOpen={false}>
        <Toggle
          checked={hasBenchmarks}
          onChange={(v) =>
            setScalar("has_benchmarks", v ? "true" : "")
          }
          label="Only show models with benchmark scores"
        />
      </Section>

      <Section title="Has free tier" defaultOpen={false}>
        <Toggle
          checked={hasFreeTier}
          onChange={(v) => setScalar("has_free_tier", v ? "true" : "")}
          label="Free commercial-API access"
        />
      </Section>

      <div className="border-subtle mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-tertiary text-caption font-mono">
          {activeCount === 0 ? "No filters" : `${activeCount} active`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          disabled={activeCount === 0}
          className="gap-1"
        >
          <X className="size-3.5" aria-hidden="true" />
          Clear all
        </Button>
      </div>
    </div>
  )
}

// ----- helpers ---------------------------------------------------------

function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen: boolean
  children: React.ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="border-subtle group/section -mx-1 border-b px-1 py-3 last:border-b-0"
    >
      <summary
        className={cn(
          "list-none cursor-pointer outline-none",
          "flex items-center justify-between gap-3"
        )}
      >
        <span className="text-primary text-caption font-medium">{title}</span>
        <ChevronDown
          className="text-tertiary size-3.5 transition-transform group-open/section:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  )
}

function CheckboxGroup({
  options,
  active,
  onToggle,
}: {
  options: { value: string; label: string }[]
  active: string[]
  onToggle: (value: string) => void
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {options.map((opt) => (
        <li key={opt.value}>
          <label className="text-secondary text-caption hover:text-primary flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={active.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="accent-accent size-3.5"
            />
            {opt.label}
          </label>
        </li>
      ))}
    </ul>
  )
}

function RadioGroup({
  name,
  options,
  active,
  onChange,
}: {
  name: string
  options: { value: string; label: string }[]
  active: string
  onChange: (value: string) => void
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {options.map((opt) => (
        <li key={opt.value || "any"}>
          <label className="text-secondary text-caption hover:text-primary flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={name}
              checked={active === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-accent size-3.5"
            />
            {opt.label}
          </label>
        </li>
      ))}
    </ul>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <label className="text-secondary text-caption hover:text-primary flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-accent size-3.5"
      />
      {label}
    </label>
  )
}

function OrgList({
  all,
  active,
  onToggle,
}: {
  all: string[]
  active: string[]
  onToggle: (v: string) => void
}) {
  return (
    <ul className="max-h-64 overflow-y-auto pr-1">
      {all.length === 0 ? (
        <li className="text-tertiary text-micro">No organizations available.</li>
      ) : (
        all.map((org) => (
          <li key={org}>
            <label className="text-secondary text-caption hover:text-primary flex cursor-pointer items-center gap-2 py-0.5">
              <input
                type="checkbox"
                checked={active.includes(org)}
                onChange={() => onToggle(org)}
                className="accent-accent size-3.5"
              />
              <span className="truncate">{org}</span>
            </label>
          </li>
        ))
      )}
    </ul>
  )
}

function formatParamLabel(log10: number): string {
  const value = 10 ** log10
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(value >= 100e9 ? 0 : 0)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`
  return `${Math.round(value)}`
}
