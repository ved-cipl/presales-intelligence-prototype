import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  buildGraph,
  CASE_STUDIES,
  getCapabilityDetail,
  getClientDetail,
  getIndustryDetail,
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
];

const TYPE_META: Record<GraphNodeType, { fill: string; label: string; radius: number }> = {
  opportunity: { fill: "var(--signal-info)", label: "Opportunity", radius: 20 },
  client: { fill: "var(--primary)", label: "Client", radius: 22 },
  industry: { fill: "var(--signal-unknown)", label: "Industry", radius: 16 },
  capability: { fill: "var(--signal-positive)", label: "Capability", radius: 17 },
  technology: { fill: "var(--signal-warning)", label: "Technology", radius: 14 },
  caseStudy: { fill: "#8b5cf6", label: "Case Study", radius: 13 },
  practice: { fill: "#0891b2", label: "Practice", radius: 13 },
};

function NodeShape({
  type,
  x,
  y,
  r,
  dimmed,
}: {
  type: GraphNodeType;
  x: number;
  y: number;
  r: number;
  dimmed?: boolean;
}) {
  const fill = TYPE_META[type].fill;
  const opacity = dimmed ? 0.35 : 1;
  if (type === "client") {
    return (
      <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={6} fill={fill} opacity={opacity} />
    );
  }
  if (type === "industry") {
    return (
      <polygon
        points={`${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`}
        fill={fill}
        opacity={opacity}
      />
    );
  }
  if (type === "technology") {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`;
    }).join(" ");
    return <polygon points={pts} fill={fill} opacity={opacity} />;
  }
  return <circle cx={x} cy={y} r={r} fill={fill} opacity={opacity} />;
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
  const nodeMap = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const [centerId, setCenterId] = React.useState(initialCenterId);
  const [selected, setSelected] = React.useState<GraphNode | null>(null);
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => setCenterId(initialCenterId), [initialCenterId]);

  const center = nodeMap.get(centerId);
  const neighborIds = React.useMemo(() => {
    const ids = new Set<string>();
    for (const e of edges) {
      if (e.a === centerId) ids.add(e.b);
      if (e.b === centerId) ids.add(e.a);
    }
    return Array.from(ids);
  }, [edges, centerId]);

  const neighbors = neighborIds
    .map((id) => nodeMap.get(id))
    .filter((n): n is GraphNode => !!n)
    .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));

  const R = Math.min(230, 140 + neighbors.length * 6);
  const positions = new Map<string, { x: number; y: number }>();
  neighbors.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / neighbors.length - Math.PI / 2;
    positions.set(n.id, { x: R * Math.cos(angle), y: R * Math.sin(angle) });
  });

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setScale((s) => Math.min(2, Math.max(0.5, s - e.deltaY * 0.001)));
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border bg-card"
      style={{ height }}
    >
      <svg
        viewBox="-320 -260 640 520"
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onPointerDown={(e) => {
          dragRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (!dragRef.current) return;
          const dx = (e.clientX - dragRef.current.x) / scale;
          const dy = (e.clientY - dragRef.current.y) / scale;
          setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
          dragRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => (dragRef.current = null)}
        onPointerLeave={() => (dragRef.current = null)}
      >
        <g transform={`scale(${scale}) translate(${offset.x} ${offset.y})`}>
          {center &&
            neighbors.map((n) => {
              const p = positions.get(n.id)!;
              return (
                <line
                  key={`edge-${n.id}`}
                  x1={0}
                  y1={0}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--border)"
                  strokeWidth={1.25}
                />
              );
            })}

          {neighbors.map((n) => {
            const p = positions.get(n.id)!;
            const meta = TYPE_META[n.type];
            return (
              <g
                key={n.id}
                className="cursor-pointer"
                onClick={() => setSelected(n)}
                onDoubleClick={() => setCenterId(n.id)}
              >
                <NodeShape type={n.type} x={p.x} y={p.y} r={meta.radius} />
                <text
                  x={p.x}
                  y={p.y + meta.radius + 13}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontWeight={500}
                  fill="var(--foreground)"
                >
                  {n.label.length > 20 ? `${n.label.slice(0, 19)}…` : n.label}
                </text>
              </g>
            );
          })}

          {center ? (
            <g className="cursor-pointer" onClick={() => setSelected(center)}>
              <circle
                cx={0}
                cy={0}
                r={30}
                fill="var(--sidebar)"
                stroke={TYPE_META[center.type].fill}
                strokeWidth={3}
              />
              <text
                x={0}
                y={-40}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill="var(--foreground)"
              >
                {center.label.length > 26 ? `${center.label.slice(0, 25)}…` : center.label}
              </text>
            </g>
          ) : null}
        </g>
      </svg>

      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7 bg-card"
          onClick={() => setScale((s) => Math.min(2, s + 0.15))}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7 bg-card"
          onClick={() => setScale((s) => Math.max(0.5, s - 0.15))}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7 bg-card"
          onClick={() => {
            setScale(1);
            setOffset({ x: 0, y: 0 });
            setCenterId(initialCenterId);
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 rounded-md bg-card/90 px-2.5 py-1.5 text-[10px] text-muted-foreground shadow-sm backdrop-blur">
        {TYPE_ORDER.map((t) => (
          <span key={t} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_META[t].fill }} />
            {TYPE_META[t].label}
          </span>
        ))}
      </div>

      <NodeDetailSheet
        node={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onFocus={(id) => {
          setCenterId(id);
          setSelected(null);
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
  node: GraphNode | null;
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
                <Button variant="outline" onClick={() => onFocus(node.id)}>
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
  node: GraphNode;
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
  if (node.type === "opportunity") {
    const o = getOpportunity(node.id);
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
