import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/features/presales/components/CommandPalette";
import { CygnetMark } from "@/features/presales/components/CygnetMark";
import { PRESALES_NAV } from "@/features/presales/components/nav";

const NOTIFICATIONS = [
  {
    title: "AI qualification completed",
    detail: "Government AI Platform RFP — 91% confidence",
    time: "2h ago",
  },
  {
    title: "3 opportunities need review",
    detail: "Unknowns added since last check-in",
    time: "5h ago",
  },
  {
    title: "New case study indexed",
    detail: "Retail SOC Deployment now searchable in the knowledge graph",
    time: "1d ago",
  },
];

export function PresalesLayout({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(
    () => new Set(["decision-intelligence", "knowledge"]),
  );

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <CygnetMark className="h-8 w-8 shrink-0 rounded-lg" />
          <div>
            <p className="text-sm font-semibold leading-tight text-white">Presales Intelligence</p>
            <p className="text-[11px] leading-tight text-sidebar-foreground/60">CIPL Internal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {PRESALES_NAV.map((item, i) => {
            if (item.kind === "divider") {
              return <div key={`div-${i}`} className="my-2 border-t border-sidebar-border" />;
            }
            if (item.kind === "group") {
              const isOpen = openGroups.has(item.id) || item.items.some((sub) => pathname.startsWith(sub.to));
              const GroupIcon = item.icon;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.id)}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <GroupIcon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </span>
                    <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {isOpen ? (
                    <div className="mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3.5">
                      {item.items.map((sub) => {
                        const active = pathname === sub.to || pathname.startsWith(`${sub.to}/`);
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className={cn(
                              "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                              active
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                            )}
                          >
                            <SubIcon className="h-3.5 w-3.5 shrink-0" />
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </span>
                {item.comingSoon ? (
                  <span className="rounded border border-sidebar-foreground/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sidebar-foreground/50">
                    Soon
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-positive opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-positive" />
              </span>
              <p className="text-xs font-semibold text-white">System Operational</p>
            </div>
            <p className="mt-1 text-[11px] text-sidebar-foreground/60">
              AI confidence avg. 87% across 96 assessments
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-1">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary/20 text-xs font-semibold text-sidebar-primary">
                PL
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">Presales Lead</p>
              <p className="truncate text-[11px] text-sidebar-foreground/55">presales@cipl.com</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card/60 px-6 backdrop-blur">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 w-72 max-w-sm items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:border-ring cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            Search opportunities, clients, capabilities…
            <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Wednesday, 19 Aug 2026
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-signal-risk" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b border-border px-3 py-2.5">
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                <div className="divide-y divide-border">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.title} className="px-3 py-2.5">
                      <p className="text-xs font-medium text-foreground">{n.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{n.detail}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      PL
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56">
                <p className="text-sm font-semibold text-foreground">Presales Lead</p>
                <p className="text-xs text-muted-foreground">presales@cipl.com</p>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Prototype build — no authentication required.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
