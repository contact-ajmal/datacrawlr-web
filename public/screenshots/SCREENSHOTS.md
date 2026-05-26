# Marketing screenshots

Real product screenshots that the marketing pages reference. Filenames here
must match the `src` values used by `<BrowserFrame>` calls — see
`components/marketing/BrowserFrame.tsx` and the marketing page sources.

Until each file exists in this directory, the corresponding `<BrowserFrame>`
renders a dashed placeholder labelled with the filename + route. Drop the
PNGs here and flip the `available` prop on the matching `<BrowserFrame>`
(or have the capture script update the manifest — see below).

## Capture method

You have two equally-supported options.

### A. Automated (recommended)

```bash
# 1. Make sure the app is running locally with REAL crawled data:
#    - Backend: cd ../api && make up && make migrate && datacrawlr seed-sources
#      && datacrawlr crawl huggingface --max-batches 4 && wait for enrichment
#    - Frontend: pnpm dev (NEXT_PUBLIC_USE_MOCK_DATA=false; .env.example default)

# 2. Install Playwright's Chromium build once:
npx playwright install chromium

# 3. Capture every screenshot in the manifest:
pnpm capture:screenshots
```

The script reads the manifest below, navigates to each route at the
specified viewport, waits for the network to settle plus a content
selector to appear, then writes a PNG into this directory.

### B. Manual (macOS)

Open each route in a real browser at the target viewport (resize the
window with the dev-tools device toolbar set to "Responsive" → 1440×900
for desktop, 390×844 for mobile), press `Cmd+Shift+4`, click+drag to
capture the area of interest. Save as `<filename>.png` here.

## Manifest

| Filename                          | Route                                 | Viewport   | Required data state                                                    |
| --------------------------------- | ------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `hero-graph.png`                  | `/datasets/<popular-slug>` (Lineage tab) | 1440×900   | Dataset with ≥3 related datasets; lineage edges populated.            |
| `search-results.png`              | `/search?q=medical+imaging`           | 1440×900   | Index populated; AI synthesis generated; ≥6 result cards.             |
| `live-search.png`                 | `/` with typeahead dropdown open      | 1440×900   | Type "imagenet" into the hero; capture with dropdown showing matches. |
| `dataset-detail.png`              | `/datasets/<popular-slug>` (Overview) | 1440×900   | AI summary present; ≥3 sources; ≥1 model link in "Models trained on". |
| `model-detail.png`                | `/models/<frontier-slug>` (Overview)  | 1440×900   | ≥4 benchmark scores; composite rank assigned.                          |
| `model-benchmarks.png`            | `/models/<frontier-slug>` Benchmarks  | 1440×900   | Same as above; click Benchmarks tab before capture.                    |
| `model-leaderboard.png`           | `/models/leaderboard/mmlu-pro`        | 1440×900   | ≥20 models scored on MMLU-Pro.                                         |
| `explore-dashboard.png`           | `/explore`                            | 1440×900   | Stats + domain grid + trending rail all populated.                     |
| `model-comparison.png`            | `/models/compare?ids=<a>,<b>`         | 1440×900   | Both models have full benchmark + pricing data.                        |
| `search-results-mobile.png`       | `/search?q=medical+imaging`           | 390×844    | Same data as desktop; mobile layout.                                   |
| `dataset-detail-mobile.png`       | `/datasets/<popular-slug>` (Overview) | 390×844    | Same data as desktop; mobile layout.                                   |

Replace `<popular-slug>` and `<frontier-slug>` with real values from the
running index — e.g. `hf-meta-llama-llama-4-maverick` for the frontier
model. The capture script honors `MARKETING_DATASET_SLUG`,
`MARKETING_MODEL_SLUG`, and `MARKETING_COMPARE_IDS` env vars so you can
point it at the right rows without editing the script.

## After capture

Set `available={true}` on the corresponding `<BrowserFrame>` calls (search
`grep -nR "BrowserFrame" components app` to find them). The placeholder
disappears and the real image renders at the same dimensions, so layout
won't reflow.
