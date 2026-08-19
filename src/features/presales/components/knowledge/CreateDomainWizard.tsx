import * as React from "react";
import { Check } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { KnowledgeDomain, TrustLevel } from "@/features/presales/data/knowledge-domains";

const STEPS = ["Define Domain", "Select Sources", "Entity Types", "Relationships", "Trust Level"] as const;

const SOURCE_TYPE_OPTIONS = ["SharePoint", "Database", "CRM", "API", "Folder", "Manual Knowledge", "Upload Documents"];
const ENTITY_TYPE_OPTIONS = ["Capability", "Technology", "Industry", "Client", "Project", "Person", "Case Study", "Certification"];
const RELATIONSHIP_OPTIONS = [
  "Opportunity requires Capability",
  "Capability requires Technology",
  "Client operates in Industry",
  "Project delivered Capability",
  "Opportunity similar_to Opportunity",
];
const TRUST_LEVELS: TrustLevel[] = ["Authoritative", "Verified", "Reference", "Unverified"];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:bg-accent",
      )}
    >
      {label}
    </button>
  );
}

function toggle(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function CreateDomainWizard({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (domain: KnowledgeDomain) => void;
}) {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [recordLabel, setRecordLabel] = React.useState<"Documents" | "Records">("Documents");
  const [sourceTypes, setSourceTypes] = React.useState<Set<string>>(new Set());
  const [entityTypes, setEntityTypes] = React.useState<Set<string>>(new Set());
  const [relationships, setRelationships] = React.useState<Set<string>>(new Set());
  const [trustLevel, setTrustLevel] = React.useState<TrustLevel>("Unverified");

  function reset() {
    setStep(0);
    setName("");
    setDescription("");
    setRecordLabel("Documents");
    setSourceTypes(new Set());
    setEntityTypes(new Set());
    setRelationships(new Set());
    setTrustLevel("Unverified");
  }

  const canAdvance = step === 0 ? name.trim().length > 0 : true;

  function handleCreate() {
    const id = `custom-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString(36).slice(-4)}`;
    const domain: KnowledgeDomain = {
      id,
      name: name.trim(),
      description: description.trim() || "No description provided.",
      recordLabel,
      recordCount: 0,
      sourceCount: sourceTypes.size,
      trustLevel,
      health: 0,
      healthDetail: {
        completeness: 0,
        evidenceQuality: 0,
        humanVerified: 0,
        staleInformation: 0,
        conflictingInformation: 0,
        missingMetadata: 100,
      },
      entities: Array.from(entityTypes).map((t) => ({ name: t, type: t, count: 0, confidence: 0 })),
      relationships: Array.from(relationships).map((r) => {
        const [from, relation, to] = r.split(/ (?=requires|operates in|delivered|similar_to)| requires | operates in | delivered | similar_to /).filter(Boolean);
        return { from: from ?? r, relation: relation ?? "relates to", to: to ?? "", confidence: 0, source: "Newly configured — not yet indexed" };
      }),
      usedBy: [],
      owner: "Presales Leadership",
      refreshFrequency: "Not yet scheduled",
      accessLevel: "All presales staff",
      lastUpdated: "19 Aug 2026",
    };
    onCreate(domain);
    onOpenChange(false);
    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Knowledge Domain</DialogTitle>
          <DialogDescription>Configure a new domain of organizational knowledge the AI can reason over.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              {i < STEPS.length - 1 ? (
                <div className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-border")} />
              ) : null}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs font-semibold text-foreground">{STEPS[step]}</p>

        <div className="min-h-[220px] space-y-4">
          {step === 0 ? (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Domain Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Partner Ecosystem Knowledge" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="text-sm" placeholder="What does this domain capture, and who relies on it?" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Record Type</Label>
                <Select value={recordLabel} onValueChange={(v) => setRecordLabel(v as "Documents" | "Records")}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Documents">Documents</SelectItem>
                    <SelectItem value="Records">Records</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <p className="text-xs text-muted-foreground">Choose the source types this domain will ingest from.</p>
              <div className="flex flex-wrap gap-1.5">
                {SOURCE_TYPE_OPTIONS.map((s) => (
                  <Chip key={s} label={s} active={sourceTypes.has(s)} onClick={() => setSourceTypes((prev) => toggle(prev, s))} />
                ))}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <p className="text-xs text-muted-foreground">Which entity types should the AI extract from this domain?</p>
              <div className="flex flex-wrap gap-1.5">
                {ENTITY_TYPE_OPTIONS.map((e) => (
                  <Chip key={e} label={e} active={entityTypes.has(e)} onClick={() => setEntityTypes((prev) => toggle(prev, e))} />
                ))}
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <p className="text-xs text-muted-foreground">Which relationships should be detected between entities?</p>
              <div className="flex flex-wrap gap-1.5">
                {RELATIONSHIP_OPTIONS.map((r) => (
                  <Chip key={r} label={r} active={relationships.has(r)} onClick={() => setRelationships((prev) => toggle(prev, r))} />
                ))}
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Trust Level</Label>
                <Select value={trustLevel} onValueChange={(v) => setTrustLevel(v as TrustLevel)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRUST_LEVELS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Determines how heavily AI reasoning weights information from this domain when evidence conflicts.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
                <p className="font-semibold text-foreground">{name || "Untitled domain"}</p>
                <p className="mt-1 text-muted-foreground">{sourceTypes.size} source types · {entityTypes.size} entity types · {relationships.size} relationships</p>
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => (step === 0 ? onOpenChange(false) : setStep((s) => s - 1))}>
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button disabled={!canAdvance} onClick={() => setStep((s) => s + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate}>Create Domain</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
