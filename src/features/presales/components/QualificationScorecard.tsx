import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { DimensionLevelBadge } from "@/features/presales/components/badges";
import { EvidenceCard } from "@/features/presales/components/EvidenceCard";
import type { Opportunity } from "@/features/presales/data/types";

export function QualificationScorecard({ opportunity }: { opportunity: Opportunity }) {
  const [expandedKey, setExpandedKey] = React.useState<string | null>(
    opportunity.dimensions[0]?.key ?? null,
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {opportunity.dimensions.map((d) => {
        const isOpen = expandedKey === d.key;
        const relatedEvidence = opportunity.evidence.filter((e) => d.evidenceIds.includes(e.id));
        return (
          <div
            key={d.key}
            className={cn(
              "col-span-1 rounded-xl border bg-card shadow-sm transition-all",
              isOpen ? "sm:col-span-2 lg:col-span-3 border-primary/30" : "border-border",
            )}
          >
            <button
              type="button"
              onClick={() => setExpandedKey(isOpen ? null : d.key)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{d.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Weight {d.weight}%</p>
              </div>
              <div className="flex items-center gap-2">
                <DimensionLevelBadge level={d.level} />
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </div>
            </button>
            {isOpen ? (
              <div className="border-t border-border p-4 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Assessment
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">{d.assessment}</p>
                {relatedEvidence.length > 0 ? (
                  <>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Evidence ({relatedEvidence.length})
                    </p>
                    <div className="mt-2 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                      {relatedEvidence.map((e) => (
                        <EvidenceCard key={e.id} evidence={e} />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-4 rounded-md border border-dashed border-signal-unknown/40 bg-signal-unknown/[0.04] p-3 text-xs text-signal-unknown">
                    No evidence collected yet for this dimension.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
