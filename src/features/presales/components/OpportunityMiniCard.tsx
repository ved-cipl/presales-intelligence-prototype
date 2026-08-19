import { Link } from "@tanstack/react-router";

import { ConfidenceBadge, PriorityBadge } from "@/features/presales/components/badges";
import type { Opportunity } from "@/features/presales/data/types";

export function OpportunityMiniCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Link
      to="/opportunities/$id"
      params={{ id: opportunity.id }}
      className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug text-foreground">{opportunity.name}</p>
          <PriorityBadge priority={opportunity.priority} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {opportunity.client} · {opportunity.industry}
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-medium tabular-nums text-foreground">
          {opportunity.estimatedValueLabel}
        </span>
        <ConfidenceBadge value={opportunity.confidence} />
      </div>
      <p className="mt-2 truncate text-[11px] font-medium text-muted-foreground">
        {opportunity.recommendation}
      </p>
    </Link>
  );
}
