import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/features/presales/components/PageHeader";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <PageContainer>
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/[0.06] text-primary">
          <SettingsIcon className="h-6 w-6" />
        </span>
        <span className="mt-4 rounded-md border border-signal-unknown/25 bg-signal-unknown/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-signal-unknown">
          Coming Soon
        </span>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          User management, notification preferences and integration settings will live here. The
          organizational qualification methodology — the standard the AI is measured against — is
          already configurable today.
        </p>
        <Link to="/qualification" className="mt-6">
          <Button variant="outline">Go to Qualification Standards</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
