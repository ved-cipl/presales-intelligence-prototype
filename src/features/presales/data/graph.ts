import { OPPORTUNITIES } from "./opportunities";
import type { Opportunity } from "./types";

export type GraphNodeType =
  "opportunity" | "client" | "industry" | "capability" | "technology" | "caseStudy" | "practice";

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
    id: "cs-fraud-analytics",
    label: "Real-Time Fraud Analytics",
    year: "2025",
    capabilities: ["AI/ML", "Cybersecurity"],
    industry: "BFSI",
    outcome: "38% reduction in fraud losses in year one.",
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

export const CAPABILITY_TREND: Record<string, string> = {
  "AI/ML": "+42%",
  "AI Governance": "+34%",
  "Cloud Engineering": "+21%",
  "Data Engineering": "+19%",
  SAP: "+6%",
  Cybersecurity: "+15%",
  RPA: "+9%",
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
    if (edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))) return;
    edges.push({ a, b, kind });
  };

  for (const opp of OPPORTUNITIES) {
    addNode({ id: opp.id, type: "opportunity", label: opp.name, sub: opp.client });
    const cid = clientNodeId(opp.client);
    addNode({ id: cid, type: "client", label: opp.client, sub: opp.industry });
    addEdge(opp.id, cid);

    const iid = industryNodeId(opp.industry);
    addNode({ id: iid, type: "industry", label: opp.industry });
    addEdge(opp.id, iid);
    addEdge(cid, iid);

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
    for (const simId of opp.similarOpportunityIds) {
      addEdge(opp.id, simId, "similar");
    }
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
