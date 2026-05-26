import { ImageResponse } from "next/og"

export const alt = "Datacrawlr — The dataset intelligence layer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          backgroundColor: "#07080A",
          backgroundImage:
            "radial-gradient(ellipse at top, #1A2238 0%, #07080A 60%)",
          color: "#F5F7FA",
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 56 }}
        >
          <svg width="56" height="56" viewBox="0 0 20 20" fill="none">
            <line
              x1="10"
              y1="4"
              x2="4"
              y2="16"
              stroke="#5EEAD4"
              strokeWidth={0.75}
              strokeOpacity={0.6}
            />
            <line
              x1="10"
              y1="4"
              x2="16"
              y2="16"
              stroke="#5EEAD4"
              strokeWidth={0.75}
              strokeOpacity={0.6}
            />
            <line
              x1="4"
              y1="16"
              x2="16"
              y2="16"
              stroke="#5EEAD4"
              strokeWidth={0.75}
              strokeOpacity={0.6}
            />
            <circle cx="10" cy="4" r="2" fill="#5EEAD4" />
            <circle cx="4" cy="16" r="2" fill="#5EEAD4" />
            <circle cx="16" cy="16" r="2" fill="#5EEAD4" />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#F5F7FA" }}>data</span>
            <span style={{ color: "#5EEAD4" }}>crawlr</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          The dataset intelligence layer.
        </div>

        <div
          style={{
            display: "flex",
            color: "#A0A7B4",
            fontSize: 28,
            lineHeight: 1.4,
          }}
        >
          Semantic search across HuggingFace, Kaggle, GitHub, and research
          papers.
        </div>
      </div>
    ),
    { ...size }
  )
}
