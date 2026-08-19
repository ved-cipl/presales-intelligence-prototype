import * as React from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePresalesData } from "@/features/presales/state/PresalesDataContext";
import type { DecisionRecord, Opportunity } from "@/features/presales/data/types";

const OVERRIDE_REASONS = [
  "Strategic concern",
  "Commercial concern",
  "Capability concern",
  "Relationship information",
  "Competition",
  "Other",
];

export function DecisionModal({
  opportunity,
  open,
  onOpenChange,
}: {
  opportunity: Opportunity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { recordDecision } = usePresalesData();
  const [choice, setChoice] = React.useState<DecisionRecord["humanDecision"]>("Agree");
  const [reason, setReason] = React.useState<string>("");
  const [notes, setNotes] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setChoice("Agree");
      setReason("");
      setNotes("");
      setConfirmed(false);
    }
  }, [open]);

  function handleSubmit() {
    recordDecision(opportunity.id, {
      humanDecision: choice,
      reason: choice === "Override" ? reason : undefined,
      notes: notes || undefined,
    });
    setConfirmed(true);
    toast.success("Decision recorded", {
      description:
        "This decision will become part of the opportunity's organizational intelligence history.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {confirmed ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-signal-positive" />
            <h3 className="mt-4 text-base font-semibold text-foreground">Decision recorded</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This decision will become part of the opportunity's organizational intelligence
              history.
            </p>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Presales Decision</DialogTitle>
              <DialogDescription>
                {opportunity.name} — {opportunity.client}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                AI Recommendation
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {opportunity.recommendation}
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Human Decision</Label>
              <RadioGroup
                value={choice}
                onValueChange={(v) => setChoice(v as DecisionRecord["humanDecision"])}
              >
                {(["Agree", "Override", "Need more information"] as const).map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-2.5 text-sm hover:bg-accent"
                  >
                    <RadioGroupItem value={opt} id={`decision-${opt}`} />
                    {opt}
                  </label>
                ))}
              </RadioGroup>
            </div>

            {choice === "Override" ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Reason</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {OVERRIDE_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Explain decision</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add context for this override…"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Notes (optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional context…"
                  rows={2}
                />
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={choice === "Override" && !reason}>
                Record Decision
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
