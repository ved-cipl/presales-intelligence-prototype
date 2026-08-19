import { OPPORTUNITIES } from "./opportunities";
import type { Opportunity } from "./types";

export type GraphNodeType =
  | "opportunity"
  | "client"
  | "industry"
  | "capability"
  | "technology"
  | "caseStudy"
  | "practice"
  | "person";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  sub?: string;
}

export interface GraphEdge {
  a: string;
  b: string;
  kind: "primary" | "similar";
}

interface CaseStudySeed {
  id: string;
  label: string;
  year: string;
  capabilities: string[];
  industry: Opportunity["industry"];
  outcome: string;
}

export const CASE_STUDIES: CaseStudySeed[] = [
  {
    id: "cs-ai-transform",
    label: "AI Transformation Program",
    year: "2025",
    capabilities: ["AI/ML", "AI Governance"],
    industry: "Government",
    outcome: "94% client satisfaction, on-time go-live.",
  },
  {
    id: "cs-gov-data",
    label: "Government Data Platform",
    year: "2024",
    capabilities: ["Data Engineering", "Cloud Engineering"],
    industry: "Government",
    outcome: "96% stakeholder satisfaction, 3 weeks ahead of schedule.",
  },
  {
    id: "cs-sap-migration",
    label: "SAP Migration Portfolio",
    year: "2023",
    capabilities: ["SAP", "Cloud Engineering"],
    industry: "Manufacturing",
    outcome: "3 multi-site S/4HANA rollouts delivered.",
  },
  {
    id: "cs-manufacturing-iot",
    label: "Factory Automation Rollout",
    year: "2023",
    capabilities: ["RPA", "Cloud Engineering"],
    industry: "Manufacturing",
    outcome: "60% reduction in manual production reporting.",
  },
  {
    id: "cs-fraud-analytics",
    label: "Real-Time Fraud Analytics",
    year: "2025",
    capabilities: ["AI/ML", "Cybersecurity"],
    industry: "BFSI",
    outcome: "38% reduction in fraud losses in year one.",
  },
  {
    id: "cs-bfsi-lending",
    label: "Digital Lending Accelerator",
    year: "2024",
    capabilities: ["AI/ML", "Data Engineering"],
    industry: "BFSI",
    outcome: "Loan decisioning time cut from 5 days to 4 hours.",
  },
  {
    id: "cs-retail-soc",
    label: "Retail SOC Deployment",
    year: "2024",
    capabilities: ["Cybersecurity"],
    industry: "Retail",
    outcome: "24/7 managed SOC live in 11 weeks.",
  },
  {
    id: "cs-health-analytics",
    label: "Patient Analytics Platform",
    year: "2024",
    capabilities: ["Data Engineering", "AI/ML"],
    industry: "Healthcare",
    outcome: "Unified records across 6 facilities.",
  },
];

export const PRACTICES: { id: string; label: string; capabilities: string[]; headcount: number }[] =
  [
    { id: "pr-ai", label: "AI Practice", capabilities: ["AI/ML", "AI Governance"], headcount: 64 },
    { id: "pr-cloud", label: "Cloud Practice", capabilities: ["Cloud Engineering"], headcount: 88 },
    { id: "pr-data", label: "Data Practice", capabilities: ["Data Engineering"], headcount: 71 },
    { id: "pr-sap", label: "SAP Practice", capabilities: ["SAP"], headcount: 45 },
    {
      id: "pr-cyber",
      label: "Cybersecurity Practice",
      capabilities: ["Cybersecurity"],
      headcount: 39,
    },
    { id: "pr-rpa", label: "Automation Practice", capabilities: ["RPA"], headcount: 22 },
  ];

// Owners already appear on opportunities — surfacing them as graph nodes ties named
// expertise into the same connected model instead of inventing a separate people list.
export const OWNER_PRACTICE: Record<string, { practiceId: string; title: string }> = {
  "Ananya Rao": { practiceId: "pr-ai", title: "AI Practice Lead" },
  "Vikram Sethi": { practiceId: "pr-cloud", title: "Cloud Practice Lead" },
  "Karan Mehta": { practiceId: "pr-sap", title: "SAP Practice Lead" },
  "Neha Kapoor": { practiceId: "pr-rpa", title: "Automation Practice Lead" },
  "Priya Nair": { practiceId: "pr-data", title: "Data Practice Lead" },
  "Rohan Iyer": { practiceId: "pr-cyber", title: "Cybersecurity Practice Lead" },
};

export function personNodeId(owner: string) {
  return `person-${slug(owner)}`;
}

export const CAPABILITY_TREND: Record<string, string> = {
  "AI/ML": "+42%",
  "AI Governance": "+34%",
  "Cloud Engineering": "+21%",
  "Data Engineering": "+19%",
  SAP: "+6%",
  Cybersecurity: "+15%",
  RPA: "+9%",
};

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function clientNodeId(client: string) {
  return `client-${slug(client)}`;
}
export function industryNodeId(industry: string) {
  return `industry-${slug(industry)}`;
}
export function capabilityNodeId(capability: string) {
  return `cap-${slug(capability)}`;
}
export function technologyNodeId(tech: string) {
  return `tech-${slug(tech)}`;
}

export function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const addNode = (n: GraphNode) => {
    if (!nodes.has(n.id)) nodes.set(n.id, n);
  };
  const addEdge = (a: string, b: string, kind: GraphEdge["kind"] = "primary") => {
    if (a === b) return;
    if (edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))) return;
    edges.push({ a, b, kind });
  };

  const capTechPairCounts = new Map<string, number>();

  for (const opp of OPPORTUNITIES) {
    addNode({ id: opp.id, type: "opportunity", label: opp.name, sub: opp.client });
    const cid = clientNodeId(opp.client);
    addNode({ id: cid, type: "client", label: opp.client, sub: opp.industry });
    addEdge(opp.id, cid);

    const iid = industryNodeId(opp.industry);
    addNode({ id: iid, type: "industry", label: opp.industry });
    addEdge(opp.id, iid);
    addEdge(cid, iid);

    const pid = personNodeId(opp.owner);
    const ownerMeta = OWNER_PRACTICE[opp.owner];
    addNode({ id: pid, type: "person", label: opp.owner, sub: ownerMeta?.title ?? "Presales" });
    addEdge(opp.id, pid);
    if (ownerMeta) addEdge(pid, ownerMeta.practiceId);

    for (const cap of opp.capabilities) {
      const capId = capabilityNodeId(cap);
      addNode({ id: capId, type: "capability", label: cap });
      addEdge(opp.id, capId);
      addEdge(cid, capId);
    }
    for (const tech of opp.technologies) {
      const techId = technologyNodeId(tech);
      addNode({ id: techId, type: "technology", label: tech });
      addEdge(opp.id, techId);
      addEdge(cid, techId);
    }
    for (const cap of opp.capabilities) {
      for (const tech of opp.technologies) {
        const key = `${cap}|||${tech}`;
        capTechPairCounts.set(key, (capTechPairCounts.get(key) ?? 0) + 1);
      }
    }
    for (const simId of opp.similarOpportunityIds) {
      addEdge(opp.id, simId, "similar");
    }
  }

  // Direct capability <-> technology links where the pairing recurs across opportunities —
  // surfaces which tech stacks a capability is actually delivered with, not just co-membership.
  for (const [key, count] of capTechPairCounts) {
    if (count < 2) continue;
    const [cap, tech] = key.split("|||");
    addEdge(capabilityNodeId(cap), technologyNodeId(tech));
  }

  for (const cs of CASE_STUDIES) {
    addNode({ id: cs.id, type: "caseStudy", label: cs.label, sub: cs.year });
    addEdge(cs.id, industryNodeId(cs.industry));
    for (const cap of cs.capabilities) addEdge(cs.id, capabilityNodeId(cap));
  }

  for (const pr of PRACTICES) {
    addNode({ id: pr.id, type: "practice", label: pr.label, sub: `${pr.headcount} people` });
    for (const cap of pr.capabilities) addEdge(pr.id, capabilityNodeId(cap));
  }

  return { nodes: Array.from(nodes.values()), edges };
}

export interface CapabilityDetail {
  connectedOpportunities: number;
  successfulProjects: number;
  activeOpportunities: number;
  industries: string[];
  relatedTechnologies: string[];
  trend: string;
}

export function getCapabilityDetail(capabilityLabel: string): CapabilityDetail {
  const relatedOpps = OPPORTUNITIES.filter((o) => o.capabilities.includes(capabilityLabel));
  const relatedCaseStudies = CASE_STUDIES.filter((cs) => cs.capabilities.includes(capabilityLabel));
  const industries = Array.from(new Set(relatedOpps.map((o) => o.industry)));
  const relatedTechnologies = Array.from(new Set(relatedOpps.flatMap((o) => o.technologies)));
  return {
    connectedOpportunities: relatedOpps.length,
    successfulProjects: relatedCaseStudies.length,
    activeOpportunities: relatedOpps.length,
    industries,
    relatedTechnologies,
    trend: CAPABILITY_TREND[capabilityLabel] ?? "—",
  };
}

export function getClientDetail(clientLabel: string) {
  const relatedOpps = OPPORTUNITIES.filter((o) => o.client === clientLabel);
  return {
    opportunities: relatedOpps,
    industry: relatedOpps[0]?.industry ?? "Unknown",
    totalValueLabel: relatedOpps.map((o) => o.estimatedValueLabel).join(" · "),
  };
}

export function getIndustryDetail(industryLabel: string) {
  const relatedOpps = OPPORTUNITIES.filter((o) => o.industry === industryLabel);
  const capabilities = Array.from(new Set(relatedOpps.flatMap((o) => o.capabilities)));
  return { opportunities: relatedOpps, capabilities };
}

export function getTechnologyDetail(techLabel: string) {
  const relatedOpps = OPPORTUNITIES.filter((o) => o.technologies.includes(techLabel));
  const industries = Array.from(new Set(relatedOpps.map((o) => o.industry)));
  return { opportunities: relatedOpps, industries };
}

export function getPersonDetail(ownerLabel: string) {
  const relatedOpps = OPPORTUNITIES.filter((o) => o.owner === ownerLabel);
  const meta = OWNER_PRACTICE[ownerLabel];
  const practice = PRACTICES.find((p) => p.id === meta?.practiceId);
  return {
    opportunities: relatedOpps,
    title: meta?.title ?? "Presales",
    practiceLabel: practice?.label ?? "—",
    totalValueLabel: relatedOpps.map((o) => o.estimatedValueLabel).join(" · "),
  };
}

// --- Knowledge Graph evidence & trust model -------------------------------
// The graph deliberately does not present every node as equally certain: some
// facts are source-verified, some are AI-inferred from patterns, some rest on
// thin evidence, and a small number genuinely conflict across sources. This
// mirrors real organizational knowledge rather than implying false precision.

export type VerificationStatus = "verified" | "ai-inferred" | "low-confidence" | "conflicting";

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const VERIFIED_BIAS: Record<GraphNodeType, number> = {
  opportunity: 0.72,
  client: 0.8,
  industry: 0.45,
  capability: 0.7,
  technology: 0.58,
  caseStudy: 0.88,
  practice: 1,
  person: 0.85,
};

// A handful of nodes are deliberately marked conflicting to demonstrate that the
// system can say "we don't know" rather than presenting a single false answer.
const CONFLICTING_NODE_IDS = new Set<string>([
  industryNodeId("BFSI"),
  technologyNodeId("Azure"),
  clientNodeId("Sterling Capital Bank"),
]);

const EVIDENCE_SOURCES_BY_TYPE: Record<GraphNodeType, string[]> = {
  opportunity: ["CRM", "RFP document", "Presales notes"],
  client: ["CRM — Accounts", "Account Notes (Manual Knowledge)"],
  industry: ["CRM", "Analyst Report Feed (Market Intelligence)"],
  capability: ["Practice Charter (Manual Knowledge)", "Certification Registry"],
  technology: ["Historical Project Repository", "Proposal Archive"],
  caseStudy: ["Case Study Database — Human Verified"],
  practice: ["Practice Charter (Manual Knowledge)"],
  person: ["CRM — Owner field", "Staffing System API"],
};

export interface NodeEvidence {
  status: VerificationStatus;
  confidence: number;
  sources: string[];
  activity: { label: string; time: string }[];
}

export function getNodeEvidence(node: GraphNode): NodeEvidence {
  if (node.type === "practice") {
    return {
      status: "verified",
      confidence: 99,
      sources: EVIDENCE_SOURCES_BY_TYPE.practice,
      activity: [{ label: "Confirmed against practice charter", time: "Reviewed monthly" }],
    };
  }

  const h = hashId(node.id);
  const roll = (h % 1000) / 1000;
  const sources = EVIDENCE_SOURCES_BY_TYPE[node.type];

  let status: VerificationStatus;
  if (CONFLICTING_NODE_IDS.has(node.id)) {
    status = "conflicting";
  } else if (roll < VERIFIED_BIAS[node.type] - 0.15) {
    status = "verified";
  } else if (roll < VERIFIED_BIAS[node.type] + 0.12) {
    status = "ai-inferred";
  } else {
    status = "low-confidence";
  }

  const confidence =
    status === "verified"
      ? 88 + (h % 11)
      : status === "ai-inferred"
        ? 68 + (h % 16)
        : status === "conflicting"
          ? 40 + (h % 16)
          : 32 + (h % 18);

  const activity: { label: string; time: string }[] =
    status === "conflicting"
      ? [
          { label: "AI reconciliation flagged conflicting source values", time: `${2 + (h % 5)} days ago` },
          { label: "Awaiting human review", time: "Open" },
        ]
      : status === "ai-inferred"
        ? [{ label: "Inferred from co-occurrence across opportunities", time: `${1 + (h % 4)} weeks ago` }]
        : status === "low-confidence"
          ? [{ label: "Single-source mention, not yet corroborated", time: `${3 + (h % 6)} weeks ago` }]
          : [{ label: "Re-verified against source system", time: `${1 + (h % 9)} days ago` }];

  return { status, confidence: Math.min(99, confidence), sources, activity };
}
