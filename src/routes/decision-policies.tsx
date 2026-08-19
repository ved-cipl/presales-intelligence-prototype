import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { DECISION_POLICIES } from "@/features/presales/data/decision-designer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/decision-policies")({
  component: DecisionPoliciesPage,
});

function DecisionPoliciesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Decision Policies"
        subtitle="Every policy governing how the AI reasons through presales decisions"
      />

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {DECISION_POLICIES.map((p) => (
          <div key={p.id} className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug text-foreground">
                  {p.name} <span className="text-muted-foreground">v{p.version}</span>
                </h3>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                    p.status === "Published"
                      ? "border-signal-positive/25 bg-signal-positive/10 text-signal-positive"
                      : "border-signal-warning/30 bg-signal-warning/15 text-amber-700 dark:text-signal-warning",
                  )}
                >
                  {p.status === "Published" ? <ShieldCheck className="h-3 w-3" /> : null}
                  {p.status}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">Owner: {p.owner}</p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border p-2.5">
                  <p className="text-[10px] font-medium text-muted-foreground">Opportunities Evaluated</p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                    {p.opportunitiesEvaluated}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-2.5">
                  <p className="text-[10px] font-medium text-muted-foreground">Human Override Rate</p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                    {p.humanOverrideRate}%
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                <p>Effective: {p.effectiveDate}</p>
                <p>Last reviewed: {p.lastReview}</p>
                <p>Last updated: {p.lastUpdated}</p>
              </div>
            </div>

            <Link
              to="/decision-designer"
              search={{ policy: p.id }}
              className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              Open in Designer
            </Link>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
