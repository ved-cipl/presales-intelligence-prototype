import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Opportunity } from "@/features/presales/data/types";

export function WhyPanel({
  opportunity,
  open,
  onOpenChange,
}: {
  opportunity: Opportunity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Recommendation
          </p>
          <DialogTitle className="text-xl">{opportunity.recommendation}</DialogTitle>
          <DialogDescription>
            Why the system reached this recommendation, and what would change it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Why?
          </p>
          <ol className="space-y-3">
            {opportunity.whyReasons.map((reason, i) => (
              <li
                key={reason.title}
                className="flex gap-3 rounded-lg border border-border bg-muted/40 p-3"
              >
                <span className="mt-0.5 shrink-0">
                  {reason.polarity === "positive" ? (
                    <CheckCircle2 className="h-4 w-4 text-signal-positive" />
                  ) : (
                    <XCircle className="h-4 w-4 text-signal-warning" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {i + 1}. {reason.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {reason.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-dashed border-signal-info/30 bg-signal-info/[0.04] p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-signal-info">
            <HelpCircle className="h-3.5 w-3.5" />
            What would change this recommendation?
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground">
            {opportunity.whatWouldChange}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
