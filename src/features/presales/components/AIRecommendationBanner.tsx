import * as React from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/features/presales/components/badges";
import { WhyPanel } from "@/features/presales/components/WhyPanel";
import { DecisionModal } from "@/features/presales/components/DecisionModal";
import type { Opportunity } from "@/features/presales/data/types";

export function AIRecommendationBanner({ opportunity }: { opportunity: Opportunity }) {
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [decisionOpen, setDecisionOpen] = React.useState(false);
  const latestDecision = opportunity.decisions[opportunity.decisions.length - 1];

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Recommended
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {opportunity.recommendation}
              </h2>
              <ConfidenceBadge value={opportunity.confidence} />
            </div>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {opportunity.whyReasons.find((r) => r.polarity === "negative")
                ? `${opportunity.whyReasons
                    .filter((r) => r.polarity === "positive")
                    .map((r) => r.title.toLowerCase())
                    .slice(0, 2)
                    .join(" and ")}, but ${opportunity.whyReasons
                    .filter((r) => r.polarity === "negative")
                    .map((r) => r.title.toLowerCase())
                    .join(" and ")} remain unresolved.`
                : "Strong alignment across assessed dimensions."}
            </p>
            {latestDecision ? (
              <p className="mt-2 text-xs font-medium text-signal-positive">
                Human decision recorded: {latestDecision.humanDecision} — {latestDecision.decidedBy}{" "}
                · {latestDecision.date}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={() => setWhyOpen(true)}>
            Review Assessment
          </Button>
          <Button onClick={() => setDecisionOpen(true)}>Override Decision</Button>
        </div>
      </div>
      <WhyPanel opportunity={opportunity} open={whyOpen} onOpenChange={setWhyOpen} />
      <DecisionModal opportunity={opportunity} open={decisionOpen} onOpenChange={setDecisionOpen} />
    </div>
  );
}
