import { Link } from "@tanstack/react-router";

import { domainUsageForPolicy } from "@/features/presales/data/decision-designer";
import { getKnowledgeDomain, type TrustLevel } from "@/features/presales/data/knowledge-domains";
import { cn } from "@/lib/utils";

const TRUST_TONE: Record<TrustLevel, string> = {
  Authoritative: "border-signal-positive/25 bg-signal-positive/10 text-signal-positive",
  Verified: "border-signal-info/25 bg-signal-info/10 text-signal-info",
  Reference: "border-signal-warning/30 bg-signal-warning/15 text-amber-700 dark:text-signal-warning",
  Unverified: "border-signal-risk/25 bg-signal-risk/10 text-signal-risk",
};

export function KnowledgeUsedCard({ policyId = "qualification-v1-4" }: { policyId?: string }) {
  const usage = domainUsageForPolicy(policyId)
    .map((u) => ({ ...u, domain: getKnowledgeDomain(u.domainId) }))
    .filter((u) => !!u.domain);

  if (usage.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Knowledge Used</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Knowledge domains the AI drew on to assess this opportunity
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {usage.map((u) => (
          <Link
            key={u.domainId}
            to="/knowledge/domains/$id"
            params={{ id: u.domainId }}
            className="rounded-lg border border-border p-3 transition-colors hover:border-ring hover:bg-accent/40"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{u.domain!.name}</p>
              <span className={cn("shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold", TRUST_TONE[u.domain!.trustLevel])}>
                {u.domain!.trustLevel}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Used for: {u.usedByNodes.join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
