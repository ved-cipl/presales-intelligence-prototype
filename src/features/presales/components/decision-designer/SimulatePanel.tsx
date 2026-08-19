import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfidenceBadge } from "@/features/presales/components/badges";
import { OPPORTUNITIES } from "@/features/presales/data/opportunities";
import {
  PORTFOLIO_SIMULATION,
  simulateAllOpportunities,
  simulateQualificationV14,
  type SimulationResult,
} from "@/features/presales/data/decision-simulation";

const DECISION_TONE: Record<SimulationResult["finalDecision"], string> = {
  GO: "text-signal-positive",
  "NO-GO": "text-signal-risk",
  "DISCOVERY REQUIRED": "text-signal-warning",
};

export function SimulatePanel({
  open,
  onOpenChange,
  onSimulate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSimulate: (result: SimulationResult | null) => void;
}) {
  const navigate = useNavigate();
  const [opportunityId, setOpportunityId] = React.useState(OPPORTUNITIES[0].id);
  const [result, setResult] = React.useState<SimulationResult | null>(null);
  const [whatIfOn, setWhatIfOn] = React.useState(false);
  const [whatIfResult, setWhatIfResult] = React.useState<SimulationResult | null>(null);

  function runSingle() {
    const r = simulateQualificationV14(opportunityId);
    setResult(r);
    setWhatIfOn(false);
    setWhatIfResult(null);
    onSimulate(r);
  }

  function runWhatIf() {
    const r = simulateQualificationV14(opportunityId, { competitivePosition: "Low" });
    setWhatIfResult(r);
    setWhatIfOn(true);
    onSimulate(r);
  }

  const batch = React.useMemo(() => simulateAllOpportunities(), []);

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) onSimulate(null);
      }}
    >
      <SheetContent side="right" className="w-[440px] overflow-y-auto sm:max-w-[440px]">
        <SheetHeader>
          <SheetTitle>Simulate</SheetTitle>
          <SheetDescription>Run this policy against real or hypothetical opportunity data.</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="single" className="mt-4 px-1">
          <TabsList className="w-full">
            <TabsTrigger value="single" className="flex-1">
              Single Opportunity
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex-1">
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground">Select Opportunity</p>
              <Select value={opportunityId} onValueChange={setOpportunityId}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPPORTUNITIES.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={runSingle}>
              <Play className="h-3.5 w-3.5" />
              Run Decision
            </Button>

            {result ? (
              <div className="presales-fade-in space-y-3 rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Decision Trace</p>
                <div>
                  <p className="text-[11px] text-muted-foreground">Final Decision</p>
                  <p className={`text-base font-bold ${DECISION_TONE[result.finalDecision]}`}>{result.finalDecision}</p>
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
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onOpenChange(false);
                    navigate({ to: "/opportunities/$id", params: { id: opportunityId } });
                  }}
                >
                  Open Opportunity
                </Button>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-signal-info" />
                    <p className="text-xs font-semibold text-foreground">What If?</p>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Current: <span className="font-medium text-foreground">Competition = Unknown</span> → change to{" "}
                    <span className="font-medium text-foreground">Competition = Strong</span>
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" onClick={runWhatIf}>
                    Run What-If
                  </Button>
                </div>

                {whatIfOn && whatIfResult ? (
                  <div className="presales-fade-in space-y-2 rounded-lg border border-dashed border-signal-info/40 bg-signal-info/[0.05] p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Current Decision</span>
                      <span className={`font-bold ${DECISION_TONE[result.finalDecision]}`}>{result.finalDecision}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Simulated Decision</span>
                      <span className={`font-bold ${DECISION_TONE[whatIfResult.finalDecision]}`}>
                        {whatIfResult.finalDecision}
                      </span>
                    </div>
                    <p className="border-t border-signal-info/20 pt-2 text-[11px] leading-relaxed text-foreground">
                      <span className="font-semibold">Impact:</span> {whatIfResult.reason}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4 pt-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Illustrative simulation using prototype data — not a real organizational measurement.
            </p>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-foreground">
                {PORTFOLIO_SIMULATION.totalEvaluated} Opportunities Evaluated
              </p>
              <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-signal-positive">GO</span>
                  <span className="font-semibold tabular-nums">{PORTFOLIO_SIMULATION.go}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-signal-warning">DISCOVERY REQUIRED</span>
                  <span className="font-semibold tabular-nums">{PORTFOLIO_SIMULATION.discoveryRequired}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-signal-risk">NO-GO</span>
                  <span className="font-semibold tabular-nums">{PORTFOLIO_SIMULATION.noGo}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-foreground">Presales Capacity Impact</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground">Before</p>
                  <p className="text-sm font-bold text-foreground">{PORTFOLIO_SIMULATION.hoursBefore} hrs</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">After</p>
                  <p className="text-sm font-bold text-foreground">{PORTFOLIO_SIMULATION.hoursAfter} hrs</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Released</p>
                  <p className="text-sm font-bold text-signal-positive">{PORTFOLIO_SIMULATION.hoursReleased} hrs</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Current portfolio ({batch.length} opportunities)
              </p>
              <div className="mt-2 space-y-1.5">
                {batch.map(({ opportunity, result: r }) => (
                  <div key={opportunity.id} className="flex items-center justify-between rounded-md border border-border px-2.5 py-1.5 text-xs">
                    <span className="truncate text-foreground">{opportunity.name}</span>
                    <span className={`ml-2 shrink-0 font-semibold ${DECISION_TONE[r.finalDecision]}`}>{r.finalDecision}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
