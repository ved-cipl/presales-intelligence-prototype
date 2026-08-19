import { HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UnknownItem } from "@/features/presales/data/types";

export function UnknownCard({
  item,
  onAction,
  className,
}: {
  item: UnknownItem;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-lg border border-dashed border-signal-unknown/40 bg-signal-unknown/[0.04] p-4",
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground">{item.label}</h4>
          <span className="inline-flex items-center gap-1 rounded-md bg-signal-unknown/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-signal-unknown">
            <HelpCircle className="h-3 w-3" />
            {item.status}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.whyItMatters}</p>
      </div>
      <Button variant="outline" size="sm" className="mt-3 w-fit" onClick={onAction}>
        {item.actionLabel}
      </Button>
    </div>
  );
}
