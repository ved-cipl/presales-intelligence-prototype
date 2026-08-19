import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import {
  DECISION_DISTRIBUTION,
  DECISION_KPIS,
  OVERRIDE_REASONS,
  POLICY_LEARNING_INSIGHT,
  POLICY_PERFORMANCE,
} from "@/features/presales/data/decision-analytics";

export const Route = createFileRoute("/decision-analytics")({
  component: DecisionAnalyticsPage,
});

const DECISION_COLOR: Record<string, string> = {
  GO: "var(--signal-positive)",
  DISCOVERY: "var(--signal-warning)",
  "NO-GO": "var(--signal-risk)",
};

function DecisionAnalyticsPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader
        title="Decision Analytics"
        subtitle="How AI-driven qualification decisions are performing across the portfolio"
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {DECISION_KPIS.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{k.value}</p>
            <p className="mt-1 text-[10px] text-muted-foreground/80">{k.subtext}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Decision Distribution</h2>
          <p className="text-xs text-muted-foreground">Final decisions across evaluated opportunities</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={DECISION_DISTRIBUTION} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="decision" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" name="Opportunities" radius={[4, 4, 0, 0]}>
                {DECISION_DISTRIBUTION.map((d) => (
                  <Cell key={d.decision} fill={DECISION_COLOR[d.decision]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Human Override Reasons</h2>
          <p className="text-xs text-muted-foreground">Why humans overrode the AI's recommended decision</p>
          <div className="mt-4 space-y-2.5">
            {OVERRIDE_REASONS.map((r) => {
              const max = OVERRIDE_REASONS[0].count;
              return (
                <div key={r.reason}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{r.reason}</span>
                    <span className="font-semibold tabular-nums text-muted-foreground">{r.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-signal-info"
                      style={{ width: `${(r.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Policy Performance</h2>
        <p className="text-xs text-muted-foreground">Outcome quality by AI decision under Qualification Policy v1.4</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-4">Decision</th>
                <th className="pb-2 pr-4">Opportunities</th>
                <th className="pb-2 pr-4">Win Rate</th>
                <th className="pb-2">Avg. Presales Effort</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {POLICY_PERFORMANCE.map((row) => (
                <tr key={row.decision}>
                  <td className="py-2.5 pr-4 font-medium text-foreground">{row.decision}</td>
                  <td className="py-2.5 pr-4 tabular-nums text-foreground">{row.opportunities}</td>
                  <td className="py-2.5 pr-4 tabular-nums text-foreground">{row.winRate}</td>
                  <td className="py-2.5 tabular-nums text-foreground">{row.avgEffort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-signal-info/25 bg-signal-info/[0.04] p-5">
        <div className="flex items-start gap-2.5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-signal-info" />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">{POLICY_LEARNING_INSIGHT.title}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground">{POLICY_LEARNING_INSIGHT.body}</p>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => {
                toast.success("Opening Qualification Policy v1.4 in the designer", {
                  description: "Adjust Winability's knowledge domains to weight relationship intelligence more heavily.",
                });
                navigate({ to: "/decision-designer", search: { policy: "qualification-v1-4" } });
              }}
            >
              Update Policy
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
