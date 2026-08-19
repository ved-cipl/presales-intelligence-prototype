import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn(
          "shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer",
          value
            ? "border-signal-positive/25 bg-signal-positive/10 text-signal-positive"
            : "border-border bg-muted text-muted-foreground",
        )}
      >
        {value ? "On" : "Off"}
      </button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function SettingsPage() {
  const [requireApproval, setRequireApproval] = React.useState(true);
  const [notifyOnOverride, setNotifyOnOverride] = React.useState(true);
  const [autoPublishDrafts, setAutoPublishDrafts] = React.useState(false);

  const [requireReviewOnUnverified, setRequireReviewOnUnverified] = React.useState(true);
  const [flagConflicts, setFlagConflicts] = React.useState(true);
  const [allowSelfServiceDomains, setAllowSelfServiceDomains] = React.useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        subtitle="Governance controls for how decisions are made and knowledge is trusted"
      />

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Decision Governance</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Controls on how decision policies are authored, published and overridden
          </p>
          <div className="mt-3">
            <InfoRow label="Policy publish authority" value="Presales Leadership" />
            <InfoRow label="Active published policy" value="Qualification Policy v1.4" />
            <InfoRow label="Human override rate (last 90 days)" value="18%" />
          </div>
          <div className="mt-1">
            <ToggleRow
              label="Require approval before publishing"
              description="A second reviewer must approve policy changes before they go live"
              value={requireApproval}
              onChange={setRequireApproval}
            />
            <ToggleRow
              label="Notify owner on every human override"
              description="Alerts the policy owner whenever a human overrides an AI decision"
              value={notifyOnOverride}
              onChange={setNotifyOnOverride}
            />
            <ToggleRow
              label="Auto-publish new draft policies"
              description="Skip Draft status and publish immediately on save (not recommended)"
              value={autoPublishDrafts}
              onChange={setAutoPublishDrafts}
            />
          </div>
          <Link to="/decision-policies" className="mt-3 inline-block">
            <Button variant="outline" size="sm">
              View Decision Policies
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Knowledge Governance</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Controls on how knowledge domains are trusted and maintained
          </p>
          <div className="mt-3">
            <InfoRow label="Knowledge domains" value="5 active" />
            <InfoRow label="Connected sources" value="12" />
            <InfoRow label="Average knowledge health" value="79%" />
          </div>
          <div className="mt-1">
            <ToggleRow
              label="Require human review of Unverified facts"
              description="AI assessments may not rely solely on Unverified-trust knowledge"
              value={requireReviewOnUnverified}
              onChange={setRequireReviewOnUnverified}
            />
            <ToggleRow
              label="Flag conflicting evidence automatically"
              description="Surface a warning whenever sources disagree on the same fact"
              value={flagConflicts}
              onChange={setFlagConflicts}
            />
            <ToggleRow
              label="Allow self-service domain creation"
              description="Let any presales user create a new knowledge domain without approval"
              value={allowSelfServiceDomains}
              onChange={setAllowSelfServiceDomains}
            />
          </div>
          <Link to="/knowledge/domains" className="mt-3 inline-block">
            <Button variant="outline" size="sm">
              View Knowledge Domains
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/[0.06] text-primary">
          <SettingsIcon className="h-5 w-5" />
        </span>
        <span className="mt-3 rounded-md border border-signal-unknown/25 bg-signal-unknown/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-signal-unknown">
          Coming Soon
        </span>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">
          User management, notification preferences and integration settings will live here.
        </p>
      </div>
    </PageContainer>
  );
}
