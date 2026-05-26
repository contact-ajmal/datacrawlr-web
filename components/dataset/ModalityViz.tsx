import { MODALITY_ICONS } from "@/lib/modality-icons"
import type { SubModalityShare } from "@/lib/dataset-derivations"
import type { Modality } from "@/lib/types"

interface ModalityVizProps {
  modality: Modality
  subModalities?: SubModalityShare[]
}

const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const MODALITY_LABEL: Record<Modality, string> = {
  text: "Text",
  image: "Image",
  audio: "Audio",
  video: "Video",
  tabular: "Tabular",
  multimodal: "Multimodal",
  graph: "Graph",
  time_series: "Time series",
  other: "Other",
}

const SEGMENT_OPACITY = [1, 0.62, 0.36, 0.22]

export function ModalityViz({ modality, subModalities = [] }: ModalityVizProps) {
  if (modality === "multimodal" && subModalities.length > 0) {
    let cursor = 0
    return (
      <div className="flex items-center gap-4">
        <svg
          viewBox="0 0 36 36"
          className="size-20 -rotate-90"
          aria-label="Sub-modality distribution"
        >
          <circle
            cx="18"
            cy="18"
            r={RADIUS}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="3"
          />
          {subModalities.map((s, i) => {
            const length = s.share * CIRCUMFERENCE
            const offset = -cursor
            cursor += length
            return (
              <circle
                key={s.modality}
                cx="18"
                cy="18"
                r={RADIUS}
                fill="none"
                stroke="var(--accent)"
                strokeOpacity={SEGMENT_OPACITY[i] ?? 0.18}
                strokeWidth="3"
                strokeDasharray={`${length} ${CIRCUMFERENCE}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            )
          })}
        </svg>
        <ul className="text-caption space-y-1">
          {subModalities.map((s, i) => (
            <li
              key={s.modality}
              className="text-secondary flex items-center gap-2"
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: "var(--accent)",
                  opacity: SEGMENT_OPACITY[i] ?? 0.18,
                }}
              />
              <span className="text-primary">{MODALITY_LABEL[s.modality]}</span>
              <span className="text-tertiary text-micro font-mono">
                {Math.round(s.share * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const Icon = MODALITY_ICONS[modality]
  return (
    <div className="flex flex-col items-center justify-center py-2 text-center">
      <Icon
        className="text-accent size-16"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className="text-primary text-body mt-3 font-medium">
        {MODALITY_LABEL[modality]}
      </div>
    </div>
  )
}
