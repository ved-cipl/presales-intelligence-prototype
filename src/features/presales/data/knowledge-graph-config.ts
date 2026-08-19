export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  detail: string;
}

export const GRAPH_PIPELINE: PipelineStage[] = [
  {
    id: "sources",
    name: "Knowledge Sources",
    description: "SharePoint, CRM, folders, databases, APIs and manual knowledge entries.",
    detail:
      "12 connected sources across 5 domains feed raw documents and records into the pipeline.",
  },
  {
    id: "extraction",
    name: "Extraction",
    description: "Structured fields and entity mentions are pulled from unstructured content.",
    detail: "RFPs, proposals and project records are parsed for named entities and key fields.",
  },
  {
    id: "resolution",
    name: "Entity Resolution",
    description: "Mentions are matched and merged into canonical entities.",
    detail:
      "\"Azure\", \"MS Azure\" and \"Microsoft Azure\" resolve to a single Technology entity.",
  },
  {
    id: "relationships",
    name: "Relationship Detection",
    description: "Connections between entities are inferred from co-occurrence and structure.",
    detail: "e.g. Opportunity → requires → Capability, Project → delivered → Capability.",
  },
  {
    id: "confidence",
    name: "Confidence Scoring",
    description: "Each entity and relationship is scored for confidence and trust.",
    detail: "Scores combine source trust level, corroboration count and human verification.",
  },
  {
    id: "graph",
    name: "Knowledge Graph",
    description: "The resulting connected graph powers qualification, trends and search.",
    detail: "72 nodes, ~250 edges today — growing with every new opportunity and project.",
  },
];

export interface GraphEntityConfig {
  id: string;
  name: string;
  source: string;
  status: "Active" | "Paused";
}

export const GRAPH_ENTITY_CONFIGS: GraphEntityConfig[] = [
  { id: "client", name: "Client", source: "CRM + Account Intelligence", status: "Active" },
  { id: "opportunity", name: "Opportunity", source: "CRM + Opportunity Intelligence", status: "Active" },
  { id: "capability", name: "Capability", source: "Capability Knowledge", status: "Active" },
  { id: "technology", name: "Technology", source: "Presales + Delivery Knowledge", status: "Active" },
  { id: "project", name: "Project", source: "Delivery Knowledge", status: "Active" },
  { id: "outcome", name: "Outcome", source: "CRM + Project Systems", status: "Active" },
  { id: "industry", name: "Industry", source: "CRM + Market Intelligence", status: "Active" },
  { id: "competitor", name: "Competitor", source: "Market Intelligence", status: "Paused" },
];

export interface GraphRelationshipConfig {
  id: string;
  from: string;
  relation: string;
  to: string;
  confidence: number;
  source: string;
  method?: string;
}

export const GRAPH_RELATIONSHIP_CONFIGS: GraphRelationshipConfig[] = [
  {
    id: "rel-requires",
    from: "Opportunity",
    relation: "requires",
    to: "Capability",
    confidence: 94,
    source: "RFP / Human verified",
  },
  {
    id: "rel-delivered",
    from: "Project",
    relation: "delivered",
    to: "Capability",
    confidence: 91,
    source: "Project records",
  },
  {
    id: "rel-uses",
    from: "Project",
    relation: "uses",
    to: "Technology",
    confidence: 88,
    source: "Project records",
  },
  {
    id: "rel-operates-in",
    from: "Client",
    relation: "operates in",
    to: "Industry",
    confidence: 97,
    source: "CRM",
  },
  {
    id: "rel-similar-to",
    from: "Opportunity",
    relation: "similar_to",
    to: "Opportunity",
    confidence: 78,
    source: "Semantic + structured similarity",
    method: "Embedding similarity over scope, industry and capability tags",
  },
];
