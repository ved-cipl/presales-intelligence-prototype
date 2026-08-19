import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentCard } from "@/features/presales/components/AgentCard";
import { AgentDetailDialog } from "@/features/presales/components/AgentDetailDialog";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { AI_AGENTS, type AiAgent } from "@/features/presales/data/agents";
import { technologyNodeId } from "@/features/presales/data/graph";
import {
  CAPABILITY_DEMAND,
  EMERGING_TECHNOLOGIES,
  INDUSTRY_DEMAND,
  MARKET_MAP,
  STRATEGIC_SIGNAL,
} from "@/features/presales/data/trends";

const VIEWS = ["trends", "market-map", "workforce", "architecture"] as const;

export const Route = createFileRoute("/intelligence")({
  validateSearch: z.object({ view: z.enum(VIEWS).optional() }),
  component: IntelligencePage,
});

function IntelligencePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const view = search.view ?? "trends";

  return (
    <PageContainer>
      <PageHeader
        title="Presales Intelligence"
        subtitle="Signals emerging across the opportunity portfolio"
      />

      <Tabs
        value={view}
        onValueChange={(v) =>
          navigate({ to: "/intelligence", search: { view: v as (typeof VIEWS)[number] } })
        }
        className="mt-5"
      >
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="market-map">Market Map</TabsTrigger>
          <TabsTrigger value="workforce">AI Workforce</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="pt-4">
          <TrendsView />
        </TabsContent>
        <TabsContent value="market-map" className="pt-4">
          <MarketMapView />
        </TabsContent>
        <TabsContent value="workforce" className="pt-4">
          <WorkforceView />
        </TabsContent>
        <TabsContent value="architecture" className="pt-4">
          <ArchitectureView />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

function TrendsView() {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Emerging Technologies</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {EMERGING_TECHNOLOGIES.map((t) => (
            <div key={t.label} className="rounded-lg border border-border p-3.5">
              <p className="text-xs font-medium text-muted-foreground">{t.label}</p>
              <p className="mt-1 text-xl font-semibold text-signal-positive">{t.change}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Industry Demand</h2>
          <p className="text-xs text-muted-foreground">Opportunity volume by industry</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={INDUSTRY_DEMAND} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="industry" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="opportunities"
                name="Opportunities"
                fill="var(--signal-info)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Capability Demand</h2>
          <p className="text-xs text-muted-foreground">Opportunities requiring each capability</p>
          <div className="mt-4 space-y-3">
            {CAPABILITY_DEMAND.map((c) => (
              <button
                key={c.capability}
                onClick={() =>
                  navigate({ to: "/opportunities", search: { capability: c.capability } })
                }
                className="grid w-full grid-cols-[9rem_1fr_1.5rem] items-center gap-3 text-left text-sm cursor-pointer"
              >
                <span className="truncate text-muted-foreground">{c.capability}</span>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-signal-positive"
                    style={{ width: `${(c.count / CAPABILITY_DEMAND[0].count) * 100}%` }}
                  />
                </div>
                <span className="text-right text-xs font-medium tabular-nums text-foreground">
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Strategic Signal
            </p>
            <h3 className="mt-0.5 text-base font-semibold text-foreground">
              {STRATEGIC_SIGNAL.title}
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {STRATEGIC_SIGNAL.explanation}
            </p>
            <Button
              className="mt-3"
              size="sm"
              onClick={() =>
                navigate({ to: "/opportunities", search: { capability: "AI Governance" } })
              }
            >
              View contributing opportunities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketMapView() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs text-muted-foreground">
        Industries → Requirements → Technologies. Click an industry to see its opportunities, or a
        technology to explore it in the knowledge graph.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MARKET_MAP.map((group) => (
          <div key={group.industry} className="rounded-lg border border-border p-4">
            <Link
              to="/opportunities"
              search={{ industry: group.industry }}
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              {group.industry}
            </Link>
            <div className="mt-2.5 space-y-2.5 border-l border-border pl-3">
              {group.requirements.map((req) => (
                <div key={req.label}>
                  <p className="text-xs font-medium text-foreground">{req.label}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {req.technologies.map((t) => (
                      <Link
                        key={t}
                        to="/knowledge-graph"
                        search={{ center: technologyNodeId(t) }}
                        className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-primary/40 hover:text-primary"
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkforceView() {
  const [selected, setSelected] = React.useState<AiAgent | null>(null);
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">AI Presales Workforce</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          These are not independent tools. Every capability reads from and writes back to the same
          shared Organizational Intelligence Layer — so what Qualification learns today, Solutioning
          and Trends can use tomorrow.
        </p>
        <div className="mt-6 flex flex-col items-center">
          <div className="rounded-xl border-2 border-primary/30 bg-primary/[0.04] px-6 py-3 text-center">
            <p className="text-sm font-semibold text-foreground">
              Organizational Intelligence Layer
            </p>
          </div>
          <svg width="100%" height="40" className="max-w-3xl">
            <line
              x1="50%"
              y1="0"
              x2="10%"
              y2="40"
              stroke="var(--border)"
              className="presales-flow-line"
            />
            <line
              x1="50%"
              y1="0"
              x2="30%"
              y2="40"
              stroke="var(--border)"
              className="presales-flow-line"
            />
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="40"
              stroke="var(--border)"
              className="presales-flow-line"
            />
            <line
              x1="50%"
              y1="0"
              x2="70%"
              y2="40"
              stroke="var(--border)"
              className="presales-flow-line"
            />
            <line
              x1="50%"
              y1="0"
              x2="90%"
              y2="40"
              stroke="var(--border)"
              className="presales-flow-line"
            />
          </svg>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AI_AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onClick={() => setSelected(agent)} />
          ))}
        </div>
      </div>
      <AgentDetailDialog
        agent={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  );
}

function ArchitectureView() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">
          Organizational Intelligence Layer
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How every new opportunity strengthens the same underlying model.
        </p>

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <Node label="OPPORTUNITIES" />
          <Arrow />
          <div className="flex w-full max-w-2xl items-center justify-between gap-2">
            <Node label="CLIENTS" muted />
            <Arrow horizontal />
            <Node label="INTELLIGENCE" emphasis />
            <Arrow horizontal flip />
            <Node label="PROJECTS" muted />
          </div>
          <Arrow />
          <div className="grid w-full max-w-2xl grid-cols-3 gap-3">
            <Node label="CAPABILITIES" muted />
            <Node label="TECHNOLOGIES" muted />
            <Node label="OUTCOMES" muted />
          </div>
          <Arrow />
          <Node label="DECISION HISTORY" />
          <Arrow />
          <Node label="HUMAN EXPERTISE" />
          <Arrow />
          <Node label="ORGANIZATIONAL MODEL" emphasis />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">
          Every opportunity makes the system smarter
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {[
            "Opportunity",
            "Evidence",
            "AI Assessment",
            "Human Decision",
            "Outcome",
            "Learning",
          ].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span className="rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-foreground">
                {step}
              </span>
              {i < arr.length - 1 ? (
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">How it works</h2>
        <div className="mt-5 flex flex-col items-center gap-2 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            <Node label="CRM" small />
            <Node label="RFPs" small />
            <Node label="Documents" small />
          </div>
          <Arrow />
          <Node label="AI Extraction" />
          <Arrow />
          <Node label="Opportunity Model" />
          <Arrow />
          <Node label="Evidence Layer" />
          <Arrow />
          <Node label="Organizational Intelligence" emphasis />
          <Arrow />
          <div className="flex flex-wrap justify-center gap-3">
            <Node label="Qualification" small />
            <Node label="Trends" small />
            <Node label="Solutioning" small />
          </div>
          <Arrow />
          <Node label="Human Decision" />
          <Arrow />
          <Node label="Outcome" />
          <Arrow />
          <Node label="Learning" />
        </div>
      </div>
    </div>
  );
}

function Node({
  label,
  emphasis,
  muted,
  small,
}: {
  label: string;
  emphasis?: boolean;
  muted?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-4 text-xs font-semibold ${small ? "py-1.5" : "py-2.5"} ${
        emphasis
          ? "border-primary bg-primary text-primary-foreground"
          : muted
            ? "border-border bg-muted/40 text-muted-foreground"
            : "border-border bg-card text-foreground"
      }`}
    >
      {label}
    </div>
  );
}

function Arrow({ horizontal, flip }: { horizontal?: boolean; flip?: boolean }) {
  if (horizontal) {
    return (
      <ArrowRight
        className={`h-4 w-4 shrink-0 text-muted-foreground ${flip ? "rotate-180" : ""}`}
      />
    );
  }
  return <div className="h-5 w-px bg-border" />;
}
