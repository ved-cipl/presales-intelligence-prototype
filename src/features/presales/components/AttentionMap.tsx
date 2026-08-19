import { useNavigate } from "@tanstack/react-router";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { OPPORTUNITIES } from "@/features/presales/data/opportunities";
import type { Opportunity, Priority } from "@/features/presales/data/types";

const PRIORITY_COLOR: Record<Priority, string> = {
  High: "var(--signal-positive)",
  Monitor: "var(--signal-warning)",
  Discovery: "var(--signal-unknown)",
  Low: "var(--signal-risk)",
};

const PRIORITIES: Priority[] = ["High", "Monitor", "Discovery", "Low"];

function TooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Opportunity }[];
}) {
  if (!active || !payload?.length) return null;
  const o = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-md">
      <p className="text-sm font-semibold text-foreground">{o.name}</p>
      <p className="text-xs text-muted-foreground">{o.client}</p>
      <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
        <span>
          Value: <span className="font-medium text-foreground">{o.estimatedValueLabel}</span>
        </span>
        <span>
          Winability: <span className="font-medium text-foreground">{o.winability}%</span>
        </span>
        <span>
          Effort: <span className="font-medium text-foreground">{o.effort}</span>
        </span>
        <span>
          Priority: <span className="font-medium text-foreground">{o.priority}</span>
        </span>
      </div>
    </div>
  );
}

export function AttentionMap() {
  const navigate = useNavigate();

  return (
    <div>
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="estimatedValueMid"
            name="Expected Value"
            unit=" Cr"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            label={{
              value: "Expected Value (₹ Cr)",
              position: "insideBottom",
              offset: -4,
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
          />
          <YAxis
            type="number"
            dataKey="winability"
            name="Winability"
            unit="%"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            label={{
              value: "Winability",
              angle: -90,
              position: "insideLeft",
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
          />
          <ZAxis type="number" dataKey="effort" range={[80, 500]} name="Presales Effort" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<TooltipContent />} />
          {PRIORITIES.map((p) => (
            <Scatter
              key={p}
              name={p}
              data={OPPORTUNITIES.filter((o) => o.priority === p)}
              fill={PRIORITY_COLOR[p]}
              fillOpacity={0.75}
              stroke={PRIORITY_COLOR[p]}
              cursor="pointer"
              onClick={(point: unknown) => {
                const o = point as Opportunity;
                if (o?.id) navigate({ to: "/opportunities/$id", params: { id: o.id } });
              }}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1">
        {PRIORITIES.map((p) => (
          <span key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: PRIORITY_COLOR[p] }}
            />
            {p}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-muted-foreground">
          Bubble size = presales effort
        </span>
      </div>
    </div>
  );
}
