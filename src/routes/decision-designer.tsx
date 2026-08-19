import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageContainer } from "@/features/presales/components/PageHeader";
import {
  DecisionDesignerCanvas,
  type DecisionDesignerHandle,
} from "@/features/presales/components/decision-designer/DecisionDesignerCanvas";
import { PolicyHeader } from "@/features/presales/components/decision-designer/PolicyHeader";
import { SimulatePanel } from "@/features/presales/components/decision-designer/SimulatePanel";
import { ValidatePanel } from "@/features/presales/components/decision-designer/ValidatePanel";
import { DECISION_POLICIES, getPolicy } from "@/features/presales/data/decision-designer";
import type { SimulationResult } from "@/features/presales/data/decision-simulation";

export const Route = createFileRoute("/decision-designer")({
  validateSearch: z.object({ policy: z.string().optional() }),
  component: DecisionDesignerPage,
});

function DecisionDesignerPage() {
  const { policy: policyId } = Route.useSearch();
  const policy = getPolicy(policyId ?? "") ?? DECISION_POLICIES[0];

  const handleRef = React.useRef<DecisionDesignerHandle | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const [validateOpen, setValidateOpen] = React.useState(false);
  const [simulateOpen, setSimulateOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [simResult, setSimResult] = React.useState<SimulationResult | null>(null);

  return (
    <PageContainer fluid>
      <div className="flex h-full min-h-0 flex-col">
        <PolicyHeader
          policy={policy}
          dirty={dirty}
          onSaveDraft={() => {
            setDirty(false);
            toast.success("Draft saved", { description: `${policy.name} v${policy.version} saved as draft.` });
          }}
          onValidate={() => setValidateOpen(true)}
          onSimulate={() => setSimulateOpen(true)}
          onPublish={() => setValidateOpen(true)}
          onVersionHistory={() => setHistoryOpen(true)}
        />

        <div className="min-h-0 flex-1">
          <DecisionDesignerCanvas
            key={policy.id}
            policy={policy}
            highlightPath={simResult?.path ?? null}
            edgeOutcomes={simResult?.edgeOutcomes ?? null}
            handleRef={handleRef}
          />
        </div>
      </div>

      <ValidatePanel
        open={validateOpen}
        onOpenChange={setValidateOpen}
        onPublish={() => {
          setDirty(false);
          toast.success("Policy published", {
            description: `${policy.name} v${policy.version} is now live for new opportunity qualification.`,
          });
        }}
      />

      <SimulatePanel
        open={simulateOpen}
        onOpenChange={setSimulateOpen}
        onSimulate={(result) => setSimResult(result)}
      />

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>{policy.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">v{policy.version} — Current</span>
              <span className="text-xs text-muted-foreground">{policy.lastUpdated}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              <span>v1.3</span>
              <span className="text-xs">02 Jul 2026</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              <span>v1.2</span>
              <span className="text-xs">14 May 2026</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
