import * as React from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Download, GitBranch, Share2 as ShareIcon, UserCheck } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIRecommendationBanner } from "@/features/presales/components/AIRecommendationBanner";
import { ConfidenceBadge, DimensionLevelBadge } from "@/features/presales/components/badges";
import { DecisionMatrix } from "@/features/presales/components/DecisionMatrix";
import { DecisionTracePanel } from "@/features/presales/components/decision-designer/DecisionTracePanel";
import { EvidenceCard } from "@/features/presales/components/EvidenceCard";
import { GraphCanvas } from "@/features/presales/components/GraphCanvas";
import { KnowledgeUsedCard } from "@/features/presales/components/knowledge/KnowledgeUsedCard";
import { OpportunityMiniCard } from "@/features/presales/components/OpportunityMiniCard";
import { PageContainer } from "@/features/presales/components/PageHeader";
import { QualificationScorecard } from "@/features/presales/components/QualificationScorecard";
import { Timeline } from "@/features/presales/components/Timeline";
import { UnknownCard } from "@/features/presales/components/UnknownCard";
import { clientNodeId } from "@/features/presales/data/graph";
import { getOpportunity } from "@/features/presales/data/opportunities";
import { usePresalesData } from "@/features/presales/state/PresalesDataContext";
import { toast } from "sonner";

const TABS = [
  "overview",
  "qualification",
  "evidence",
  "similar",
  "graph",
  "activity",
  "decisions",
] as const;

export const Route = createFileRoute("/opportunities/$id")({
  validateSearch: z.object({ tab: z.enum(TABS).optional() }),
  loader: ({ params }) => {
    const opp = getOpportunity(params.id);
    if (!opp) throw notFound();
    return { name: opp.name };
  },
  component: OpportunityDetailPage,
});

const STRATEGIC_SUBSCORES = [
  { key: "capability", label: "Capability alignment" },
  { key: "industry", label: "Industry relevance" },
  { key: "account", label: "Strategic account value" },
  { key: "technology", label: "Technology relevance" },
  { key: "revenue", label: "Revenue potential" },
];

function pseudoOffset(seed: string, salt: number) {
  let h = salt;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 97;
  return (h % 9) / 10 - 0.4;
}

function OpportunityDetailPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { getOpportunity: getLiveOpportunity } = usePresalesData();
  const opportunity = getLiveOpportunity(id) ?? getOpportunity(id);
  const [traceOpen, setTraceOpen] = React.useState(false);

  if (!opportunity) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Opportunity not found.</p>
      </PageContainer>
    );
  }

  const tab = search.tab ?? "overview";
  const setTab = (t: string) =>
    navigate({
      to: "/opportunities/$id",
      params: { id },
      search: { tab: t as (typeof TABS)[number] },
    });

  const similar = opportunity.similarOpportunityIds
    .map((sid) => getLiveOpportunity(sid) ?? getOpportunity(sid))
    .filter((o): o is NonNullable<typeof o> => !!o);

  const profile: { label: string; value: string }[] = [
    { label: "Client", value: opportunity.client },
    { label: "Industry", value: opportunity.industry },
    { label: "Geography", value: opportunity.geography },
    { label: "Opportunity Type", value: opportunity.type },
    { label: "Estimated Value", value: opportunity.estimatedValueLabel },
    { label: "Timeline", value: opportunity.timeline },
    { label: "Existing Account", value: opportunity.existingAccount },
    { label: "Decision Stage", value: opportunity.decisionStage },
    { label: "Competition", value: opportunity.competition },
    { label: "Procurement Model", value: opportunity.procurementModel },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{opportunity.client}</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
            {opportunity.name}
          </h1>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {opportunity.badges.map((b) => (
              <span
                key={b}
                className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.info("Prototype note", {
                description: "Sharing isn't wired up in this prototype.",
              })
            }
          >
            <ShareIcon className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.info("Prototype note", {
                description: "Export isn't wired up in this prototype.",
              })
            }
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() =>
              toast.success("Review requested", {
                description: "A presales reviewer has been notified.",
              })
            }
          >
            <UserCheck className="h-3.5 w-3.5" />
            Request Review
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <AIRecommendationBanner opportunity={opportunity} />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qualification">Qualification</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="similar">Similar Opportunities</TabsTrigger>
          <TabsTrigger value="graph">Knowledge Graph</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="decisions">Decision History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-5 pt-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Opportunity Summary</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{opportunity.summary}</p>
            <button
              onClick={() => setTab("evidence")}
              className="mt-2.5 text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              Generated from {opportunity.evidence.length} evidence points
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Opportunity Profile</h2>
            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {profile.map((f) => (
                <div key={f.label}>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {f.label}
                  </p>
                  <p
                    className={`mt-0.5 text-sm font-medium ${f.value === "Unknown" ? "text-signal-unknown" : "text-foreground"}`}
                  >
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Strategic Fit</h2>
              <span className="text-2xl font-semibold tabular-nums text-foreground">
                {opportunity.strategicFit.toFixed(1)}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ 10</span>
              </span>
            </div>
            <div className="mt-4 space-y-2.5">
              {STRATEGIC_SUBSCORES.map((s, i) => {
                const value = Math.max(
                  1,
                  Math.min(10, opportunity.strategicFit + pseudoOffset(opportunity.id, i + 1)),
                );
                return (
                  <div
                    key={s.key}
                    className="grid grid-cols-[10rem_1fr_2.5rem] items-center gap-3 text-sm"
                  >
                    <span className="text-muted-foreground">{s.label}</span>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-signal-info"
                        style={{ width: `${value * 10}%` }}
                      />
                    </div>
                    <span className="text-right text-xs font-medium tabular-nums text-foreground">
                      {value.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <KnowledgeUsedCard />
        </TabsContent>

        <TabsContent value="qualification" className="space-y-5 pt-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">AI Qualification Assessment</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Assessment against organizational qualification standards
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setTraceOpen(true)}>
              <GitBranch className="h-3.5 w-3.5" />
              Decision Trace
            </Button>
          </div>

          <QualificationScorecard opportunity={opportunity} />

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground">Qualification Decision</h3>
            <div className="mt-4">
              <DecisionMatrix dimensions={opportunity.dimensions} />
            </div>
            <div className="mt-5 rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  AI Recommendation
                </p>
                <ConfidenceBadge value={opportunity.confidence} />
              </div>
              <p className="mt-1 text-base font-semibold text-foreground">
                {opportunity.recommendation}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Opportunity meets the minimum qualification threshold across strategic fit,
                capability alignment and economic potential. Additional discovery is recommended
                before allocating full solutioning resources.
              </p>
            </div>
          </div>

          {opportunity.unknowns.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-foreground">Critical Unknowns</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {opportunity.unknowns.map((u) => (
                  <UnknownCard
                    key={u.id}
                    item={u}
                    onAction={() =>
                      toast.info(`${u.actionLabel}: ${u.label}`, {
                        description: "This would open a guided intake flow in production.",
                      })
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Evidence ({opportunity.evidence.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Every assessment is grounded in a traceable source.
              </p>
            </div>
            <Link to="/opportunities/$id/evidence" params={{ id }}>
              <Button variant="outline" size="sm">
                Open Evidence Explorer
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {opportunity.evidence.map((e) => (
              <EvidenceCard key={e.id} evidence={e} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="similar" className="pt-4">
          {similar.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((o) => (
                <OpportunityMiniCard key={o.id} opportunity={o} />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No similar opportunities identified yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="graph" className="pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Graph centered on this opportunity's client. Click a node for details, double-click to
              re-center.
            </p>
            <Link
              to="/knowledge-graph"
              search={{ center: clientNodeId(opportunity.client) }}
            >
              <Button variant="outline" size="sm">
                Open full Knowledge Graph
              </Button>
            </Link>
          </div>
          <GraphCanvas initialCenterId={clientNodeId(opportunity.client)} height={500} />
        </TabsContent>

        <TabsContent value="activity" className="pt-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <Timeline events={opportunity.timelineEvents} />
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="pt-4">
          {opportunity.decisions.length > 0 ? (
            <div className="space-y-3">
              {opportunity.decisions.map((d) => (
                <div key={d.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{d.humanDecision}</p>
                    <span className="text-xs text-muted-foreground">
                      {d.decidedBy} · {d.date}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    AI recommended: {d.aiRecommendation}
                  </p>
                  {d.reason ? (
                    <p className="mt-1 text-xs text-foreground">Reason: {d.reason}</p>
                  ) : null}
                  {d.notes ? <p className="mt-1 text-xs text-foreground">{d.notes}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No decisions recorded yet. Use “Override Decision” above to record a human review.
            </p>
          )}
        </TabsContent>
      </Tabs>

      <DecisionTracePanel open={traceOpen} onOpenChange={setTraceOpen} opportunityId={opportunity.id} />
    </PageContainer>
  );
}
