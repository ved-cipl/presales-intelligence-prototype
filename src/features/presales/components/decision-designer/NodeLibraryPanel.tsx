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

import { NODE_LIBRARY, type DecisionNodeType } from "@/features/presales/data/decision-designer";

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

export function NodeLibraryPanel() {
  return (
    <div className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Node Library</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Drag a node onto the canvas</p>
      </div>
      <div className="space-y-2 p-3">
        {NODE_LIBRARY.map((item) => {
          const Icon = ICONS[item.type];
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/presales-node-type", item.type);
                e.dataTransfer.effectAllowed = "move";
              }}
              className="cursor-grab rounded-lg border border-border bg-background p-3 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40 active:cursor-grabbing"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/[0.06] text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                </div>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{item.description}</p>
              {item.examples.length > 0 ? (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.examples.slice(0, 3).map((ex) => (
                    <span key={ex} className="rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[9px] text-muted-foreground">
                      {ex}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
