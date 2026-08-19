import { createFileRoute, Link } from "@tanstack/react-router";

import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { domainLabel, type TrustLevel } from "@/features/presales/data/knowledge-domains";
import { KNOWLEDGE_SOURCES } from "@/features/presales/data/knowledge-sources";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge/sources")({
  component: KnowledgeSourcesPage,
});

const TRUST_TONE: Record<TrustLevel, string> = {
  Authoritative: "border-signal-positive/25 bg-signal-positive/10 text-signal-positive",
  Verified: "border-signal-info/25 bg-signal-info/10 text-signal-info",
  Reference: "border-signal-warning/30 bg-signal-warning/15 text-amber-700 dark:text-signal-warning",
  Unverified: "border-signal-risk/25 bg-signal-risk/10 text-signal-risk",
};

const STATUS_TONE: Record<string, string> = {
  Connected: "border-signal-positive/25 bg-signal-positive/10 text-signal-positive",
  Syncing: "border-signal-info/25 bg-signal-info/10 text-signal-info",
  Error: "border-signal-risk/25 bg-signal-risk/10 text-signal-risk",
  "Not Connected": "border-border bg-muted text-muted-foreground",
};

function KnowledgeSourcesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Knowledge Sources"
        subtitle="Every connected system feeding organizational knowledge into the AI"
      />

      <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Domain</th>
              <th className="px-4 py-2.5">Type</th>
              <th className="px-4 py-2.5">Documents</th>
              <th className="px-4 py-2.5">Last Sync</th>
              <th className="px-4 py-2.5">Trust Level</th>
              <th className="px-4 py-2.5">Health</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {KNOWLEDGE_SOURCES.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2.5 font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-2.5">
                  <Link
                    to="/knowledge/domains/$id"
                    params={{ id: s.domainId }}
                    className="text-signal-info hover:underline"
                  >
                    {domainLabel(s.domainId)}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{s.type}</td>
                <td className="px-4 py-2.5 tabular-nums text-foreground">{s.documentCount.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{s.lastSync}</td>
                <td className="px-4 py-2.5">
                  <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-semibold", TRUST_TONE[s.trustLevel])}>
                    {s.trustLevel}
                  </span>
                </td>
                <td className="px-4 py-2.5 tabular-nums text-foreground">{s.health}%</td>
                <td className="px-4 py-2.5">
                  <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-semibold", STATUS_TONE[s.status])}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
