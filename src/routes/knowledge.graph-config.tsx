import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import {
  GRAPH_ENTITY_CONFIGS,
  GRAPH_PIPELINE,
  GRAPH_RELATIONSHIP_CONFIGS,
  type GraphEntityConfig,
  type GraphRelationshipConfig,
} from "@/features/presales/data/knowledge-graph-config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge/graph-config")({
  component: KnowledgeGraphConfigPage,
});

function KnowledgeGraphConfigPage() {
  const [activeStage, setActiveStage] = React.useState(GRAPH_PIPELINE[0].id);
  const [entities, setEntities] = React.useState<GraphEntityConfig[]>(GRAPH_ENTITY_CONFIGS);
  const [relationships, setRelationships] = React.useState<GraphRelationshipConfig[]>(GRAPH_RELATIONSHIP_CONFIGS);
  const [from, setFrom] = React.useState(entities[0]?.name ?? "");
  const [relation, setRelation] = React.useState("");
  const [to, setTo] = React.useState(entities[1]?.name ?? "");

  const stage = GRAPH_PIPELINE.find((s) => s.id === activeStage)!;

  function toggleEntity(id: string) {
    setEntities((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: e.status === "Active" ? "Paused" : "Active" } : e)),
    );
  }

  function addRelationship() {
    if (!relation.trim()) {
      toast.error("Enter a relationship label first.");
      return;
    }
    setRelationships((prev) => [
      ...prev,
      {
        id: `rel-custom-${Date.now()}`,
        from,
        relation: relation.trim(),
        to,
        confidence: 0,
        source: "Newly configured — not yet indexed",
      },
    ]);
    setRelation("");
    toast.success("Relationship added", { description: `${from} → ${relation.trim()} → ${to}` });
  }

  return (
    <PageContainer>
      <PageHeader
        title="Knowledge Graph Configuration"
        subtitle="How raw sources become the connected organizational knowledge graph"
      />

      <div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Pipeline</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {GRAPH_PIPELINE.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                type="button"
                onClick={() => setActiveStage(s.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer",
                  activeStage === s.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-foreground hover:bg-accent",
                )}
              >
                {s.name}
              </button>
              {i < GRAPH_PIPELINE.length - 1 ? (
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              ) : null}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-signal-info/25 bg-signal-info/[0.04] p-3.5">
          <p className="text-sm font-semibold text-foreground">{stage.name}</p>
          <p className="mt-1 text-xs text-foreground">{stage.description}</p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">{stage.detail}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Entity Configuration</h2>
          <p className="text-xs text-muted-foreground">Which entity types the graph tracks, and where they're sourced from.</p>
          <div className="mt-3 space-y-2">
            {entities.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{e.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{e.source}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleEntity(e.id)}
                  className={cn(
                    "shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer",
                    e.status === "Active"
                      ? "border-signal-positive/25 bg-signal-positive/10 text-signal-positive"
                      : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {e.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Relationship Types</h2>
          <p className="text-xs text-muted-foreground">Connections the graph detects between entities.</p>
          <div className="mt-3 space-y-2">
            {relationships.map((r) => (
              <div key={r.id} className="rounded-lg border border-border px-3 py-2">
                <p className="text-sm font-medium text-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5">{r.from}</span>
                  <span className="mx-1.5 text-muted-foreground">{r.relation}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5">{r.to}</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {r.source} · {r.confidence}% confidence
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2.5 border-t border-border pt-3.5">
            <Label className="text-xs font-medium">Add Relationship</Label>
            <div className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((e) => (
                    <SelectItem key={e.id} value={e.name}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={relation}
                onChange={(ev) => setRelation(ev.target.value)}
                placeholder="relation"
                className="text-sm"
              />
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((e) => (
                    <SelectItem key={e.id} value={e.name}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={addRelationship} className="col-span-2 sm:col-span-1">
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
