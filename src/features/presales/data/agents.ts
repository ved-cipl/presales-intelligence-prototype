export type AgentStatus = "Live" | "Beta" | "Coming Soon";

export interface AiAgent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  icon: "ScanSearch" | "TrendingUp" | "Blocks" | "FileText" | "Building2" | "BookOpen";
  dataDependencies: string[];
}

export const AI_AGENTS: AiAgent[] = [
  {
    id: "agent-qualification",
    name: "Qualification Agent",
    description:
      "Assess opportunity fit and prioritize human attention against organizational qualification standards.",
    status: "Live",
    icon: "ScanSearch",
    dataDependencies: [
      "RFPs & requirement documents",
      "CRM account records",
      "Qualification standards",
      "Historical project outcomes",
    ],
  },
  {
    id: "agent-trend",
    name: "Trend Intelligence Agent",
    description:
      "Identify emerging market and technology demand across the accumulated opportunity portfolio.",
    status: "Beta",
    icon: "TrendingUp",
    dataDependencies: [
      "Structured opportunity intelligence objects",
      "Capability & technology tags",
      "Industry classifications",
    ],
  },
  {
    id: "agent-solution",
    name: "Solution Agent",
    description: "Map requirements to organizational capabilities and reusable solution patterns.",
    status: "Coming Soon",
    icon: "Blocks",
    dataDependencies: [
      "Evidence layer",
      "Capability catalogue",
      "Case study library",
      "Delivery playbooks",
    ],
  },
  {
    id: "agent-proposal",
    name: "Proposal Agent",
    description:
      "Accelerate proposal and RFP response creation using organizational evidence and precedent.",
    status: "Coming Soon",
    icon: "FileText",
    dataDependencies: [
      "Qualification assessment",
      "Solutioning output",
      "Past proposals",
      "Commercial rate cards",
    ],
  },
  {
    id: "agent-account",
    name: "Account Intelligence Agent",
    description:
      "Build account-level opportunity intelligence spanning every engagement with a client over time.",
    status: "Coming Soon",
    icon: "Building2",
    dataDependencies: [
      "CRM account history",
      "Decision history",
      "Outcome records across opportunities",
    ],
  },
  {
    id: "agent-knowledge",
    name: "Knowledge Agent",
    description:
      "Find and synthesize institutional knowledge across documents, projects and individual expertise.",
    status: "Coming Soon",
    icon: "BookOpen",
    dataDependencies: [
      "Document repository",
      "Case studies",
      "Employee expertise graph",
      "Knowledge graph",
    ],
  },
];
