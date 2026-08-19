import * as React from "react";

import { OPPORTUNITIES } from "@/features/presales/data/opportunities";
import type { DecisionRecord, Opportunity, TimelineEvent } from "@/features/presales/data/types";

interface RecordDecisionInput {
  humanDecision: DecisionRecord["humanDecision"];
  reason?: string;
  notes?: string;
  decidedBy?: string;
}

interface PresalesDataContextValue {
  opportunities: Opportunity[];
  getOpportunity: (id: string) => Opportunity | undefined;
  recordDecision: (opportunityId: string, input: RecordDecisionInput) => void;
}

const PresalesDataContext = React.createContext<PresalesDataContextValue | null>(null);

const STORAGE_KEY = "presales-intelligence:decision-overlay:v1";

interface OverlayEntry {
  decisions: DecisionRecord[];
  timelineEvents: TimelineEvent[];
  lastUpdated: string;
}

function loadOverlay(): Record<string, OverlayEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, OverlayEntry>) : {};
  } catch {
    return {};
  }
}

function saveOverlay(overlay: Record<string, OverlayEntry>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
  } catch {
    // best-effort — this is a demo prototype, not persisted storage of record
  }
}

function buildOpportunities(): Opportunity[] {
  const overlay = loadOverlay();
  return OPPORTUNITIES.map((o) => {
    const extra = overlay[o.id];
    if (!extra) {
      return { ...o, decisions: [...o.decisions], timelineEvents: [...o.timelineEvents] };
    }
    return {
      ...o,
      decisions: [...o.decisions, ...extra.decisions],
      timelineEvents: [...o.timelineEvents, ...extra.timelineEvents],
      lastUpdated: extra.lastUpdated,
    };
  });
}

export function PresalesDataProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>(() =>
    buildOpportunities(),
  );

  const getOpportunity = React.useCallback(
    (id: string) => opportunities.find((o) => o.id === id),
    [opportunities],
  );

  const recordDecision = React.useCallback(
    (opportunityId: string, input: RecordDecisionInput) => {
      const today = "19 Aug 2026";
      const target = opportunities.find((o) => o.id === opportunityId);
      if (!target) return;

      const decision: DecisionRecord = {
        id: `${opportunityId}-dec-${target.decisions.length + 1}`,
        date: today,
        aiRecommendation: target.recommendation,
        humanDecision: input.humanDecision,
        reason: input.reason,
        notes: input.notes,
        decidedBy: input.decidedBy ?? "You",
      };
      const eventTitle =
        input.humanDecision === "Agree"
          ? "Presales reviewer confirmed AI recommendation"
          : input.humanDecision === "Override"
            ? "Presales reviewer overrode AI recommendation"
            : "Presales reviewer requested more information";
      const event: TimelineEvent = {
        date: today,
        title: eventTitle,
        description: input.notes || input.reason,
        actor: "Human",
      };

      const overlay = loadOverlay();
      const existing = overlay[opportunityId];
      overlay[opportunityId] = {
        decisions: [...(existing?.decisions ?? []), decision],
        timelineEvents: [...(existing?.timelineEvents ?? []), event],
        lastUpdated: today,
      };
      saveOverlay(overlay);

      setOpportunities((prev) =>
        prev.map((o) =>
          o.id !== opportunityId
            ? o
            : {
                ...o,
                decisions: [...o.decisions, decision],
                timelineEvents: [...o.timelineEvents, event],
                lastUpdated: today,
              },
        ),
      );
    },
    [opportunities],
  );

  const value = React.useMemo(
    () => ({ opportunities, getOpportunity, recordDecision }),
    [opportunities, getOpportunity, recordDecision],
  );

  return <PresalesDataContext.Provider value={value}>{children}</PresalesDataContext.Provider>;
}

export function usePresalesData() {
  const ctx = React.useContext(PresalesDataContext);
  if (!ctx) throw new Error("usePresalesData must be used within PresalesDataProvider");
  return ctx;
}
