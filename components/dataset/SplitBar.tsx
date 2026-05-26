interface SplitBarProps {
  train?: number
  val?: number
  test?: number
}

export function SplitBar({ train = 80, val = 10, test = 10 }: SplitBarProps) {
  const total = train + val + test
  const tPct = (train / total) * 100
  const vPct = (val / total) * 100
  const ePct = (test / total) * 100

  return (
    <div>
      <div
        role="img"
        aria-label={`Train ${train}, val ${val}, test ${test}`}
        className="bg-overlay flex h-3 overflow-hidden rounded-full"
      >
        <span
          className="bg-accent block h-full"
          style={{ width: `${tPct}%` }}
        />
        <span
          className="bg-accent/60 block h-full"
          style={{ width: `${vPct}%` }}
        />
        <span
          className="bg-accent/30 block h-full"
          style={{ width: `${ePct}%` }}
        />
      </div>
      <div className="text-tertiary text-micro mt-3 flex justify-between font-mono">
        <span>
          <span className="text-primary">{train}%</span> train
        </span>
        <span>
          <span className="text-primary">{val}%</span> val
        </span>
        <span>
          <span className="text-primary">{test}%</span> test
        </span>
      </div>
    </div>
  )
}
