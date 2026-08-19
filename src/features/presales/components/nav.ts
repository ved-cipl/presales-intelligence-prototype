import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  BookOpen,
  Briefcase,
  LayoutDashboard,
  ScanSearch,
  Settings,
  Share2,
  TrendingUp,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export const PRESALES_NAV: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Opportunities", to: "/opportunities", icon: Briefcase },
  { label: "Qualification", to: "/qualification", icon: ScanSearch },
  { label: "Knowledge Graph", to: "/knowledge-graph", icon: Share2 },
  { label: "Intelligence", to: "/intelligence", icon: TrendingUp },
  { label: "Solutions", to: "/solutions", icon: Blocks, comingSoon: true },
  { label: "Knowledge", to: "/knowledge", icon: BookOpen, comingSoon: true },
  { label: "Settings", to: "/settings", icon: Settings, comingSoon: true },
];
