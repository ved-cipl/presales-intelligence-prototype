import {
  Blocks,
  BookOpen,
  Building2,
  FileText,
  ScanSearch,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AgentStatus, AiAgent } from "@/features/presales/data/agents";

const iconMap: Record<AiAgent["icon"], LucideIcon> = {
  ScanSearch,
  TrendingUp,
  Blocks,
  FileText,
  Building2,
  BookOpen,
};

const statusTone: Record<AgentStatus, string> = {
  Live: "bg-signal-positive/10 text-signal-positive border-signal-positive/25",
  Beta: "bg-signal-info/10 text-signal-info border-signal-info/25",
  "Coming Soon": "bg-signal-unknown/10 text-signal-unknown border-signal-unknown/25",
};

export function AgentDetailDialog({
  agent,
  open,
  onOpenChange,
}: {
  agent: AiAgent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!agent) return null;
  const Icon = iconMap[agent.icon];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/[0.06] text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle>{agent.name}</DialogTitle>
              <span
                className={`mt-1 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusTone[agent.status]}`}
              >
                {agent.status}
              </span>
            </div>
          </div>
          <DialogDescription className="pt-2">{agent.description}</DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Data dependencies
          </p>
          <ul className="mt-2 space-y-1.5">
            {agent.dataDependencies.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <p className="rounded-md border border-dashed border-border bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
          Every capability reads from and writes back to the same Organizational Intelligence Layer
          — no separate silos of data.
        </p>
      </DialogContent>
    </Dialog>
  );
}
