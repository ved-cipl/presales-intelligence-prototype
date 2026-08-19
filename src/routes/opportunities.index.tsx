import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfidenceBadge, PriorityBadge } from "@/features/presales/components/badges";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { OPPORTUNITIES } from "@/features/presales/data/opportunities";
import type { Industry, OpportunityType, Priority } from "@/features/presales/data/types";

export const Route = createFileRoute("/opportunities/")({
  validateSearch: z.object({
    industry: z.string().optional(),
    priority: z.string().optional(),
    capability: z.string().optional(),
    q: z.string().optional(),
  }),
  component: OpportunitiesPage,
});

type SortKey = "value" | "winability" | "confidence" | "updated";

function OpportunitiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState(search.q ?? "");
  const [industry, setIndustry] = React.useState<string>(search.industry ?? "all");
  const [type, setType] = React.useState<string>("all");
  const [account, setAccount] = React.useState<string>("all");
  const [priority, setPriority] = React.useState<string>(search.priority ?? "all");
  const [sort, setSort] = React.useState<SortKey>("value");

  const industries = Array.from(new Set(OPPORTUNITIES.map((o) => o.industry))) as Industry[];
  const types = Array.from(new Set(OPPORTUNITIES.map((o) => o.type))) as OpportunityType[];
  const priorities: Priority[] = ["High", "Monitor", "Discovery", "Low"];

  const filtered = OPPORTUNITIES.filter((o) => {
    if (query && !`${o.name} ${o.client}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (industry !== "all" && o.industry !== industry) return false;
    if (type !== "all" && o.type !== type) return false;
    if (account !== "all" && o.existingAccount !== account) return false;
    if (priority !== "all" && o.priority !== priority) return false;
    if (search.capability && !o.capabilities.includes(search.capability)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "value") return b.estimatedValueMid - a.estimatedValueMid;
    if (sort === "winability") return b.winability - a.winability;
    if (sort === "confidence") return b.confidence - a.confidence;
    return 0;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Opportunities"
        subtitle="AI-enriched view of the presales pipeline"
        actions={
          <Button onClick={() => navigate({ to: "/opportunities/new" })}>
            <Plus className="h-4 w-4" />
            New Opportunity
          </Button>
        }
      />

      {search.capability ? (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-signal-info/25 bg-signal-info/[0.05] px-3 py-2 text-xs text-signal-info">
          Filtered by capability: <span className="font-semibold">{search.capability}</span>
          <button
            className="ml-auto font-medium underline cursor-pointer"
            onClick={() => navigate({ to: "/opportunities", search: {} })}
          >
            Clear
          </button>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search opportunities or clients…"
            className="h-8 pl-8 text-xs"
          />
        </div>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All industries</SelectItem>
            {industries.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-8 w-[170px] text-xs">
            <SelectValue placeholder="Opportunity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={account} onValueChange={setAccount}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All accounts</SelectItem>
            <SelectItem value="Yes">Existing account</SelectItem>
            <SelectItem value="No">New account</SelectItem>
            <SelectItem value="Unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {priorities.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="h-8 w-[170px] text-xs">
            <ArrowUpDown className="h-3 w-3" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value">Sort: Estimated value</SelectItem>
            <SelectItem value="winability">Sort: Winability</SelectItem>
            <SelectItem value="confidence">Sort: Confidence</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} of {OPPORTUNITIES.length}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[220px]">Opportunity</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Est. Value</TableHead>
              <TableHead>Strategic Fit</TableHead>
              <TableHead>Capability Fit</TableHead>
              <TableHead>Winability</TableHead>
              <TableHead>Effort</TableHead>
              <TableHead className="min-w-[190px]">AI Recommendation</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow
                key={o.id}
                className="cursor-pointer"
                onClick={() =>
                  navigate({ to: "/opportunities/$id", params: { id: o.id } })
                }
              >
                <TableCell>
                  <Link
                    to="/opportunities/$id"
                    params={{ id: o.id }}
                    className="font-medium text-foreground hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {o.name}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <PriorityBadge priority={o.priority} />
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{o.client}</TableCell>
                <TableCell className="text-muted-foreground">{o.industry}</TableCell>
                <TableCell className="whitespace-nowrap tabular-nums">
                  {o.estimatedValueLabel}
                </TableCell>
                <TableCell className="tabular-nums">{o.strategicFit.toFixed(1)}</TableCell>
                <TableCell className="tabular-nums">{o.capabilityFit.toFixed(1)}</TableCell>
                <TableCell className="tabular-nums">{o.winability}%</TableCell>
                <TableCell className="tabular-nums">{o.effort}</TableCell>
                <TableCell className="text-xs font-medium text-foreground">
                  {o.recommendation}
                </TableCell>
                <TableCell>
                  <ConfidenceBadge value={o.confidence} />
                </TableCell>
                <TableCell className="text-muted-foreground">{o.owner}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {o.lastUpdated}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="py-10 text-center text-sm text-muted-foreground">
                  No opportunities match the current filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
