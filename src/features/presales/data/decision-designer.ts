export type DecisionNodeType =
  | "trigger"
  | "extraction"
  | "condition"
  | "aiAssessment"
  | "evidenceCheck"
  | "score"
  | "humanGate"
  | "decision"
  | "action";

export const NODE_TYPE_META: Record<
  DecisionNodeType,
  { label: string; icon: string; description: string; category: string }
> = {
  trigger: {
    label: "Trigger",
    icon: "Zap",
    description: "Starts when a new opportunity enters the system.",
    category: "Trigger",
  },
  extraction: {
    label: "Extract Field",
    icon: "ScanLine",
    description: "Extract structured information from opportunity evidence.",
    category: "Extraction",
  },
  condition: {
    label: "Condition",
    icon: "GitBranch",
    description: "Evaluate a rule or condition.",
    category: "Condition",
  },
  aiAssessment: {
    label: "AI Assessment",
    icon: "Sparkles",
    description: "Use AI reasoning against configured knowledge and evidence.",
    category: "AI Assessment",
  },
  evidenceCheck: {
    label: "Evidence Check",
    icon: "FileSearch",
    description: "Check whether sufficient evidence exists.",
    category: "Evidence",
  },
  score: {
    label: "Score",
    icon: "Calculator",
    description: "Calculate a weighted score.",
    category: "Score",
  },
  humanGate: {
    label: "Human Review",
    icon: "UserCheck",
    description: "Route the opportunity to a human reviewer.",
    category: "Human Gate",
  },
  decision: {
    label: "Decision",
    icon: "Flag",
    description: "Create a final organizational decision.",
    category: "Decision",
  },
  action: {
    label: "Action",
    icon: "PlayCircle",
    description: "Trigger an operational action.",
    category: "Action",
  },
};

export interface DesignerField {
  key: string;
  label: string;
  value: string;
  kind: "text" | "select" | "multiselect" | "textarea" | "percent";
  options?: string[];
}

export interface DesignerNode {
  id: string;
  type: DecisionNodeType;
  position: { x: number; y: number };
  name: string;
  summary: string[];
  status: "Configured" | "Needs Attention" | "Draft";
  knowledgeDomainIds: string[];
  fields: DesignerField[];
}

export interface DesignerEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  rule?: string;
  tone: "positive" | "negative" | "neutral";
}

export interface DecisionPolicy {
  id: string;
  name: string;
  version: string;
  status: "Published" | "Draft";
  owner: string;
  lastUpdated: string;
  effectiveDate: string;
  lastReview: string;
  opportunitiesEvaluated: number;
  humanOverrideRate: number;
  nodes: DesignerNode[];
  edges: DesignerEdge[];
}

const KD = {
  presales: "presales-knowledge",
  delivery: "delivery-knowledge",
  capability: "capability-knowledge",
  account: "account-intelligence",
  market: "market-intelligence",
};

const QUALIFICATION_V14_NODES: DesignerNode[] = [
  {
    id: "trig-1",
    type: "trigger",
    position: { x: 520, y: 0 },
    name: "Opportunity Created",
    summary: ["Fires on new opportunity intake"],
    status: "Configured",
    knowledgeDomainIds: [],
    fields: [{ key: "event", label: "Trigger Event", value: "Opportunity Created", kind: "text" }],
  },
  {
    id: "ext-1",
    type: "extraction",
    position: { x: 520, y: 150 },
    name: "Extract Fields",
    summary: ["Budget, Timeline, Technology, Industry, Client, Requirement"],
    status: "Configured",
    knowledgeDomainIds: [KD.presales],
    fields: [
      {
        key: "fields",
        label: "Fields to Extract",
        value: "Budget, Timeline, Technology, Industry, Client, Requirement",
        kind: "multiselect",
        options: ["Budget", "Timeline", "Technology", "Industry", "Client", "Requirement"],
      },
    ],
  },
  {
    id: "ai-strategic",
    type: "aiAssessment",
    position: { x: 520, y: 300 },
    name: "Strategic Fit",
    summary: ["Confidence threshold: 70%", "Evidence: Required"],
    status: "Configured",
    knowledgeDomainIds: [KD.account, KD.presales],
    fields: [
      { key: "assessment", label: "Assessment", value: "Strategic Fit", kind: "text" },
      {
        key: "instruction",
        label: "Instruction",
        value:
          "Assess strategic relevance using organizational strategy, account priorities and opportunity characteristics.",
        kind: "textarea",
      },
      {
        key: "domains",
        label: "Knowledge Domains",
        value: "Account Intelligence, Strategic Priorities, Opportunity History",
        kind: "multiselect",
        options: ["Account Intelligence", "Presales Knowledge", "Delivery Knowledge", "Capability Knowledge", "Market Intelligence"],
      },
      { key: "confidence", label: "Confidence Threshold", value: "70", kind: "percent" },
      {
        key: "insufficient",
        label: "Insufficient Evidence",
        value: "Route to Human Review",
        kind: "select",
        options: ["Route to Human Review", "Block", "Flag and continue"],
      },
    ],
  },
  {
    id: "cond-capability",
    type: "condition",
    position: { x: 340, y: 470 },
    name: "Capability Fit",
    summary: ["Capability Fit >= Medium"],
    status: "Configured",
    knowledgeDomainIds: [KD.capability, KD.delivery],
    fields: [
      { key: "name", label: "Name", value: "Capability Fit", kind: "text" },
      { key: "field", label: "Field", value: "Capability Fit", kind: "text" },
      { key: "operator", label: "Operator", value: ">=", kind: "select", options: [">=", ">", "=", "<", "<="] },
      { key: "threshold", label: "Threshold", value: "Medium", kind: "select", options: ["Low", "Medium", "High"] },
      {
        key: "evidence",
        label: "Evidence Required",
        value: "Relevant organizational capability",
        kind: "text",
      },
      {
        key: "domains",
        label: "Knowledge Domains",
        value: "Capability Knowledge, Project History",
        kind: "multiselect",
        options: ["Capability Knowledge", "Delivery Knowledge", "Presales Knowledge", "Account Intelligence", "Market Intelligence"],
      },
      { key: "failure", label: "Failure Action", value: "NO-GO", kind: "select", options: ["NO-GO", "DISCOVERY REQUIRED", "ESCALATE"] },
    ],
  },
  {
    id: "dec-nogo-1",
    type: "decision",
    position: { x: 780, y: 470 },
    name: "NO-GO",
    summary: ["Low strategic fit"],
    status: "Configured",
    knowledgeDomainIds: [],
    fields: [
      { key: "outcome", label: "Outcome", value: "NO-GO", kind: "select", options: ["GO", "NO-GO", "DISCOVERY REQUIRED", "ESCALATE"] },
      {
        key: "rationale",
        label: "Rationale Template",
        value: "Strategic fit below organizational threshold.",
        kind: "textarea",
      },
    ],
  },
  {
    id: "ev-budget",
    type: "evidenceCheck",
    position: { x: 180, y: 630 },
    name: "Budget Evidence Available",
    summary: ["Checks for confirmed or estimated budget"],
    status: "Configured",
    knowledgeDomainIds: [KD.account, KD.presales],
    fields: [
      { key: "item", label: "Evidence Item", value: "Budget evidence available", kind: "text" },
      { key: "required", label: "Required", value: "Yes", kind: "select", options: ["Yes", "No"] },
      {
        key: "domains",
        label: "Knowledge Domains",
        value: "Account Intelligence, Presales Knowledge",
        kind: "multiselect",
        options: ["Account Intelligence", "Presales Knowledge", "Delivery Knowledge", "Capability Knowledge", "Market Intelligence"],
      },
    ],
  },
  {
    id: "dec-nogo-2",
    type: "decision",
    position: { x: 520, y: 630 },
    name: "NO-GO",
    summary: ["Capability fit below threshold"],
    status: "Configured",
    knowledgeDomainIds: [],
    fields: [
      { key: "outcome", label: "Outcome", value: "NO-GO", kind: "select", options: ["GO", "NO-GO", "DISCOVERY REQUIRED", "ESCALATE"] },
      {
        key: "rationale",
        label: "Rationale Template",
        value: "Capability fit below organizational threshold.",
        kind: "textarea",
      },
    ],
  },
  {
    id: "hgate-1",
    type: "humanGate",
    position: { x: 0, y: 800 },
    name: "Human Review",
    summary: ["Reviewer: Presales Lead"],
    status: "Configured",
    knowledgeDomainIds: [],
    fields: [
      { key: "reviewer", label: "Reviewer", value: "Presales Lead", kind: "select", options: ["Presales Lead", "Sales", "Solution Architect", "Delivery"] },
      { key: "trigger", label: "Trigger", value: "Low confidence OR strategic override", kind: "text" },
      {
        key: "inputs",
        label: "Required Inputs",
        value: "AI assessment, Evidence, Unknowns",
        kind: "multiselect",
        options: ["AI assessment", "Evidence", "Unknowns"],
      },
    ],
  },
  {
    id: "score-economic",
    type: "score",
    position: { x: 340, y: 800 },
    name: "Economic Fit",
    summary: ["Weighted: value 50% · margin 30% · terms 20%"],
    status: "Configured",
    knowledgeDomainIds: [KD.account],
    fields: [
      { key: "name", label: "Score Name", value: "Economic Fit", kind: "text" },
      {
        key: "weights",
        label: "Weights",
        value: "Deal value 50%, Margin expectation 30%, Payment terms 20%",
        kind: "textarea",
      },
      {
        key: "domains",
        label: "Knowledge Domains",
        value: "Account Intelligence",
        kind: "multiselect",
        options: ["Account Intelligence", "Presales Knowledge", "Delivery Knowledge", "Capability Knowledge", "Market Intelligence"],
      },
    ],
  },
  {
    id: "dec-discovery-1",
    type: "decision",
    position: { x: 60, y: 970 },
    name: "DISCOVERY REQUIRED",
    summary: ["Insufficient evidence or economic fit unclear"],
    status: "Configured",
    knowledgeDomainIds: [],
    fields: [
      { key: "outcome", label: "Outcome", value: "DISCOVERY REQUIRED", kind: "select", options: ["GO", "NO-GO", "DISCOVERY REQUIRED", "ESCALATE"] },
      {
        key: "rationale",
        label: "Rationale Template",
        value: "Evidence or economic fit insufficient to qualify confidently.",
        kind: "textarea",
      },
    ],
  },
  {
    id: "ai-winability",
    type: "aiAssessment",
    position: { x: 340, y: 970 },
    name: "Winability",
    summary: ["Confidence threshold: 65%", "Evidence: Required"],
    status: "Configured",
    knowledgeDomainIds: [KD.account, KD.market],
    fields: [
      { key: "assessment", label: "Assessment", value: "Winability", kind: "text" },
      {
        key: "instruction",
        label: "Instruction",
        value: "Assess likelihood of winning using relationship strength, competitive position and timing.",
        kind: "textarea",
      },
      {
        key: "domains",
        label: "Knowledge Domains",
        value: "Account Intelligence, Market Intelligence",
        kind: "multiselect",
        options: ["Account Intelligence", "Presales Knowledge", "Delivery Knowledge", "Capability Knowledge", "Market Intelligence"],
      },
      { key: "confidence", label: "Confidence Threshold", value: "65", kind: "percent" },
      {
        key: "insufficient",
        label: "Insufficient Evidence",
        value: "Route to Human Review",
        kind: "select",
        options: ["Route to Human Review", "Block", "Flag and continue"],
      },
    ],
  },
  {
    id: "dec-discovery-2",
    type: "decision",
    position: { x: 340, y: 1140 },
    name: "DISCOVERY REQUIRED",
    summary: ["Winability uncertain"],
    status: "Configured",
    knowledgeDomainIds: [],
    fields: [
      { key: "outcome", label: "Outcome", value: "DISCOVERY REQUIRED", kind: "select", options: ["GO", "NO-GO", "DISCOVERY REQUIRED", "ESCALATE"] },
      {
        key: "rationale",
        label: "Rationale Template",
        value: "Winability below confident threshold; competitive and relationship evidence needed.",
        kind: "textarea",
      },
    ],
  },
  {
    id: "dec-go",
    type: "decision",
    position: { x: 580, y: 1140 },
    name: "GO",
    summary: ["Full presales resourcing"],
    status: "Configured",
    knowledgeDomainIds: [],
    fields: [
      { key: "outcome", label: "Outcome", value: "GO", kind: "select", options: ["GO", "NO-GO", "DISCOVERY REQUIRED", "ESCALATE"] },
      {
        key: "rationale",
        label: "Rationale Template",
        value: "Strategic fit, capability fit, economic fit and winability all clear threshold.",
        kind: "textarea",
      },
    ],
  },
  {
    id: "act-assign",
    type: "action",
    position: { x: 580, y: 1290 },
    name: "Assign Owner",
    summary: ["Notifies account manager", "Creates CRM task"],
    status: "Configured",
    knowledgeDomainIds: [],
    fields: [
      {
        key: "action",
        label: "Action Type",
        value: "Assign owner",
        kind: "select",
        options: ["Assign owner", "Create CRM task", "Request information", "Notify account manager"],
      },
    ],
  },
];

const QUALIFICATION_V14_EDGES: DesignerEdge[] = [
  { id: "e1", source: "trig-1", target: "ext-1", tone: "neutral" },
  { id: "e2", source: "ext-1", target: "ai-strategic", tone: "neutral" },
  { id: "e3", source: "ai-strategic", target: "cond-capability", label: "HIGH", tone: "positive", rule: "IF Strategic Fit = High" },
  { id: "e4", source: "ai-strategic", target: "dec-nogo-1", label: "LOW", tone: "negative", rule: "IF Strategic Fit = Low" },
  { id: "e5", source: "cond-capability", target: "ev-budget", label: "PASS", tone: "positive", rule: "IF Capability Fit >= Medium" },
  { id: "e6", source: "cond-capability", target: "dec-nogo-2", label: "FAIL", tone: "negative", rule: "IF Capability Fit < Medium" },
  { id: "e7", source: "ev-budget", target: "score-economic", label: "YES", tone: "positive", rule: "IF Budget evidence available" },
  { id: "e8", source: "ev-budget", target: "hgate-1", label: "NO", tone: "neutral", rule: "IF Budget evidence missing" },
  { id: "e9", source: "hgate-1", target: "dec-discovery-1", tone: "neutral" },
  { id: "e10", source: "score-economic", target: "ai-winability", label: "HIGH", tone: "positive", rule: "IF Economic Fit = High" },
  { id: "e11", source: "score-economic", target: "dec-discovery-1", label: "LOW", tone: "negative", rule: "IF Economic Fit = Low" },
  { id: "e12", source: "ai-winability", target: "dec-go", label: "HIGH", tone: "positive", rule: "IF Winability = High AND Confidence >= 65%" },
  { id: "e13", source: "ai-winability", target: "dec-discovery-2", label: "MEDIUM/LOW", tone: "negative", rule: "IF Winability < High OR Confidence < 65%" },
  { id: "e14", source: "dec-go", target: "act-assign", tone: "neutral" },
];

function simplePolicy(
  id: string,
  name: string,
  version: string,
  status: "Published" | "Draft",
  owner: string,
  lastUpdated: string,
): DecisionPolicy {
  const nodes: DesignerNode[] = [
    {
      id: `${id}-trig`,
      type: "trigger",
      position: { x: 300, y: 0 },
      name: "Opportunity Created",
      summary: ["Fires on new opportunity intake"],
      status: "Configured",
      knowledgeDomainIds: [],
      fields: [{ key: "event", label: "Trigger Event", value: "Opportunity Created", kind: "text" }],
    },
    {
      id: `${id}-ai`,
      type: "aiAssessment",
      position: { x: 300, y: 150 },
      name: "Relationship Strength",
      summary: ["Confidence threshold: 60%"],
      status: "Needs Attention",
      knowledgeDomainIds: [KD.account],
      fields: [
        { key: "assessment", label: "Assessment", value: "Relationship Strength", kind: "text" },
        {
          key: "instruction",
          label: "Instruction",
          value: "Assess depth of existing relationship and sponsor access.",
          kind: "textarea",
        },
        {
          key: "domains",
          label: "Knowledge Domains",
          value: "Account Intelligence",
          kind: "multiselect",
          options: ["Account Intelligence", "Presales Knowledge", "Delivery Knowledge", "Capability Knowledge", "Market Intelligence"],
        },
        { key: "confidence", label: "Confidence Threshold", value: "60", kind: "percent" },
        {
          key: "insufficient",
          label: "Insufficient Evidence",
          value: "Route to Human Review",
          kind: "select",
          options: ["Route to Human Review", "Block", "Flag and continue"],
        },
      ],
    },
    {
      id: `${id}-gate`,
      type: "humanGate",
      position: { x: 300, y: 300 },
      name: "Human Review",
      summary: ["Reviewer: Sales"],
      status: "Draft",
      knowledgeDomainIds: [],
      fields: [
        { key: "reviewer", label: "Reviewer", value: "Sales", kind: "select", options: ["Presales Lead", "Sales", "Solution Architect", "Delivery"] },
        { key: "trigger", label: "Trigger", value: "Always", kind: "text" },
        { key: "inputs", label: "Required Inputs", value: "AI assessment, Evidence", kind: "multiselect", options: ["AI assessment", "Evidence", "Unknowns"] },
      ],
    },
    {
      id: `${id}-decision`,
      type: "decision",
      position: { x: 300, y: 450 },
      name: "DISCOVERY REQUIRED",
      summary: ["Pending policy finalization"],
      status: "Draft",
      knowledgeDomainIds: [],
      fields: [
        { key: "outcome", label: "Outcome", value: "DISCOVERY REQUIRED", kind: "select", options: ["GO", "NO-GO", "DISCOVERY REQUIRED", "ESCALATE"] },
        { key: "rationale", label: "Rationale Template", value: "Draft policy — outcome logic not finalized.", kind: "textarea" },
      ],
    },
  ];
  const edges: DesignerEdge[] = [
    { id: `${id}-e1`, source: `${id}-trig`, target: `${id}-ai`, tone: "neutral" },
    { id: `${id}-e2`, source: `${id}-ai`, target: `${id}-gate`, tone: "neutral" },
    { id: `${id}-e3`, source: `${id}-gate`, target: `${id}-decision`, tone: "neutral" },
  ];
  return {
    id,
    name,
    version,
    status,
    owner,
    lastUpdated,
    effectiveDate: lastUpdated,
    lastReview: lastUpdated,
    opportunitiesEvaluated: 0,
    humanOverrideRate: 0,
    nodes,
    edges,
  };
}

export const DECISION_POLICIES: DecisionPolicy[] = [
  {
    id: "qualification-v1-4",
    name: "Qualification Policy",
    version: "1.4",
    status: "Published",
    owner: "Presales Leadership",
    lastUpdated: "19 Aug 2026",
    effectiveDate: "01 Jul 2026",
    lastReview: "15 Aug 2026",
    opportunitiesEvaluated: 312,
    humanOverrideRate: 18,
    nodes: QUALIFICATION_V14_NODES,
    edges: QUALIFICATION_V14_EDGES,
  },
  simplePolicy(
    "existing-account-v2-1",
    "Existing Account Qualification",
    "2.1",
    "Draft",
    "Account Management",
    "11 Aug 2026",
  ),
  simplePolicy(
    "strategic-opportunity-v1-0",
    "Strategic Opportunity Qualification",
    "1.0",
    "Draft",
    "Presales Leadership",
    "02 Aug 2026",
  ),
];

export function getPolicy(id: string) {
  return DECISION_POLICIES.find((p) => p.id === id);
}

export function domainUsageForPolicy(policyId: string): { domainId: string; usedByNodes: string[] }[] {
  const policy = getPolicy(policyId);
  if (!policy) return [];
  const map = new Map<string, Set<string>>();
  for (const n of policy.nodes) {
    for (const d of n.knowledgeDomainIds) {
      if (!map.has(d)) map.set(d, new Set());
      map.get(d)!.add(n.name);
    }
  }
  return Array.from(map.entries()).map(([domainId, nodes]) => ({
    domainId,
    usedByNodes: Array.from(nodes),
  }));
}

export function nodesForPolicyPath(policyId: string, path: string[]): DesignerNode[] {
  const policy = getPolicy(policyId);
  if (!policy) return [];
  return path
    .map((id) => policy.nodes.find((n) => n.id === id))
    .filter((n): n is DesignerNode => !!n);
}

export interface NodeLibraryItem {
  type: DecisionNodeType;
  label: string;
  description: string;
  examples: string[];
}

export const NODE_LIBRARY: NodeLibraryItem[] = [
  { type: "trigger", label: "Opportunity Created", description: NODE_TYPE_META.trigger.description, examples: [] },
  {
    type: "extraction",
    label: "Extract Field",
    description: NODE_TYPE_META.extraction.description,
    examples: ["Budget", "Timeline", "Technology", "Industry", "Client", "Requirement"],
  },
  {
    type: "condition",
    label: "Condition",
    description: NODE_TYPE_META.condition.description,
    examples: ["Capability Fit >= Medium"],
  },
  {
    type: "aiAssessment",
    label: "AI Assessment",
    description: NODE_TYPE_META.aiAssessment.description,
    examples: ["Strategic Fit", "Winability", "Delivery Risk", "Competitive Position"],
  },
  {
    type: "evidenceCheck",
    label: "Evidence Check",
    description: NODE_TYPE_META.evidenceCheck.description,
    examples: ["Budget evidence available", "Relationship evidence available", "Relevant case study exists"],
  },
  { type: "score", label: "Score", description: NODE_TYPE_META.score.description, examples: [] },
  {
    type: "humanGate",
    label: "Human Review",
    description: NODE_TYPE_META.humanGate.description,
    examples: ["Presales", "Sales", "Solution Architect", "Delivery"],
  },
  {
    type: "decision",
    label: "Decision",
    description: NODE_TYPE_META.decision.description,
    examples: ["GO", "NO-GO", "DISCOVERY REQUIRED", "ESCALATE"],
  },
  {
    type: "action",
    label: "Action",
    description: NODE_TYPE_META.action.description,
    examples: ["Assign owner", "Create CRM task", "Request information", "Notify account manager"],
  },
];
