import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import {
  QUALIFICATION_STANDARDS,
  type StandardDimension,
} from "@/features/presales/data/qualification-framework";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/qualification")({
  component: QualificationStandardsPage,
});

function QualificationStandardsPage() {
  const [standards, setStandards] = React.useState<StandardDimension[]>(QUALIFICATION_STANDARDS);
  const [editing, setEditing] = React.useState<StandardDimension | null>(null);

  const totalWeight = standards.reduce((sum, s) => sum + s.weight, 0);

  function saveEdit(next: StandardDimension) {
    setStandards((prev) => prev.map((s) => (s.key === next.key ? next : s)));
    setEditing(null);
    toast.success("Standard updated", {
      description: `${next.label} now applies at ${next.weight}% weight, minimum ${next.minimum}.`,
    });
  }

  return (
    <PageContainer>
      <PageHeader
        title="Qualification Standards"
        subtitle="The organizational methodology every AI assessment is measured against"
        actions={
          <span
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-semibold",
              totalWeight === 100
                ? "border-signal-positive/25 bg-signal-positive/10 text-signal-positive"
                : "border-signal-warning/30 bg-signal-warning/15 text-signal-warning",
            )}
          >
            Total weight: {totalWeight}%
          </span>
        }
      />

      <p className="mt-4 max-w-2xl rounded-lg border border-dashed border-signal-info/25 bg-signal-info/[0.04] p-3 text-xs leading-relaxed text-foreground">
        The AI operates against these organizational standards — it does not invent its own
        definition of a good opportunity. Editing weights, minimum thresholds or evidence
        requirements here changes how every future qualification assessment is scored.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {standards.map((s) => (
          <div
            key={s.key}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{s.label}</h3>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground">
                  Weight: {s.weight}%
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Minimum: <span className="font-medium text-foreground">{s.minimum}</span>
              </p>
              <div className="mt-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Required evidence
                </p>
                <ul className="mt-1 space-y-1">
                  {s.requiredEvidence.map((e) => (
                    <li key={e} className="flex items-start gap-1.5 text-xs text-foreground">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-signal-positive" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground">{s.status}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-fit"
              onClick={() => setEditing(s)}
            >
              Edit Standard
            </Button>
          </div>
        ))}
      </div>

      <EditStandardDialog
        standard={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={saveEdit}
      />
    </PageContainer>
  );
}

function EditStandardDialog({
  standard,
  onOpenChange,
  onSave,
}: {
  standard: StandardDimension | null;
  onOpenChange: (open: boolean) => void;
  onSave: (next: StandardDimension) => void;
}) {
  const [weight, setWeight] = React.useState(standard?.weight ?? 0);
  const [minimum, setMinimum] = React.useState<StandardDimension["minimum"]>(
    standard?.minimum ?? "Low",
  );

  React.useEffect(() => {
    if (standard) {
      setWeight(standard.weight);
      setMinimum(standard.minimum);
    }
  }, [standard]);

  return (
    <Dialog open={!!standard} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        {standard ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Standard — {standard.label}</DialogTitle>
              <DialogDescription>
                Changes apply to future AI qualification assessments.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Weight (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Minimum threshold</Label>
                <Select
                  value={minimum}
                  onValueChange={(v) => setMinimum(v as StandardDimension["minimum"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => onSave({ ...standard, weight, minimum })}>
                Save Standard
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
