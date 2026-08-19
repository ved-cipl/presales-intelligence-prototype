import { OPPORTUNITIES, getOpportunity } from "./opportunities";
import type { Opportunity } from "./types";

export interface DecisionTraceStep {
  nodeId: string;
  outcome?: string;
}

export interface SimulationResult {
  path: string[];
  edgeOutcomes: Record<string, string>;
  finalDecisionNodeId: string;
  finalDecision: "GO" | "NO-GO" | "DISCOVERY REQUIRED";
  confidence: number;
  reason: string;
  nextAction: string;
}

function level(o: Opportunity, key: string) {
  return o.dimensions.find((d) => d.key === key)?.level ?? "Unknown";
}

export type SimulationOverrides = Partial<
  Record<"strategicFit" | "capabilityFit" | "economicAttractiveness" | "winability" | "competitivePosition", string>
>;

export function simulateQualificationV14(
  opportunityId: string,
  overrides: SimulationOverrides = {},
): SimulationResult | null {
  const o = getOpportunity(opportunityId);
  if (!o) return null;

  const strategic = overrides.strategicFit ?? level(o, "strategicFit");
  const capability = overrides.capabilityFit ?? level(o, "capabilityFit");
  const economic = overrides.economicAttractiveness ?? level(o, "economicAttractiveness");
  const winability = overrides.winability ?? level(o, "winability");
  const competitivePosition = overrides.competitivePosition ?? level(o, "competitivePosition");

  if (competitivePosition === "Low") {
    return {
      path: ["trig-1", "ext-1", "ai-strategic", "cond-capability", "ev-budget", "score-economic", "ai-winability", "dec-nogo-2"],
      edgeOutcomes: { "ai-winability": "STRONG COMPETITION" },
      finalDecisionNodeId: "dec-nogo-2",
      finalDecision: "NO-GO",
      confidence: Math.max(60, o.confidence - 5),
      reason: "Strong incumbent competition exceeds this policy's qualification risk threshold, regardless of other factors.",
      nextAction: "Deprioritize unless a differentiated angle against the incumbent can be established.",
    };
  }

  const path: string[] = ["trig-1", "ext-1", "ai-strategic"];
  const edgeOutcomes: Record<string, string> = {};

  if (strategic !== "High") {
    path.push("dec-nogo-1");
    return {
      path,
      edgeOutcomes: { "ai-strategic": "LOW" },
      finalDecisionNodeId: "dec-nogo-1",
      finalDecision: "NO-GO",
      confidence: o.confidence,
      reason: `Strategic fit is ${strategic.toLowerCase()}, below the organizational threshold required to continue.`,
      nextAction: "Archive opportunity — no further presales effort required.",
    };
  }
  edgeOutcomes["ai-strategic"] = "HIGH";
  path.push("cond-capability");

  if (capability !== "High" && capability !== "Medium") {
    path.push("dec-nogo-2");
    return {
      path,
      edgeOutcomes: { ...edgeOutcomes, "cond-capability": "FAIL" },
      finalDecisionNodeId: "dec-nogo-2",
      finalDecision: "NO-GO",
      confidence: o.confidence,
      reason: `Capability fit is ${capability.toLowerCase()}, below the Medium threshold this policy requires.`,
      nextAction: "Archive opportunity — no further presales effort required.",
    };
  }
  edgeOutcomes["cond-capability"] = "PASS";
  path.push("ev-budget");

  if (economic === "Unknown") {
    path.push("hgate-1", "dec-discovery-1");
    return {
      path,
      edgeOutcomes: { ...edgeOutcomes, "ev-budget": "NO" },
      finalDecisionNodeId: "dec-discovery-1",
      finalDecision: "DISCOVERY REQUIRED",
      confidence: Math.max(30, o.confidence - 20),
      reason: "No budget evidence was found, so the policy routes this to human review before an economic assessment can run.",
      nextAction: "Obtain budget confirmation before re-qualifying.",
    };
  }
  edgeOutcomes["ev-budget"] = "YES";
  path.push("score-economic");

  if (economic !== "High") {
    path.push("dec-discovery-1");
    return {
      path,
      edgeOutcomes: { ...edgeOutcomes, "score-economic": "LOW" },
      finalDecisionNodeId: "dec-discovery-1",
      finalDecision: "DISCOVERY REQUIRED",
      confidence: o.confidence,
      reason: `Economic fit is ${economic.toLowerCase()}; commercial attractiveness needs to be confirmed before committing full presales effort.`,
      nextAction: "Confirm budget range and margin expectation before re-qualifying.",
    };
  }
  edgeOutcomes["score-economic"] = "HIGH";
  path.push("ai-winability");

  if (winability !== "High") {
    path.push("dec-discovery-2");
    return {
      path,
      edgeOutcomes: { ...edgeOutcomes, "ai-winability": "MEDIUM/LOW" },
      finalDecisionNodeId: "dec-discovery-2",
      finalDecision: "DISCOVERY REQUIRED",
      confidence: o.confidence,
      reason:
        "Strategic and capability alignment are strong, but competition and relationship evidence remain unverified, leaving winability uncertain.",
      nextAction: "Obtain competitive intelligence and relationship evidence before re-qualifying.",
    };
  }
  edgeOutcomes["ai-winability"] = "HIGH";
  path.push("dec-go", "act-assign");
  return {
    path,
    edgeOutcomes,
    finalDecisionNodeId: "dec-go",
    finalDecision: "GO",
    confidence: o.confidence,
    reason: "Strategic fit, capability fit, economic fit and winability all clear the organizational qualification threshold.",
    nextAction: "Assign an owner and proceed directly to solutioning.",
  };
}

export interface PortfolioSimulationResult {
  totalEvaluated: number;
  go: number;
  discoveryRequired: number;
  noGo: number;
  hoursBefore: number;
  hoursAfter: number;
  hoursReleased: number;
}

export const PORTFOLIO_SIMULATION: PortfolioSimulationResult = {
  totalEvaluated: 100,
  go: 27,
  discoveryRequired: 31,
  noGo: 42,
  hoursBefore: 420,
  hoursAfter: 248,
  hoursReleased: 172,
};

export function simulateAllOpportunities() {
  return OPPORTUNITIES.map((o) => ({ opportunity: o, result: simulateQualificationV14(o.id)! }));
}
