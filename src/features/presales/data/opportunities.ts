import { DIMENSION_DEFS, LEVEL_SCORE } from "./dimension-defs";
import type {
  DimensionLevel,
  EvidencePoint,
  Opportunity,
  QualificationDimension,
  SourceType,
  TimelineEvent,
  UnknownItem,
} from "./types";

let evCounter = 0;
function ev(
  oppId: string,
  text: string,
  source: string,
  sourceType: SourceType,
  confidence: EvidencePoint["confidence"],
  timestamp: string,
  interpretation: string,
  supportsLabel: string,
  supportsDimension: string,
): EvidencePoint {
  evCounter += 1;
  return {
    id: `${oppId}-ev-${evCounter}`,
    text,
    source,
    sourceType,
    confidence,
    timestamp,
    interpretation,
    supportsLabel,
    supportsDimension,
  };
}

function dims(
  oppId: string,
  levels: Record<string, { level: DimensionLevel; assessment: string; evidenceIds?: string[] }>,
): QualificationDimension[] {
  return DIMENSION_DEFS.map((def) => {
    const entry = levels[def.key] ?? {
      level: "Unknown" as DimensionLevel,
      assessment: "No evidence collected yet for this dimension.",
      evidenceIds: [],
    };
    return {
      key: def.key,
      label: def.label,
      weight: def.weight,
      level: entry.level,
      score: LEVEL_SCORE[entry.level],
      assessment: entry.assessment,
      evidenceIds: entry.evidenceIds ?? [],
    };
  });
}

function unknownsFromDims(oppId: string, d: QualificationDimension[]): UnknownItem[] {
  const copy: Record<string, { why: string; action: string }> = {
    relationshipStrength: {
      why: "Relationship strength shapes access to decision-makers and how much benefit-of-the-doubt the opportunity gets during evaluation.",
      action: "Verify",
    },
    competitivePosition: {
      why: "Not knowing who else is bidding materially changes win probability and pricing strategy.",
      action: "Investigate",
    },
    economicAttractiveness: {
      why: "Budget confirmation materially affects commercial attractiveness and effort justification.",
      action: "Add information",
    },
    deliveryRisk: {
      why: "Unassessed delivery risk can lead to under-scoped effort and margin erosion later.",
      action: "Add information",
    },
    winability: {
      why: "Without a winability read, presales effort may be spent on opportunities unlikely to convert.",
      action: "Investigate",
    },
  };
  return d
    .filter((x) => x.level === "Unknown")
    .map((x) => ({
      id: `${oppId}-unk-${x.key}`,
      label: x.label,
      status: "Unknown" as const,
      whyItMatters:
        copy[x.key]?.why ??
        "This dimension has no supporting evidence yet, which lowers overall confidence.",
      actionLabel: copy[x.key]?.action ?? "Add information",
    }));
}

function timeline(oppId: string, entries: TimelineEvent[]): TimelineEvent[] {
  return entries;
}

// ───────────────────────────────────────────────────────────────────────────
// 1. HERO — National Infrastructure Authority (default demo-intake opportunity)
// ───────────────────────────────────────────────────────────────────────────
const nia_ev1 = ev(
  "opp-nia",
  "Client requires an AI governance framework covering model risk, data governance and responsible-AI controls across all new platform components.",
  "RFP Section 3.2",
  "RFP",
  "High",
  "2026-08-12",
  "Directly matches organizational AI Governance capability; strong signal of capability fit.",
  "Supports Capability Fit",
  "capabilityFit",
);
const nia_ev2 = ev(
  "opp-nia",
  "Scope spans AI governance, data infrastructure modernization, GenAI applications and enterprise system integration across 6 departments.",
  "RFP Section 1 — Scope of Work",
  "RFP",
  "High",
  "2026-08-12",
  "Broad, multi-capability scope aligned with the organization's core AI/cloud/data offering.",
  "Supports Strategic Fit",
  "strategicFit",
);
const nia_ev3 = ev(
  "opp-nia",
  "Organization delivered a comparable Government Data Platform program (2024) with a 94% client satisfaction score and on-time go-live.",
  "Case Study: Government Data Platform",
  "Historical project",
  "High",
  "2026-08-13",
  "Directly relevant delivery precedent in the same industry reduces execution risk and strengthens the pitch.",
  "Supports Capability Fit",
  "capabilityFit",
);
const nia_ev4 = ev(
  "opp-nia",
  "Estimated contract value range of ₹8–12 Cr stated in RFP commercial annexure; multi-year engagement implied by 9–12 month phase-1 timeline.",
  "RFP Commercial Annexure",
  "RFP",
  "Medium",
  "2026-08-12",
  "Sizeable value with likely follow-on phases; strong economic potential, though full budget approval is not yet confirmed.",
  "Supports Economic Attractiveness",
  "economicAttractiveness",
);
const nia_ev5 = ev(
  "opp-nia",
  "RFP requires proposals within 21 days and references an active national digital transformation mandate.",
  "RFP Section 1.1 — Background",
  "RFP",
  "High",
  "2026-08-12",
  "Tight timeline plus a funded government mandate signal genuine urgency rather than exploratory intent.",
  "Supports Timing / Urgency",
  "timingUrgency",
);
const nia_ev6 = ev(
  "opp-nia",
  "No prior engagement found in CRM for this specific authority; no named contact or sponsor identified.",
  "CRM Account Search",
  "CRM",
  "Medium",
  "2026-08-13",
  "Absence of a relationship record means access and trust will need to be established from a standing start.",
  "Relationship Strength — no record found",
  "relationshipStrength",
);
const nia_ev7 = ev(
  "opp-nia",
  "RFP does not disclose an incumbent vendor or shortlist size; open public tender process.",
  "RFP Section 2 — Procurement Process",
  "RFP",
  "Low",
  "2026-08-12",
  "Open tender with no visibility into competitors makes competitive position difficult to assess.",
  "Competitive Position — undisclosed",
  "competitivePosition",
);
const nia_ev8 = ev(
  "opp-nia",
  "Delivery will require coordinated staffing across AI/ML, Cloud Engineering, Data Engineering and AI Governance practices simultaneously.",
  "Capability Mapping (auto-generated)",
  "Historical project",
  "Medium",
  "2026-08-13",
  "Multi-practice delivery raises coordination risk moderately but is within demonstrated organizational range.",
  "Supports Delivery Risk",
  "deliveryRisk",
);

const nia_dims = dims("opp-nia", {
  strategicFit: {
    level: "High",
    assessment:
      "Requirement scope is a close match to the organization's current AI transformation priorities and government sector focus.",
    evidenceIds: [nia_ev2.id],
  },
  capabilityFit: {
    level: "High",
    assessment:
      "Four relevant capabilities identified — AI/ML, Cloud Engineering, Data Engineering and AI Governance — with a directly comparable delivery precedent.",
    evidenceIds: [nia_ev1.id, nia_ev3.id],
  },
  economicAttractiveness: {
    level: "High",
    assessment:
      "₹8–12 Cr estimated value with multi-phase potential represents strong economic upside for a single engagement.",
    evidenceIds: [nia_ev4.id],
  },
  winability: {
    level: "Medium",
    assessment:
      "Strong capability match offsets the lack of an existing relationship, but an open tender with unknown competitors caps confidence.",
    evidenceIds: [nia_ev6.id, nia_ev7.id],
  },
  relationshipStrength: {
    level: "Unknown",
    assessment: "No prior engagement or named sponsor found for this authority.",
    evidenceIds: [nia_ev6.id],
  },
  competitivePosition: {
    level: "Unknown",
    assessment: "Procurement process does not disclose incumbent or shortlist composition.",
    evidenceIds: [nia_ev7.id],
  },
  deliveryRisk: {
    level: "Medium",
    assessment:
      "Multi-practice delivery across four capability areas is coordination-heavy but within demonstrated organizational range.",
    evidenceIds: [nia_ev8.id],
  },
  presalesEffort: {
    level: "Medium",
    assessment:
      "Response requires cross-practice solutioning and a formal government proposal, but reusable case study material exists.",
    evidenceIds: [nia_ev3.id],
  },
  timingUrgency: {
    level: "High",
    assessment: "21-day response window tied to an active, funded transformation mandate.",
    evidenceIds: [nia_ev5.id],
  },
});

const nia: Opportunity = {
  id: "opp-nia",
  name: "Enterprise AI Transformation Platform",
  client: "National Infrastructure Authority",
  industry: "Government",
  geography: "National — Federal",
  type: "RFP",
  estimatedValueLabel: "₹8–12 Cr",
  estimatedValueMid: 10,
  timeline: "9–12 months (Phase 1)",
  existingAccount: "No",
  decisionStage: "RFP issued — response in preparation",
  competition: "Unknown",
  procurementModel: "Open public tender",
  owner: "Ananya Rao",
  ownerInitials: "AR",
  lastUpdated: "19 Aug 2026",
  priority: "High",
  winability: 62,
  effort: 58,
  confidence: 82,
  strategicFit: 8.7,
  capabilityFit: 9.1,
  recommendation: "QUALIFY FOR DISCOVERY",
  qualificationStatus: "Qualify for Discovery",
  summary:
    "National Infrastructure Authority is seeking an enterprise AI transformation platform covering AI governance, data infrastructure, GenAI applications and enterprise integration. The opportunity aligns strongly with the organization's AI/cloud capabilities. Existing government delivery experience provides relevant context, although no direct relationship or confirmed budget has been identified.",
  whyReasons: [
    {
      title: "Strong capability alignment",
      detail:
        "4 relevant capabilities identified: AI/ML, Cloud Engineering, Data Engineering, AI Governance.",
      polarity: "positive",
    },
    {
      title: "Strong economic potential",
      detail: "Estimated opportunity value: ₹8–12 Cr, with likely multi-phase follow-on.",
      polarity: "positive",
    },
    {
      title: "Strategic relevance",
      detail: "Requirement aligns with the organization's current AI transformation priorities.",
      polarity: "positive",
    },
    {
      title: "Insufficient relationship evidence",
      detail: "Client relationship is currently unknown — no CRM record or named sponsor.",
      polarity: "negative",
    },
    {
      title: "Competitive position unknown",
      detail: "No reliable competition information found in the open tender documents.",
      polarity: "negative",
    },
  ],
  whatWouldChange:
    "Confirmed budget, an identified decision-maker, or evidence of strong incumbent competition could change this recommendation.",
  technologies: ["Azure", "AWS", "GenAI", "Data Platform"],
  capabilities: ["AI/ML", "Cloud Engineering", "Data Engineering", "AI Governance"],
  badges: ["New RFP", "Government", "₹8–12 Cr", "High Priority"],
  dimensions: nia_dims,
  evidence: [nia_ev1, nia_ev2, nia_ev3, nia_ev4, nia_ev5, nia_ev6, nia_ev7, nia_ev8],
  unknowns: [
    ...unknownsFromDims("opp-nia", nia_dims),
    {
      id: "opp-nia-unk-decisionmaker",
      label: "Decision Maker",
      status: "Unknown",
      whyItMatters: "No named evaluator or sponsor has been identified inside the authority.",
      actionLabel: "Add information",
    },
  ],
  similarOpportunityIds: ["opp-gov-ai-platform", "opp-gov-data-expansion", "opp-tax-compliance"],
  timelineEvents: timeline("opp-nia", [
    { date: "12 Aug 2026", title: "RFP received and logged", actor: "System" },
    {
      date: "19 Aug 2026",
      title: "AI qualification completed",
      description: "Confidence 82% — Qualify for Discovery",
      actor: "AI",
    },
  ]),
  decisions: [],
};

// ───────────────────────────────────────────────────────────────────────────
// 2. Government AI Platform RFP — Prioritize (Overview recommendation)
// ───────────────────────────────────────────────────────────────────────────
const gap_ev1 = ev(
  "opp-gov-ai-platform",
  "Ministry names our organization's AI Center of Excellence case study as a reference model in the RFP background section.",
  "RFP Section 1 — Background",
  "RFP",
  "High",
  "2026-08-05",
  "Being cited by name is an unusually strong strategic and relationship signal.",
  "Supports Strategic Fit",
  "strategicFit",
);
const gap_ev2 = ev(
  "opp-gov-ai-platform",
  "Existing framework agreement with the Ministry from a prior data platform engagement, account team already assigned.",
  "CRM Account Record",
  "CRM",
  "High",
  "2026-08-06",
  "Existing account relationship substantially improves access and trust.",
  "Supports Relationship Strength",
  "relationshipStrength",
);
const gap_ev3 = ev(
  "opp-gov-ai-platform",
  "Requirement covers agentic AI case management and GenAI document processing — both active organizational capability investments.",
  "RFP Section 4 — Technical Requirements",
  "RFP",
  "High",
  "2026-08-06",
  "Strong match to current capability build-out, positioning us ahead of generalist competitors.",
  "Supports Capability Fit",
  "capabilityFit",
);
const gap_dims = dims("opp-gov-ai-platform", {
  strategicFit: {
    level: "High",
    assessment: "Named reference account with direct strategic alignment.",
    evidenceIds: [gap_ev1.id],
  },
  capabilityFit: {
    level: "High",
    assessment: "Agentic AI and GenAI document processing match current investment areas.",
    evidenceIds: [gap_ev3.id],
  },
  economicAttractiveness: {
    level: "High",
    assessment: "₹12–16 Cr multi-year framework value with renewal potential.",
    evidenceIds: [],
  },
  winability: {
    level: "High",
    assessment:
      "Existing relationship plus named reference status make this a strong win candidate.",
    evidenceIds: [gap_ev2.id],
  },
  relationshipStrength: {
    level: "High",
    assessment: "Active framework agreement and assigned account team.",
    evidenceIds: [gap_ev2.id],
  },
  competitivePosition: {
    level: "Medium",
    assessment: "Incumbent advantage, though the RFP is technically open to competitors.",
    evidenceIds: [],
  },
  deliveryRisk: {
    level: "Low",
    assessment: "Team has delivered comparable scope for this client before.",
    evidenceIds: [],
  },
  presalesEffort: {
    level: "Low",
    assessment: "Existing account context and reusable reference material reduce response effort.",
    evidenceIds: [],
  },
  timingUrgency: {
    level: "High",
    assessment: "Ministry has a board-approved deadline for vendor selection this quarter.",
    evidenceIds: [],
  },
});
const gap: Opportunity = {
  id: "opp-gov-ai-platform",
  name: "Government AI Platform RFP",
  client: "Ministry of Digital Services",
  industry: "Government",
  geography: "National — Federal",
  type: "RFP",
  estimatedValueLabel: "₹12–16 Cr",
  estimatedValueMid: 14,
  timeline: "12–15 months",
  existingAccount: "Yes",
  decisionStage: "Vendor evaluation — shortlisting",
  competition: "2 other shortlisted vendors (named)",
  procurementModel: "Restricted framework RFP",
  owner: "Vikram Sethi",
  ownerInitials: "VS",
  lastUpdated: "18 Aug 2026",
  priority: "High",
  winability: 84,
  effort: 40,
  confidence: 91,
  strategicFit: 9.4,
  capabilityFit: 9.0,
  recommendation: "QUALIFY — ACTIVE PURSUIT",
  qualificationStatus: "Qualified",
  summary:
    "The Ministry of Digital Services has issued an AI platform RFP that names our organization's prior work as a reference model. Combined with an active framework agreement and strong capability alignment on agentic AI and GenAI document processing, this is a high-confidence, high-priority pursuit.",
  whyReasons: [
    {
      title: "Named strategic account",
      detail: "Client cites our AI CoE case study directly in the RFP.",
      polarity: "positive",
    },
    {
      title: "Existing relationship",
      detail: "Active framework agreement with an assigned account team.",
      polarity: "positive",
    },
    {
      title: "Strong capability match",
      detail: "Agentic AI and GenAI document processing align with current investment.",
      polarity: "positive",
    },
    {
      title: "Named competition",
      detail: "Two shortlisted vendors are known, allowing targeted differentiation.",
      polarity: "positive",
    },
  ],
  whatWouldChange:
    "A materially lower budget allocation or loss of the incumbent framework agreement would lower confidence.",
  technologies: ["Azure", "GenAI", "Data Platform"],
  capabilities: ["AI/ML", "AI Governance", "Cloud Engineering"],
  badges: ["RFP", "Government", "₹12–16 Cr", "High Priority"],
  dimensions: gap_dims,
  evidence: [gap_ev1, gap_ev2, gap_ev3],
  unknowns: unknownsFromDims("opp-gov-ai-platform", gap_dims),
  similarOpportunityIds: ["opp-nia", "opp-gov-data-expansion"],
  timelineEvents: [
    { date: "05 Aug 2026", title: "RFP received via existing account team", actor: "Human" },
    {
      date: "06 Aug 2026",
      title: "AI qualification completed",
      description: "Confidence 91% — Qualify, active pursuit",
      actor: "AI",
    },
    {
      date: "08 Aug 2026",
      title: "Presales reviewer confirmed relationship strength",
      actor: "Human",
    },
    { date: "18 Aug 2026", title: "Solutioning initiated", actor: "Human" },
  ],
  decisions: [
    {
      id: "dec-gap-1",
      date: "08 Aug 2026",
      aiRecommendation: "QUALIFY — ACTIVE PURSUIT",
      humanDecision: "Agree",
      decidedBy: "Vikram Sethi",
      notes: "Confirmed via account team — proceeding directly to solutioning.",
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// 3. Global SAP Modernization — Investigate (insufficient budget/competition info)
// ───────────────────────────────────────────────────────────────────────────
const sap_ev1 = ev(
  "opp-sap-modernization",
  "RFI requests a global S/4HANA rollout across 14 manufacturing sites in 3 regions, no phased budget breakdown provided.",
  "RFI Document",
  "RFP",
  "Medium",
  "2026-08-10",
  "Very large scope, but the absence of a phased budget makes commercial sizing unreliable.",
  "Supports Economic Attractiveness — unclear",
  "economicAttractiveness",
);
const sap_ev2 = ev(
  "opp-sap-modernization",
  "Client mentions 'multiple global system integrators under consideration' without naming them.",
  "RFI Section 2",
  "RFP",
  "Low",
  "2026-08-10",
  "Signals a competitive process but gives no usable detail on who we are up against.",
  "Competitive Position — vague",
  "competitivePosition",
);
const sap_ev3 = ev(
  "opp-sap-modernization",
  "Organization has delivered 3 SAP S/4HANA migrations in manufacturing in the last 4 years, including one multi-site rollout.",
  "Case Study: SAP Migration Portfolio",
  "Historical project",
  "High",
  "2026-08-11",
  "Directly relevant delivery track record supports capability fit.",
  "Supports Capability Fit",
  "capabilityFit",
);
const sap_dims = dims("opp-sap-modernization", {
  strategicFit: {
    level: "Medium",
    assessment:
      "Large-scope SAP work is strategically relevant but outside current AI-led growth focus.",
    evidenceIds: [],
  },
  capabilityFit: {
    level: "High",
    assessment: "Track record of 3 prior S/4HANA migrations, including a multi-site rollout.",
    evidenceIds: [sap_ev3.id],
  },
  economicAttractiveness: {
    level: "Unknown",
    assessment: "No phased budget disclosed for a 14-site global rollout.",
    evidenceIds: [sap_ev1.id],
  },
  winability: {
    level: "Medium",
    assessment: "Strong delivery credentials offset by an undefined competitive field.",
    evidenceIds: [],
  },
  relationshipStrength: {
    level: "Low",
    assessment: "Single RFI contact, no prior engagement on file.",
    evidenceIds: [],
  },
  competitivePosition: {
    level: "Unknown",
    assessment: "Multiple unnamed global SIs reportedly under consideration.",
    evidenceIds: [sap_ev2.id],
  },
  deliveryRisk: {
    level: "Medium",
    assessment: "Multi-region, multi-site rollout raises coordination and localization risk.",
    evidenceIds: [],
  },
  presalesEffort: {
    level: "High",
    assessment: "Global RFI response requires significant multi-region solutioning effort.",
    evidenceIds: [],
  },
  timingUrgency: {
    level: "Medium",
    assessment: "No hard deadline stated; client describes this as an 18-month planning horizon.",
    evidenceIds: [],
  },
});
const sap: Opportunity = {
  id: "opp-sap-modernization",
  name: "Global SAP S/4HANA Modernization",
  client: "Meridian Manufacturing Group",
  industry: "Manufacturing",
  geography: "Multi-region — APAC, EMEA, NA",
  type: "RFP",
  estimatedValueLabel: "₹18–26 Cr (unconfirmed)",
  estimatedValueMid: 22,
  timeline: "18–24 months",
  existingAccount: "Unknown",
  decisionStage: "RFI — pre-shortlist",
  competition: "Unknown",
  procurementModel: "Global RFI, shortlist RFP to follow",
  owner: "Karan Mehta",
  ownerInitials: "KM",
  lastUpdated: "17 Aug 2026",
  priority: "Monitor",
  winability: 48,
  effort: 78,
  confidence: 54,
  strategicFit: 6.2,
  capabilityFit: 8.4,
  recommendation: "INVESTIGATE BEFORE COMMITTING EFFORT",
  qualificationStatus: "Insufficient Information",
  summary:
    "Meridian Manufacturing Group has issued a global RFI for a 14-site SAP S/4HANA rollout. Our delivery track record is strong, but budget and competitive information are both missing, and the RFI-stage response effort required is disproportionately high given how little is confirmed.",
  whyReasons: [
    {
      title: "Strong delivery track record",
      detail: "3 prior S/4HANA migrations, including a multi-site rollout.",
      polarity: "positive",
    },
    {
      title: "Large but unconfirmed scope",
      detail: "No phased budget breakdown provided for a 14-site global rollout.",
      polarity: "negative",
    },
    {
      title: "Competitive field unclear",
      detail: "Multiple unnamed global SIs reportedly under consideration.",
      polarity: "negative",
    },
    {
      title: "High presales effort at RFI stage",
      detail: "Global, multi-region response required before shortlist is even confirmed.",
      polarity: "negative",
    },
  ],
  whatWouldChange:
    "A confirmed phased budget or a named competitive shortlist would allow a confident qualification decision either way.",
  technologies: ["SAP"],
  capabilities: ["SAP", "Cloud Engineering"],
  badges: ["RFI", "Manufacturing", "₹18–26 Cr", "Monitor"],
  dimensions: sap_dims,
  evidence: [sap_ev1, sap_ev2, sap_ev3],
  unknowns: [...unknownsFromDims("opp-sap-modernization", sap_dims)],
  similarOpportunityIds: ["opp-cloud-migration", "opp-legacy-modernization"],
  timelineEvents: [
    { date: "10 Aug 2026", title: "RFI received", actor: "System" },
    {
      date: "17 Aug 2026",
      title: "AI qualification completed",
      description: "Confidence 54% — Investigate before committing effort",
      actor: "AI",
    },
  ],
  decisions: [],
};

// ───────────────────────────────────────────────────────────────────────────
// 4. Legacy Application Support — Deprioritize
// ───────────────────────────────────────────────────────────────────────────
const las_ev1 = ev(
  "opp-legacy-support",
  "Client requests continued L2/L3 support for a 12-year-old .NET monolith with no modernization budget attached.",
  "Renewal Request Email",
  "Client communication",
  "High",
  "2026-08-08",
  "Pure maintenance renewal with no transformation upside for the organization's strategic focus.",
  "Strategic Fit — low",
  "strategicFit",
);
const las_ev2 = ev(
  "opp-legacy-support",
  "Historical delivery data shows this account consumes 22% more support hours than comparably-sized contracts.",
  "Historical Delivery Data",
  "Historical project",
  "High",
  "2026-08-09",
  "High effort-to-value ratio relative to the rest of the portfolio.",
  "Supports Delivery Risk / Effort",
  "presalesEffort",
);
const las_dims = dims("opp-legacy-support", {
  strategicFit: {
    level: "Low",
    assessment: "Pure maintenance renewal, no transformation or AI upside.",
    evidenceIds: [las_ev1.id],
  },
  capabilityFit: {
    level: "Medium",
    assessment: "Within capability but not a differentiated or growth area.",
    evidenceIds: [],
  },
  economicAttractiveness: {
    level: "Low",
    assessment: "Flat renewal value with historically thin margin.",
    evidenceIds: [],
  },
  winability: {
    level: "High",
    assessment: "Existing sole-source contract, renewal is largely procedural.",
    evidenceIds: [],
  },
  relationshipStrength: {
    level: "High",
    assessment: "Long-standing account, but relationship is transactional.",
    evidenceIds: [],
  },
  competitivePosition: {
    level: "High",
    assessment: "No competitive process — direct renewal.",
    evidenceIds: [],
  },
  deliveryRisk: {
    level: "Medium",
    assessment: "Aging codebase increases support unpredictability.",
    evidenceIds: [],
  },
  presalesEffort: {
    level: "Low",
    assessment: "Minimal presales effort required for a renewal.",
    evidenceIds: [las_ev2.id],
  },
  timingUrgency: {
    level: "Low",
    assessment: "Contract has a 60-day auto-renewal buffer.",
    evidenceIds: [],
  },
});
const las: Opportunity = {
  id: "opp-legacy-support",
  name: "Legacy Application Support Renewal",
  client: "Coastal Retail Holdings",
  industry: "Retail",
  geography: "Regional — West Coast",
  type: "Existing Account",
  estimatedValueLabel: "₹1.8–2.4 Cr",
  estimatedValueMid: 3,
  timeline: "12 months (renewal)",
  existingAccount: "Yes",
  decisionStage: "Renewal — no competitive process",
  competition: "None — sole source",
  procurementModel: "Direct renewal",
  owner: "Neha Kapoor",
  ownerInitials: "NK",
  lastUpdated: "16 Aug 2026",
  priority: "Low",
  winability: 91,
  effort: 63,
  confidence: 88,
  strategicFit: 3.1,
  capabilityFit: 5.4,
  recommendation: "DEPRIORITIZE FOR STRATEGIC ATTENTION",
  qualificationStatus: "Deprioritized",
  summary:
    "Coastal Retail Holdings is renewing legacy application support with no modernization scope. Win probability is very high, but the opportunity has low strategic fit and consumes disproportionate delivery effort relative to its value — a candidate for lightweight renewal handling rather than active presales attention.",
  whyReasons: [
    {
      title: "Low strategic fit",
      detail: "Pure maintenance renewal, no transformation or AI upside.",
      polarity: "negative",
    },
    {
      title: "High delivery effort relative to value",
      detail: "Consumes 22% more support hours than comparable contracts.",
      polarity: "negative",
    },
    {
      title: "High certainty of renewal",
      detail: "Sole-source contract with an auto-renewal buffer.",
      polarity: "positive",
    },
  ],
  whatWouldChange:
    "If the client attached a modernization budget to the renewal, strategic fit and economic attractiveness would both rise.",
  technologies: ["Cloud"],
  capabilities: ["Cloud Engineering"],
  badges: ["Existing Account", "Retail", "₹1.8–2.4 Cr", "Low Priority"],
  dimensions: las_dims,
  evidence: [las_ev1, las_ev2],
  unknowns: [],
  similarOpportunityIds: ["opp-legacy-modernization"],
  timelineEvents: [
    { date: "08 Aug 2026", title: "Renewal request received", actor: "Human" },
    {
      date: "16 Aug 2026",
      title: "AI qualification completed",
      description: "Confidence 88% — Deprioritize for strategic attention",
      actor: "AI",
    },
  ],
  decisions: [],
};

// ───────────────────────────────────────────────────────────────────────────
// Lightweight opportunities — full shape, lighter evidence, for portfolio depth
// ───────────────────────────────────────────────────────────────────────────
function quick(params: {
  id: string;
  name: string;
  client: string;
  industry: Opportunity["industry"];
  geography: string;
  type: Opportunity["type"];
  valueLabel: string;
  valueMid: number;
  timelineText: string;
  existingAccount: Opportunity["existingAccount"];
  decisionStage: string;
  competition: string;
  procurementModel: string;
  owner: string;
  ownerInitials: string;
  lastUpdated: string;
  priority: Opportunity["priority"];
  winability: number;
  effort: number;
  confidence: number;
  recommendation: string;
  qualificationStatus: Opportunity["qualificationStatus"];
  summary: string;
  technologies: string[];
  capabilities: string[];
  badges: string[];
  levels: Record<string, DimensionLevel>;
  evidenceSeed: {
    text: string;
    source: string;
    sourceType: SourceType;
    supportsDimension: string;
    supportsLabel: string;
  }[];
  similarOpportunityIds: string[];
}): Opportunity {
  const evidence = params.evidenceSeed.map((e, i) =>
    ev(
      params.id,
      e.text,
      e.source,
      e.sourceType,
      i === 0 ? "High" : i === 1 ? "Medium" : "Medium",
      params.lastUpdated,
      `Informs ${e.supportsLabel.toLowerCase()} based on ${e.sourceType.toLowerCase()} evidence.`,
      e.supportsLabel,
      e.supportsDimension,
    ),
  );
  const levelEntries: Record<
    string,
    { level: DimensionLevel; assessment: string; evidenceIds: string[] }
  > = {};
  DIMENSION_DEFS.forEach((def) => {
    const level = params.levels[def.key] ?? "Unknown";
    const matched = evidence.filter((e) => e.supportsDimension === def.key).map((e) => e.id);
    levelEntries[def.key] = {
      level,
      assessment:
        level === "Unknown"
          ? "No evidence collected yet for this dimension."
          : level === "High"
            ? `Strong ${def.label.toLowerCase()} indicated by available evidence.`
            : level === "Medium"
              ? `Moderate ${def.label.toLowerCase()}; partially supported by available evidence.`
              : `Limited ${def.label.toLowerCase()} based on evidence gathered so far.`,
      evidenceIds: matched,
    };
  });
  const d = dims(params.id, levelEntries);
  const strategicScore = (d.find((x) => x.key === "strategicFit")?.score ?? 0) + 0.7;
  const capabilityScore = (d.find((x) => x.key === "capabilityFit")?.score ?? 0) + 0.9;
  return {
    id: params.id,
    name: params.name,
    client: params.client,
    industry: params.industry,
    geography: params.geography,
    type: params.type,
    estimatedValueLabel: params.valueLabel,
    estimatedValueMid: params.valueMid,
    timeline: params.timelineText,
    existingAccount: params.existingAccount,
    decisionStage: params.decisionStage,
    competition: params.competition,
    procurementModel: params.procurementModel,
    owner: params.owner,
    ownerInitials: params.ownerInitials,
    lastUpdated: params.lastUpdated,
    priority: params.priority,
    winability: params.winability,
    effort: params.effort,
    confidence: params.confidence,
    strategicFit: Math.min(10, strategicScore),
    capabilityFit: Math.min(10, capabilityScore),
    recommendation: params.recommendation,
    qualificationStatus: params.qualificationStatus,
    summary: params.summary,
    whyReasons: [
      {
        title:
          d.find((x) => x.key === "strategicFit")?.level === "High"
            ? "Strong strategic relevance"
            : "Moderate strategic relevance",
        detail: d.find((x) => x.key === "strategicFit")?.assessment ?? "",
        polarity:
          d.find((x) => x.key === "strategicFit")?.level === "Low" ||
          d.find((x) => x.key === "strategicFit")?.level === "Unknown"
            ? "negative"
            : "positive",
      },
      {
        title:
          d.find((x) => x.key === "capabilityFit")?.level === "High"
            ? "Strong capability match"
            : "Partial capability match",
        detail: d.find((x) => x.key === "capabilityFit")?.assessment ?? "",
        polarity:
          d.find((x) => x.key === "capabilityFit")?.level === "Low" ||
          d.find((x) => x.key === "capabilityFit")?.level === "Unknown"
            ? "negative"
            : "positive",
      },
      {
        title: "Relationship & competition",
        detail: `Relationship strength: ${d.find((x) => x.key === "relationshipStrength")?.level}. Competitive position: ${d.find((x) => x.key === "competitivePosition")?.level}.`,
        polarity:
          d.find((x) => x.key === "relationshipStrength")?.level === "Unknown"
            ? "negative"
            : "positive",
      },
    ],
    whatWouldChange:
      "Additional confirmed evidence on the Unknown dimensions above would sharpen this recommendation.",
    technologies: params.technologies,
    capabilities: params.capabilities,
    badges: params.badges,
    dimensions: d,
    evidence,
    unknowns: unknownsFromDims(params.id, d),
    similarOpportunityIds: params.similarOpportunityIds,
    timelineEvents: [
      { date: params.lastUpdated, title: "Opportunity logged", actor: "System" },
      {
        date: params.lastUpdated,
        title: "AI qualification completed",
        description: `Confidence ${params.confidence}% — ${params.recommendation}`,
        actor: "AI",
      },
    ],
    decisions: [],
  };
}

const bfsiLending = quick({
  id: "opp-bfsi-lending",
  name: "BFSI Digital Lending Platform",
  client: "Prime Trust Bank",
  industry: "BFSI",
  geography: "National",
  type: "RFP",
  valueLabel: "₹7–9 Cr",
  valueMid: 9,
  timelineText: "8–10 months",
  existingAccount: "No",
  decisionStage: "RFP — technical evaluation",
  competition: "3 vendors shortlisted",
  procurementModel: "Competitive RFP",
  owner: "Rohan Iyer",
  ownerInitials: "RI",
  lastUpdated: "18 Aug 2026",
  priority: "High",
  winability: 71,
  effort: 45,
  confidence: 79,
  recommendation: "QUALIFY FOR DISCOVERY",
  qualificationStatus: "Qualify for Discovery",
  summary:
    "Prime Trust Bank requires a digital lending platform with automated underwriting and fraud checks. Strong technology and capability match; relationship is new but the bank has engaged proactively with our team.",
  technologies: ["AWS", "AI/ML", "Data Engineering"],
  capabilities: ["AI/ML", "Data Engineering", "Cybersecurity"],
  badges: ["RFP", "BFSI", "₹7–9 Cr", "High Priority"],
  levels: {
    strategicFit: "High",
    capabilityFit: "High",
    economicAttractiveness: "Medium",
    winability: "Medium",
    relationshipStrength: "Low",
    competitivePosition: "Medium",
    deliveryRisk: "Low",
    presalesEffort: "Medium",
    timingUrgency: "High",
  },
  evidenceSeed: [
    {
      text: "RFP requires ML-based credit underwriting with explainability for regulatory audit.",
      source: "RFP Section 2.4",
      sourceType: "RFP",
      supportsDimension: "capabilityFit",
      supportsLabel: "Capability Fit",
    },
    {
      text: "Bank's CTO reached out directly via LinkedIn referencing our fintech case studies.",
      source: "Client Communication",
      sourceType: "Client communication",
      supportsDimension: "strategicFit",
      supportsLabel: "Strategic Fit",
    },
    {
      text: "Three named vendors shortlisted for technical evaluation round.",
      source: "RFP Evaluation Notice",
      sourceType: "RFP",
      supportsDimension: "competitivePosition",
      supportsLabel: "Competitive Position",
    },
  ],
  similarOpportunityIds: ["opp-fraud-detection", "opp-rpa-claims"],
});

const taxCompliance = quick({
  id: "opp-tax-compliance",
  name: "Tax Compliance Platform",
  client: "State Revenue Board",
  industry: "Government",
  geography: "Regional — State",
  type: "RFP",
  valueLabel: "₹5–7 Cr",
  valueMid: 6,
  timelineText: "10 months",
  existingAccount: "Unknown",
  decisionStage: "RFP published",
  competition: "Unknown",
  procurementModel: "Open tender",
  owner: "Ananya Rao",
  ownerInitials: "AR",
  lastUpdated: "15 Aug 2026",
  priority: "Monitor",
  winability: 55,
  effort: 50,
  confidence: 61,
  recommendation: "MONITOR — GATHER MORE EVIDENCE",
  qualificationStatus: "Insufficient Information",
  summary:
    "State Revenue Board requires a modern tax compliance and audit platform. Reasonable capability fit, but relationship and competitive information are both thin.",
  technologies: ["Azure", "Data Engineering"],
  capabilities: ["Data Engineering", "Cloud Engineering"],
  badges: ["RFP", "Government", "₹5–7 Cr", "Monitor"],
  levels: {
    strategicFit: "Medium",
    capabilityFit: "Medium",
    economicAttractiveness: "Medium",
    winability: "Medium",
    relationshipStrength: "Unknown",
    competitivePosition: "Unknown",
    deliveryRisk: "Medium",
    presalesEffort: "Medium",
    timingUrgency: "Medium",
  },
  evidenceSeed: [
    {
      text: "RFP requires audit-trail-grade data governance and case management workflows.",
      source: "RFP Section 3",
      sourceType: "RFP",
      supportsDimension: "capabilityFit",
      supportsLabel: "Capability Fit",
    },
    {
      text: "No named contact or prior CRM record for this state board.",
      source: "CRM Account Search",
      sourceType: "CRM",
      supportsDimension: "relationshipStrength",
      supportsLabel: "Relationship Strength",
    },
  ],
  similarOpportunityIds: ["opp-nia", "opp-gov-data-expansion"],
});

const healthcareData = quick({
  id: "opp-healthcare-data",
  name: "Data & Analytics Transformation",
  client: "Horizon Health Network",
  industry: "Healthcare",
  geography: "Multi-state",
  type: "Strategic Account",
  valueLabel: "₹10–12 Cr",
  valueMid: 11,
  timelineText: "12 months",
  existingAccount: "Yes",
  decisionStage: "Strategic account planning",
  competition: "None — direct negotiation",
  procurementModel: "Negotiated strategic account",
  owner: "Priya Nair",
  ownerInitials: "PN",
  lastUpdated: "19 Aug 2026",
  priority: "High",
  winability: 88,
  effort: 52,
  confidence: 90,
  recommendation: "QUALIFY — ACTIVE PURSUIT",
  qualificationStatus: "Qualified",
  summary:
    "Horizon Health Network, an existing strategic account, wants a unified analytics and patient-data platform. Strong relationship and capability alignment make this a confident, high-priority pursuit.",
  technologies: ["AWS", "Data Platform", "AI/ML"],
  capabilities: ["Data Engineering", "AI/ML", "Cloud Engineering"],
  badges: ["Strategic Account", "Healthcare", "₹10–12 Cr", "High Priority"],
  levels: {
    strategicFit: "High",
    capabilityFit: "High",
    economicAttractiveness: "High",
    winability: "High",
    relationshipStrength: "High",
    competitivePosition: "High",
    deliveryRisk: "Low",
    presalesEffort: "Low",
    timingUrgency: "Medium",
  },
  evidenceSeed: [
    {
      text: "Existing 3-year master services agreement covers expansion into analytics scope.",
      source: "CRM Account Record",
      sourceType: "CRM",
      supportsDimension: "relationshipStrength",
      supportsLabel: "Relationship Strength",
    },
    {
      text: "Prior patient-records migration delivered ahead of schedule with zero critical incidents.",
      source: "Historical Project Record",
      sourceType: "Historical project",
      supportsDimension: "capabilityFit",
      supportsLabel: "Capability Fit",
    },
  ],
  similarOpportunityIds: ["opp-patient-data"],
});

const legacyModernization = quick({
  id: "opp-legacy-modernization",
  name: "Legacy Application Modernization",
  client: "Union Manufacturing Co",
  industry: "Manufacturing",
  geography: "National",
  type: "Existing Account",
  valueLabel: "₹4–6 Cr",
  valueMid: 5,
  timelineText: "9 months",
  existingAccount: "Yes",
  decisionStage: "Scoping",
  competition: "None — sole source",
  procurementModel: "Direct extension",
  owner: "Karan Mehta",
  ownerInitials: "KM",
  lastUpdated: "14 Aug 2026",
  priority: "Monitor",
  winability: 74,
  effort: 60,
  confidence: 68,
  recommendation: "MONITOR — SCOPE BEFORE COMMITTING",
  qualificationStatus: "Insufficient Information",
  summary:
    "Union Manufacturing wants to modernize a legacy MES integration layer. Solid relationship, but requirements are still being scoped and economic value is not yet firm.",
  technologies: ["Cloud", "RPA"],
  capabilities: ["Cloud Engineering", "RPA"],
  badges: ["Existing Account", "Manufacturing", "₹4–6 Cr", "Monitor"],
  levels: {
    strategicFit: "Medium",
    capabilityFit: "High",
    economicAttractiveness: "Unknown",
    winability: "High",
    relationshipStrength: "High",
    competitivePosition: "High",
    deliveryRisk: "Medium",
    presalesEffort: "Medium",
    timingUrgency: "Low",
  },
  evidenceSeed: [
    {
      text: "Client requested a scoping workshop before committing to a statement of work.",
      source: "Client Communication",
      sourceType: "Client communication",
      supportsDimension: "economicAttractiveness",
      supportsLabel: "Economic Attractiveness",
    },
    {
      text: "Existing account team has delivered two prior modernization phases for this client.",
      source: "CRM Account Record",
      sourceType: "CRM",
      supportsDimension: "relationshipStrength",
      supportsLabel: "Relationship Strength",
    },
  ],
  similarOpportunityIds: ["opp-sap-modernization", "opp-legacy-support"],
});

const genAiRetail = quick({
  id: "opp-genai-retail",
  name: "GenAI Customer Service Suite",
  client: "Apex Retail Corp",
  industry: "Retail",
  geography: "National",
  type: "New Lead",
  valueLabel: "₹3–5 Cr (unconfirmed)",
  valueMid: 4,
  timelineText: "Unknown",
  existingAccount: "No",
  decisionStage: "Early inbound lead",
  competition: "Unknown",
  procurementModel: "Unknown",
  owner: "Neha Kapoor",
  ownerInitials: "NK",
  lastUpdated: "17 Aug 2026",
  priority: "Discovery",
  winability: 40,
  effort: 30,
  confidence: 38,
  recommendation: "GATHER INFORMATION BEFORE QUALIFYING",
  qualificationStatus: "Insufficient Information",
  summary:
    "Apex Retail Corp submitted an inbound web inquiry about a GenAI customer service suite. The lead is promising in theme but has almost no structured information yet — a short discovery call is recommended before further presales investment.",
  technologies: ["GenAI"],
  capabilities: ["AI/ML"],
  badges: ["New Lead", "Retail", "Discovery Required"],
  levels: {
    strategicFit: "Medium",
    capabilityFit: "Medium",
    economicAttractiveness: "Unknown",
    winability: "Unknown",
    relationshipStrength: "Unknown",
    competitivePosition: "Unknown",
    deliveryRisk: "Unknown",
    presalesEffort: "Low",
    timingUrgency: "Unknown",
  },
  evidenceSeed: [
    {
      text: "Inbound web form: 'interested in GenAI for customer service, exploring options.'",
      source: "Web Inquiry Form",
      sourceType: "Client communication",
      supportsDimension: "strategicFit",
      supportsLabel: "Strategic Fit",
    },
  ],
  similarOpportunityIds: ["opp-nia", "opp-bfsi-lending"],
});

const fraudDetection = quick({
  id: "opp-fraud-detection",
  name: "Fraud Detection Modernization",
  client: "Sterling Capital Bank",
  industry: "BFSI",
  geography: "National",
  type: "Expansion",
  valueLabel: "₹6–8 Cr",
  valueMid: 7,
  timelineText: "7 months",
  existingAccount: "Yes",
  decisionStage: "Expansion of existing engagement",
  competition: "None — negotiated extension",
  procurementModel: "Direct extension",
  owner: "Rohan Iyer",
  ownerInitials: "RI",
  lastUpdated: "19 Aug 2026",
  priority: "High",
  winability: 86,
  effort: 42,
  confidence: 85,
  recommendation: "QUALIFY — ACTIVE PURSUIT",
  qualificationStatus: "Qualified",
  summary:
    "Sterling Capital Bank wants to extend our existing fraud analytics engagement with real-time model scoring. Strong relationship, clear scope and proven delivery track record.",
  technologies: ["AI/ML", "Data Engineering", "Cybersecurity"],
  capabilities: ["AI/ML", "Cybersecurity"],
  badges: ["Expansion", "BFSI", "₹6–8 Cr", "High Priority"],
  levels: {
    strategicFit: "High",
    capabilityFit: "High",
    economicAttractiveness: "High",
    winability: "High",
    relationshipStrength: "High",
    competitivePosition: "High",
    deliveryRisk: "Low",
    presalesEffort: "Low",
    timingUrgency: "High",
  },
  evidenceSeed: [
    {
      text: "Existing fraud analytics contract explicitly includes a real-time scoring expansion option.",
      source: "CRM Account Record",
      sourceType: "CRM",
      supportsDimension: "relationshipStrength",
      supportsLabel: "Relationship Strength",
    },
    {
      text: "Bank flagged rising fraud losses as board-level priority in latest quarterly review.",
      source: "Client Communication",
      sourceType: "Client communication",
      supportsDimension: "timingUrgency",
      supportsLabel: "Timing / Urgency",
    },
  ],
  similarOpportunityIds: ["opp-bfsi-lending", "opp-rpa-claims"],
});

const cloudMigration = quick({
  id: "opp-cloud-migration",
  name: "Cloud Migration Program",
  client: "Continental Manufacturing",
  industry: "Manufacturing",
  geography: "National",
  type: "RFP",
  valueLabel: "₹7–9 Cr",
  valueMid: 8,
  timelineText: "10 months",
  existingAccount: "No",
  decisionStage: "RFP — proposal stage",
  competition: "2 vendors named",
  procurementModel: "Competitive RFP",
  owner: "Karan Mehta",
  ownerInitials: "KM",
  lastUpdated: "13 Aug 2026",
  priority: "Monitor",
  winability: 58,
  effort: 55,
  confidence: 63,
  recommendation: "QUALIFY FOR DISCOVERY",
  qualificationStatus: "Qualify for Discovery",
  summary:
    "Continental Manufacturing is running a competitive RFP for a factory-systems cloud migration. Reasonable capability and economic fit; relationship is new but the field is small and named.",
  technologies: ["AWS", "Cloud"],
  capabilities: ["Cloud Engineering"],
  badges: ["RFP", "Manufacturing", "₹7–9 Cr", "Monitor"],
  levels: {
    strategicFit: "Medium",
    capabilityFit: "High",
    economicAttractiveness: "Medium",
    winability: "Medium",
    relationshipStrength: "Low",
    competitivePosition: "Medium",
    deliveryRisk: "Medium",
    presalesEffort: "Medium",
    timingUrgency: "Medium",
  },
  evidenceSeed: [
    {
      text: "RFP names two competing vendors in the evaluation committee briefing notes.",
      source: "RFP Briefing Notes",
      sourceType: "RFP",
      supportsDimension: "competitivePosition",
      supportsLabel: "Competitive Position",
    },
    {
      text: "Scope closely matches our factory-systems cloud migration reference architecture.",
      source: "Case Study: Factory Cloud Migration",
      sourceType: "Case study",
      supportsDimension: "capabilityFit",
      supportsLabel: "Capability Fit",
    },
  ],
  similarOpportunityIds: ["opp-sap-modernization", "opp-legacy-modernization"],
});

const patientData = quick({
  id: "opp-patient-data",
  name: "Patient Data Platform",
  client: "MedCore Health Systems",
  industry: "Healthcare",
  geography: "Regional",
  type: "RFP",
  valueLabel: "₹5–7 Cr",
  valueMid: 6,
  timelineText: "Unknown",
  existingAccount: "No",
  decisionStage: "RFP published",
  competition: "Unknown",
  procurementModel: "Open tender",
  owner: "Priya Nair",
  ownerInitials: "PN",
  lastUpdated: "11 Aug 2026",
  priority: "Discovery",
  winability: 44,
  effort: 48,
  confidence: 41,
  recommendation: "GATHER INFORMATION BEFORE QUALIFYING",
  qualificationStatus: "Insufficient Information",
  summary:
    "MedCore Health Systems published an RFP for a patient data platform with limited detail. Compliance and interoperability requirements are unclear; discovery call recommended before deeper investment.",
  technologies: ["Data Platform"],
  capabilities: ["Data Engineering"],
  badges: ["RFP", "Healthcare", "Discovery Required"],
  levels: {
    strategicFit: "Medium",
    capabilityFit: "Medium",
    economicAttractiveness: "Unknown",
    winability: "Unknown",
    relationshipStrength: "Unknown",
    competitivePosition: "Unknown",
    deliveryRisk: "Unknown",
    presalesEffort: "Medium",
    timingUrgency: "Unknown",
  },
  evidenceSeed: [
    {
      text: "RFP references HIPAA-equivalent compliance but does not detail current system landscape.",
      source: "RFP Document",
      sourceType: "RFP",
      supportsDimension: "deliveryRisk",
      supportsLabel: "Delivery Risk",
    },
  ],
  similarOpportunityIds: ["opp-healthcare-data"],
});

const govDataExpansion = quick({
  id: "opp-gov-data-expansion",
  name: "Government Data Platform Expansion",
  client: "National Statistics Bureau",
  industry: "Government",
  geography: "National",
  type: "Expansion",
  valueLabel: "₹4–6 Cr",
  valueMid: 5,
  timelineText: "6 months",
  existingAccount: "Yes",
  decisionStage: "Expansion — statement of work drafting",
  competition: "None — negotiated extension",
  procurementModel: "Direct extension",
  owner: "Ananya Rao",
  ownerInitials: "AR",
  lastUpdated: "19 Aug 2026",
  priority: "High",
  winability: 89,
  effort: 35,
  confidence: 92,
  recommendation: "QUALIFY — ACTIVE PURSUIT",
  qualificationStatus: "Qualified",
  summary:
    "National Statistics Bureau is expanding our existing government data platform engagement to a second department. High confidence, low risk, direct continuation of proven delivery.",
  technologies: ["Azure", "Data Platform"],
  capabilities: ["Data Engineering", "AI Governance"],
  badges: ["Expansion", "Government", "₹4–6 Cr", "High Priority"],
  levels: {
    strategicFit: "High",
    capabilityFit: "High",
    economicAttractiveness: "Medium",
    winability: "High",
    relationshipStrength: "High",
    competitivePosition: "High",
    deliveryRisk: "Low",
    presalesEffort: "Low",
    timingUrgency: "Medium",
  },
  evidenceSeed: [
    {
      text: "Bureau's data office requested a same-team extension into a second department.",
      source: "Client Communication",
      sourceType: "Client communication",
      supportsDimension: "relationshipStrength",
      supportsLabel: "Relationship Strength",
    },
    {
      text: "Phase 1 delivered 3 weeks ahead of schedule with a 96% stakeholder satisfaction score.",
      source: "Case Study: Government Data Platform",
      sourceType: "Case study",
      supportsDimension: "capabilityFit",
      supportsLabel: "Capability Fit",
    },
  ],
  similarOpportunityIds: ["opp-nia", "opp-gov-ai-platform", "opp-tax-compliance"],
});

const rpaClaims = quick({
  id: "opp-rpa-claims",
  name: "RPA for Claims Processing",
  client: "Unity Insurance Group",
  industry: "BFSI",
  geography: "Regional",
  type: "New Lead",
  valueLabel: "₹2–3 Cr",
  valueMid: 3,
  timelineText: "4 months",
  existingAccount: "No",
  decisionStage: "Early inbound lead",
  competition: "Unknown",
  procurementModel: "Unknown",
  owner: "Rohan Iyer",
  ownerInitials: "RI",
  lastUpdated: "10 Aug 2026",
  priority: "Low",
  winability: 52,
  effort: 22,
  confidence: 57,
  recommendation: "DEPRIORITIZE — LOW STRATEGIC VALUE",
  qualificationStatus: "Deprioritized",
  summary:
    "Unity Insurance Group wants RPA automation for a narrow claims-intake process. Small, low-complexity scope with limited strategic upside relative to portfolio priorities.",
  technologies: ["RPA"],
  capabilities: ["RPA"],
  badges: ["New Lead", "BFSI", "₹2–3 Cr", "Low Priority"],
  levels: {
    strategicFit: "Low",
    capabilityFit: "Medium",
    economicAttractiveness: "Low",
    winability: "Medium",
    relationshipStrength: "Low",
    competitivePosition: "Medium",
    deliveryRisk: "Low",
    presalesEffort: "Low",
    timingUrgency: "Low",
  },
  evidenceSeed: [
    {
      text: "Scope limited to a single claims-intake step with a small process footprint.",
      source: "Discovery Call Notes",
      sourceType: "Client communication",
      supportsDimension: "economicAttractiveness",
      supportsLabel: "Economic Attractiveness",
    },
  ],
  similarOpportunityIds: ["opp-fraud-detection"],
});

const cyberOps = quick({
  id: "opp-cyber-ops",
  name: "Cybersecurity Operations Center",
  client: "Vantage Retail Group",
  industry: "Retail",
  geography: "National",
  type: "RFP",
  valueLabel: "₹5–7 Cr",
  valueMid: 6,
  timelineText: "9 months",
  existingAccount: "No",
  decisionStage: "RFP — technical evaluation",
  competition: "4 vendors shortlisted",
  procurementModel: "Competitive RFP",
  owner: "Neha Kapoor",
  ownerInitials: "NK",
  lastUpdated: "16 Aug 2026",
  priority: "Monitor",
  winability: 47,
  effort: 50,
  confidence: 58,
  recommendation: "MONITOR — COMPETITIVE FIELD IS WIDE",
  qualificationStatus: "Insufficient Information",
  summary:
    "Vantage Retail Group is running a competitive RFP for a managed SOC. Capability fit is solid, but a four-vendor shortlist and no existing relationship lower near-term winability.",
  technologies: ["Cybersecurity"],
  capabilities: ["Cybersecurity"],
  badges: ["RFP", "Retail", "₹5–7 Cr", "Monitor"],
  levels: {
    strategicFit: "Medium",
    capabilityFit: "High",
    economicAttractiveness: "Medium",
    winability: "Low",
    relationshipStrength: "Unknown",
    competitivePosition: "Low",
    deliveryRisk: "Low",
    presalesEffort: "Medium",
    timingUrgency: "Medium",
  },
  evidenceSeed: [
    {
      text: "RFP evaluation committee lists four shortlisted vendors, all established SOC providers.",
      source: "RFP Evaluation Notice",
      sourceType: "RFP",
      supportsDimension: "competitivePosition",
      supportsLabel: "Competitive Position",
    },
    {
      text: "Requirement matches our managed SOC reference architecture and staffing model.",
      source: "Case Study: Retail SOC Deployment",
      sourceType: "Case study",
      supportsDimension: "capabilityFit",
      supportsLabel: "Capability Fit",
    },
  ],
  similarOpportunityIds: ["opp-fraud-detection"],
});

export const OPPORTUNITIES: Opportunity[] = [
  nia,
  gap,
  sap,
  las,
  bfsiLending,
  taxCompliance,
  healthcareData,
  legacyModernization,
  genAiRetail,
  fraudDetection,
  cloudMigration,
  patientData,
  govDataExpansion,
  rpaClaims,
  cyberOps,
];

export function getOpportunity(id: string): Opportunity | undefined {
  return OPPORTUNITIES.find((o) => o.id === id);
}

export const DEMO_OPPORTUNITY_ID = "opp-nia";
