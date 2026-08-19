import type { LucideIcon } from "lucide-react";

import { PageContainer } from "@/features/presales/components/PageHeader";

export function ComingSoon({
  icon: Icon,
  title,
  description,
  points,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <PageContainer>
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/[0.06] text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <span className="mt-4 rounded-md border border-signal-unknown/25 bg-signal-unknown/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-signal-unknown">
          Coming Soon
        </span>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        <ul className="mt-6 space-y-1.5 text-left">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[11px] text-muted-foreground/70">
          Built on the same Organizational Intelligence Layer as Qualification — no separate data
          model required.
        </p>
      </div>
    </PageContainer>
  );
}
