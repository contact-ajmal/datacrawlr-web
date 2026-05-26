import ReactMarkdown, { type Components } from "react-markdown"

import { cn } from "@/lib/utils"

interface MarkdownBlockProps {
  content: string
  className?: string
}

const components: Components = {
  h1: (props) => (
    <h1
      className="text-h2 text-primary mt-10 mb-4 font-semibold tracking-tight"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-h3 text-primary mt-8 mb-3 font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-h4 text-primary mt-6 mb-2 font-semibold"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-secondary text-body my-4 leading-relaxed" {...props} />
  ),
  ul: (props) => (
    <ul
      className="text-secondary text-body my-4 list-disc space-y-1.5 pl-6 leading-relaxed"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="text-secondary text-body my-4 list-decimal space-y-1.5 pl-6 leading-relaxed"
      {...props}
    />
  ),
  li: (props) => <li className="marker:text-tertiary" {...props} />,
  a: (props) => (
    <a
      className="text-accent underline-offset-2 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: ({ children, ...props }) => (
    <code
      className="bg-elevated text-primary border-subtle rounded border px-1.5 py-0.5 font-mono text-caption"
      {...props}
    >
      {children}
    </code>
  ),
  pre: (props) => (
    <pre
      className="bg-elevated border-subtle text-primary text-caption my-5 overflow-x-auto rounded-lg border p-4 font-mono"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-accent text-secondary text-body my-4 border-l-2 pl-4 italic"
      {...props}
    />
  ),
  hr: () => <hr className="border-subtle my-8" />,
  strong: (props) => <strong className="text-primary font-semibold" {...props} />,
}

export function MarkdownBlock({ content, className }: MarkdownBlockProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
}
