import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  subtext,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  subtext: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}
