import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

import { PageContainer } from "@/features/presales/components/PageHeader";
import { getOpportunity } from "@/features/presales/data/opportunities";
import { usePresalesData } from "@/features/presales/state/PresalesDataContext";
import type { EvidencePoint, SourceType } from "@/features/presales/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/opportunities/$id_/evidence")({
  loader: ({ params }) => {
    const opp = getOpportunity(params.id);
    if (!opp) throw notFound();
    return { name: opp.name };
  },
  component: EvidenceExplorerPage,
});

const SOURCE_TYPES: SourceType[] = [
  "RFP",
  "CRM",
  "Client communication",
  "Historical project",
  "Case study",
  "Human input",
];

function EvidenceExplorerPage() {
  const { id } = Route.useParams();
  const { getOpportunity: getLiveOpportunity } = usePresalesData();
  const opportunity = getLiveOpportunity(id) ?? getOpportunity(id);
  const [sourceFilter, setSourceFilter] = React.useState<SourceType | "all">("all");
  const [selected, setSelected] = React.useState<EvidencePoint | null>(
    opportunity?.evidence[0] ?? null,
  );

  if (!opportunity) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Opportunity not found.</p>
      </PageContainer>
    );
  }

  const filtered =
    sourceFilter === "all"
      ? opportunity.evidence
      : opportunity.evidence.filter((e) => e.sourceType === sourceFilter);
  const countBySource = (t: SourceType) =>
    opportunity.evidence.filter((e) => e.sourceType === t).length;

  return (
    <PageContainer fluid>
      <div className="border-b border-border px-6 py-5 md:px-8">
        <Link
          to="/opportunities/$id"
          params={{ id }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {opportunity.name}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Evidence Explorer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI reasoning grounded in organizational evidence, not unsupported answers.
        </p>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-[220px_1fr_340px]"
        style={{ minHeight: "calc(100vh - 10rem)" }}
      >
        <div className="border-b border-border p-4 lg:border-b-0 lg:border-r">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Sources
          </p>
          <div className="mt-2 space-y-0.5">
            <button
              onClick={() => setSourceFilter("all")}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm cursor-pointer",
                sourceFilter === "all"
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60",
              )}
            >
              All sources
              <span className="text-xs">{opportunity.evidence.length}</span>
            </button>
            {SOURCE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSourceFilter(t)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm cursor-pointer",
                  sourceFilter === t
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/60",
                )}
              >
                {t}
                <span className="text-xs">{countBySource(t)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-border p-4 lg:border-b-0 lg:border-r">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Extracted Evidence
          </p>
          <div className="mt-2 space-y-2">
            {filtered.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left text-sm transition-colors cursor-pointer",
                  selected?.id === e.id
                    ? "border-primary/40 bg-primary/[0.04]"
                    : "border-border hover:bg-accent/40",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {e.sourceType}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{e.timestamp}</span>
                </div>
                <p className="mt-1.5 text-foreground">{e.text}</p>
              </button>
            ))}
            {filtered.length === 0 ? (
              <p className="p-4 text-center text-xs text-muted-foreground">
                No evidence for this source.
              </p>
            ) : null}
          </div>
        </div>

        <div className="p-4">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            AI Interpretation
          </p>
          {selected ? (
            <div className="mt-2 rounded-lg border border-signal-info/25 bg-signal-info/[0.04] p-4">
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {selected.interpretation}
              </p>
              <div className="mt-3 space-y-2 border-t border-signal-info/20 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence</span>
                  <span
                    className={cn(
                      "font-semibold",
                      selected.confidence === "High" && "text-signal-positive",
                      selected.confidence === "Medium" && "text-signal-warning",
                      selected.confidence === "Low" && "text-signal-risk",
                    )}
                  >
                    {selected.confidence}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Relationship</span>
                  <span className="font-medium text-foreground">{selected.supportsLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-medium text-foreground">{selected.source}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Select an evidence point to see the AI's interpretation.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
