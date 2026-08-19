import type { DimensionLevel } from "./types";

export const DIMENSION_DEFS: { key: string; label: string; weight: number }[] = [
  { key: "strategicFit", label: "Strategic Fit", weight: 15 },
  { key: "capabilityFit", label: "Capability Fit", weight: 15 },
  { key: "economicAttractiveness", label: "Economic Attractiveness", weight: 15 },
  { key: "winability", label: "Winability", weight: 15 },
  { key: "relationshipStrength", label: "Relationship Strength", weight: 10 },
  { key: "competitivePosition", label: "Competitive Position", weight: 10 },
  { key: "deliveryRisk", label: "Delivery Risk", weight: 10 },
  { key: "presalesEffort", label: "Presales Effort", weight: 5 },
  { key: "timingUrgency", label: "Timing / Urgency", weight: 5 },
];

export const LEVEL_SCORE: Record<DimensionLevel, number> = {
  High: 9,
  Medium: 6,
  Low: 3,
  Unknown: 0,
};

export const LEVEL_TONE: Record<DimensionLevel, "positive" | "warning" | "risk" | "unknown"> = {
  High: "positive",
  Medium: "warning",
  Low: "risk",
  Unknown: "unknown",
};
