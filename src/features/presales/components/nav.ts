import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  BookOpen,
  Briefcase,
  Database,
  GitBranch,
  LayoutDashboard,
  LineChart,
  ScanSearch,
  Settings,
  Share2,
  TrendingUp,
  Workflow,
} from "lucide-react";

export interface NavLink {
  kind: "link";
  label: string;
  to: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export interface NavGroup {
  kind: "group";
  id: string;
  label: string;
  icon: LucideIcon;
  items: { label: string; to: string; icon: LucideIcon }[];
}

export interface NavDivider {
  kind: "divider";
}

export type NavEntry = NavLink | NavGroup | NavDivider;

export const PRESALES_NAV: NavEntry[] = [
  { kind: "link", label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { kind: "link", label: "Opportunities", to: "/opportunities", icon: Briefcase },
  { kind: "link", label: "Qualification", to: "/qualification", icon: ScanSearch },
  { kind: "divider" },
  {
    kind: "group",
    id: "decision-intelligence",
    label: "Decision Intelligence",
    icon: Workflow,
    items: [
      { label: "Decision Designer", to: "/decision-designer", icon: GitBranch },
      { label: "Decision Policies", to: "/decision-policies", icon: Blocks },
      { label: "Decision Analytics", to: "/decision-analytics", icon: LineChart },
    ],
  },
  {
    kind: "group",
    id: "knowledge",
    label: "Knowledge",
    icon: Database,
    items: [
      { label: "Knowledge Domains", to: "/knowledge/domains", icon: BookOpen },
      { label: "Knowledge Sources", to: "/knowledge/sources", icon: Database },
      { label: "Knowledge Graph", to: "/knowledge-graph", icon: Share2 },
    ],
  },
  { kind: "divider" },
  { kind: "link", label: "Intelligence", to: "/intelligence", icon: TrendingUp },
  { kind: "link", label: "Solutions", to: "/solutions", icon: Blocks, comingSoon: true },
  { kind: "link", label: "Settings", to: "/settings", icon: Settings },
];
