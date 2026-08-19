import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, type LucideIcon } from "lucide-react";
import { Blocks, Database, GitBranch, Sparkles } from "lucide-react";

import { PageContainer } from "@/features/presales/components/PageHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/platform")({
  component: PlatformPage,
});

interface Layer {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  items: { label: string; to: string }[];
}

const LAYERS: Layer[] = [
  {
    id: "knowledge",
    eyebrow: "Layer 1 — Knowledge",
    title: "Define what we know",
    description:
      "Organizational knowledge — client relationships, delivery history, capabilities and market signals — is captured as configurable domains with explicit trust levels, not buried in disconnected documents.",
    icon: Database,
    accent: "border-signal-info/30 bg-signal-info/[0.05]",
    items: [
      { label: "Knowledge Domains", to: "/knowledge/domains" },
      { label: "Knowledge Sources", to: "/knowledge/sources" },
      { label: "Knowledge Graph", to: "/knowledge-graph" },
    ],
  },
  {
    id: "decision",
    eyebrow: "Layer 2 — Decision Logic",
    title: "Define how we decide",
    description:
      "Qualification and pursuit decisions are governed by visual, versioned policies — not tribal knowledge in someone's head. Every branch, threshold and knowledge dependency is explicit and editable.",
    icon: GitBranch,
    accent: "border-primary/25 bg-primary/[0.04]",
    items: [
      { label: "Decision Designer", to: "/decision-designer" },
      { label: "Decision Policies", to: "/decision-policies" },
      { label: "Decision Analytics", to: "/decision-analytics" },
    ],
  },
  {
    id: "reasoning",
    eyebrow: "Layer 3 — AI Reasoning",
    title: "Let AI execute the reasoning",
    description:
      "The AI walks the decision policy against real evidence and organizational knowledge — scoring, checking evidence, and routing to a human wherever confidence is insufficient. It never invents its own standard.",
    icon: Sparkles,
    accent: "border-signal-warning/30 bg-signal-warning/[0.05]",
    items: [
      { label: "Qualification Standards", to: "/qualification" },
      { label: "Opportunities", to: "/opportunities" },
    ],
  },
  {
    id: "outcomes",
    eyebrow: "Layer 4 — Outcomes",
    title: "Decisions humans can trust and override",
    description:
      "Every AI decision ships with confidence, decisive factors, blocking unknowns and a next action — plus a full trace back through the policy and the knowledge it relied on. Humans stay in control.",
    icon: Blocks,
    accent: "border-signal-positive/30 bg-signal-positive/[0.05]",
    items: [
      { label: "Overview Dashboard", to: "/dashboard" },
      { label: "Decision Analytics", to: "/decision-analytics" },
    ],
  },
];

function PlatformPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Platform Architecture
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Define what we know. Define how we decide.
          <br />
          Let AI execute the reasoning.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The Presales Intelligence System separates organizational knowledge, decision logic and
          AI execution into distinct, configurable layers — so both can evolve independently, and
          every decision stays explainable.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col items-stretch gap-0">
        {LAYERS.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <div key={layer.id} className="flex flex-col items-center">
              <div className={cn("w-full rounded-xl border p-5 shadow-sm", layer.accent)}>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
                    <Icon className="h-4 w-4 text-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {layer.eyebrow}
                    </p>
                    <h2 className="text-base font-semibold text-foreground">{layer.title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">{layer.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {layer.items.map((it) => (
                        <Link
                          key={it.to}
                          to={it.to}
                          className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {i < LAYERS.length - 1 ? (
                <ArrowDown className="my-2 h-4 w-4 shrink-0 text-muted-foreground" />
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
        This prototype demonstrates the architecture with mock data and simulated reasoning — no
        production LLM calls, document ingestion or workflow execution are wired up.
      </p>
    </PageContainer>
  );
}
