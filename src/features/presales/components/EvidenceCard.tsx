import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EvidencePoint } from "@/features/presales/data/types";

const sourceToneClass: Record<EvidencePoint["sourceType"], string> = {
  RFP: "bg-signal-info/10 text-signal-info",
  CRM: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Client communication": "bg-signal-warning/15 text-amber-700 dark:text-signal-warning",
  "Historical project": "bg-signal-positive/10 text-signal-positive",
  "Case study": "bg-signal-positive/10 text-signal-positive",
  "Human input": "bg-signal-unknown/10 text-signal-unknown",
};

const confidenceToneClass: Record<EvidencePoint["confidence"], string> = {
  High: "text-signal-positive",
  Medium: "text-signal-warning",
  Low: "text-signal-risk",
};

export function EvidenceCard({
  evidence,
  className,
}: {
  evidence: EvidencePoint;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            sourceToneClass[evidence.sourceType],
          )}
        >
          <FileText className="h-3 w-3" />
          {evidence.sourceType}
        </span>
        <span className="text-[11px] text-muted-foreground">{evidence.timestamp}</span>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-foreground">{evidence.text}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 text-xs">
        <span className="text-muted-foreground">
          Source: <span className="font-medium text-foreground">{evidence.source}</span>
        </span>
        <span className={cn("font-semibold", confidenceToneClass[evidence.confidence])}>
          Confidence: {evidence.confidence}
        </span>
      </div>
    </div>
  );
}
