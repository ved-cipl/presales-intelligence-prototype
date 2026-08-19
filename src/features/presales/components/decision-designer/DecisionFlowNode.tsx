import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import {
  Calculator,
  FileSearch,
  Flag,
  GitBranch,
  PlayCircle,
  ScanLine,
  Sparkles,
  UserCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { NODE_TYPE_META, type DecisionNodeType, type DesignerNode } from "@/features/presales/data/decision-designer";

const ICONS: Record<DecisionNodeType, LucideIcon> = {
  trigger: Zap,
  extraction: ScanLine,
  condition: GitBranch,
  aiAssessment: Sparkles,
  evidenceCheck: FileSearch,
  score: Calculator,
  humanGate: UserCheck,
  decision: Flag,
  action: PlayCircle,
};

const TYPE_STYLE: Record<DecisionNodeType, { accent: string; chipBg: string; chipText: string }> = {
  trigger: { accent: "#8b5cf6", chipBg: "bg-violet-500/10", chipText: "text-violet-600" },
  extraction: { accent: "#2563eb", chipBg: "bg-blue-500/10", chipText: "text-blue-600" },
  condition: { accent: "#d97706", chipBg: "bg-amber-500/10", chipText: "text-amber-700" },
  aiAssessment: { accent: "#0ea5e9", chipBg: "bg-sky-500/10", chipText: "text-sky-600" },
  evidenceCheck: { accent: "#0d9488", chipBg: "bg-teal-500/10", chipText: "text-teal-700" },
  score: { accent: "#0891b2", chipBg: "bg-cyan-500/10", chipText: "text-cyan-700" },
  humanGate: { accent: "#db2777", chipBg: "bg-pink-500/10", chipText: "text-pink-600" },
  decision: { accent: "#12213B", chipBg: "bg-primary/10", chipText: "text-primary" },
  action: { accent: "#16a34a", chipBg: "bg-signal-positive/10", chipText: "text-signal-positive" },
};

const STATUS_DOT: Record<DesignerNode["status"], string> = {
  Configured: "bg-signal-positive",
  "Needs Attention": "bg-signal-warning",
  Draft: "bg-signal-unknown",
};

const DECISION_OUTCOME_STYLE: Record<string, string> = {
  GO: "bg-signal-positive text-white",
  "NO-GO": "bg-signal-risk text-white",
  "DISCOVERY REQUIRED": "bg-signal-warning text-white",
  ESCALATE: "bg-purple-600 text-white",
};

export type DecisionFlowNodeData = DesignerNode & {
  onHighlight?: boolean;
  simulationOutcome?: string;
};

type DecisionFlowNodeType = Node<Record<string, unknown> & DecisionFlowNodeData>;

export function DecisionFlowNode({ data, selected }: NodeProps<DecisionFlowNodeType>) {
  const Icon = ICONS[data.type];
  const style = TYPE_STYLE[data.type];
  const isDecision = data.type === "decision";
  const outcomeField = data.fields.find((f) => f.key === "outcome")?.value;
  const decisionClass = isDecision && outcomeField ? DECISION_OUTCOME_STYLE[outcomeField] : undefined;

  return (
    <div
      className={cn(
        "w-[228px] rounded-xl border bg-card shadow-sm transition-all",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
        data.onHighlight && "ring-2 ring-signal-info shadow-md",
      )}
      style={{ borderLeftColor: style.accent, borderLeftWidth: 3 }}
    >
      <Handle type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border-2 !bg-background" style={{ borderColor: style.accent }} />

      <div
        className={cn(
          "flex items-center gap-1.5 rounded-t-[10px] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide",
          isDecision ? decisionClass ?? "bg-primary/10 text-primary" : cn(style.chipBg, style.chipText),
        )}
      >
        <Icon className="h-3 w-3" />
        {NODE_TYPE_META[data.type].label}
      </div>

      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold leading-snug text-foreground">{data.name}</p>
        {data.summary.length > 0 ? (
          <div className="mt-1.5 space-y-0.5">
            {data.summary.map((line) => (
              <p key={line} className="text-[11px] leading-snug text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        ) : null}

        {data.simulationOutcome ? (
          <div className="mt-2 rounded-md bg-signal-info/10 px-2 py-1 text-[11px] font-semibold text-signal-info">
            {data.simulationOutcome}
          </div>
        ) : null}

        <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[data.status])} />
          <span className="text-[10px] font-medium text-muted-foreground">{data.status}</span>
          {data.knowledgeDomainIds.length > 0 ? (
            <span className="ml-auto text-[10px] text-muted-foreground">
              {data.knowledgeDomainIds.length} knowledge {data.knowledgeDomainIds.length === 1 ? "domain" : "domains"}
            </span>
          ) : null}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border-2 !bg-background" style={{ borderColor: style.accent }} />
    </div>
  );
}
