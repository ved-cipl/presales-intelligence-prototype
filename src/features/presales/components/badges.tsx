import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { DimensionLevel, Priority } from "@/features/presales/data/types";

const toneClasses: Record<string, string> = {
  positive: "bg-signal-positive/10 text-signal-positive border-signal-positive/25",
  warning: "bg-signal-warning/15 text-amber-700 dark:text-signal-warning border-signal-warning/30",
  risk: "bg-signal-risk/10 text-signal-risk border-signal-risk/25",
  unknown: "bg-signal-unknown/10 text-signal-unknown border-signal-unknown/25",
  info: "bg-signal-info/10 text-signal-info border-signal-info/25",
};

const levelTone: Record<DimensionLevel, keyof typeof toneClasses> = {
  High: "positive",
  Medium: "warning",
  Low: "risk",
  Unknown: "unknown",
};

export function DimensionLevelBadge({
  level,
  className,
}: {
  level: DimensionLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        toneClasses[levelTone[level]],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

const priorityTone: Record<Priority, keyof typeof toneClasses> = {
  High: "positive",
  Monitor: "warning",
  Discovery: "unknown",
  Low: "risk",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
        toneClasses[priorityTone[priority]],
        className,
      )}
    >
      {priority}
    </span>
  );
}

export function ConfidenceBadge({ value, className }: { value: number; className?: string }) {
  const tone = value >= 75 ? "positive" : value >= 50 ? "warning" : "risk";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        toneClasses[tone],
        className,
      )}
    >
      <Sparkles className="h-3 w-3" />
      {value}% confidence
    </span>
  );
}

type ProvenanceKind =
  | "ai-inferred"
  | "source-verified"
  | "human-confirmed"
  | "unknown"
  | "low-confidence"
  | "high-confidence"
  | "conflicting";

const provenanceMeta: Record<
  ProvenanceKind,
  { label: string; icon: typeof Sparkles; tone: keyof typeof toneClasses }
> = {
  "ai-inferred": { label: "AI inferred", icon: Sparkles, tone: "info" },
  "source-verified": { label: "Source verified", icon: ShieldCheck, tone: "positive" },
  "human-confirmed": { label: "Human confirmed", icon: CheckCircle2, tone: "positive" },
  unknown: { label: "Unknown", icon: CircleDashed, tone: "unknown" },
  "low-confidence": { label: "Low confidence", icon: AlertTriangle, tone: "warning" },
  "high-confidence": { label: "High confidence", icon: TrendingUp, tone: "positive" },
  conflicting: { label: "Conflicting evidence", icon: AlertTriangle, tone: "risk" },
};

export function ProvenanceBadge({ kind, className }: { kind: ProvenanceKind; className?: string }) {
  const meta = provenanceMeta[kind];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        toneClasses[meta.tone],
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}
