import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfidenceBadge } from "@/features/presales/components/badges";
import { NODE_TYPE_META, nodesForPolicyPath } from "@/features/presales/data/decision-designer";
import { simulateQualificationV14 } from "@/features/presales/data/decision-simulation";

const DECISION_TONE: Record<string, string> = {
  GO: "text-signal-positive",
  "NO-GO": "text-signal-risk",
  "DISCOVERY REQUIRED": "text-signal-warning",
};

export function DecisionTracePanel({
  open,
  onOpenChange,
  opportunityId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunityId: string;
}) {
  const navigate = useNavigate();
  const result = simulateQualificationV14(opportunityId);
  const steps = result ? nodesForPolicyPath("qualification-v1-4", result.path) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Decision Trace</DialogTitle>
          <DialogDescription>How Qualification Policy v1.4 reached this decision</DialogDescription>
        </DialogHeader>

        {result ? (
          <>
            <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
              {steps.map((step, i) => {
                const outcome = result.edgeOutcomes[step.id];
                return (
                  <div key={step.id} className="flex items-start gap-2">
                    <div className="flex flex-col items-center pt-1">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      {i < steps.length - 1 ? <span className="my-0.5 h-4 w-px bg-border" /> : null}
                    </div>
                    <div className="min-w-0 flex-1 pb-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{step.name}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {NODE_TYPE_META[step.type].label}
                        </span>
                      </div>
                      {outcome ? (
                        <span className="mt-0.5 inline-block rounded bg-signal-info/10 px-1.5 py-0.5 text-[10px] font-semibold text-signal-info">
                          {outcome}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2.5 rounded-lg border border-border bg-muted/30 p-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Final Decision</p>
                <p className={`text-base font-bold ${DECISION_TONE[result.finalDecision]}`}>
                  {result.finalDecision}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Confidence</p>
                <ConfidenceBadge value={result.confidence} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Reason</p>
                <p className="text-sm text-foreground">{result.reason}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Next Action</p>
                <p className="text-sm text-foreground">{result.nextAction}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No decision trace available for this opportunity.</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate({ to: "/decision-designer", search: { policy: "qualification-v1-4" } });
            }}
          >
            <GitBranch className="h-3.5 w-3.5" />
            Open in Decision Designer
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
