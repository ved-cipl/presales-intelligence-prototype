import * as React from "react";
import { ArrowRight, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getKnowledgeDomain } from "@/features/presales/data/knowledge-domains";
import { NODE_TYPE_META, type DesignerEdge, type DesignerField, type DesignerNode } from "@/features/presales/data/decision-designer";

function toArray(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function FieldEditor({
  field,
  onChange,
}: {
  field: DesignerField;
  onChange: (value: string) => void;
}) {
  if (field.kind === "textarea") {
    return <Textarea value={field.value} onChange={(e) => onChange(e.target.value)} rows={3} className="text-sm" />;
  }
  if (field.kind === "select") {
    return (
      <Select value={field.value} onValueChange={onChange}>
        <SelectTrigger className="text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(field.options ?? []).map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (field.kind === "percent") {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={100}
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm"
        />
        <span className="text-sm text-muted-foreground">%</span>
      </div>
    );
  }
  if (field.kind === "multiselect") {
    const selected = new Set(toArray(field.value));
    return (
      <div className="flex flex-wrap gap-1.5">
        {(field.options ?? []).map((opt) => {
          const active = selected.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                const next = new Set(selected);
                if (next.has(opt)) next.delete(opt);
                else next.add(opt);
                onChange(Array.from(next).join(", "));
              }}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-accent",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  }
  return <Input value={field.value} onChange={(e) => onChange(e.target.value)} className="text-sm" />;
}

export function NodeConfigPanel({
  node,
  edge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteNode,
  onDeleteEdge,
  onClose,
}: {
  node: DesignerNode | null;
  edge: DesignerEdge | null;
  onUpdateNode: (nodeId: string, updater: (n: DesignerNode) => DesignerNode) => void;
  onUpdateEdge: (edgeId: string, updater: (e: DesignerEdge) => DesignerEdge) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onClose: () => void;
}) {
  const [impactOpen, setImpactOpen] = React.useState(false);

  if (!node && !edge) {
    return (
      <div className="flex h-full w-80 shrink-0 flex-col items-center justify-center border-l border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-foreground">No node selected</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Click a node or connector on the canvas to configure it.
        </p>
      </div>
    );
  }

  if (edge) {
    return (
      <div className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Transition Rule</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Branch Label</Label>
            <Input
              value={edge.label ?? ""}
              onChange={(e) => onUpdateEdge(edge.id, (prev) => ({ ...prev, label: e.target.value }))}
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Transition Rule</Label>
            <Textarea
              value={edge.rule ?? ""}
              placeholder="IF Capability Fit >= Medium"
              onChange={(e) => onUpdateEdge(edge.id, (prev) => ({ ...prev, rule: e.target.value }))}
              rows={3}
              className="text-sm"
            />
          </div>
          <Button variant="outline" className="w-full text-signal-risk hover:text-signal-risk" onClick={() => onDeleteEdge(edge.id)}>
            <Trash2 className="h-3.5 w-3.5" />
            Remove Connection
          </Button>
        </div>
      </div>
    );
  }

  const n = node!;
  const domains = n.knowledgeDomainIds.map((id) => getKnowledgeDomain(id)).filter(Boolean);

  return (
    <div className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {NODE_TYPE_META[n.type].label}
          </p>
          <p className="text-sm font-semibold text-foreground">{n.name}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {n.fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label className="text-xs font-medium">{field.label}</Label>
            <FieldEditor
              field={field}
              onChange={(value) =>
                onUpdateNode(n.id, (prev) => {
                  const nextFields = prev.fields.map((f) => (f.key === field.key ? { ...f, value } : f));
                  const nextName = field.key === "name" || field.key === "assessment" ? value : prev.name;
                  return { ...prev, fields: nextFields, name: nextName };
                })
              }
            />
          </div>
        ))}

        {domains.length > 0 ? (
          <div className="rounded-lg border border-signal-info/25 bg-signal-info/[0.04] p-3">
            <p className="text-xs font-semibold text-signal-info">Knowledge dependency</p>
            <p className="mt-1 text-[11px] leading-relaxed text-foreground">
              This decision uses information from {domains.length} knowledge{" "}
              {domains.length === 1 ? "domain" : "domains"}.
            </p>
            <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => setImpactOpen(true)}>
              View Knowledge Impact
            </Button>
          </div>
        ) : null}

        <div className="border-t border-border pt-3">
          <Label className="text-xs font-medium">Status</Label>
          <Select
            value={n.status}
            onValueChange={(v) => onUpdateNode(n.id, (prev) => ({ ...prev, status: v as DesignerNode["status"] }))}
          >
            <SelectTrigger className="mt-1.5 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Configured">Configured</SelectItem>
              <SelectItem value="Needs Attention">Needs Attention</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full text-signal-risk hover:text-signal-risk" onClick={() => onDeleteNode(n.id)}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete Node
        </Button>
      </div>

      <Dialog open={impactOpen} onOpenChange={setImpactOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Knowledge Impact</DialogTitle>
            <DialogDescription>How {n.name} is grounded in organizational knowledge.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-1.5 py-2">
            {[n.name, "Knowledge Domains", ...domains.map((d) => d!.name), "Knowledge Graph", "Evidence"].map(
              (step, i, arr) => (
                <React.Fragment key={`${step}-${i}`}>
                  <div className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-center text-xs font-medium text-foreground">
                    {step}
                  </div>
                  {i < arr.length - 1 ? <ArrowRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" /> : null}
                </React.Fragment>
              ),
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
