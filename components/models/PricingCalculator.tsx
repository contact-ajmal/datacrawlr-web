"use client"

import { useMemo, useState } from "react"

import { Slider } from "@/components/ui/slider"
import { StandardCard } from "@/components/shared/Cards"
import type { Model } from "@/lib/types"

interface PricingCalculatorProps {
  model: Model
  /** Up to 3 cheaper-or-comparable models to surface in the comparison row. */
  comparisons: Model[]
}

function cost(model: Model, inputM: number, outputM: number): number | null {
  const p = model.pricing
  if (!p) return null
  const inCost = (p.inputPerMillionTokens ?? 0) * inputM
  const outCost = (p.outputPerMillionTokens ?? 0) * outputM
  return inCost + outCost
}

export function PricingCalculator({ model, comparisons }: PricingCalculatorProps) {
  const [inputM, setInputM] = useState(1)
  const [outputM, setOutputM] = useState(0.25)

  const own = useMemo(() => cost(model, inputM, outputM), [model, inputM, outputM])
  const compared = useMemo(
    () =>
      comparisons.map((m) => ({
        model: m,
        cost: cost(m, inputM, outputM),
      })),
    [comparisons, inputM, outputM]
  )

  return (
    <StandardCard className="!p-6">
      <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
        Cost calculator
      </p>
      <p className="text-secondary text-caption mt-1">
        Drag the sliders to estimate cost for a representative request mix.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <SliderField
          label="Input tokens"
          value={inputM}
          onChange={setInputM}
        />
        <SliderField
          label="Output tokens"
          value={outputM}
          onChange={setOutputM}
        />
      </div>

      <div className="border-subtle mt-6 border-t pt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-secondary text-caption">
            Estimated cost on{" "}
            <span className="text-primary font-medium">{model.name}</span>
          </span>
          <span className="text-accent text-h3 font-mono tabular-nums">
            {own === null ? "—" : formatUSD(own)}
          </span>
        </div>

        {compared.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {compared.map(({ model: m, cost: c }) => (
              <li
                key={m.slug}
                className="border-subtle text-tertiary flex items-center justify-between rounded-md border px-3 py-2 text-caption"
              >
                <span className="truncate">
                  <span className="text-secondary">{m.name}</span>{" "}
                  <span className="text-tertiary text-micro font-mono">
                    · {m.organization}
                  </span>
                </span>
                <span className="font-mono tabular-nums">
                  {c === null ? "—" : formatUSD(c)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </StandardCard>
  )
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-secondary text-caption font-medium">{label}</span>
        <span className="text-tertiary text-micro font-mono tabular-nums">
          {value.toFixed(2)}M
        </span>
      </div>
      <Slider
        min={0}
        max={50}
        step={0.05}
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? 0)}
        className="mt-2"
      />
    </div>
  )
}

function formatUSD(value: number): string {
  if (value === 0) return "$0.00"
  if (value < 0.01) return "<$0.01"
  if (value < 1) return `$${value.toFixed(2)}`
  if (value < 100) return `$${value.toFixed(2)}`
  return `$${Math.round(value).toLocaleString()}`
}
