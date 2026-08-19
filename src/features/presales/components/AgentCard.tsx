import {
  Blocks,
  BookOpen,
  Building2,
  FileText,
  ScanSearch,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AgentStatus, AiAgent } from "@/features/presales/data/agents";

const iconMap: Record<AiAgent["icon"], LucideIcon> = {
  ScanSearch,
  TrendingUp,
  Blocks,
  FileText,
  Building2,
  BookOpen,
};

const statusTone: Record<AgentStatus, string> = {
  Live: "bg-signal-positive/10 text-signal-positive border-signal-positive/25",
  Beta: "bg-signal-info/10 text-signal-info border-signal-info/25",
  "Coming Soon": "bg-signal-unknown/10 text-signal-unknown border-signal-unknown/25",
};

export function AgentCard({
  agent,
  onClick,
  className,
}: {
  agent: AiAgent;
  onClick?: () => void;
  className?: string;
}) {
  const Icon = iconMap[agent.icon];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col items-start rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md cursor-pointer",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/[0.06] text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            statusTone[agent.status],
          )}
        >
          {agent.status}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{agent.name}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{agent.description}</p>
    </button>
  );
}
