import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";

import { PageContainer } from "@/features/presales/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getKnowledgeDomain, type TrustLevel } from "@/features/presales/data/knowledge-domains";
import { sourcesForDomain } from "@/features/presales/data/knowledge-sources";
import { cn } from "@/lib/utils";

const TABS = ["overview", "sources", "entities", "relationships", "quality", "usage"] as const;

export const Route = createFileRoute("/knowledge/domains/$id")({
  validateSearch: z.object({ tab: z.enum(TABS).optional() }),
  loader: ({ params }) => {
    const domain = getKnowledgeDomain(params.id);
    if (!domain) throw notFound();
    return { name: domain.name };
  },
  component: KnowledgeDomainDetailPage,
});

const TRUST_TONE: Record<TrustLevel, string> = {
  Authoritative: "border-signal-positive/25 bg-signal-positive/10 text-signal-positive",
  Verified: "border-signal-info/25 bg-signal-info/10 text-signal-info",
  Reference: "border-signal-warning/30 bg-signal-warning/15 text-amber-700 dark:text-signal-warning",
  Unverified: "border-signal-risk/25 bg-signal-risk/10 text-signal-risk",
};

const SOURCE_STATUS_TONE: Record<string, string> = {
  Connected: "border-signal-positive/25 bg-signal-positive/10 text-signal-positive",
  Syncing: "border-signal-info/25 bg-signal-info/10 text-signal-info",
  Error: "border-signal-risk/25 bg-signal-risk/10 text-signal-risk",
  "Not Connected": "border-border bg-muted text-muted-foreground",
};

const QUALITY_METRICS: { key: "completeness" | "evidenceQuality" | "humanVerified" | "staleInformation" | "conflictingInformation" | "missingMetadata"; label: string; goodDirection: "high" | "low" }[] = [
  { key: "completeness", label: "Completeness", goodDirection: "high" },
  { key: "evidenceQuality", label: "Evidence Quality", goodDirection: "high" },
  { key: "humanVerified", label: "Human Verified", goodDirection: "high" },
  { key: "staleInformation", label: "Stale Information", goodDirection: "low" },
  { key: "conflictingInformation", label: "Conflicting Information", goodDirection: "low" },
  { key: "missingMetadata", label: "Missing Metadata", goodDirection: "low" },
];

function metricColor(value: number, goodDirection: "high" | "low") {
  const good = goodDirection === "high" ? value >= 80 : value <= 15;
  const bad = goodDirection === "high" ? value < 60 : value > 25;
  if (good) return "bg-signal-positive";
  if (bad) return "bg-signal-risk";
  return "bg-signal-warning";
}

function KnowledgeDomainDetailPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const domain = getKnowledgeDomain(id)!;
  const sources = sourcesForDomain(id);
  const tab = search.tab ?? "overview";
  const setTab = (t: string) =>
    navigate({ to: "/knowledge/domains/$id", params: { id }, search: { tab: t as (typeof TABS)[number] } });

  return (
    <PageContainer>
      <Link to="/knowledge/domains" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Knowledge Domains
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{domain.name}</h1>
            <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-semibold", TRUST_TONE[domain.trustLevel])}>
              {domain.trustLevel}
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{domain.description}</p>
        </div>
        <div className="shrink-0 rounded-lg border border-border bg-card px-3.5 py-2.5 text-right shadow-sm">
          <p className="text-[10px] font-medium text-muted-foreground">Knowledge Health</p>
          <p className="text-xl font-semibold tabular-nums text-foreground">{domain.health}%</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Domain Profile</h2>
              <dl className="mt-3 space-y-2.5 text-sm">
                {[
                  ["Owner", domain.owner],
                  ["Refresh Frequency", domain.refreshFrequency],
                  ["Access Level", domain.accessLevel],
                  ["Last Updated", domain.lastUpdated],
                  [domain.recordLabel, domain.recordCount.toLocaleString()],
                  ["Sources", String(domain.sourceCount || sources.length)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Used By</h2>
              {domain.usedBy.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {domain.usedBy.map((u) => (
                    <li key={u} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground">
                      {u}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Not yet referenced by any decision policy or AI agent.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="pt-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2.5">Source</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Documents</th>
                  <th className="px-4 py-2.5">Last Sync</th>
                  <th className="px-4 py-2.5">Health</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sources.length > 0 ? (
                  sources.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-2.5 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{s.type}</td>
                      <td className="px-4 py-2.5 tabular-nums text-foreground">{s.documentCount.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{s.lastSync}</td>
                      <td className="px-4 py-2.5 tabular-nums text-foreground">{s.health}%</td>
                      <td className="px-4 py-2.5">
                        <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-semibold", SOURCE_STATUS_TONE[s.status])}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No sources connected yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="entities" className="pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {domain.entities.length > 0 ? (
              domain.entities.map((e) => (
                <div key={e.name} className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{e.name}</p>
                    <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {e.type}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{e.count} instances</span>
                    <span className="font-semibold tabular-nums text-foreground">{e.confidence}% confidence</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No entity types configured yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="relationships" className="pt-4">
          <div className="space-y-2.5">
            {domain.relationships.length > 0 ? (
              domain.relationships.map((r, i) => (
                <div key={`${r.from}-${r.relation}-${i}`} className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
                  <p className="text-sm font-medium text-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5">{r.from}</span>
                    <span className="mx-1.5 text-muted-foreground">{r.relation}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5">{r.to}</span>
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Source: {r.source} · Confidence: <span className="font-semibold text-foreground">{r.confidence}%</span>
                  </p>
                  {r.method ? <p className="mt-1 text-[11px] text-muted-foreground">{r.method}</p> : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No relationships configured yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quality" className="pt-4">
          <div className="rounded-xl border border-dashed border-signal-warning/30 bg-signal-warning/[0.04] p-3 text-xs leading-relaxed text-foreground">
            This domain is not perfectly accurate. The system tracks what it doesn't know as honestly as what it does.
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {QUALITY_METRICS.map((m) => {
              const value = domain.healthDetail[m.key];
              return (
                <div key={m.key} className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{m.label}</span>
                    <span className="font-semibold tabular-nums text-foreground">{value}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", metricColor(value, m.goodDirection))} style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="pt-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Referenced By</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Decision policy nodes and AI agents that read from this domain.
            </p>
            {domain.usedBy.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {domain.usedBy.map((u) => (
                  <span key={u} className="rounded-full border border-signal-info/25 bg-signal-info/10 px-2.5 py-1 text-xs font-medium text-signal-info">
                    {u}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Not yet referenced.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
