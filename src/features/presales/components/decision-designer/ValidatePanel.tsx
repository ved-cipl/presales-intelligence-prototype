import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CHECKS = [
  "All nodes have valid configurations",
  "All decision paths terminate",
  "No unreachable nodes",
  "All mandatory fields have evidence requirements",
];

const WARNINGS = [
  "“Competitive Position” has no configured knowledge source",
  "“Economic Fit” threshold may require human verification",
];

export function ValidatePanel({
  open,
  onOpenChange,
  onPublish,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Decision Policy Validation</DialogTitle>
          <DialogDescription>
            Warnings do not block publishing — they flag areas worth strengthening.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {CHECKS.map((c) => (
            <div key={c} className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-signal-positive" />
              {c}
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-signal-warning">Warnings</p>
            <span className="rounded-full bg-signal-warning/15 px-2 py-0.5 text-[11px] font-semibold text-signal-warning">
              {WARNINGS.length} warnings
            </span>
          </div>
          {WARNINGS.map((w) => (
            <div key={w} className="flex items-start gap-2 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-signal-warning" />
              {w}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onPublish();
              onOpenChange(false);
            }}
          >
            Publish Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
