import { cn } from "@/lib/utils";
import type { QualificationDimension } from "@/features/presales/data/types";

const barTone: Record<QualificationDimension["level"], string> = {
  High: "bg-signal-positive",
  Medium: "bg-signal-warning",
  Low: "bg-signal-risk",
  Unknown: "bg-signal-unknown/40",
};

export function DecisionMatrix({ dimensions }: { dimensions: QualificationDimension[] }) {
  return (
    <div className="space-y-3">
      {dimensions.map((d) => (
        <div key={d.key} className="grid grid-cols-[9rem_1fr_5rem] items-center gap-3 text-sm">
          <span className="truncate text-muted-foreground">{d.label}</span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", barTone[d.level])}
              style={{ width: `${Math.max(d.score, d.level === "Unknown" ? 4 : 8) * 10}%` }}
            />
          </div>
          <span
            className={cn(
              "text-right text-xs font-semibold",
              d.level === "High" && "text-signal-positive",
              d.level === "Medium" && "text-signal-warning",
              d.level === "Low" && "text-signal-risk",
              d.level === "Unknown" && "text-signal-unknown",
            )}
          >
            {d.level}
          </span>
        </div>
      ))}
    </div>
  );
}
