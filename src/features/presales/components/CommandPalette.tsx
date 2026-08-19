import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Blocks,
  Briefcase,
  Database,
  GitBranch,
  Layers,
  LayoutDashboard,
  LineChart,
  ScanSearch,
  Settings2,
  Share2,
  TrendingUp,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { OPPORTUNITIES } from "@/features/presales/data/opportunities";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  function go(to: string) {
    onOpenChange(false);
    navigate({ to });
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search opportunities, clients, capabilities…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard /> Overview
          </CommandItem>
          <CommandItem onSelect={() => go("/opportunities")}>
            <Briefcase /> Opportunities
          </CommandItem>
          <CommandItem onSelect={() => go("/qualification")}>
            <ScanSearch /> Qualification Standards
          </CommandItem>
          <CommandItem onSelect={() => go("/decision-designer")}>
            <GitBranch /> Decision Designer
          </CommandItem>
          <CommandItem onSelect={() => go("/decision-policies")}>
            <Blocks /> Decision Policies
          </CommandItem>
          <CommandItem onSelect={() => go("/decision-analytics")}>
            <LineChart /> Decision Analytics
          </CommandItem>
          <CommandItem onSelect={() => go("/knowledge/domains")}>
            <Database /> Knowledge Domains
          </CommandItem>
          <CommandItem onSelect={() => go("/knowledge/sources")}>
            <Database /> Knowledge Sources
          </CommandItem>
          <CommandItem onSelect={() => go("/knowledge-graph")}>
            <Share2 /> Knowledge Graph
          </CommandItem>
          <CommandItem onSelect={() => go("/knowledge/graph-config")}>
            <Settings2 /> Knowledge Graph Configuration
          </CommandItem>
          <CommandItem onSelect={() => go("/intelligence")}>
            <TrendingUp /> Intelligence
          </CommandItem>
          <CommandItem onSelect={() => go("/platform")}>
            <Layers /> Platform Architecture
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Opportunities">
          {OPPORTUNITIES.map((o) => (
            <CommandItem
              key={o.id}
              value={`${o.name} ${o.client}`}
              onSelect={() => {
                onOpenChange(false);
                navigate({ to: "/opportunities/$id", params: { id: o.id } });
              }}
            >
              <Briefcase />
              <span>
                {o.name}
                <span className="ml-1.5 text-muted-foreground">— {o.client}</span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
