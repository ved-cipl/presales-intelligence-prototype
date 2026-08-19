import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import ForceGraph2D, { type ForceGraphMethods, type NodeObject } from "react-force-graph-2d";
import { ArrowRight, Minus, Plus, RotateCcw, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  buildGraph,
  CASE_STUDIES,
  getCapabilityDetail,
  getClientDetail,
  getIndustryDetail,
  getPersonDetail,
  getTechnologyDetail,
  PRACTICES,
  type GraphNode,
  type GraphNodeType,
} from "@/features/presales/data/graph";
import { getOpportunity } from "@/features/presales/data/opportunities";
import { PriorityBadge } from "@/features/presales/components/badges";

const TYPE_ORDER: GraphNodeType[] = [
  "opportunity",
  "client",
  "industry",
  "capability",
  "technology",
  "caseStudy",
  "practice",
  "person",
];

const TYPE_META: Record<
  GraphNodeType,
  { fill: string; label: string; shape: "circle" | "square" | "diamond" | "hexagon" }
> = {
  opportunity: { fill: "#3b82f6", label: "Opportunity", shape: "circle" },
  client: { fill: "#193a6f", label: "Client", shape: "square" },
  industry: { fill: "#78716c", label: "Industry", shape: "diamond" },
  capability: { fill: "#16a34a", label: "Capability", shape: "circle" },
  technology: { fill: "#d97706", label: "Technology", shape: "hexagon" },
  caseStudy: { fill: "#8b5cf6", label: "Case Study", shape: "circle" },
  practice: { fill: "#0891b2", label: "Practice", shape: "square" },
  person: { fill: "#db2777", label: "Person", shape: "circle" },
};

type FGNode = NodeObject<GraphNode>;
interface FGLink {
  source: string | FGNode;
  target: string | FGNode;
  kind: "primary" | "similar";
}

function nodeIdOf(n: string | FGNode): string {
  return typeof n === "string" ? n : ((n.id as string) ?? "");
}

function drawShape(ctx: CanvasRenderingContext2D, shape: string, x: number, y: number, r: number) {
  ctx.beginPath();
  if (shape === "square") {
    ctx.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
  } else if (shape === "diamond") {
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
  } else if (shape === "hexagon") {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else {
    ctx.arc(x, y, r, 0, 2 * Math.PI);
  }
}

export function GraphCanvas({
  initialCenterId,
  height = 480,
}: {
  initialCenterId: string;
  height?: number;
}) {
  const navigate = useNavigate();
  const { nodes, edges } = React.useMemo(() => buildGraph(), []);
  const graphData = React.useMemo(
    () => ({
      nodes: nodes.map((n) => ({ ...n })) as FGNode[],
      links: edges.map((e) => ({ source: e.a, target: e.b, kind: e.kind })) as FGLink[],
    }),
    [nodes, edges],
  );

  const degree = React.useMemo(() => {
    const d = new Map<string, number>();
    for (const e of edges) {
      d.set(e.a, (d.get(e.a) ?? 0) + 1);
      d.set(e.b, (d.get(e.b) ?? 0) + 1);
    }
    return d;
  }, [edges]);

  const neighborMap = React.useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const e of edges) {
      if (!m.has(e.a)) m.set(e.a, new Set());
      if (!m.has(e.b)) m.set(e.b, new Set());
      m.get(e.a)!.add(e.b);
      m.get(e.b)!.add(e.a);
    }
    return m;
  }, [edges]);

  const fgRef = React.useRef<ForceGraphMethods<GraphNode, FGLink> | undefined>(undefined);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dims, setDims] = React.useState({ width: 800, height });

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setDims({ width: box.width, height: box.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [activeTypes, setActiveTypes] = React.useState<Set<GraphNodeType>>(() => new Set(TYPE_ORDER));
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<FGNode | null>(null);
  const [hovered, setHovered] = React.useState<FGNode | null>(null);
  const hasCenteredRef = React.useRef<string | null>(null);

  const focusNode = React.useCallback((node: FGNode | undefined, zoomLevel = 2.4) => {
    if (!node) return;
    setSelected(node);
    if (typeof node.x === "number" && typeof node.y === "number" && fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 700);
      fgRef.current.zoom(zoomLevel, 700);
    }
  }, []);

  const handleEngineStop = React.useCallback(() => {
    if (hasCenteredRef.current === initialCenterId) return;
    hasCenteredRef.current = initialCenterId;
    const node = graphData.nodes.find((n) => n.id === initialCenterId);
    focusNode(node);
  }, [initialCenterId, graphData, focusNode]);

  const filteredData = React.useMemo(() => {
    const visibleIds = new Set(
      graphData.nodes.filter((n) => activeTypes.has(n.type)).map((n) => n.id as string),
    );
    return {
      nodes: graphData.nodes.filter((n) => visibleIds.has(n.id as string)),
      links: graphData.links.filter(
        (l) => visibleIds.has(nodeIdOf(l.source)) && visibleIds.has(nodeIdOf(l.target)),
      ),
    };
  }, [graphData, activeTypes]);

  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return graphData.nodes.filter((n) => n.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, graphData]);

  const activeFocus = hovered ?? selected;
  const highlightIds = activeFocus
    ? new Set([activeFocus.id as string, ...(neighborMap.get(activeFocus.id as string) ?? [])])
    : null;

  function toggleType(t: GraphNodeType) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next.size ? next : prev;
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a node…"
            className="h-8 pl-8 text-xs"
          />
          {searchResults.length > 0 ? (
            <div className="absolute left-0 top-9 z-20 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-md">
              {searchResults.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    focusNode(n);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs hover:bg-accent cursor-pointer"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: TYPE_META[n.type].fill }}
                  />
                  <span className="truncate text-foreground">{n.label}</span>
                  <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                    {TYPE_META[n.type].label}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {TYPE_ORDER.map((t) => {
            const count = graphData.nodes.filter((n) => n.type === t).length;
            const active = activeTypes.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                  active
                    ? "border-border bg-background text-foreground"
                    : "border-border/60 bg-muted/40 text-muted-foreground/50",
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: active ? TYPE_META[t].fill : "var(--muted-foreground)" }}
                />
                {TYPE_META[t].label}
                <span className="tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <span className="ml-auto text-[11px] text-muted-foreground">
          {filteredData.nodes.length} nodes · {filteredData.links.length} connections
        </span>
      </div>

      <div ref={containerRef} className="relative" style={{ height }}>
        <ForceGraph2D<GraphNode, FGLink>
          ref={fgRef}
          graphData={filteredData}
          width={dims.width}
          height={height}
          backgroundColor="rgba(0,0,0,0)"
          nodeRelSize={4}
          nodeVal={(n) => Math.max(2.5, Math.sqrt(degree.get(n.id as string) ?? 1) * 2.2)}
          nodeLabel={(n) => `${n.label} · ${TYPE_META[n.type].label}`}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const r = Math.max(2.5, Math.sqrt(degree.get(node.id as string) ?? 1) * 2.2);
            const isSelected = selected?.id === node.id;
            const isHighlighted = !highlightIds || highlightIds.has(node.id as string);
            const meta = TYPE_META[node.type];

            ctx.globalAlpha = isHighlighted ? 1 : 0.15;
            drawShape(ctx, meta.shape, node.x ?? 0, node.y ?? 0, r);
            ctx.fillStyle = meta.fill;
            ctx.fill();
            if (isSelected) {
              ctx.lineWidth = 2 / globalScale;
              ctx.strokeStyle = "#111827";
              ctx.stroke();
            }

            if (isHighlighted && (globalScale > 2.2 || isSelected || node.type === "client")) {
              ctx.globalAlpha = isHighlighted ? 1 : 0.15;
              ctx.font = `${isSelected ? "700" : "500"} ${11 / globalScale}px system-ui, sans-serif`;
              ctx.textAlign = "center";
              ctx.fillStyle = "#111827";
              ctx.fillText(
                node.label.length > 22 ? `${node.label.slice(0, 21)}…` : node.label,
                node.x ?? 0,
                (node.y ?? 0) + r + 8 / globalScale,
              );
            }
            ctx.globalAlpha = 1;
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            const r = Math.max(4, Math.sqrt(degree.get(node.id as string) ?? 1) * 2.2 + 2);
            ctx.fillStyle = color;
            drawShape(ctx, TYPE_META[node.type].shape, node.x ?? 0, node.y ?? 0, r);
            ctx.fill();
          }}
          linkColor={(l) => {
            const link = l as unknown as FGLink;
            const isHighlighted =
              activeFocus &&
              (nodeIdOf(link.source) === activeFocus.id || nodeIdOf(link.target) === activeFocus.id);
            if (isHighlighted) return "#2563eb";
            return activeFocus ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.45)";
          }}
          linkWidth={(l) => {
            const link = l as unknown as FGLink;
            const isHighlighted =
              activeFocus &&
              (nodeIdOf(link.source) === activeFocus.id || nodeIdOf(link.target) === activeFocus.id);
            return isHighlighted ? 1.8 : 0.8;
          }}
          linkLineDash={(l) => ((l as unknown as FGLink).kind === "similar" ? [3, 2] : null)}
          linkDirectionalParticles={(l) => {
            const link = l as unknown as FGLink;
            return selected &&
              (nodeIdOf(link.source) === selected.id || nodeIdOf(link.target) === selected.id)
              ? 2
              : 0;
          }}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.006}
          onNodeClick={(node) => focusNode(node)}
          onNodeHover={(node) => setHovered(node ?? null)}
          onBackgroundClick={() => setSelected(null)}
          onEngineStop={handleEngineStop}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.35}
          enableNodeDrag
        />

        <div className="absolute right-3 top-3 flex flex-col gap-1">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-card"
            onClick={() => fgRef.current?.zoom((fgRef.current?.zoom() ?? 1) * 1.4, 300)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-card"
            onClick={() => fgRef.current?.zoom((fgRef.current?.zoom() ?? 1) / 1.4, 300)}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-card"
            onClick={() => {
              setSelected(null);
              fgRef.current?.zoomToFit(600, 60);
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {selected ? (
          <button
            onClick={() => setSelected(null)}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-card/95 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur hover:text-foreground cursor-pointer"
          >
            <X className="h-3 w-3" />
            Clear focus: {selected.label}
          </button>
        ) : (
          <p className="absolute bottom-3 left-3 rounded-md bg-card/90 px-2.5 py-1.5 text-[10px] text-muted-foreground shadow-sm backdrop-blur">
            Drag to pan · scroll to zoom · drag a node to reposition it
          </p>
        )}
      </div>

      <NodeDetailSheet
        node={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onFocus={(id) => {
          const node = graphData.nodes.find((n) => n.id === id);
          focusNode(node);
        }}
        onOpenOpportunity={(id) => navigate({ to: "/opportunities/$id", params: { id } })}
      />
    </div>
  );
}

function NodeDetailSheet({
  node,
  onOpenChange,
  onFocus,
  onOpenOpportunity,
}: {
  node: FGNode | null;
  onOpenChange: (open: boolean) => void;
  onFocus: (id: string) => void;
  onOpenOpportunity: (id: string) => void;
}) {
  return (
    <Sheet open={!!node} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] overflow-y-auto sm:max-w-[380px]">
        {node ? (
          <>
            <SheetHeader>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {TYPE_META[node.type].label}
              </p>
              <SheetTitle>{node.label}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4 px-1">
              <NodeDetailBody node={node} onOpenOpportunity={onOpenOpportunity} />
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <Button variant="outline" onClick={() => onFocus(node.id as string)}>
                  <ArrowRight className="h-3.5 w-3.5" />
                  Explore intelligence
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function NodeDetailBody({
  node,
  onOpenOpportunity,
}: {
  node: FGNode;
  onOpenOpportunity: (id: string) => void;
}) {
  if (node.type === "capability") {
    const d = getCapabilityDetail(node.label);
    return (
      <div>
        <StatRow label="Connected opportunities" value={d.connectedOpportunities} />
        <StatRow label="Successful projects" value={d.successfulProjects} />
        <StatRow label="Active opportunities" value={d.activeOpportunities} />
        <StatRow label="Industries" value={d.industries.join(", ") || "—"} />
        <StatRow label="Related technologies" value={d.relatedTechnologies.join(", ") || "—"} />
        <StatRow label="Trend" value={<span className="text-signal-positive">↑ {d.trend}</span>} />
      </div>
    );
  }
  if (node.type === "client") {
    const d = getClientDetail(node.label);
    return (
      <div>
        <StatRow label="Industry" value={d.industry} />
        <StatRow label="Opportunities" value={d.opportunities.length} />
        <div className="space-y-2 pt-2">
          {d.opportunities.map((o) => (
            <button
              key={o.id}
              onClick={() => onOpenOpportunity(o.id)}
              className="flex w-full items-center justify-between rounded-md border border-border p-2.5 text-left text-xs hover:bg-accent cursor-pointer"
            >
              <span className="font-medium text-foreground">{o.name}</span>
              <PriorityBadge priority={o.priority} />
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (node.type === "industry") {
    const d = getIndustryDetail(node.label);
    return (
      <div>
        <StatRow label="Opportunities" value={d.opportunities.length} />
        <StatRow label="Capabilities in demand" value={d.capabilities.join(", ")} />
      </div>
    );
  }
  if (node.type === "technology") {
    const d = getTechnologyDetail(node.label);
    return (
      <div>
        <StatRow label="Used across opportunities" value={d.opportunities.length} />
        <StatRow label="Industries" value={d.industries.join(", ")} />
      </div>
    );
  }
  if (node.type === "person") {
    const d = getPersonDetail(node.label);
    return (
      <div>
        <StatRow label="Role" value={d.title} />
        <StatRow label="Practice" value={d.practiceLabel} />
        <StatRow label="Opportunities owned" value={d.opportunities.length} />
        <div className="space-y-2 pt-2">
          {d.opportunities.map((o) => (
            <button
              key={o.id}
              onClick={() => onOpenOpportunity(o.id)}
              className="flex w-full items-center justify-between rounded-md border border-border p-2.5 text-left text-xs hover:bg-accent cursor-pointer"
            >
              <span className="font-medium text-foreground">{o.name}</span>
              <PriorityBadge priority={o.priority} />
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (node.type === "opportunity") {
    const o = getOpportunity(node.id as string);
    if (!o) return null;
    return (
      <div>
        <StatRow label="Client" value={o.client} />
        <StatRow label="Industry" value={o.industry} />
        <StatRow label="Estimated value" value={o.estimatedValueLabel} />
        <StatRow label="Recommendation" value={o.recommendation} />
        <button
          onClick={() => onOpenOpportunity(o.id)}
          className="mt-2 w-full rounded-md border border-border p-2.5 text-left text-xs font-medium text-primary hover:bg-accent cursor-pointer"
        >
          Open opportunity →
        </button>
      </div>
    );
  }
  if (node.type === "caseStudy") {
    const cs = CASE_STUDIES.find((c) => c.id === node.id);
    if (!cs) return null;
    return (
      <div>
        <StatRow label="Year" value={cs.year} />
        <StatRow label="Industry" value={cs.industry} />
        <StatRow label="Capabilities" value={cs.capabilities.join(", ")} />
        <p className="pt-2 text-sm text-muted-foreground">{cs.outcome}</p>
      </div>
    );
  }
  if (node.type === "practice") {
    const pr = PRACTICES.find((p) => p.id === node.id);
    if (!pr) return null;
    return (
      <div>
        <StatRow label="Headcount" value={pr.headcount} />
        <StatRow label="Capabilities" value={pr.capabilities.join(", ")} />
      </div>
    );
  }
  return null;
}
