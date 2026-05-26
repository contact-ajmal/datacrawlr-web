import type { BenchmarkName } from "./types"

export interface BenchmarkMeta {
  title: string
  description: string
  methodology: string
  scoreFormat: string
}

/**
 * Static, per-benchmark explanation copy. Surfaces on the leaderboard
 * detail page and (when we wire it later) on benchmark tooltips.
 *
 * The methodology blurb is intentionally short — link out to canonical
 * sources rather than reproduce them.
 */
export const BENCHMARK_META: Record<BenchmarkName, BenchmarkMeta> = {
  "mmlu-pro": {
    title: "MMLU-Pro",
    description:
      "Anti-contamination general knowledge and reasoning. The successor to MMLU, designed to resist memorization through harder questions and adversarial examples.",
    methodology:
      "5-shot prompting, multiple-choice with 10 options. Reported as accuracy on a held-out test set.",
    scoreFormat: "% accuracy",
  },
  gpqa: {
    title: "GPQA Diamond",
    description:
      "Graduate-level questions in biology, chemistry, and physics — designed to be difficult even for domain experts with access to the open web.",
    methodology:
      "Zero-shot, multiple-choice with 4 options. The 'Diamond' subset is the highest-quality slice.",
    scoreFormat: "% accuracy",
  },
  humaneval: {
    title: "HumanEval",
    description:
      "Function-level code synthesis from docstrings. The original OpenAI release covers 164 Python problems with hidden unit tests.",
    methodology:
      "pass@1 — one generation per problem. Saturated for frontier models; LiveCodeBench is the modern replacement.",
    scoreFormat: "% pass@1",
  },
  math: {
    title: "MATH",
    description:
      "Olympiad-style mathematical problem solving across algebra, geometry, calculus, and number theory.",
    methodology:
      "Chain-of-thought generation, answer extracted from the final boxed expression. Reported as exact-match accuracy.",
    scoreFormat: "% accuracy",
  },
  ifeval: {
    title: "IFEval",
    description:
      "Strict instruction following — checks whether the model obeys verifiable constraints like 'reply in exactly three bullets'.",
    methodology:
      "Programmatic verification of 25 instruction types. Strict prompt-level accuracy.",
    scoreFormat: "% accuracy",
  },
  musr: {
    title: "MuSR",
    description:
      "Multistep reasoning narratives — murder mysteries and team allocation puzzles requiring multi-hop inference.",
    methodology:
      "Zero-shot, multiple-choice. Designed to be hard to pre-train on by virtue of its narrative structure.",
    scoreFormat: "% accuracy",
  },
  bfcl: {
    title: "BFCL",
    description:
      "Berkeley Function-Calling Leaderboard — measures whether the model can call the right tool with the right arguments.",
    methodology:
      "AST-level and execution-level verification across simple, multiple, and parallel function calls.",
    scoreFormat: "% pass rate",
  },
  "arena-elo": {
    title: "Chatbot Arena ELO",
    description:
      "Human-preference ratings from blind, pairwise battles in LMSys Chatbot Arena.",
    methodology:
      "Bradley-Terry ELO over hundreds of thousands of human votes. Updated continuously; can drift with population shifts.",
    scoreFormat: "ELO",
  },
  mmlu: {
    title: "MMLU (legacy)",
    description:
      "The original multi-subject knowledge benchmark — 57 academic and professional subjects. Largely saturated; included for historical comparison.",
    methodology:
      "5-shot prompting, multiple-choice with 4 options. Prefer MMLU-Pro for current evaluation.",
    scoreFormat: "% accuracy",
  },
  aime: {
    title: "AIME",
    description:
      "American Invitational Mathematics Examination — high-school competition math, integer-valued answers.",
    methodology:
      "Free-form generation with answer extraction. Reported as accuracy on the 2024 set unless otherwise noted.",
    scoreFormat: "% accuracy",
  },
  "swe-bench-verified": {
    title: "SWE-Bench Verified",
    description:
      "Real-world software engineering tasks — fixing bugs in popular open-source Python repositories from GitHub issues.",
    methodology:
      "Hidden unit tests on the human-verified subset (500 problems). Resolution rate measured end-to-end.",
    scoreFormat: "% resolved",
  },
  livecodebench: {
    title: "LiveCodeBench",
    description:
      "Code generation on programming contest problems collected after each model's training cutoff. Contamination-resistant by construction.",
    methodology:
      "pass@1 over a rolling window of recent LeetCode/AtCoder/CodeForces problems.",
    scoreFormat: "% pass@1",
  },
}

export const ALL_BENCHMARKS = Object.keys(BENCHMARK_META) as BenchmarkName[]
