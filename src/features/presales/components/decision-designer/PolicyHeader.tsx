import { CheckCircle2, History, Play, Save, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DecisionPolicy } from "@/features/presales/data/decision-designer";

export function PolicyHeader({
  policy,
  dirty,
  onSaveDraft,
  onValidate,
  onSimulate,
  onPublish,
  onVersionHistory,
}: {
  policy: DecisionPolicy;
  dirty: boolean;
  onSaveDraft: () => void;
  onValidate: () => void;
  onSimulate: () => void;
  onPublish: () => void;
  onVersionHistory: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-5 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="truncate text-base font-semibold text-foreground">
            {policy.name} v{policy.version}
          </h1>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
              policy.status === "Published"
                ? "border-signal-positive/25 bg-signal-positive/10 text-signal-positive"
                : "border-signal-warning/30 bg-signal-warning/15 text-amber-700 dark:text-signal-warning",
            )}
          >
            {policy.status === "Published" ? <ShieldCheck className="h-3 w-3" /> : null}
            {policy.status}
          </span>
          {dirty ? (
            <span className="shrink-0 rounded-md border border-signal-info/25 bg-signal-info/10 px-2 py-0.5 text-[11px] font-semibold text-signal-info">
              Unsaved changes
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          Owner: {policy.owner} · Last updated {policy.lastUpdated}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" onClick={onVersionHistory}>
          <History className="h-3.5 w-3.5" />
          Version History
        </Button>
        <Button variant="outline" size="sm" onClick={onSaveDraft}>
          <Save className="h-3.5 w-3.5" />
          Save Draft
        </Button>
        <Button variant="outline" size="sm" onClick={onValidate}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Validate
        </Button>
        <Button variant="outline" size="sm" onClick={onSimulate}>
          <Play className="h-3.5 w-3.5" />
          Simulate
        </Button>
        <Button size="sm" onClick={onPublish}>
          Publish
        </Button>
      </div>
    </div>
  );
}
