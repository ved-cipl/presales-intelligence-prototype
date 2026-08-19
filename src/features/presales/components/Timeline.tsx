import { Bot, User, Cog } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/features/presales/data/types";

const actorMeta = {
  AI: { icon: Bot, tone: "bg-signal-info/10 text-signal-info" },
  Human: { icon: User, tone: "bg-signal-positive/10 text-signal-positive" },
  System: { icon: Cog, tone: "bg-signal-unknown/10 text-signal-unknown" },
} as const;

export function Timeline({ events, className }: { events: TimelineEvent[]; className?: string }) {
  return (
    <ol className={cn("relative space-y-6 border-l border-border pl-6", className)}>
      {events.map((e, i) => {
        const meta = actorMeta[e.actor];
        const Icon = meta.icon;
        return (
          <li key={`${e.date}-${i}`} className="relative">
            <span
              className={cn(
                "absolute -left-[1.9rem] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background",
                meta.tone,
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-medium text-muted-foreground">{e.date}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{e.title}</p>
            {e.description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{e.description}</p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
