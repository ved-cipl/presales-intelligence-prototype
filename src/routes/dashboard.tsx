import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Gauge,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AttentionMap } from "@/features/presales/components/AttentionMap";
import { KpiCard } from "@/features/presales/components/KpiCard";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { DASHBOARD_RECOMMENDATIONS, KPI_CARDS } from "@/features/presales/data/trends";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const KPI_ICONS = [Target, Sparkles, ArrowUpCircle, Clock, Gauge];

const RECOMMENDATION_ICON = {
  Prioritize: { icon: ArrowUpCircle, tone: "text-signal-positive bg-signal-positive/10" },
  Investigate: { icon: Search, tone: "text-signal-warning bg-signal-warning/15" },
  Deprioritize: { icon: ArrowDownCircle, tone: "text-signal-risk bg-signal-risk/10" },
  "Emerging Signal": { icon: TrendingUp, tone: "text-signal-info bg-signal-info/10" },
} as const;

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader
        title="Presales Intelligence"
        subtitle="AI-powered opportunity intelligence and presales decision support"
      />

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {KPI_CARDS.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            subtext={kpi.subtext}
            icon={KPI_ICONS[i]}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Opportunity Attention Map</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Where expected value, winability and presales effort intersect. Click a bubble to
                open the opportunity.
              </p>
            </div>
          </div>
          <div className="mt-2">
            <AttentionMap />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">AI Recommendations</h2>
          <div className="mt-3 space-y-3">
            {DASHBOARD_RECOMMENDATIONS.map((rec) => {
              const meta = RECOMMENDATION_ICON[rec.kind];
              const Icon = meta.icon;
              return (
                <div key={rec.title} className="rounded-lg border border-border p-3.5">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${meta.tone}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {rec.kind}
                      </p>
                      <p className="mt-0.5 text-sm font-medium leading-snug text-foreground">
                        {rec.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() =>
                      rec.opportunityId
                        ? navigate({
                            to: "/opportunities/$id",
                            params: { id: rec.opportunityId },
                          })
                        : navigate({ to: "/intelligence" })
                    }
                  >
                    {rec.buttonLabel}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
