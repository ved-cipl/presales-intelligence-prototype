import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { CreateDomainWizard } from "@/features/presales/components/knowledge/CreateDomainWizard";
import { KNOWLEDGE_DOMAINS, type KnowledgeDomain, type TrustLevel } from "@/features/presales/data/knowledge-domains";
import { sourcesForDomain } from "@/features/presales/data/knowledge-sources";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge/domains/")({
  component: KnowledgeDomainsPage,
});

const TRUST_TONE: Record<TrustLevel, string> = {
  Authoritative: "border-signal-positive/25 bg-signal-positive/10 text-signal-positive",
  Verified: "border-signal-info/25 bg-signal-info/10 text-signal-info",
  Reference: "border-signal-warning/30 bg-signal-warning/15 text-amber-700 dark:text-signal-warning",
  Unverified: "border-signal-risk/25 bg-signal-risk/10 text-signal-risk",
};

function healthColor(health: number) {
  if (health >= 85) return "bg-signal-positive";
  if (health >= 65) return "bg-signal-warning";
  return "bg-signal-risk";
}

function KnowledgeDomainsPage() {
  const [domains, setDomains] = React.useState<KnowledgeDomain[]>(KNOWLEDGE_DOMAINS);
  const [wizardOpen, setWizardOpen] = React.useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Knowledge Domains"
        subtitle="Configurable domains of organizational knowledge the AI reasons over"
        actions={
          <Button size="sm" onClick={() => setWizardOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Create Knowledge Domain
          </Button>
        }
      />

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {domains.map((d) => {
          const sourceCount = d.sourceCount || sourcesForDomain(d.id).length;
          return (
            <Link
              key={d.id}
              to="/knowledge/domains/$id"
              params={{ id: d.id }}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-ring"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-snug text-foreground">{d.name}</h3>
                  <span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold", TRUST_TONE[d.trustLevel])}>
                    {d.trustLevel}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{d.description}</p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border p-2.5">
                    <p className="text-[10px] font-medium text-muted-foreground">{d.recordLabel}</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                      {d.recordCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-2.5">
                    <p className="text-[10px] font-medium text-muted-foreground">Sources</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{sourceCount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-muted-foreground">Knowledge health</span>
                  <span className="font-semibold tabular-nums text-foreground">{d.health}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", healthColor(d.health))} style={{ width: `${d.health}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <CreateDomainWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onCreate={(domain) => setDomains((prev) => [...prev, domain])}
      />
    </PageContainer>
  );
}
