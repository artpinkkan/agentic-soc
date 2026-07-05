import { Link2, Server, ShieldAlert, Bug } from "lucide-react"
import type { Citation } from "@/lib/investigate-data"
import { cn } from "@/lib/utils"

const KIND_STYLES: Record<Citation["kind"], { icon: typeof Link2; className: string }> = {
  internal: { icon: Server, className: "bg-blue-50 text-blue-700 border-blue-200" },
  attck: { icon: Link2, className: "bg-violet-50 text-violet-700 border-violet-200" },
  abuseipdb: { icon: ShieldAlert, className: "bg-amber-50 text-amber-700 border-amber-200" },
  cve: { icon: Bug, className: "bg-orange-50 text-orange-700 border-orange-200" },
}

export function CitationChip({ citation }: { citation: Citation }) {
  const style = KIND_STYLES[citation.kind]
  const Icon = style.icon
  return (
    <span
      title={citation.title}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-mono cursor-help",
        style.className
      )}
    >
      <Icon className="size-3" />
      {citation.label}
    </span>
  )
}
