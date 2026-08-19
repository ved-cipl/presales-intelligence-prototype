import { OPPORTUNITIES } from "./opportunities";

const gapOpportunityId = "opp-gov-ai-platform";
const sapOpportunityId = "opp-sap-modernization";
const lasOpportunityId = "opp-legacy-support";

export const KPI_CARDS = [
  { label: "Active Opportunities", value: "128", subtext: "+14 this month" },
  { label: "AI-Assessed", value: "96", subtext: "75% of active opportunities" },
  { label: "High-Priority Opportunities", value: "27", subtext: "Recommended for active pursuit" },
  { label: "Attention Saved", value: "184 hrs", subtext: "Estimated this quarter" },
  { label: "Qualification Confidence", value: "87%", subtext: "Average evidence confidence" },
] as const;

export const DASHBOARD_RECOMMENDATIONS = [
  {
    kind: "Prioritize" as const,
    title: "Government AI Platform RFP",
    reason: "High strategic fit + strong capability match + existing account relationship.",
    buttonLabel: "Review",
    opportunityId: gapOpportunityId,
  },
  {
    kind: "Investigate" as const,
    title: "Global SAP Modernization",
    reason: "Large opportunity but insufficient information about budget and competition.",
    buttonLabel: "Investigate",
    opportunityId: sapOpportunityId,
  },
  {
    kind: "Deprioritize" as const,
    title: "Legacy Application Support",
    reason: "Low strategic fit and high expected delivery effort.",
    buttonLabel: "View reasoning",
    opportunityId: lasOpportunityId,
  },
  {
    kind: "Emerging Signal" as const,
    title: "Demand for GenAI governance increased 34% across recent opportunities.",
    reason: "AI Governance requirements now appear in 6 of the last 12 opportunities logged.",
    buttonLabel: "Explore trend",
    opportunityId: null,
  },
];

export const EMERGING_TECHNOLOGIES = [
  { label: "GenAI", change: "+42%" },
  { label: "AI Governance", change: "+34%" },
  { label: "Agentic AI", change: "+28%" },
  { label: "Cloud Modernization", change: "+21%" },
];

const INDUSTRIES = ["Government", "BFSI", "Manufacturing", "Retail", "Healthcare"] as const;

export const INDUSTRY_DEMAND = INDUSTRIES.map((industry) => {
  const opps = OPPORTUNITIES.filter((o) => o.industry === industry);
  return {
    industry,
    opportunities: opps.length,
    valueCr: opps.reduce((sum, o) => sum + o.estimatedValueMid, 0),
  };
});

export const CAPABILITY_DEMAND = (() => {
  const counts = new Map<string, number>();
  for (const o of OPPORTUNITIES) {
    for (const cap of o.capabilities) counts.set(cap, (counts.get(cap) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([capability, count]) => ({ capability, count }))
    .sort((a, b) => b.count - a.count);
})();

export const STRATEGIC_SIGNAL = {
  title: "AI Governance is emerging as a recurring requirement",
  explanation:
    "34% increase in opportunities mentioning AI governance, model risk, data governance or responsible AI compared with the previous period.",
  contributingOpportunityIds: OPPORTUNITIES.filter((o) =>
    o.capabilities.includes("AI Governance"),
  ).map((o) => o.id),
};

export const MARKET_MAP = [
  {
    industry: "Government",
    requirements: [
      { label: "AI Transformation", technologies: ["GenAI", "AI Governance", "Data Platform"] },
      { label: "Digital Services", technologies: ["Cloud", "Data Engineering"] },
    ],
  },
  {
    industry: "BFSI",
    requirements: [
      { label: "Lending", technologies: ["AI/ML", "Data Engineering"] },
      { label: "Fraud Detection", technologies: ["AI/ML", "Cybersecurity"] },
      { label: "Customer Intelligence", technologies: ["GenAI", "Data Platform"] },
    ],
  },
  {
    industry: "Manufacturing",
    requirements: [
      { label: "ERP Modernization", technologies: ["SAP", "Cloud"] },
      { label: "Factory Systems", technologies: ["Cloud", "RPA"] },
    ],
  },
  {
    industry: "Retail",
    requirements: [
      { label: "Customer Service AI", technologies: ["GenAI"] },
      { label: "Security Operations", technologies: ["Cybersecurity"] },
    ],
  },
  {
    industry: "Healthcare",
    requirements: [{ label: "Patient Analytics", technologies: ["Data Platform", "AI/ML"] }],
  },
];
