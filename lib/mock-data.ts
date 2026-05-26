import type {
  BenchmarkScore,
  Citation,
  Dataset,
  GraphEdge,
  GraphNode,
  Model,
  SchemaField,
  SearchFilters,
  SearchResponse,
  SearchResult,
} from "./types"

const KB = 1024
const MB = KB * 1024
const GB = MB * 1024
const TB = GB * 1024

const taxiSchema: SchemaField[] = [
  { name: "trip_id", type: "string", description: "Unique trip identifier" },
  { name: "pickup_datetime", type: "timestamp", description: "Pickup time in NYC local" },
  { name: "dropoff_datetime", type: "timestamp", description: "Dropoff time in NYC local" },
  { name: "passenger_count", type: "int", nullable: true },
  { name: "trip_distance_miles", type: "float" },
  { name: "pickup_zone", type: "string", description: "TLC taxi zone name" },
  { name: "dropoff_zone", type: "string" },
  { name: "fare_amount_usd", type: "float" },
  { name: "tip_amount_usd", type: "float", nullable: true },
  { name: "total_amount_usd", type: "float" },
  { name: "payment_type", type: "enum<cash,card,nopayment>" },
  { name: "vendor_id", type: "string" },
]

const creditSchema: SchemaField[] = [
  { name: "applicant_id", type: "string" },
  { name: "age_bucket", type: "enum<18-25,26-35,36-50,51-65,65+>" },
  { name: "income_bracket", type: "string", description: "Synthetic income bracket — not real" },
  { name: "employment_years", type: "float", nullable: true },
  { name: "credit_history_months", type: "int" },
  { name: "open_credit_lines", type: "int" },
  { name: "loan_amount_usd", type: "float" },
  { name: "loan_purpose", type: "enum<auto,home,personal,business,education>" },
  { name: "default_within_24mo", type: "bool", description: "Target label" },
  { name: "synth_seed", type: "int", description: "Generator seed for reproducibility" },
]

const energySchema: SchemaField[] = [
  { name: "household_id", type: "string" },
  { name: "timestamp", type: "timestamp" },
  { name: "kwh_consumed", type: "float" },
  { name: "outdoor_temp_c", type: "float", nullable: true },
  { name: "indoor_temp_c", type: "float", nullable: true },
  { name: "occupancy_count", type: "int", nullable: true },
  { name: "appliance_id", type: "string", nullable: true },
  { name: "tariff_band", type: "enum<peak,offpeak,shoulder>" },
]

const flightSchema: SchemaField[] = [
  { name: "flight_id", type: "string" },
  { name: "carrier", type: "string" },
  { name: "origin_iata", type: "string" },
  { name: "destination_iata", type: "string" },
  { name: "scheduled_departure", type: "timestamp" },
  { name: "actual_departure", type: "timestamp", nullable: true },
  { name: "delay_minutes", type: "int" },
  { name: "cancellation_reason", type: "enum<weather,carrier,nas,security,none>" },
  { name: "distance_miles", type: "int" },
  { name: "aircraft_type", type: "string" },
]

const stackoverflowSchema: SchemaField[] = [
  { name: "question_id", type: "string" },
  { name: "question_title", type: "string" },
  { name: "question_body", type: "markdown" },
  { name: "accepted_answer_body", type: "markdown" },
  { name: "tags", type: "list<string>" },
  { name: "language", type: "string", description: "Inferred programming language" },
  { name: "score_question", type: "int" },
  { name: "score_answer", type: "int" },
  { name: "code_blocks", type: "list<string>", description: "Extracted fenced code blocks" },
]

const arxivSchema: SchemaField[] = [
  { name: "arxiv_id", type: "string" },
  { name: "title", type: "string" },
  { name: "abstract", type: "string" },
  { name: "authors", type: "list<string>" },
  { name: "primary_category", type: "string" },
  { name: "categories", type: "list<string>" },
  { name: "submitted", type: "date" },
  { name: "updated", type: "date" },
  { name: "doi", type: "string", nullable: true },
]

const librispeechSchema: SchemaField[] = [
  { name: "utterance_id", type: "string" },
  { name: "speaker_id", type: "string" },
  { name: "audio_path", type: "string" },
  { name: "transcript", type: "string" },
  { name: "duration_seconds", type: "float" },
  { name: "sample_rate", type: "int" },
  { name: "snr_db", type: "float", description: "Estimated signal-to-noise ratio" },
  { name: "split", type: "enum<train,dev,test>" },
]

const codesearchSchema: SchemaField[] = [
  { name: "func_name", type: "string" },
  { name: "language", type: "enum<python,javascript,java,go,php,ruby>" },
  { name: "code", type: "string" },
  { name: "docstring", type: "string", nullable: true },
  { name: "repo", type: "string" },
  { name: "path", type: "string" },
  { name: "license", type: "string" },
  { name: "stars", type: "int" },
]

const scienceQASchema: SchemaField[] = [
  { name: "question_id", type: "string" },
  { name: "question", type: "string" },
  { name: "image_path", type: "string", nullable: true },
  { name: "choices", type: "list<string>" },
  { name: "answer_idx", type: "int" },
  { name: "subject", type: "enum<biology,physics,chemistry,earth-science,economics>" },
  { name: "grade", type: "string" },
  { name: "lecture", type: "string", nullable: true },
  { name: "solution_explanation", type: "string", nullable: true },
]

const wikitextCitations: Citation[] = [
  {
    title: "Pointer Sentinel Mixture Models",
    authors: ["Stephen Merity", "Caiming Xiong", "James Bradbury", "Richard Socher"],
    venue: "ICLR",
    year: 2017,
    url: "https://arxiv.org/abs/1609.07843",
  },
  {
    title: "Regularizing and Optimizing LSTM Language Models",
    authors: ["Stephen Merity", "Nitish Shirish Keskar", "Richard Socher"],
    venue: "ICLR",
    year: 2018,
    url: "https://arxiv.org/abs/1708.02182",
  },
  {
    title: "Language Modeling with Gated Convolutional Networks",
    authors: ["Yann Dauphin", "Angela Fan", "Michael Auli", "David Grangier"],
    venue: "ICML",
    year: 2017,
    url: "https://arxiv.org/abs/1612.08083",
  },
  {
    title: "Re-evaluating WikiText-103 in the Era of Modern LLMs",
    authors: ["A. Patel", "M. Lin", "S. Choudhury"],
    venue: "EMNLP Findings",
    year: 2024,
    url: "https://example.org/papers/wikitext-revisit-2024",
  },
]

const openwebmathCitations: Citation[] = [
  {
    title: "OpenWebMath: An Open Dataset of High-Quality Mathematical Web Text",
    authors: ["K. Paster", "M. Dos Santos", "Z. Azerbayev", "J. Ba"],
    venue: "ICLR",
    year: 2024,
    url: "https://arxiv.org/abs/2310.06786",
  },
  {
    title: "Llemma: An Open Language Model for Mathematics",
    authors: ["Z. Azerbayev", "H. Schoelkopf", "K. Paster"],
    venue: "ICLR",
    year: 2024,
    url: "https://arxiv.org/abs/2310.10631",
  },
  {
    title: "Continued Pretraining on Math: Practical Recipes",
    authors: ["L. Romero", "T. Nakamura"],
    venue: "Workshop on Math AI",
    year: 2025,
    url: "https://example.org/papers/math-pretrain-2025",
  },
]

const librispeechCitations: Citation[] = [
  {
    title: "LibriSpeech: An ASR Corpus Based on Public Domain Audio Books",
    authors: ["V. Panayotov", "G. Chen", "D. Povey", "S. Khudanpur"],
    venue: "ICASSP",
    year: 2015,
    url: "https://www.openslr.org/12/",
  },
  {
    title: "Conformer: Convolution-augmented Transformer for Speech Recognition",
    authors: ["A. Gulati", "J. Qin", "C.-C. Chiu", "N. Parmar"],
    venue: "Interspeech",
    year: 2020,
    url: "https://arxiv.org/abs/2005.08100",
  },
  {
    title: "Whisper: Robust Speech Recognition via Large-Scale Weak Supervision",
    authors: ["A. Radford", "J. W. Kim", "T. Xu", "G. Brockman"],
    venue: "OpenAI",
    year: 2022,
    url: "https://arxiv.org/abs/2212.04356",
  },
  {
    title: "Re-cleaning LibriSpeech: Aligned Transcripts and Noise Estimates",
    authors: ["P. Voss", "R. Garcia"],
    venue: "Interspeech",
    year: 2024,
    url: "https://example.org/papers/librispeech-clean-2024",
  },
]

const audiosetCitations: Citation[] = [
  {
    title: "Audio Set: An ontology and human-labeled dataset for audio events",
    authors: ["J. Gemmeke", "D. Ellis", "D. Freedman"],
    venue: "ICASSP",
    year: 2017,
    url: "https://research.google.com/audioset/",
  },
  {
    title: "PANNs: Large-Scale Pretrained Audio Neural Networks",
    authors: ["Q. Kong", "Y. Cao", "T. Iqbal"],
    venue: "TASLP",
    year: 2020,
    url: "https://arxiv.org/abs/1912.10211",
  },
  {
    title: "AudioSet Strong: Re-balancing the Tail",
    authors: ["S. Hershey", "A. Chaudhuri"],
    venue: "ICASSP",
    year: 2024,
    url: "https://example.org/papers/audioset-strong-2024",
  },
]

const laionCitations: Citation[] = [
  {
    title: "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models",
    authors: ["C. Schuhmann", "R. Beaumont", "R. Vencu"],
    venue: "NeurIPS",
    year: 2022,
    url: "https://arxiv.org/abs/2210.08402",
  },
  {
    title: "Stable Diffusion: High-Resolution Image Synthesis with Latent Diffusion",
    authors: ["R. Rombach", "A. Blattmann", "D. Lorenz"],
    venue: "CVPR",
    year: 2022,
    url: "https://arxiv.org/abs/2112.10752",
  },
  {
    title: "Curating Web-Scale Image-Text Pairs for Safer Training",
    authors: ["D. Birhane", "V. Prabhu"],
    venue: "FAccT",
    year: 2023,
    url: "https://example.org/papers/curated-image-text",
  },
  {
    title: "LAION-Curated-EN: A Filtered English Subset",
    authors: ["E. Tanaka", "M. Owens"],
    venue: "Workshop on Open Data",
    year: 2025,
    url: "https://example.org/papers/laion-curated-en",
  },
]

const kineticsCitations: Citation[] = [
  {
    title: "The Kinetics Human Action Video Dataset",
    authors: ["W. Kay", "J. Carreira", "K. Simonyan"],
    venue: "arXiv",
    year: 2017,
    url: "https://arxiv.org/abs/1705.06950",
  },
  {
    title: "Quo Vadis, Action Recognition? A New Model and the Kinetics Dataset",
    authors: ["J. Carreira", "A. Zisserman"],
    venue: "CVPR",
    year: 2017,
    url: "https://arxiv.org/abs/1705.07750",
  },
  {
    title: "VideoMAE: Masked Autoencoders for Self-Supervised Video Pre-Training",
    authors: ["Z. Tong", "Y. Song", "J. Wang", "L. Wang"],
    venue: "NeurIPS",
    year: 2022,
    url: "https://arxiv.org/abs/2203.12602",
  },
]

const scienceQACitations: Citation[] = [
  {
    title: "Learn to Explain: Multimodal Reasoning via Thought Chains for Science Question Answering",
    authors: ["P. Lu", "S. Mishra", "T. Xia", "L. Qiu"],
    venue: "NeurIPS",
    year: 2022,
    url: "https://arxiv.org/abs/2209.09513",
  },
  {
    title: "Multimodal Chain-of-Thought Reasoning in Language Models",
    authors: ["Z. Zhang", "A. Zhang", "M. Li"],
    venue: "TMLR",
    year: 2023,
    url: "https://arxiv.org/abs/2302.00923",
  },
  {
    title: "ScienceQA-Multimodal v2: Diagram-Aware Splits",
    authors: ["H. Naidu", "F. Li"],
    venue: "EMNLP",
    year: 2024,
    url: "https://example.org/papers/scienceqa-v2",
  },
]

const medicalImagenetCitations: Citation[] = [
  {
    title: "MedicalNet: Transfer Learning for 3D Medical Image Analysis",
    authors: ["S. Chen", "K. Ma", "Y. Zheng"],
    venue: "MICCAI",
    year: 2019,
    url: "https://arxiv.org/abs/1904.00625",
  },
  {
    title: "RadImageNet: A Large-Scale Radiologic Dataset for Transfer Learning",
    authors: ["X. Mei", "Z. Liu", "P. Robson"],
    venue: "Radiology: AI",
    year: 2022,
    url: "https://pubs.rsna.org/doi/10.1148/ryai.210315",
  },
  {
    title: "MedicalImageNet-v3: De-identification and Re-balancing Across Modalities",
    authors: ["J. Park", "A. Iyer"],
    venue: "MICCAI",
    year: 2025,
    url: "https://example.org/papers/medicalimagenet-v3",
  },
]

export const datasets: Dataset[] = [
  {
    id: "ds-001",
    slug: "wikitext-103-refined",
    name: "WikiText-103-Refined",
    description: "A re-tokenized, deduplicated take on the classic WikiText-103 long-form prose corpus.",
    longDescription:
      "## Overview\n\nWikiText-103-Refined is a 2024 community re-cut of the original WikiText-103 corpus from Salesforce Research. It preserves the long-form Wikipedia article structure that made the original useful for measuring perplexity on extended context, while patching three known issues: residual HTML escapes in articles 18,000–22,000, duplicated section headers introduced by the original sentence splitter, and inconsistent unicode normalization for diacritics in non-English names.\n\n## Use it for\n\n- Perplexity benchmarks against pre-2023 baselines.\n- Sanity-checking small-to-medium language models on coherent long-form prose.\n- Tokenizer evaluation where stable, well-known text is required.",
    tags: ["language-modeling", "wikipedia", "long-context", "perplexity", "english"],
    modality: "text",
    size: { rows: 1_801_350, bytes: 540 * MB },
    license: "CC-BY-SA-3.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/wikitext",
        title: "wikitext on Hugging Face",
      },
      {
        provider: "github",
        url: "https://github.com/example/wikitext-103-refined",
        title: "Refinement scripts",
      },
    ],
    lastUpdated: "2025-11-14",
    popularity: 88,
    quality: 92,
    warnings: [
      {
        level: "info",
        title: "Tokenization drift in articles 18,000–22,000",
        body: "If you're fine-tuning a sentencepiece model, expect ~2% token-count drift compared to the original 2016 release in this article range. Most users will not notice.",
      },
    ],
    aiSummary:
      "WikiText-103-Refined remains the strongest choice for benchmarking small language models on long-form prose, particularly for perplexity comparisons against pre-2023 baselines. The 2024 re-cut fixes the worst HTML and unicode bugs from the original release. Watch for the documented tokenization drift in articles 18,000–22,000 if you're training a sentencepiece model — it's small but reproducible. Avoid if you need anything multilingual or beyond Wikipedia's prose register.",
    citations: wikitextCitations,
    downloads: 412_000,
  },
  {
    id: "ds-002",
    slug: "commoncrawl-curated-2024",
    name: "CommonCrawl-Curated-2024",
    description: "A quality-filtered slice of CommonCrawl with deduplication and toxicity scoring.",
    longDescription:
      "A 4.2 TB English subset of CommonCrawl 2024 snapshots, filtered with a CCNet-style perplexity threshold, MinHash deduplication at the document level, and a per-shard toxicity score for downstream filtering. Released as a series of Parquet shards with stable IDs across the 12 monthly snapshots.",
    tags: ["pretraining", "web", "english", "deduplicated"],
    modality: "text",
    size: { rows: 1_400_000_000, bytes: 4.2 * TB },
    license: "custom",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/commoncrawl-curated-2024",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2026-02-08",
    popularity: 95,
    quality: 78,
    warnings: [
      {
        level: "warn",
        title: "License is non-standard",
        body: "Distribution is permitted for research; commercial use requires a per-org agreement. Read the LICENSE file before training a production model.",
      },
      {
        level: "info",
        title: "Toxicity scores are advisory",
        body: "The toxicity field is a model output, not a label. Always re-filter for your downstream policy.",
      },
    ],
    aiSummary:
      "CommonCrawl-Curated-2024 is the most up-to-date open pretraining corpus, with sane defaults for dedup and quality scoring already applied. Use it as a base for general LLM pretraining when you need recent web coverage and don't want to redo CCNet-style filtering yourself. The custom license blocks commercial use without a separate agreement, which is the main reason teams pick a more permissive alternative. Treat the toxicity scores as a starting point, not a final filter.",
    downloads: 1_800_000,
  },
  {
    id: "ds-003",
    slug: "openwebmath-plus",
    name: "OpenWebMath-Plus",
    description: "An expanded math-rich web corpus with LaTeX preserved and theorem boundaries marked.",
    longDescription:
      "OpenWebMath-Plus extends the original OpenWebMath release with 1.6× more documents drawn from arxiv mirrors, math StackExchange, and curated lecture notes. LaTeX is preserved verbatim; section and theorem boundaries are tagged so models can learn structural cues.",
    tags: ["math", "latex", "pretraining", "stem"],
    modality: "text",
    size: { rows: 21_400_000, bytes: 64 * GB },
    license: "ODC-BY-1.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/openwebmath-plus",
        title: "Hugging Face mirror",
      },
      {
        provider: "paper",
        url: "https://arxiv.org/abs/2310.06786",
        title: "Original OpenWebMath paper",
      },
    ],
    lastUpdated: "2025-12-02",
    popularity: 82,
    quality: 90,
    warnings: [
      {
        level: "info",
        title: "LaTeX is verbatim, not normalized",
        body: "Macros and custom \\newcommand definitions are preserved as-is. Normalize at training time if your model can't handle expanded macros.",
      },
    ],
    aiSummary:
      "OpenWebMath-Plus is the obvious pick when you're doing continued pretraining for math or scientific reasoning and need clean LaTeX in context. It's noticeably better than naive CommonCrawl filtering for this domain because theorem and section boundaries are tagged. The verbatim LaTeX is a feature for capable models and a footgun for smaller ones — normalize macros if your tokenizer can't handle them. Pair with a general corpus to avoid catastrophic forgetting.",
    citations: openwebmathCitations,
    downloads: 96_000,
  },
  {
    id: "ds-004",
    slug: "stackoverflow-code-pairs",
    name: "StackOverflow-Code-Pairs",
    description: "Question-answer pairs from StackOverflow with code blocks extracted and language-tagged.",
    longDescription:
      "A 6M-row dataset of accepted StackOverflow Q&A pairs across the top 12 programming languages, with fenced code blocks extracted into their own field and language inferred via tree-sitter. Useful for training code-explanation, bug-fix, and dual-encoder retrieval models.",
    tags: ["code", "qa", "stackoverflow", "retrieval"],
    modality: "text",
    size: { rows: 6_400_000, bytes: 18 * GB },
    license: "CC-BY-SA-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/stackoverflow-code-pairs",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2026-01-21",
    popularity: 79,
    quality: 84,
    warnings: [
      {
        level: "warn",
        title: "Share-Alike license",
        body: "Outputs of models trained on this data may inherit the share-alike obligation depending on your jurisdiction. Check with legal before commercial deployment.",
      },
    ],
    aiSummary:
      "StackOverflow-Code-Pairs is a strong choice for any code-understanding or QA-style task because the answers are human-curated and the code is already separated from prose. The language inference makes it easy to filter to a single language without writing detection yourself. The CC-BY-SA license is the main commercial blocker — many teams treat it as fine-for-research-only. Don't use it as the *only* code corpus; coverage of newer frameworks is uneven.",
    schema: stackoverflowSchema,
    downloads: 154_000,
  },
  {
    id: "ds-005",
    slug: "arxiv-abstracts-2025",
    name: "ArxivAbstracts-2025",
    description: "All arXiv abstracts through end of 2025, with cleaned LaTeX and citation graph.",
    longDescription:
      "A complete dump of arXiv abstracts and metadata through 2025-12-31. LaTeX in titles and abstracts is preserved; a side-table of citation edges links papers within the dump for graph-based experiments.",
    tags: ["arxiv", "abstracts", "metadata", "scientific"],
    modality: "text",
    size: { rows: 2_780_000, bytes: 6.8 * GB },
    license: "CC0-1.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/arxiv-abstracts-2025",
        title: "Hugging Face mirror",
      },
      {
        provider: "github",
        url: "https://github.com/example/arxiv-abstracts-2025",
        title: "Build scripts",
      },
    ],
    lastUpdated: "2026-01-04",
    popularity: 74,
    quality: 88,
    warnings: [],
    aiSummary:
      "ArxivAbstracts-2025 is the easiest way to get a complete, recent academic abstract corpus with permissive licensing. CC0 means you can use it for anything, including commercial pretraining. The citation-graph side-table is what makes it interesting for retrieval and recommendation experiments — most arxiv dumps don't include it. The main weakness is that abstracts are short; for deep semantics you'll want full-text papers from a different source.",
    schema: arxivSchema,
    downloads: 88_000,
  },
  {
    id: "ds-006",
    slug: "reddit-dialog-7m",
    name: "RedditDialog-7M",
    description: "7M Reddit comment threads filtered for multi-turn conversational structure.",
    longDescription:
      "Filtered Reddit threads from 2018-2024 with at least three turns, no removed/deleted comments in the chain, and minimum karma thresholds applied per turn. Useful for conversational pretraining and dialogue evaluation.",
    tags: ["dialogue", "reddit", "conversational", "english"],
    modality: "text",
    size: { rows: 7_120_000, bytes: 22 * GB },
    license: "custom",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/reddit-dialog-7m",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-09-30",
    popularity: 61,
    quality: 70,
    warnings: [
      {
        level: "danger",
        title: "Reddit content licensing in flux",
        body: "Reddit's API and content licensing terms changed in 2024. Verify your use case is permitted before redistributing or training a public model.",
      },
      {
        level: "warn",
        title: "Toxic and offensive content",
        body: "Despite filtering, Reddit threads contain significant toxic content. Apply downstream safety filtering before using outputs in user-facing products.",
      },
    ],
    aiSummary:
      "RedditDialog-7M is one of the larger open conversational corpora with explicit multi-turn structure, which is hard to get from synthetic data. Use it when you specifically need natural, casual, often-irreverent dialogue patterns. The licensing situation is the dominant concern — train at your own risk and double-check Reddit's current redistribution terms. Always pair with safety filtering downstream; the karma threshold removes the worst content but not all of it.",
    downloads: 41_000,
  },
  {
    id: "ds-007",
    slug: "multilegal-eu",
    name: "MultiLegal-EU",
    description: "Aligned legal documents across 23 EU languages from EUR-Lex and member-state portals.",
    longDescription:
      "A multilingual legal corpus with sentence-aligned documents across 23 EU languages, drawn from EUR-Lex regulations, directives, and case law. Includes document-type tags and CELEX identifiers for cross-referencing.",
    tags: ["legal", "multilingual", "european", "translation"],
    modality: "text",
    size: { rows: 480_000, bytes: 28 * GB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/multilegal-eu",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-10-17",
    popularity: 48,
    quality: 86,
    warnings: [
      {
        level: "info",
        title: "Alignment quality varies by language pair",
        body: "Sentence alignment is high-quality for EN/DE/FR/ES but degrades for low-resource pairs like MT (Maltese). Use language-pair-specific evaluation.",
      },
    ],
    aiSummary:
      "MultiLegal-EU is the go-to corpus for multilingual legal NLP because the alignment is genuinely sentence-level, not just document-level. The legal domain coverage is excellent for European law and weak for everything else, so don't generalize to common-law jurisdictions. Quality is uneven across the long tail of EU languages — benchmark per-pair before trusting cross-lingual transfer numbers. CC-BY-4.0 is friendly enough for commercial use with attribution.",
    downloads: 12_000,
  },
  {
    id: "ds-008",
    slug: "medical-notes-synthetic",
    name: "MedicalNotes-Synthetic",
    description: "Synthetic clinical notes generated from MIMIC-style templates with patient privacy preserved.",
    longDescription:
      "Fully synthetic clinical notes (no real patient data) generated using a templating engine seeded with anonymized MIMIC-IV statistics. Covers admission summaries, progress notes, discharge summaries, and radiology reports across 14 specialties.",
    tags: ["medical", "synthetic", "clinical", "privacy-safe"],
    modality: "text",
    size: { rows: 1_240_000, bytes: 3.1 * GB },
    license: "Apache-2.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/medical-notes-synthetic",
        title: "Hugging Face mirror",
      },
      {
        provider: "github",
        url: "https://github.com/example/medical-notes-synthetic",
        title: "Generation pipeline",
      },
    ],
    lastUpdated: "2025-08-22",
    popularity: 56,
    quality: 74,
    warnings: [
      {
        level: "warn",
        title: "Synthetic ≠ real-world distribution",
        body: "These notes match aggregate statistics but not the long-tail variability of actual clinical writing. Models trained only on this dataset will fail on real notes.",
      },
      {
        level: "info",
        title: "Not for clinical decision-making",
        body: "Outputs from models trained on this data are not appropriate for any actual medical decision support without rigorous downstream validation.",
      },
    ],
    aiSummary:
      "MedicalNotes-Synthetic is the lowest-friction way to get started on clinical NLP because there's zero PHI risk and the Apache license is unrestricted. Use it for prototyping, schema design, and instruction tuning where the synthetic distribution is good enough. The synthetic-to-real gap is the central caveat: do not benchmark or deploy without validating on real (de-identified) clinical text. Best paired with a small real-data evaluation set.",
    downloads: 18_400,
  },
  {
    id: "ds-009",
    slug: "newsroom-sum-xl",
    name: "NewsroomSum-XL",
    description: "1.4M article-summary pairs from major newsrooms with extractive vs abstractive labels.",
    longDescription:
      "A summarization corpus drawn from 38 major English-language news outlets between 2010 and 2024. Each article-summary pair is scored on an extractiveness axis so you can easily build train/eval splits stratified by summary style.",
    tags: ["summarization", "news", "english", "abstractive"],
    modality: "text",
    size: { rows: 1_400_000, bytes: 8.2 * GB },
    license: "custom",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/newsroom-sum-xl",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-06-11",
    popularity: 64,
    quality: 80,
    warnings: [
      {
        level: "warn",
        title: "Per-publisher copyright restrictions",
        body: "Some publishers permit only research use; commercial training requires per-publisher licensing. The metadata field 'commercial_ok' indicates which subset is safe.",
      },
    ],
    aiSummary:
      "NewsroomSum-XL is one of the larger and cleaner summarization datasets, with the unusually useful feature of an extractiveness score per pair. That makes it easy to study the abstractive vs extractive boundary without rolling your own labels. The license is the catch — filter on 'commercial_ok' if you're training anything that ships. Coverage skews to US/UK English and centrist outlets, so don't claim general news summarization without broader evaluation.",
    downloads: 27_000,
  },
  {
    id: "ds-010",
    slug: "codesearchnet-refined",
    name: "CodeSearchNet-Refined",
    description: "A re-cleaned CodeSearchNet with stricter docstring filtering and license verification.",
    longDescription:
      "A refresh of CodeSearchNet across Python, JavaScript, Java, Go, PHP, and Ruby. Docstrings are filtered for length and English-language detection; per-function license is verified against repository-level SPDX where available.",
    tags: ["code", "retrieval", "docstrings", "multilang"],
    modality: "text",
    size: { rows: 5_800_000, bytes: 14 * GB },
    license: "MIT",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/codesearchnet-refined",
        title: "Hugging Face mirror",
      },
      {
        provider: "github",
        url: "https://github.com/example/codesearchnet-refined",
        title: "Build pipeline",
      },
    ],
    lastUpdated: "2025-12-19",
    popularity: 71,
    quality: 85,
    warnings: [
      {
        level: "info",
        title: "Per-function license is best-effort",
        body: "Repo-level SPDX is used as the source of truth. Functions in repos without SPDX inherit a 'unknown' license tag — exclude these for commercial training.",
      },
    ],
    aiSummary:
      "CodeSearchNet-Refined is a sensible pick for code-search and docstring-driven retrieval tasks because the docstring filtering removes the worst noise from the original release. The verified per-function license tag is its standout feature — most code corpora ignore licensing entirely. Always exclude 'unknown' license tags before commercial use; that's the difference between defensible and not. Don't expect coverage of newer ecosystems like Rust or Zig.",
    schema: codesearchSchema,
    downloads: 36_000,
  },
  {
    id: "ds-011",
    slug: "medical-imagenet-v3",
    name: "MedicalImageNet-v3",
    description: "Multi-modality medical imaging dataset across CT, MRI, X-ray, and ultrasound.",
    longDescription:
      "A large-scale curated medical imaging dataset spanning four modalities and 14 anatomical regions. v3 adds re-balanced class distributions and improved de-identification (face removal for head CT/MRI, embedded text removal across all modalities).",
    tags: ["medical", "imaging", "ct", "mri", "xray", "ultrasound"],
    modality: "image",
    size: { rows: 2_400_000, bytes: 1.4 * TB },
    license: "CC-BY-NC-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/medical-imagenet-v3",
        title: "Hugging Face mirror",
      },
      {
        provider: "paper",
        url: "https://example.org/papers/medicalimagenet-v3",
        title: "v3 release paper",
      },
    ],
    lastUpdated: "2025-11-30",
    popularity: 72,
    quality: 88,
    warnings: [
      {
        level: "danger",
        title: "Non-commercial license",
        body: "CC-BY-NC-4.0 prohibits commercial use of the data and likely of derived models. Healthcare startups should not use this for production training.",
      },
      {
        level: "info",
        title: "De-identification verified but not guaranteed",
        body: "Best-effort PII removal; unusual edge cases (handwritten annotations on legacy films) may slip through.",
      },
    ],
    aiSummary:
      "MedicalImageNet-v3 is the most comprehensive open multi-modality medical imaging corpus available, and the v3 de-identification work is genuinely improved over earlier releases. It's appropriate for academic research, transfer-learning studies, and pretraining medical foundation models in non-commercial contexts. The CC-BY-NC clause is hard-blocking for most healthcare startups, so plan licensing early. Always validate downstream models on your target distribution; medical imaging shifts hard across institutions.",
    citations: medicalImagenetCitations,
    downloads: 22_400,
  },
  {
    id: "ds-012",
    slug: "openimages-filtered",
    name: "OpenImages-Filtered",
    description: "OpenImages V7 with NSFW and watermark filtering and re-balanced class weights.",
    longDescription:
      "A filtered subset of Google's OpenImages V7. NSFW content is removed via a CLIP-based classifier (validated against a held-out test set); watermarked images are dropped; class weights are re-balanced for long-tail object detection training.",
    tags: ["images", "object-detection", "openimages", "filtered"],
    modality: "image",
    size: { rows: 7_200_000, bytes: 850 * GB },
    license: "CC-BY-2.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/openimages-filtered",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-07-08",
    popularity: 81,
    quality: 83,
    warnings: [
      {
        level: "info",
        title: "NSFW filter is conservative",
        body: "CLIP-based filtering errs on the side of removal. Expect some artistic and medical content to be filtered alongside actual NSFW.",
      },
    ],
    aiSummary:
      "OpenImages-Filtered is a workhorse for general object detection and image classification when you want broad coverage with most of the NSFW and watermark headache already solved. The CC-BY license is friendly for commercial use as long as you handle attribution. The conservative filtering means it's safer than raw OpenImages but loses some legitimate content; for medical or artistic domains, supplement from elsewhere. Long-tail re-balancing makes it competitive with curated commercial datasets for many tasks.",
    downloads: 134_000,
  },
  {
    id: "ds-013",
    slug: "fashion-mnist-pro",
    name: "FashionMNIST-Pro",
    description: "An extended fashion image dataset at higher resolution with 50 categories.",
    longDescription:
      "A modern reimagining of FashionMNIST: 256x256 RGB images across 50 categories instead of 10, with metadata for color, season, and price tier. Curated from product catalogs of opted-in retailers.",
    tags: ["fashion", "classification", "ecommerce", "highres"],
    modality: "image",
    size: { rows: 580_000, bytes: 64 * GB },
    license: "MIT",
    sources: [
      {
        provider: "kaggle",
        url: "https://kaggle.com/datasets/example/fashion-mnist-pro",
        title: "Kaggle mirror",
      },
    ],
    lastUpdated: "2025-04-15",
    popularity: 53,
    quality: 76,
    warnings: [],
    aiSummary:
      "FashionMNIST-Pro is a great drop-in replacement for the original FashionMNIST when you need realistic resolution and a richer label set without leaving the 'easy to load' tier. Use it for teaching, prototyping commerce models, or as a sanity-check before scaling to a full retail catalog. The opted-in retailer source means coverage is uneven across categories and biased toward Western fast-fashion aesthetics. MIT license makes commercial use straightforward.",
    downloads: 31_000,
  },
  {
    id: "ds-014",
    slug: "satellite-crop-2024",
    name: "SatelliteCrop-2024",
    description: "Sentinel-2 satellite imagery labeled for crop type across major agricultural regions.",
    longDescription:
      "Sentinel-2 L2A imagery from the 2024 growing season, labeled at the field level for 18 crop types across North America, Europe, and South Asia. Each tile includes 12 spectral bands and a NDVI time-series for the season.",
    tags: ["satellite", "agriculture", "sentinel-2", "remote-sensing"],
    modality: "image",
    size: { rows: 2_100_000, bytes: 480 * GB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/satellite-crop-2024",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-03-29",
    popularity: 47,
    quality: 84,
    warnings: [
      {
        level: "info",
        title: "Cloud coverage in some tiles",
        body: "About 8% of tiles have residual cloud coverage despite filtering. Use the included cloud-mask field to filter at training time.",
      },
    ],
    aiSummary:
      "SatelliteCrop-2024 is the right choice for crop-type classification or yield-related downstream tasks because the NDVI time-series is included alongside raw bands — most public crop datasets give you only one or the other. Coverage of three continents avoids the usual North America bias. Always apply the cloud mask before training; the residual 8% of cloudy tiles will hurt your numbers if you don't. CC-BY-4.0 is commercial-friendly with attribution.",
    downloads: 8_900,
  },
  {
    id: "ds-015",
    slug: "facemask-crowd",
    name: "FaceMaskCrowd",
    description: "Crowd images labeled for face-mask presence and crowd density.",
    longDescription:
      "Crowd photos from public events between 2020 and 2024, labeled for per-face mask presence (none, surgical, N95, cloth, other) and overall crowd density. Faces themselves are blurred at low intensity to preserve mask features while protecting identity.",
    tags: ["faces", "masks", "public-health", "detection"],
    modality: "image",
    size: { rows: 312_000, bytes: 88 * GB },
    license: "CC-BY-NC-4.0",
    sources: [
      {
        provider: "kaggle",
        url: "https://kaggle.com/datasets/example/facemask-crowd",
        title: "Kaggle mirror",
      },
    ],
    lastUpdated: "2024-12-01",
    popularity: 28,
    quality: 70,
    warnings: [
      {
        level: "danger",
        title: "Non-commercial license",
        body: "CC-BY-NC-4.0 prohibits commercial use. Public-health research only.",
      },
      {
        level: "warn",
        title: "Identity preservation is not guaranteed",
        body: "Face blurring is best-effort. Do not use this dataset for any application where individual identification is plausible.",
      },
    ],
    aiSummary:
      "FaceMaskCrowd is a niche dataset that's mostly useful if you're specifically working on public-health surveillance models or studying crowd dynamics during the 2020-2024 period. The non-commercial license rules out most product applications. Quality is decent but inconsistent — labels were crowdsourced, with documented disagreement on cloth-vs-other categories. For most face-related tasks, a general face dataset will serve you better.",
    downloads: 4_200,
  },
  {
    id: "ds-016",
    slug: "audioset-filtered",
    name: "AudioSet-Filtered",
    description: "AudioSet with low-confidence labels removed and segment boundaries refined.",
    longDescription:
      "A re-cut of Google's AudioSet with low-confidence multi-labels filtered out and segment boundaries refined via a transformer-based onset detector. Comes with a strong-labels subset (~120K clips) suitable for sound event detection.",
    tags: ["audio", "sound-events", "classification", "weak-labels"],
    modality: "audio",
    size: { rows: 1_800_000, bytes: 380 * GB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/audioset-filtered",
        title: "Hugging Face mirror",
      },
      {
        provider: "paper",
        url: "https://example.org/papers/audioset-strong-2024",
        title: "Strong-labels paper",
      },
    ],
    lastUpdated: "2025-09-04",
    popularity: 76,
    quality: 82,
    warnings: [
      {
        level: "info",
        title: "Audio links rely on YouTube",
        body: "Many clips are referenced by YouTube ID; expect ~5-8% link rot per year. Use the bundled re-host for stable URIs.",
      },
    ],
    aiSummary:
      "AudioSet-Filtered is the standard for general-purpose sound event recognition; the filtered version saves you the embarrassment of training against AudioSet's well-known noisy multi-labels. The included strong-labels subset is small but excellent for evaluation. Link rot to YouTube is the operational headache — use the bundled re-host or accept that your dataset shrinks each year. Pair with a domain-specific corpus if you're doing music or speech only.",
    citations: audiosetCitations,
    downloads: 67_000,
  },
  {
    id: "ds-017",
    slug: "librispeech-clean-2024",
    name: "LibriSpeech-Clean-2024",
    description: "Re-aligned LibriSpeech with verified transcripts and SNR estimates per utterance.",
    longDescription:
      "A 2024 re-cleaning of LibriSpeech with forced alignment redone using a modern Wav2Vec2-CTC aligner, transcript-level confidence scores, and per-utterance SNR estimates for noise-conditioned training.",
    tags: ["speech", "asr", "english", "audiobooks"],
    modality: "audio",
    size: { rows: 280_000, bytes: 60 * GB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/librispeech-clean-2024",
        title: "Hugging Face mirror",
      },
      {
        provider: "paper",
        url: "https://example.org/papers/librispeech-clean-2024",
        title: "Re-cleaning paper",
      },
    ],
    lastUpdated: "2025-05-22",
    popularity: 86,
    quality: 93,
    warnings: [],
    aiSummary:
      "LibriSpeech-Clean-2024 remains the default English ASR benchmark for good reason — it's clean, well-licensed, and now has verified alignment. Use the SNR field to construct noise-conditioned training curricula or to stratify evaluation. The audiobook domain skew is unchanged, so don't claim general-purpose ASR without supplementing from a conversational source. Strong choice for any speech-related foundation model work.",
    schema: librispeechSchema,
    citations: librispeechCitations,
    downloads: 178_000,
  },
  {
    id: "ds-018",
    slug: "envsounds-city",
    name: "EnvSounds-City",
    description: "Urban environmental sound recordings from 12 global cities, labeled by source.",
    longDescription:
      "Field recordings of urban soundscapes from 12 cities across four continents, labeled for primary and secondary sound sources (traffic, construction, voices, nature, sirens, etc.). Recordings are 30 seconds at 48 kHz stereo.",
    tags: ["environmental", "urban", "soundscape", "classification"],
    modality: "audio",
    size: { rows: 184_000, bytes: 42 * GB },
    license: "CC-BY-SA-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/envsounds-city",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2024-10-30",
    popularity: 35,
    quality: 78,
    warnings: [
      {
        level: "warn",
        title: "Share-Alike license",
        body: "CC-BY-SA-4.0 requires derived works to be released under the same license. Check whether your model weights count as derived in your jurisdiction.",
      },
    ],
    aiSummary:
      "EnvSounds-City is a solid pick when you specifically need urban acoustic environments and want global coverage rather than just North American or European cities. The 30-second clip length is long enough for context and short enough to load fast. The Share-Alike license is the main commercial blocker; for product use, a non-SA alternative is usually preferable. Quality is consistent across cities, which is rare for crowd-sourced recordings.",
    downloads: 6_100,
  },
  {
    id: "ds-019",
    slug: "music-genre-fma-plus",
    name: "MusicGenre-FMA-Plus",
    description: "Free Music Archive tracks extended to 30 genres with full audio and tag metadata.",
    longDescription:
      "An extension of the Free Music Archive (FMA) corpus expanded to 30 genres, with full-track audio, MFCC features pre-extracted, and crowd-sourced tags reconciled into a clean taxonomy.",
    tags: ["music", "genre", "fma", "classification"],
    modality: "audio",
    size: { rows: 142_000, bytes: 920 * GB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/music-genre-fma-plus",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-02-14",
    popularity: 58,
    quality: 81,
    warnings: [
      {
        level: "info",
        title: "Per-track license inheritance",
        body: "Individual FMA tracks have their own licenses (mostly CC). The dataset license is on the curation, not the audio itself. Filter by track license for commercial training.",
      },
    ],
    aiSummary:
      "MusicGenre-FMA-Plus is the right starting point for music classification when you want full audio (not just snippets) and a well-organized genre taxonomy. The pre-extracted MFCCs save real preprocessing time. The licensing nuance — dataset CC-BY but per-track licenses vary — trips up most teams; always filter by track license before commercial training. The 30-genre taxonomy is broader than most public alternatives.",
    downloads: 14_700,
  },
  {
    id: "ds-020",
    slug: "kinetics-action-refined",
    name: "Kinetics-Action-Refined",
    description: "Kinetics-700 with refined action boundaries and a hard-negative split.",
    longDescription:
      "A refresh of Kinetics-700 with action boundaries refined through human review, and a separate 'hard-negative' split where actions visually resemble each other for harder evaluation.",
    tags: ["video", "action-recognition", "kinetics"],
    modality: "video",
    size: { rows: 545_000, bytes: 1.8 * TB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/kinetics-action-refined",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-07-19",
    popularity: 70,
    quality: 87,
    warnings: [
      {
        level: "info",
        title: "YouTube link rot",
        body: "Like the original Kinetics, ~10% of videos per year become unavailable. The bundled re-host covers the most-cited clips only.",
      },
    ],
    aiSummary:
      "Kinetics-Action-Refined is the best version of Kinetics for serious action recognition work — the refined boundaries and hard-negative split make evaluation noticeably more discriminating. Use it as a benchmark for any video understanding model. YouTube link rot remains the operational pain; if reproducibility matters, snapshot to your own storage. Pair with an egocentric corpus for first-person tasks since Kinetics is overwhelmingly third-person.",
    citations: kineticsCitations,
    downloads: 52_000,
  },
  {
    id: "ds-021",
    slug: "egomotion-1m",
    name: "EgoMotion-1M",
    description: "First-person video clips with synchronized IMU and gaze tracking.",
    longDescription:
      "1M egocentric video clips from 2,400 participants doing everyday tasks, with synchronized 6-axis IMU and gaze tracking at 60 Hz. Tasks span cooking, navigation, manipulation, and social interaction.",
    tags: ["egocentric", "imu", "gaze", "video", "first-person"],
    modality: "video",
    size: { rows: 1_010_000, bytes: 3.6 * TB },
    license: "custom",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/egomotion-1m",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2026-03-10",
    popularity: 64,
    quality: 88,
    warnings: [
      {
        level: "warn",
        title: "Custom license requires a data-use agreement",
        body: "Access requires signing a research DUA. Commercial use is not permitted under the standard agreement.",
      },
      {
        level: "info",
        title: "Participant-IDs preserved across clips",
        body: "If you split randomly, the same participant will leak across train and test. Use participant-stratified splits.",
      },
    ],
    aiSummary:
      "EgoMotion-1M is the most useful egocentric corpus available because the IMU and gaze synchronization are genuinely tight — most ego datasets give you video alone. Use it for embodied AI, AR-glasses applications, or any first-person understanding work. The DUA-gated access blocks commercial use under the standard agreement; budget time to negotiate if you need it. Always use participant-stratified splits or your numbers will be optimistic.",
    downloads: 7_800,
  },
  {
    id: "ds-022",
    slug: "indoor-energy-tabular",
    name: "IndoorEnergy-Tabular",
    description: "Hourly residential energy use with appliance-level breakdowns and weather context.",
    longDescription:
      "Hourly energy consumption data from 4,800 residential households across the US, UK, and Germany, with appliance-level breakdowns from in-home monitors and synchronized local weather data.",
    tags: ["energy", "tabular", "timeseries", "smart-home"],
    modality: "tabular",
    size: { rows: 280_000_000, bytes: 36 * GB },
    license: "Apache-2.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/indoor-energy-tabular",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-12-15",
    popularity: 39,
    quality: 80,
    warnings: [
      {
        level: "info",
        title: "Appliance ID coverage varies by household",
        body: "Not every household has every appliance metered. Check the per-household coverage matrix before computing aggregates.",
      },
    ],
    aiSummary:
      "IndoorEnergy-Tabular is one of the cleanest residential energy datasets available, with the unusually useful combination of appliance-level metering and weather context. Apache 2.0 makes it commercial-friendly. Watch the per-household appliance coverage matrix — naive aggregates over households can be misleading. Strong choice for time-series forecasting research and smart-home product prototyping.",
    schema: energySchema,
    downloads: 5_400,
  },
  {
    id: "ds-023",
    slug: "nyc-taxi-2023",
    name: "NYCTaxi-2023",
    description: "All NYC TLC yellow and green taxi trips for 2023, cleaned and joined with zone metadata.",
    longDescription:
      "Complete 2023 NYC TLC yellow and green taxi trip records, cleaned for known data-quality issues (negative fares, impossible distances, zone-mismatch), with TLC taxi zones joined for human-readable pickup/dropoff names.",
    tags: ["nyc", "taxi", "tabular", "timeseries", "transportation"],
    modality: "tabular",
    size: { rows: 38_400_000, bytes: 4.2 * GB },
    license: "CC0-1.0",
    sources: [
      {
        provider: "kaggle",
        url: "https://kaggle.com/datasets/example/nyc-taxi-2023",
        title: "Kaggle mirror",
      },
      {
        provider: "github",
        url: "https://github.com/example/nyc-taxi-2023",
        title: "Cleaning scripts",
      },
    ],
    lastUpdated: "2024-04-01",
    popularity: 67,
    quality: 88,
    warnings: [],
    aiSummary:
      "NYCTaxi-2023 is the easiest-to-use snapshot of the NYC TLC trip data because the cleaning steps are documented and the zone joins are already done. CC0 means truly unrestricted use. Use it for tutorials, time-series forecasting, fare prediction, or as a clean tabular dataset for benchmarking. The 2023 boundary means you'll want a more recent snapshot for current-year analysis; downstream task validity decays year by year for transportation data.",
    schema: taxiSchema,
    downloads: 92_000,
  },
  {
    id: "ds-024",
    slug: "credit-risk-synth",
    name: "CreditRisk-Synth",
    description: "Fully synthetic credit-default labels generated to match aggregate risk statistics.",
    longDescription:
      "A fully synthetic credit-risk dataset generated to match aggregate default-rate and demographic statistics from the Federal Reserve's 2023 Consumer Credit Panel. Includes a tunable noise level for stress-testing fairness algorithms.",
    tags: ["finance", "synthetic", "credit", "fairness", "tabular"],
    modality: "tabular",
    size: { rows: 2_100_000, bytes: 1.8 * GB },
    license: "MIT",
    sources: [
      {
        provider: "github",
        url: "https://github.com/example/credit-risk-synth",
        title: "Generation pipeline",
      },
    ],
    lastUpdated: "2025-08-08",
    popularity: 31,
    quality: 72,
    warnings: [
      {
        level: "warn",
        title: "Synthetic distributions are coarser than real",
        body: "Aggregate matching does not preserve subgroup structure. Don't use for fairness audits without supplementing with real (de-identified) data.",
      },
    ],
    aiSummary:
      "CreditRisk-Synth is appropriate for teaching, benchmarking algorithms, and prototyping pipelines where you can't get real credit data. MIT license is unrestricted. The synthetic-to-real gap is the central limitation — fairness conclusions drawn here won't transfer to production data without validation. Use it as a controlled environment for algorithmic experiments, not as evidence of real-world model behavior.",
    schema: creditSchema,
    downloads: 9_300,
  },
  {
    id: "ds-025",
    slug: "flight-delay-decade",
    name: "FlightDelay-Decade",
    description: "All US domestic flight delays from 2014-2024 with weather and aircraft metadata joined.",
    longDescription:
      "Eleven years of US Bureau of Transportation Statistics on-time performance data, joined with NOAA weather observations at origin and destination airports, and FAA aircraft type metadata.",
    tags: ["aviation", "delays", "tabular", "weather", "us"],
    modality: "tabular",
    size: { rows: 67_800_000, bytes: 18 * GB },
    license: "CC0-1.0",
    sources: [
      {
        provider: "kaggle",
        url: "https://kaggle.com/datasets/example/flight-delay-decade",
        title: "Kaggle mirror",
      },
    ],
    lastUpdated: "2025-01-22",
    popularity: 44,
    quality: 84,
    warnings: [
      {
        level: "info",
        title: "Weather joins are nearest-station, not interpolated",
        body: "The weather field is from the closest NOAA station to each airport, not interpolated. Some airports have stations >5 miles away.",
      },
    ],
    aiSummary:
      "FlightDelay-Decade is the most complete open US flight-delay dataset because the weather and aircraft joins are pre-done — most public versions stop at the BTS data alone. CC0 means it's free for commercial use. The nearest-station weather join is a known limitation; if your model is sensitive to local microweather, supplement with a finer-grained source. Strong dataset for forecasting tutorials and operations-research benchmarks.",
    schema: flightSchema,
    downloads: 16_800,
  },
  {
    id: "ds-026",
    slug: "laion-curated-en",
    name: "LAION-Curated-EN",
    description: "An English-only, NSFW-filtered, deduplicated subset of LAION-5B.",
    longDescription:
      "A 280M-pair subset of LAION-5B restricted to confidently-detected English captions, with NSFW filtering, watermark detection, and aggressive perceptual deduplication. Aspect-ratio buckets are pre-computed.",
    tags: ["image-text", "laion", "english", "filtered", "multimodal"],
    modality: "multimodal",
    size: { rows: 280_000_000, bytes: 28 * TB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/laion-curated-en",
        title: "Hugging Face mirror",
      },
      {
        provider: "paper",
        url: "https://example.org/papers/laion-curated-en",
        title: "Curation paper",
      },
    ],
    lastUpdated: "2025-10-26",
    popularity: 91,
    quality: 80,
    warnings: [
      {
        level: "danger",
        title: "Image URLs subject to link rot",
        body: "Like LAION-5B, this dataset distributes image URLs, not images. Expect material rot — re-host critical training data yourself.",
      },
      {
        level: "warn",
        title: "Caption quality is web-scale, not curated",
        body: "Captions are alt-text from the web. Many are SEO spam, generic, or only loosely describe the image.",
      },
    ],
    aiSummary:
      "LAION-Curated-EN is the most practical pretraining corpus for English text-to-image and image-to-text models because the NSFW and dedup work is already done. The aspect-ratio buckets save real preprocessing time. The two big gotchas are URL link rot — you must re-host — and the caption quality, which is web-grade and noisy. Pair with a smaller curated caption corpus for instruction tuning rather than relying on this for caption fidelity alone.",
    citations: laionCitations,
    downloads: 380_000,
  },
  {
    id: "ds-027",
    slug: "scienceqa-multimodal",
    name: "ScienceQA-Multimodal",
    description: "Multiple-choice science questions with images, lectures, and chain-of-thought solutions.",
    longDescription:
      "21,000 multiple-choice K-12 science questions across biology, physics, chemistry, earth science, and economics. About half include diagrams or photos. Each item has a worked solution and a short lecture for context.",
    tags: ["multimodal", "vqa", "science", "education", "reasoning"],
    modality: "multimodal",
    size: { rows: 21_000, bytes: 3.4 * GB },
    license: "CC-BY-NC-SA-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/scienceqa-multimodal",
        title: "Hugging Face mirror",
      },
      {
        provider: "paper",
        url: "https://arxiv.org/abs/2209.09513",
        title: "Original paper",
      },
    ],
    lastUpdated: "2025-03-04",
    popularity: 75,
    quality: 89,
    warnings: [
      {
        level: "warn",
        title: "Non-commercial Share-Alike",
        body: "CC-BY-NC-SA-4.0 prohibits commercial use and requires same-license redistribution. Plan accordingly.",
      },
    ],
    aiSummary:
      "ScienceQA-Multimodal is the standard benchmark for multimodal reasoning at the K-12 science level, and the worked solutions make it useful for chain-of-thought training as well. Image-to-text alignment is high quality compared to most VQA corpora. The CC-BY-NC-SA license blocks commercial use — for product training, you'll need a different multimodal source. Use it for evaluation even if you can't train on it.",
    schema: scienceQASchema,
    citations: scienceQACitations,
    downloads: 39_000,
  },
  {
    id: "ds-028",
    slug: "robotics-manipulation-sim",
    name: "RoboticsManipulation-Sim",
    description: "Simulated robot manipulation episodes with RGB-D, joint states, and task labels.",
    longDescription:
      "Simulated manipulation episodes (pick-and-place, pour, open-drawer, etc.) generated in MuJoCo with domain-randomized backgrounds. Each episode includes RGB-D from two cameras, full joint state, and a structured task descriptor.",
    tags: ["robotics", "manipulation", "simulation", "rgbd", "multimodal"],
    modality: "multimodal",
    size: { rows: 480_000, bytes: 1.2 * TB },
    license: "Apache-2.0",
    sources: [
      {
        provider: "github",
        url: "https://github.com/example/robotics-manipulation-sim",
        title: "Generator and scenarios",
      },
    ],
    lastUpdated: "2026-01-30",
    popularity: 52,
    quality: 78,
    warnings: [
      {
        level: "warn",
        title: "Sim-to-real gap is significant",
        body: "Despite domain randomization, models trained only here will need real-world fine-tuning. Don't claim transfer without explicit validation.",
      },
    ],
    aiSummary:
      "RoboticsManipulation-Sim is a useful jump-start for manipulation research because the task descriptors are structured rather than free-form, which lets you build curricula and evaluate compositionally. Apache 2.0 is unrestricted. The sim-to-real gap is non-trivial — domain randomization helps but isn't magic; plan a real-world fine-tuning step. Strong choice for foundation-model-style manipulation pretraining.",
    downloads: 11_300,
  },
  {
    id: "ds-029",
    slug: "cooking-vqa",
    name: "CookingVQA",
    description: "Visual question answering on cooking videos with step-level annotations.",
    longDescription:
      "Cooking video clips (3-15 seconds) with multiple-choice questions about ingredients, technique, equipment, and likely next step. Step-level temporal annotations link questions to specific moments.",
    tags: ["multimodal", "video", "vqa", "cooking", "instructional"],
    modality: "multimodal",
    size: { rows: 84_000, bytes: 240 * GB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/cooking-vqa",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2025-06-18",
    popularity: 41,
    quality: 76,
    warnings: [
      {
        level: "info",
        title: "Cuisine coverage skews Western",
        body: "Most videos depict North American and European cuisines. Expect weaker performance on Asian, African, and Latin American cooking.",
      },
    ],
    aiSummary:
      "CookingVQA is a focused multimodal benchmark that's useful for instructional video understanding because step-level annotations let you study temporal reasoning explicitly. CC-BY-4.0 makes it commercial-friendly. The Western-cuisine skew is real — don't claim general cooking-video understanding without supplementing. Good complement to a more general video corpus rather than a standalone training set.",
    downloads: 8_400,
  },
  {
    id: "ds-030",
    slug: "earth-observation-multi",
    name: "EarthObservation-Multi",
    description: "Aligned multi-sensor satellite imagery (optical, SAR, thermal) over global tiles.",
    longDescription:
      "Spatially and temporally aligned multi-sensor satellite imagery: Sentinel-2 optical, Sentinel-1 SAR, and Landsat thermal. Each tile has 12 monthly observations through 2024-2025 and a land-cover label drawn from ESA WorldCover.",
    tags: ["earth-observation", "multimodal", "satellite", "sar", "land-cover"],
    modality: "multimodal",
    size: { rows: 4_800_000, bytes: 2.4 * TB },
    license: "CC-BY-4.0",
    sources: [
      {
        provider: "huggingface",
        url: "https://huggingface.co/datasets/example/earth-observation-multi",
        title: "Hugging Face mirror",
      },
    ],
    lastUpdated: "2026-04-12",
    popularity: 49,
    quality: 86,
    warnings: [
      {
        level: "info",
        title: "SAR phase data not included",
        body: "Only SAR amplitude is provided. If you need interferometric phase, use the original Sentinel-1 SLC products.",
      },
    ],
    aiSummary:
      "EarthObservation-Multi is the right pick for multi-sensor remote sensing because the spatial and temporal alignment are pre-computed — that's the bulk of the work in this domain. CC-BY-4.0 supports commercial use. The lack of SAR phase data limits some interferometric applications; users with that need should pair with raw Sentinel-1. Strong dataset for foundation-model pretraining on Earth observation.",
    downloads: 13_200,
  },
]

export const edges: GraphEdge[] = [
  // derived
  { source: "ds-003", target: "ds-002", kind: "derived", weight: 0.6 },
  { source: "ds-009", target: "ds-002", kind: "derived", weight: 0.7 },
  { source: "ds-010", target: "ds-004", kind: "derived", weight: 0.65 },
  { source: "ds-013", target: "ds-012", kind: "derived", weight: 0.5 },
  { source: "ds-015", target: "ds-012", kind: "derived", weight: 0.55 },
  { source: "ds-019", target: "ds-016", kind: "derived", weight: 0.7 },
  { source: "ds-018", target: "ds-016", kind: "derived", weight: 0.6 },
  { source: "ds-021", target: "ds-020", kind: "derived", weight: 0.55 },
  { source: "ds-006", target: "ds-002", kind: "derived", weight: 0.5 },
  { source: "ds-026", target: "ds-002", kind: "derived", weight: 0.7 },
  { source: "ds-026", target: "ds-012", kind: "derived", weight: 0.65 },
  { source: "ds-014", target: "ds-030", kind: "derived", weight: 0.6 },
  { source: "ds-017", target: "ds-016", kind: "derived", weight: 0.5 },
  { source: "ds-029", target: "ds-020", kind: "derived", weight: 0.45 },
  // similar
  { source: "ds-001", target: "ds-003", kind: "similar", weight: 0.55 },
  { source: "ds-001", target: "ds-005", kind: "similar", weight: 0.45 },
  { source: "ds-003", target: "ds-005", kind: "similar", weight: 0.7 },
  { source: "ds-009", target: "ds-002", kind: "similar", weight: 0.5 },
  { source: "ds-006", target: "ds-009", kind: "similar", weight: 0.4 },
  { source: "ds-007", target: "ds-002", kind: "similar", weight: 0.4 },
  { source: "ds-008", target: "ds-011", kind: "similar", weight: 0.5 },
  { source: "ds-012", target: "ds-011", kind: "similar", weight: 0.55 },
  { source: "ds-013", target: "ds-012", kind: "similar", weight: 0.45 },
  { source: "ds-014", target: "ds-030", kind: "similar", weight: 0.75 },
  { source: "ds-016", target: "ds-017", kind: "similar", weight: 0.5 },
  { source: "ds-018", target: "ds-019", kind: "similar", weight: 0.55 },
  { source: "ds-020", target: "ds-021", kind: "similar", weight: 0.6 },
  { source: "ds-023", target: "ds-025", kind: "similar", weight: 0.5 },
  { source: "ds-024", target: "ds-025", kind: "similar", weight: 0.4 },
  { source: "ds-026", target: "ds-027", kind: "similar", weight: 0.55 },
  { source: "ds-027", target: "ds-029", kind: "similar", weight: 0.6 },
  { source: "ds-028", target: "ds-020", kind: "similar", weight: 0.5 },
  { source: "ds-028", target: "ds-021", kind: "similar", weight: 0.55 },
  { source: "ds-030", target: "ds-014", kind: "similar", weight: 0.75 },
  { source: "ds-004", target: "ds-010", kind: "similar", weight: 0.65 },
  // benchmark
  { source: "ds-001", target: "ds-003", kind: "benchmark", weight: 0.6 },
  { source: "ds-017", target: "ds-016", kind: "benchmark", weight: 0.55 },
  { source: "ds-016", target: "ds-019", kind: "benchmark", weight: 0.5 },
  { source: "ds-020", target: "ds-021", kind: "benchmark", weight: 0.55 },
  { source: "ds-027", target: "ds-029", kind: "benchmark", weight: 0.5 },
  { source: "ds-011", target: "ds-012", kind: "benchmark", weight: 0.45 },
  { source: "ds-022", target: "ds-023", kind: "benchmark", weight: 0.4 },
  { source: "ds-014", target: "ds-030", kind: "benchmark", weight: 0.5 },
  { source: "ds-009", target: "ds-002", kind: "benchmark", weight: 0.55 },
  { source: "ds-005", target: "ds-001", kind: "benchmark", weight: 0.4 },
  // cites
  { source: "ds-005", target: "ds-001", kind: "cites", weight: 0.4 },
  { source: "ds-005", target: "ds-003", kind: "cites", weight: 0.45 },
  { source: "ds-005", target: "ds-002", kind: "cites", weight: 0.35 },
  { source: "ds-009", target: "ds-002", kind: "cites", weight: 0.4 },
  { source: "ds-007", target: "ds-005", kind: "cites", weight: 0.35 },
  { source: "ds-027", target: "ds-026", kind: "cites", weight: 0.4 },
  { source: "ds-029", target: "ds-027", kind: "cites", weight: 0.5 },
  { source: "ds-030", target: "ds-014", kind: "cites", weight: 0.45 },
  { source: "ds-028", target: "ds-021", kind: "cites", weight: 0.4 },
]

export function getDatasetBySlug(slug: string): Dataset | null {
  return datasets.find((d) => d.slug === slug) ?? null
}

export function searchDatasets(
  query: string,
  filters?: SearchFilters,
  page = 1,
  pageSize = 20
): SearchResponse {
  const q = query.trim().toLowerCase()
  const tokens = q.split(/\s+/).filter(Boolean)

  const all = datasets
    .filter((d) => matchesFilters(d, filters))
    .map((d) => scoreDataset(d, tokens, q))
    .filter((r) => r.matchScore > 0 || tokens.length === 0)
    .sort((a, b) => b.matchScore - a.matchScore)

  const safePage = Math.max(1, page)
  const safeSize = Math.max(1, pageSize)
  const start = (safePage - 1) * safeSize
  return {
    results: all.slice(start, start + safeSize),
    total: all.length,
    page: safePage,
    pageSize: safeSize,
  }
}

export function getRelatedDatasets(slug: string, limit = 6): Dataset[] {
  const target = getDatasetBySlug(slug)
  if (!target) return []
  const related = new Map<string, number>()

  for (const e of edges) {
    if (e.source === target.id) related.set(e.target, (related.get(e.target) ?? 0) + e.weight)
    if (e.target === target.id) related.set(e.source, (related.get(e.source) ?? 0) + e.weight * 0.6)
  }

  return Array.from(related.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => datasets.find((d) => d.id === id))
    .filter((d): d is Dataset => Boolean(d))
}

export function getGraph(focusSlug?: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (!focusSlug) {
    return {
      nodes: datasets.map(toGraphNode),
      edges: edges.slice(),
    }
  }
  const focus = getDatasetBySlug(focusSlug)
  if (!focus) return { nodes: [], edges: [] }
  const keep = new Set<string>([focus.id])
  for (const e of edges) {
    if (e.source === focus.id) keep.add(e.target)
    if (e.target === focus.id) keep.add(e.source)
  }
  const nodeList = datasets.filter((d) => keep.has(d.id)).map(toGraphNode)
  const edgeList = edges.filter((e) => keep.has(e.source) && keep.has(e.target))
  return { nodes: nodeList, edges: edgeList }
}

export function getTrendingDatasets(limit = 8): Dataset[] {
  return datasets
    .slice()
    .sort((a, b) => {
      const scoreA = a.popularity * 0.6 + a.quality * 0.4
      const scoreB = b.popularity * 0.6 + b.quality * 0.4
      return scoreB - scoreA
    })
    .slice(0, limit)
}

export function getRecentlyUpdated(limit = 8): Dataset[] {
  return datasets
    .slice()
    .sort((a, b) => +new Date(b.lastUpdated) - +new Date(a.lastUpdated))
    .slice(0, limit)
}

function matchesFilters(d: Dataset, f?: SearchFilters): boolean {
  if (!f) return true
  if (f.modality && f.modality.length && !f.modality.includes(d.modality)) return false
  if (f.license && f.license.length && !f.license.includes(d.license)) return false
  if (f.source && f.source.length) {
    const ps = new Set(d.sources.map((s) => s.provider))
    if (!f.source.some((p) => ps.has(p))) return false
  }
  if (typeof f.minSize === "number" && d.size.rows < f.minSize) return false
  if (typeof f.maxSize === "number" && d.size.rows > f.maxSize) return false
  if (typeof f.minQuality === "number" && d.quality < f.minQuality) return false
  if (f.updatedWithin && f.updatedWithin !== "any") {
    const cutoff = withinCutoffMs(f.updatedWithin)
    if (Date.now() - +new Date(d.lastUpdated) > cutoff) return false
  }
  return true
}

function withinCutoffMs(w: NonNullable<SearchFilters["updatedWithin"]>): number {
  switch (w) {
    case "24h":
      return 24 * 60 * 60 * 1000
    case "7d":
      return 7 * 24 * 60 * 60 * 1000
    case "30d":
      return 30 * 24 * 60 * 60 * 1000
    case "6mo":
      return 182 * 24 * 60 * 60 * 1000
    default:
      return Number.POSITIVE_INFINITY
  }
}

function scoreDataset(d: Dataset, tokens: string[], rawQuery: string): SearchResult {
  if (tokens.length === 0) {
    return {
      ...d,
      matchScore: d.popularity / 100,
      matchExplanation: "No query — sorted by popularity.",
    }
  }
  const haystack = `${d.name}\n${d.description}\n${d.tags.join(" ")}\n${d.modality}`.toLowerCase()
  let score = 0
  const reasons: string[] = []
  for (const t of tokens) {
    if (d.name.toLowerCase().includes(t)) {
      score += 5
      reasons.push(`matched "${t}" in name`)
    } else if (d.tags.some((tag) => tag.toLowerCase().includes(t))) {
      score += 3
      reasons.push(`matched "${t}" in tags`)
    } else if (d.description.toLowerCase().includes(t)) {
      score += 2
      reasons.push(`matched "${t}" in description`)
    } else if (haystack.includes(t)) {
      score += 1
      reasons.push(`matched "${t}"`)
    }
  }
  if (rawQuery && d.name.toLowerCase() === rawQuery) score += 10
  const explanation =
    reasons.length === 0
      ? "No direct match"
      : reasons.slice(0, 3).join("; ")
  return { ...d, matchScore: score, matchExplanation: explanation }
}

function toGraphNode(d: Dataset): GraphNode {
  return {
    id: d.id,
    slug: d.slug,
    label: d.name,
    modality: d.modality,
    size: d.size.rows,
  }
}

// ----------------------------------------------------------------------------
// Models — fixtures for /models, /models/[slug], and the leaderboard. Cover
// varied access types (commercial-api, open-weights, open-source) and
// organizations so filter UIs have something to bite on.
// ----------------------------------------------------------------------------

const _now = "2026-05-20T00:00:00Z"

function score(
  benchmark: BenchmarkScore["benchmark"],
  value: number,
  source: BenchmarkScore["source"] = "vendor-reported",
  scoreFormat = "0-100"
): BenchmarkScore {
  return {
    benchmark,
    score: value,
    scoreFormat,
    measuredAt: "2026-04-15T00:00:00Z",
    source,
  }
}

function _model(partial: Partial<Model> & Pick<Model, "slug" | "name">): Model {
  return {
    modelId: partial.modelId ?? partial.slug,
    slug: partial.slug,
    name: partial.name,
    shortDescription: partial.shortDescription ?? "",
    longDescription: partial.longDescription,
    sourcePlatform: partial.sourcePlatform ?? "huggingface",
    sourceUrl: partial.sourceUrl ?? `https://huggingface.co/${partial.slug}`,
    huggingfaceRepo: partial.huggingfaceRepo,
    paperUrl: partial.paperUrl,
    blogUrl: partial.blogUrl,
    architecture: partial.architecture,
    parameters: partial.parameters,
    activeParameters: partial.activeParameters,
    contextWindow: partial.contextWindow,
    maxOutputTokens: partial.maxOutputTokens,
    modalitiesInput: partial.modalitiesInput ?? ["text"],
    modalitiesOutput: partial.modalitiesOutput ?? ["text"],
    languages: partial.languages ?? ["en"],
    creators: partial.creators ?? [],
    organization: partial.organization,
    baseModel: partial.baseModel,
    trainedOnDatasetSlugs: partial.trainedOnDatasetSlugs ?? [],
    finetunedOnDatasetSlugs: partial.finetunedOnDatasetSlugs ?? [],
    releasedAt: partial.releasedAt,
    lastUpdated: partial.lastUpdated ?? _now,
    accessType: partial.accessType ?? "open-weights",
    license: partial.license,
    licenseType: partial.licenseType ?? "permissive",
    licenseIntelligence: partial.licenseIntelligence ?? {
      commercialUse: true,
      attributionRequired: true,
      redistributionAllowed: true,
      modificationAllowed: true,
      riskLevel: "low",
    },
    commercialUseAllowed: partial.commercialUseAllowed ?? true,
    weightsAvailable: partial.weightsAvailable ?? true,
    weightsUrl: partial.weightsUrl,
    pricing: partial.pricing,
    benchmarkScores: partial.benchmarkScores ?? [],
    compositeScore: partial.compositeScore,
    compositeRank: partial.compositeRank,
    downloadsCount: partial.downloadsCount,
    likesCount: partial.likesCount,
    popularityScore: partial.popularityScore ?? 50,
    qualityScore: partial.qualityScore ?? 75,
    freshnessScore: partial.freshnessScore ?? 80,
    aiSummary: partial.aiSummary,
    aiInsights: partial.aiInsights ?? [],
    warnings: partial.warnings ?? [],
    tags: partial.tags ?? [],
    indexedAt: partial.indexedAt ?? _now,
    lastSeenAt: partial.lastSeenAt ?? _now,
  }
}

export const models: Model[] = [
  // ---- Frontier commercial APIs ----
  _model({
    slug: "or-anthropic-claude-opus-4-7",
    name: "Claude Opus 4.7",
    organization: "Anthropic",
    sourcePlatform: "anthropic",
    sourceUrl: "https://www.anthropic.com/claude",
    accessType: "commercial-api",
    weightsAvailable: false,
    license: "Anthropic Commercial",
    licenseType: "proprietary",
    licenseIntelligence: { commercialUse: true, attributionRequired: false, redistributionAllowed: false, modificationAllowed: false, riskLevel: "low" },
    contextWindow: 500_000,
    maxOutputTokens: 8192,
    architecture: "transformer-decoder",
    creators: [{ name: "Anthropic" }],
    pricing: { inputPerMillionTokens: 15, outputPerMillionTokens: 75, cachedInputPerMillionTokens: 1.5, imagePerMillion: null, provider: "Anthropic", currency: "USD", freeTierAvailable: false },
    benchmarkScores: [score("mmlu-pro", 88.5), score("gpqa", 65.2), score("humaneval", 92.1), score("math", 78.0), score("ifeval", 94.5)],
    compositeScore: 92, compositeRank: 1,
    popularityScore: 99, qualityScore: 98, freshnessScore: 95,
    shortDescription: "Anthropic's flagship reasoning model with 500K context.",
    aiSummary: "Best-in-class for analysis, coding, and long-context tasks.",
    aiInsights: ["Strong at agentic workflows", "Highest GPQA among commercial-API tier"],
    tags: ["frontier", "reasoning", "agentic"],
    releasedAt: "2026-03-12",
  }),
  _model({
    slug: "or-openai-gpt-5",
    name: "GPT-5",
    organization: "OpenAI",
    sourcePlatform: "openai",
    sourceUrl: "https://platform.openai.com/docs/models/gpt-5",
    accessType: "commercial-api",
    weightsAvailable: false,
    license: "OpenAI Commercial",
    licenseType: "proprietary",
    licenseIntelligence: { commercialUse: true, attributionRequired: false, redistributionAllowed: false, modificationAllowed: false, riskLevel: "low" },
    contextWindow: 1_000_000,
    maxOutputTokens: 16384,
    creators: [{ name: "OpenAI" }],
    pricing: { inputPerMillionTokens: 10, outputPerMillionTokens: 30, cachedInputPerMillionTokens: 2.5, imagePerMillion: null, provider: "OpenAI", currency: "USD", freeTierAvailable: false },
    benchmarkScores: [score("mmlu-pro", 87.1), score("gpqa", 62.8), score("humaneval", 94.0), score("math", 80.5), score("ifeval", 92.0)],
    compositeScore: 91, compositeRank: 2,
    popularityScore: 98, qualityScore: 96, freshnessScore: 90,
    shortDescription: "OpenAI's multimodal flagship with the longest context in the market.",
    tags: ["frontier", "multimodal"],
    modalitiesInput: ["text", "image", "audio"],
    releasedAt: "2026-02-04",
  }),
  _model({
    slug: "or-google-gemini-3-pro",
    name: "Gemini 3 Pro",
    organization: "Google",
    sourcePlatform: "google",
    sourceUrl: "https://ai.google.dev/gemini-api/docs/models/gemini",
    accessType: "commercial-api",
    weightsAvailable: false,
    license: "Google Commercial",
    licenseType: "proprietary",
    licenseIntelligence: { commercialUse: true, attributionRequired: false, redistributionAllowed: false, modificationAllowed: false, riskLevel: "low" },
    contextWindow: 2_000_000,
    creators: [{ name: "Google DeepMind" }],
    pricing: { inputPerMillionTokens: 7, outputPerMillionTokens: 21, cachedInputPerMillionTokens: 1.75, imagePerMillion: null, provider: "Google", currency: "USD", freeTierAvailable: true, freeTierNotes: "Free tier via AI Studio with rate limits." },
    benchmarkScores: [score("mmlu-pro", 85.4), score("gpqa", 60.1), score("humaneval", 90.0), score("math", 76.3), score("ifeval", 91.8)],
    compositeScore: 89, compositeRank: 3,
    popularityScore: 92, qualityScore: 94, freshnessScore: 88,
    shortDescription: "Google's multimodal model with industry-leading 2M context window.",
    modalitiesInput: ["text", "image", "video", "audio"],
    tags: ["frontier", "multimodal", "long-context"],
    releasedAt: "2026-01-18",
  }),
  // ---- Open-weights frontier ----
  _model({
    slug: "hf-meta-llama-llama-4-maverick",
    name: "Llama 4 Maverick",
    organization: "Meta",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "meta-llama/Llama-4-Maverick",
    sourceUrl: "https://huggingface.co/meta-llama/Llama-4-Maverick",
    accessType: "open-weights",
    weightsAvailable: true,
    weightsUrl: "https://huggingface.co/meta-llama/Llama-4-Maverick",
    license: "Llama 4 Community License",
    licenseType: "restrictive",
    licenseIntelligence: { commercialUse: true, attributionRequired: true, redistributionAllowed: true, modificationAllowed: true, riskLevel: "medium", notes: "Acceptable use policy applies; redistribution requires upstream attribution." },
    parameters: 400_000_000_000,
    activeParameters: 17_000_000_000,
    contextWindow: 256_000,
    creators: [{ name: "Meta AI" }],
    benchmarkScores: [score("mmlu-pro", 83.2, "open-llm-leaderboard"), score("gpqa", 55.0, "open-llm-leaderboard"), score("humaneval", 88.5, "open-llm-leaderboard"), score("math", 70.4, "open-llm-leaderboard"), score("ifeval", 89.5, "open-llm-leaderboard")],
    compositeScore: 84, compositeRank: 4,
    popularityScore: 95, qualityScore: 90, freshnessScore: 92,
    shortDescription: "Meta's open-weights frontier — MoE architecture with 17B active params.",
    architecture: "moe-transformer",
    tags: ["frontier", "open-weights", "moe"],
    releasedAt: "2026-04-02",
    trainedOnDatasetSlugs: [
      "commoncrawl-curated-2024",
      "wikitext-103-refined",
      "openwebmath-plus",
      "arxiv-abstracts-2025",
      "stackoverflow-code-pairs",
      "codesearchnet-refined",
    ],
    finetunedOnDatasetSlugs: ["reddit-dialog-7m"],
  }),
  _model({
    slug: "hf-deepseek-ai-deepseek-v3-2",
    name: "DeepSeek V3.2",
    organization: "DeepSeek",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "deepseek-ai/DeepSeek-V3.2",
    sourceUrl: "https://huggingface.co/deepseek-ai/DeepSeek-V3.2",
    accessType: "open-weights",
    weightsAvailable: true,
    license: "DeepSeek License",
    licenseType: "permissive",
    licenseIntelligence: { commercialUse: true, attributionRequired: true, redistributionAllowed: true, modificationAllowed: true, riskLevel: "low" },
    parameters: 671_000_000_000,
    activeParameters: 37_000_000_000,
    contextWindow: 128_000,
    creators: [{ name: "DeepSeek AI" }],
    benchmarkScores: [score("mmlu-pro", 82.8, "open-llm-leaderboard"), score("gpqa", 53.5, "open-llm-leaderboard"), score("humaneval", 89.0, "open-llm-leaderboard"), score("math", 74.0, "open-llm-leaderboard"), score("livecodebench", 60.4, "open-llm-leaderboard")],
    compositeScore: 83, compositeRank: 5,
    popularityScore: 94, qualityScore: 89, freshnessScore: 88,
    shortDescription: "Open-weights MoE with strong code and math reasoning.",
    architecture: "moe-transformer",
    tags: ["frontier", "open-weights", "moe", "code"],
    releasedAt: "2026-03-25",
    trainedOnDatasetSlugs: [
      "commoncrawl-curated-2024",
      "openwebmath-plus",
      "stackoverflow-code-pairs",
      "codesearchnet-refined",
      "arxiv-abstracts-2025",
    ],
  }),
  _model({
    slug: "hf-qwen-qwen3-235b-a22b",
    name: "Qwen3 235B-A22B",
    organization: "Qwen",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "Qwen/Qwen3-235B-A22B",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3-235B-A22B",
    accessType: "open-weights",
    weightsAvailable: true,
    license: "Apache-2.0",
    licenseType: "permissive",
    parameters: 235_000_000_000,
    activeParameters: 22_000_000_000,
    contextWindow: 128_000,
    creators: [{ name: "Alibaba Qwen team" }],
    benchmarkScores: [score("mmlu-pro", 80.2, "open-llm-leaderboard"), score("gpqa", 51.0, "open-llm-leaderboard"), score("humaneval", 86.0, "open-llm-leaderboard"), score("math", 71.5, "open-llm-leaderboard"), score("ifeval", 87.0, "open-llm-leaderboard")],
    compositeScore: 80, compositeRank: 6,
    popularityScore: 90, qualityScore: 86, freshnessScore: 86,
    shortDescription: "Alibaba's frontier open-weights model — Apache-2.0 licensed.",
    architecture: "moe-transformer",
    languages: ["en", "zh", "es", "fr", "de", "ar"],
    tags: ["frontier", "open-weights", "multilingual"],
    releasedAt: "2026-04-29",
  }),
  // ---- Mid-tier open-weights ----
  _model({
    slug: "hf-mistralai-mistral-large-2",
    name: "Mistral Large 2",
    organization: "Mistral AI",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "mistralai/Mistral-Large-2",
    sourceUrl: "https://huggingface.co/mistralai/Mistral-Large-2",
    accessType: "open-weights",
    weightsAvailable: true,
    license: "Mistral AI Research License",
    licenseType: "non_commercial",
    licenseIntelligence: { commercialUse: false, attributionRequired: true, redistributionAllowed: true, modificationAllowed: true, riskLevel: "medium" },
    commercialUseAllowed: false,
    parameters: 123_000_000_000,
    contextWindow: 128_000,
    creators: [{ name: "Mistral AI" }],
    benchmarkScores: [score("mmlu-pro", 75.8), score("gpqa", 46.5), score("humaneval", 82.0), score("math", 65.0), score("ifeval", 84.2)],
    compositeScore: 75, compositeRank: 8,
    popularityScore: 80, qualityScore: 82, freshnessScore: 75,
    shortDescription: "Strong open-weights model — non-commercial license restricts production use.",
    tags: ["open-weights", "non-commercial"],
    languages: ["en", "fr", "de", "es", "it"],
    releasedAt: "2026-01-08",
  }),
  // ---- Smaller open-weights ----
  _model({
    slug: "hf-google-gemma-3-9b-it",
    name: "Gemma 3 9B Instruct",
    organization: "Google",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "google/gemma-3-9b-it",
    sourceUrl: "https://huggingface.co/google/gemma-3-9b-it",
    accessType: "open-weights",
    weightsAvailable: true,
    license: "Gemma Terms of Use",
    licenseType: "permissive",
    parameters: 9_000_000_000,
    contextWindow: 8192,
    creators: [{ name: "Google DeepMind" }],
    benchmarkScores: [score("mmlu-pro", 60.5, "open-llm-leaderboard"), score("gpqa", 32.0, "open-llm-leaderboard"), score("humaneval", 65.5, "open-llm-leaderboard"), score("math", 42.0, "open-llm-leaderboard"), score("ifeval", 71.0, "open-llm-leaderboard")],
    compositeScore: 58, compositeRank: 14,
    popularityScore: 78, qualityScore: 72, freshnessScore: 80,
    shortDescription: "Lightweight 9B instruct model — fits on a single consumer GPU.",
    tags: ["small", "open-weights", "instruct"],
    releasedAt: "2026-02-15",
  }),
  _model({
    slug: "hf-meta-llama-llama-3-3-70b-instruct",
    name: "Llama 3.3 70B Instruct",
    organization: "Meta",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "meta-llama/Llama-3.3-70B-Instruct",
    sourceUrl: "https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct",
    accessType: "open-weights",
    weightsAvailable: true,
    license: "Llama 3.3 Community License",
    licenseType: "restrictive",
    licenseIntelligence: { commercialUse: true, attributionRequired: true, redistributionAllowed: true, modificationAllowed: true, riskLevel: "medium" },
    parameters: 70_000_000_000,
    contextWindow: 128_000,
    creators: [{ name: "Meta AI" }],
    benchmarkScores: [score("mmlu-pro", 73.0, "open-llm-leaderboard"), score("gpqa", 44.5, "open-llm-leaderboard"), score("humaneval", 81.0, "open-llm-leaderboard"), score("math", 60.0, "open-llm-leaderboard"), score("ifeval", 84.5, "open-llm-leaderboard")],
    compositeScore: 72, compositeRank: 9,
    popularityScore: 88, qualityScore: 80, freshnessScore: 70,
    shortDescription: "Meta's reliable workhorse instruct model with broad ecosystem support.",
    tags: ["mid-tier", "open-weights", "workhorse"],
    trainedOnDatasetSlugs: [
      "commoncrawl-curated-2024",
      "wikitext-103-refined",
      "arxiv-abstracts-2025",
    ],
    finetunedOnDatasetSlugs: ["reddit-dialog-7m", "multilegal-eu"],
    releasedAt: "2025-12-06",
  }),
  _model({
    slug: "hf-microsoft-phi-4",
    name: "Phi-4",
    organization: "Microsoft",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "microsoft/phi-4",
    sourceUrl: "https://huggingface.co/microsoft/phi-4",
    accessType: "open-source",
    weightsAvailable: true,
    license: "MIT",
    licenseType: "permissive",
    parameters: 14_000_000_000,
    contextWindow: 16_000,
    creators: [{ name: "Microsoft Research" }],
    benchmarkScores: [score("mmlu-pro", 70.5, "open-llm-leaderboard"), score("gpqa", 41.0, "open-llm-leaderboard"), score("humaneval", 78.0, "open-llm-leaderboard"), score("math", 56.0, "open-llm-leaderboard"), score("ifeval", 78.0, "open-llm-leaderboard")],
    compositeScore: 68, compositeRank: 11,
    popularityScore: 82, qualityScore: 78, freshnessScore: 88,
    shortDescription: "Microsoft's MIT-licensed 14B — punches above its weight on reasoning.",
    tags: ["small", "open-source", "reasoning"],
    releasedAt: "2025-12-12",
    trainedOnDatasetSlugs: ["openwebmath-plus", "arxiv-abstracts-2025"],
  }),
  _model({
    slug: "hf-mistralai-mixtral-8x22b-instruct",
    name: "Mixtral 8x22B Instruct",
    organization: "Mistral AI",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "mistralai/Mixtral-8x22B-Instruct-v0.1",
    sourceUrl: "https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1",
    accessType: "open-weights",
    weightsAvailable: true,
    license: "Apache-2.0",
    licenseType: "permissive",
    parameters: 141_000_000_000,
    activeParameters: 39_000_000_000,
    contextWindow: 64_000,
    creators: [{ name: "Mistral AI" }],
    benchmarkScores: [score("mmlu-pro", 67.5, "open-llm-leaderboard"), score("gpqa", 38.5, "open-llm-leaderboard"), score("humaneval", 75.0, "open-llm-leaderboard"), score("math", 51.0, "open-llm-leaderboard"), score("ifeval", 73.0, "open-llm-leaderboard")],
    compositeScore: 63, compositeRank: 13,
    popularityScore: 75, qualityScore: 74, freshnessScore: 60,
    shortDescription: "Apache-licensed MoE — workhorse for cost-sensitive production deployments.",
    architecture: "moe-transformer",
    tags: ["open-weights", "moe", "apache-2.0"],
    releasedAt: "2025-04-17",
  }),
  // ---- Commercial-API mid-tier (cheap) ----
  _model({
    slug: "or-anthropic-claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    organization: "Anthropic",
    sourcePlatform: "anthropic",
    sourceUrl: "https://www.anthropic.com/claude",
    accessType: "commercial-api",
    weightsAvailable: false,
    license: "Anthropic Commercial",
    licenseType: "proprietary",
    licenseIntelligence: { commercialUse: true, attributionRequired: false, redistributionAllowed: false, modificationAllowed: false, riskLevel: "low" },
    contextWindow: 200_000,
    creators: [{ name: "Anthropic" }],
    pricing: { inputPerMillionTokens: 1, outputPerMillionTokens: 5, cachedInputPerMillionTokens: 0.1, imagePerMillion: null, provider: "Anthropic", currency: "USD", freeTierAvailable: false },
    benchmarkScores: [score("mmlu-pro", 75.0), score("gpqa", 47.0), score("humaneval", 84.5), score("math", 63.0), score("ifeval", 88.0)],
    compositeScore: 74, compositeRank: 7,
    popularityScore: 91, qualityScore: 84, freshnessScore: 92,
    shortDescription: "Anthropic's fast tier — strongest \"small\" model on most benchmarks.",
    tags: ["fast", "commercial-api"],
    releasedAt: "2026-01-22",
  }),
  _model({
    slug: "or-openai-gpt-5-mini",
    name: "GPT-5 Mini",
    organization: "OpenAI",
    sourcePlatform: "openai",
    sourceUrl: "https://platform.openai.com",
    accessType: "commercial-api",
    weightsAvailable: false,
    license: "OpenAI Commercial",
    licenseType: "proprietary",
    licenseIntelligence: { commercialUse: true, attributionRequired: false, redistributionAllowed: false, modificationAllowed: false, riskLevel: "low" },
    contextWindow: 400_000,
    creators: [{ name: "OpenAI" }],
    pricing: { inputPerMillionTokens: 0.5, outputPerMillionTokens: 1.5, cachedInputPerMillionTokens: 0.05, imagePerMillion: null, provider: "OpenAI", currency: "USD", freeTierAvailable: true, freeTierNotes: "Limited free tier via Playground." },
    benchmarkScores: [score("mmlu-pro", 72.0), score("gpqa", 44.0), score("humaneval", 81.5), score("math", 59.0), score("ifeval", 85.0)],
    compositeScore: 71, compositeRank: 10,
    popularityScore: 86, qualityScore: 80, freshnessScore: 90,
    shortDescription: "OpenAI's compact tier — most popular model in the cost-optimized bucket.",
    tags: ["fast", "commercial-api", "cheap"],
    releasedAt: "2026-02-04",
  }),
  // ---- Specialty / code ----
  _model({
    slug: "hf-deepseek-ai-deepseek-coder-v2-instruct",
    name: "DeepSeek Coder V2",
    organization: "DeepSeek",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "deepseek-ai/DeepSeek-Coder-V2-Instruct",
    sourceUrl: "https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Instruct",
    accessType: "open-weights",
    weightsAvailable: true,
    license: "DeepSeek License",
    licenseType: "permissive",
    parameters: 236_000_000_000,
    activeParameters: 21_000_000_000,
    contextWindow: 128_000,
    creators: [{ name: "DeepSeek AI" }],
    benchmarkScores: [score("humaneval", 90.2, "open-llm-leaderboard"), score("livecodebench", 55.0, "open-llm-leaderboard"), score("swe-bench-verified", 22.8, "open-llm-leaderboard"), score("mmlu-pro", 70.0, "open-llm-leaderboard")],
    compositeScore: 66, compositeRank: 12,
    popularityScore: 84, qualityScore: 86, freshnessScore: 76,
    shortDescription: "Code-specialist MoE — leads open models on SWE-Bench and LiveCodeBench.",
    architecture: "moe-transformer",
    tags: ["code", "open-weights", "moe"],
    releasedAt: "2025-09-04",
    trainedOnDatasetSlugs: [
      "stackoverflow-code-pairs",
      "codesearchnet-refined",
      "commoncrawl-curated-2024",
    ],
  }),
  _model({
    slug: "hf-stabilityai-stable-diffusion-3-5-large",
    name: "Stable Diffusion 3.5 Large",
    organization: "Stability AI",
    sourcePlatform: "huggingface",
    huggingfaceRepo: "stabilityai/stable-diffusion-3.5-large",
    sourceUrl: "https://huggingface.co/stabilityai/stable-diffusion-3.5-large",
    accessType: "open-weights",
    weightsAvailable: true,
    license: "Stability AI Community License",
    licenseType: "restrictive",
    licenseIntelligence: { commercialUse: true, attributionRequired: true, redistributionAllowed: true, modificationAllowed: true, riskLevel: "medium", notes: "Free for under $1M ARR; commercial license required above." },
    parameters: 8_000_000_000,
    creators: [{ name: "Stability AI" }],
    benchmarkScores: [],
    compositeScore: 0, compositeRank: undefined,
    popularityScore: 76, qualityScore: 78, freshnessScore: 82,
    shortDescription: "Open-weights text-to-image generator — the workhorse for creative ML.",
    modalitiesInput: ["text"],
    modalitiesOutput: ["image"],
    tags: ["image-generation", "open-weights"],
    releasedAt: "2025-10-22",
  }),
  // ---- Free-tier highlight ----
  _model({
    slug: "or-google-gemini-2-5-flash-free",
    name: "Gemini 2.5 Flash (free tier)",
    organization: "Google",
    sourcePlatform: "openrouter",
    sourceUrl: "https://openrouter.ai/models/google/gemini-2.5-flash",
    accessType: "commercial-api",
    weightsAvailable: false,
    license: "Google Commercial",
    licenseType: "proprietary",
    licenseIntelligence: { commercialUse: true, attributionRequired: false, redistributionAllowed: false, modificationAllowed: false, riskLevel: "low" },
    contextWindow: 1_000_000,
    creators: [{ name: "Google DeepMind" }],
    pricing: { inputPerMillionTokens: 0, outputPerMillionTokens: 0, cachedInputPerMillionTokens: 0, imagePerMillion: null, provider: "OpenRouter (Google)", currency: "USD", freeTierAvailable: true, freeTierNotes: "Free via OpenRouter with daily-quota rate limits." },
    benchmarkScores: [score("mmlu-pro", 70.0), score("gpqa", 40.0), score("humaneval", 78.0)],
    compositeScore: 64,
    popularityScore: 88, qualityScore: 70, freshnessScore: 90,
    shortDescription: "Free via OpenRouter — popular zero-cost choice for prototyping.",
    tags: ["free", "commercial-api"],
    releasedAt: "2026-01-30",
  }),
  // ---- Multilingual / closed-weights ----
  _model({
    slug: "or-mistralai-mistral-medium-3",
    name: "Mistral Medium 3",
    organization: "Mistral AI",
    sourcePlatform: "mistral",
    sourceUrl: "https://docs.mistral.ai",
    accessType: "closed-weights",
    weightsAvailable: false,
    license: "Mistral Commercial",
    licenseType: "proprietary",
    licenseIntelligence: { commercialUse: true, attributionRequired: false, redistributionAllowed: false, modificationAllowed: false, riskLevel: "low" },
    contextWindow: 128_000,
    creators: [{ name: "Mistral AI" }],
    pricing: { inputPerMillionTokens: 2.7, outputPerMillionTokens: 8.1, cachedInputPerMillionTokens: 0.5, imagePerMillion: null, provider: "Mistral", currency: "USD", freeTierAvailable: false },
    benchmarkScores: [score("mmlu-pro", 78.5), score("gpqa", 49.0), score("humaneval", 85.0), score("math", 67.0), score("ifeval", 86.5)],
    compositeScore: 77,
    popularityScore: 70, qualityScore: 82, freshnessScore: 78,
    shortDescription: "European-aligned closed-weights model — strong on multilingual reasoning.",
    languages: ["en", "fr", "de", "es", "it", "nl", "pl"],
    tags: ["closed-weights", "multilingual"],
    releasedAt: "2026-02-01",
  }),
]

function _matchModel(m: Model, filters?: import("./types").ModelFilters): boolean {
  if (!filters) return true
  if (filters.accessType?.length && !filters.accessType.includes(m.accessType)) return false
  if (filters.organization?.length && (!m.organization || !filters.organization.includes(m.organization))) return false
  if (filters.sourcePlatform?.length && !filters.sourcePlatform.includes(m.sourcePlatform)) return false
  if (filters.licenseType?.length && !filters.licenseType.includes(m.licenseType)) return false
  if (filters.minParameters !== undefined && (m.parameters ?? 0) < filters.minParameters) return false
  if (filters.maxParameters !== undefined && (m.parameters ?? 0) > filters.maxParameters) return false
  if (filters.commercialUseOnly && m.commercialUseAllowed === false) return false
  if (filters.freeTierOnly && !(m.pricing?.freeTierAvailable ?? false)) return false
  if (filters.minCompositeScore !== undefined && (m.compositeScore ?? 0) < filters.minCompositeScore) return false
  if (filters.modality?.length && !filters.modality.some((mod) => m.modalitiesInput.includes(mod) || m.modalitiesOutput.includes(mod))) return false
  if (filters.search) {
    const q = filters.search.toLowerCase()
    const hay = `${m.name} ${m.shortDescription} ${m.organization ?? ""} ${m.tags.join(" ")}`.toLowerCase()
    if (!hay.includes(q)) return false
  }
  return true
}

export function listModels(
  filters?: import("./types").ModelFilters
): { items: Model[]; total: number } {
  const items = models.filter((m) => _matchModel(m, filters))
  return { items, total: items.length }
}

export function getModelBySlug(slug: string): Model | null {
  return models.find((m) => m.slug === slug) ?? null
}

export function getRelatedModels(slug: string, limit = 6): Model[] {
  const target = getModelBySlug(slug)
  if (!target) return []
  return models
    .filter((m) => m.slug !== slug)
    .map((m) => {
      let score = 0
      if (m.organization === target.organization) score += 3
      if (m.accessType === target.accessType) score += 2
      if (m.licenseType === target.licenseType) score += 1
      if (target.parameters && m.parameters) {
        const ratio = Math.min(target.parameters, m.parameters) / Math.max(target.parameters, m.parameters)
        if (ratio > 0.5) score += 1
      }
      return { m, score }
    })
    .sort((a, b) => b.score - a.score || (b.m.compositeScore ?? 0) - (a.m.compositeScore ?? 0))
    .slice(0, limit)
    .map(({ m }) => m)
}

export function getTrainingDatasetsForModel(slug: string): Dataset[] {
  const model = getModelBySlug(slug)
  if (!model) return []
  const slugs = new Set([...model.trainedOnDatasetSlugs, ...model.finetunedOnDatasetSlugs])
  return datasets.filter((d) => slugs.has(d.slug))
}

export function getLeaderboard(
  benchmark: BenchmarkScore["benchmark"],
  limit = 25,
  accessType?: import("./types").ModelAccessType[]
): import("./types").LeaderboardEntry[] {
  const candidates = models.filter(
    (m) => (!accessType?.length || accessType.includes(m.accessType))
  )
  const rows = candidates
    .map((m) => ({ m, score: m.benchmarkScores.find((s) => s.benchmark === benchmark) }))
    .filter(
      (r): r is { m: Model; score: BenchmarkScore } => r.score !== undefined
    )
    .sort((a, b) => b.score.score - a.score.score)
    .slice(0, limit)
  return rows.map((r, i) => ({
    rank: i + 1,
    model: r.m,
    score: r.score.score,
    scoreFormat: r.score.scoreFormat,
  }))
}

export function getModelStats(): import("./types").ModelStats {
  const byAccessType: Record<string, number> = {}
  const byOrganization: Record<string, number> = {}
  for (const m of models) {
    byAccessType[m.accessType] = (byAccessType[m.accessType] ?? 0) + 1
    if (m.organization)
      byOrganization[m.organization] = (byOrganization[m.organization] ?? 0) + 1
  }
  const benchKeys: BenchmarkScore["benchmark"][] = ["mmlu-pro", "gpqa", "humaneval", "math", "ifeval"]
  const topBenchmarks = benchKeys.map((b) => {
    const scores = models
      .map((m) => m.benchmarkScores.find((s) => s.benchmark === b)?.score)
      .filter((s): s is number => s !== undefined)
      .sort((a, b2) => b2 - a)
    const median = scores.length === 0 ? 0 : scores[Math.floor(scores.length / 2)]
    return { benchmark: b, medianScore: median, topScore: scores[0] ?? 0 }
  })
  return {
    totalModels: models.length,
    byAccessType,
    byOrganization,
    topBenchmarks,
    lastUpdatedAt: _now,
  }
}

export function compareModels(slugs: string[]): Model[] {
  return slugs.map((s) => getModelBySlug(s)).filter((m): m is Model => m !== null)
}
