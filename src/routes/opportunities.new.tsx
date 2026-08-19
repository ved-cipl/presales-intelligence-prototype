import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Circle, FileUp, Loader2, Sparkles, UploadCloud, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { DEMO_OPPORTUNITY_ID } from "@/features/presales/data/opportunities";

export const Route = createFileRoute("/opportunities/new")({
  component: NewOpportunityPage,
});

const PROCESSING_STEPS = [
  "Extracting requirements",
  "Identifying technologies",
  "Detecting commercial signals",
  "Mapping organizational capabilities",
  "Finding similar opportunities",
  "Evaluating qualification criteria",
];

const DEMO_BRIEF = {
  client: "National Infrastructure Authority",
  requirement: "Enterprise AI Transformation Platform",
  value: "₹8–12 Cr",
  timeline: "9–12 months",
  type: "New RFP",
  industry: "Government",
};

type Stage = "idle" | "loaded" | "processing" | "done";

function NewOpportunityPage() {
  const navigate = useNavigate();
  const [stage, setStage] = React.useState<Stage>("idle");
  const [stepIndex, setStepIndex] = React.useState(-1);
  const [pasteMode, setPasteMode] = React.useState(false);
  const [pastedText, setPastedText] = React.useState("");

  React.useEffect(() => {
    if (stage !== "processing") return;
    if (stepIndex >= PROCESSING_STEPS.length - 1) {
      const t = setTimeout(() => setStage("done"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 550);
    return () => clearTimeout(t);
  }, [stage, stepIndex]);

  function loadDemo() {
    setStage("loaded");
    setPasteMode(false);
    setTimeout(() => {
      setStage("processing");
      setStepIndex(0);
    }, 400);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Create Opportunity Intelligence"
        subtitle="Turn a raw RFP, requirement document, email or CRM record into a structured intelligence object"
      />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Option A — Upload / Paste</h2>
          {!pasteMode ? (
            <button
              type="button"
              onClick={() => setPasteMode(false)}
              className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.03] cursor-pointer"
            >
              <UploadCloud className="h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Drop RFP, requirement document, email, or opportunity brief
              </p>
              <p className="text-xs text-muted-foreground">Supports PDF, DOCX, Email, Text</p>
            </button>
          ) : (
            <Textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste RFP text, an email thread, or a requirement summary…"
              rows={7}
              className="mt-3"
            />
          )}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPasteMode((v) => !v)}
              className="text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              {pasteMode ? "Use file drop instead" : "Paste opportunity details"}
            </button>
            {pasteMode ? (
              <Button
                size="sm"
                variant="outline"
                disabled={!pastedText.trim()}
                onClick={() => {
                  toast.info("Prototype note", {
                    description:
                      "Pasted text parsing isn't wired up — try “Use Demo Opportunity” to see the full flow.",
                  });
                }}
              >
                <FileUp className="h-3.5 w-3.5" />
                Parse pasted text
              </Button>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Option B — CRM</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Pull a lead or account requirement directly from CRM. In this prototype, CRM import is
            simulated with a demo opportunity so you can see the full extraction and qualification
            flow.
          </p>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() =>
              toast.info("Prototype note", {
                description: "Live CRM import isn't connected — use “Use Demo Opportunity” below.",
              })
            }
          >
            Import from CRM
          </Button>

          <div className="mt-5 rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Use Demo Opportunity</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Loads a fictional government RFP so you can walk through extraction, qualification and
              the knowledge graph end to end.
            </p>
            <Button className="mt-3 w-full" onClick={loadDemo} disabled={stage !== "idle"}>
              <Sparkles className="h-4 w-4" />
              Use Demo Opportunity
            </Button>
          </div>
        </div>
      </div>

      {stage !== "idle" ? (
        <div className="presales-fade-in mt-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Opportunity brief detected
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {DEMO_BRIEF.requirement} — {DEMO_BRIEF.client}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
              <span className="rounded-md border border-border px-2 py-1">{DEMO_BRIEF.type}</span>
              <span className="rounded-md border border-border px-2 py-1">
                {DEMO_BRIEF.industry}
              </span>
              <span className="rounded-md border border-border px-2 py-1">{DEMO_BRIEF.value}</span>
              <span className="rounded-md border border-border px-2 py-1">
                {DEMO_BRIEF.timeline}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {PROCESSING_STEPS.map((step, i) => {
              const active = stage === "processing" && i === stepIndex;
              const isComplete = stage === "done" || i < stepIndex;
              return (
                <div key={step} className="flex items-center gap-2.5 text-sm">
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-signal-positive" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-signal-info" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
                  <span
                    className={
                      isComplete
                        ? "text-foreground"
                        : active
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                    }
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {stage === "done" ? (
            <div className="presales-fade-in mt-5 flex items-center justify-between rounded-lg border border-signal-positive/25 bg-signal-positive/[0.06] p-4">
              <p className="text-sm text-foreground">
                Structured opportunity intelligence object ready — 14 evidence points extracted, 4
                capabilities mapped, 3 similar opportunities found.
              </p>
              <Button
                onClick={() =>
                  navigate({
                    to: "/opportunities/$id",
                    params: { id: DEMO_OPPORTUNITY_ID },
                  })
                }
              >
                Generate Opportunity Intelligence
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </PageContainer>
  );
}
