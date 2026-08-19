export type TrustLevel = "Authoritative" | "Verified" | "Reference" | "Unverified";

export interface KnowledgeHealth {
  completeness: number;
  evidenceQuality: number;
  humanVerified: number;
  staleInformation: number;
  conflictingInformation: number;
  missingMetadata: number;
}

export interface KnowledgeEntity {
  name: string;
  type: string;
  count: number;
  confidence: number;
}

export interface KnowledgeRelationship {
  from: string;
  relation: string;
  to: string;
  confidence: number;
  source: string;
  method?: string;
}

export interface KnowledgeDomain {
  id: string;
  name: string;
  description: string;
  recordLabel: "Documents" | "Records";
  recordCount: number;
  sourceCount: number;
  trustLevel: TrustLevel;
  health: number;
  healthDetail: KnowledgeHealth;
  entities: KnowledgeEntity[];
  relationships: KnowledgeRelationship[];
  usedBy: string[];
  owner: string;
  refreshFrequency: string;
  accessLevel: string;
  lastUpdated: string;
}

export const KNOWLEDGE_DOMAINS: KnowledgeDomain[] = [
  {
    id: "presales-knowledge",
    name: "Presales Knowledge",
    description: "Proposals, RFP responses, case studies and reusable presales material.",
    recordLabel: "Documents",
    recordCount: 12483,
    sourceCount: 3,
    trustLevel: "Verified",
    health: 84,
    healthDetail: {
      completeness: 78,
      evidenceQuality: 86,
      humanVerified: 71,
      staleInformation: 9,
      conflictingInformation: 4,
      missingMetadata: 12,
    },
    entities: [
      { name: "GenAI", type: "Technology", count: 128, confidence: 96 },
      { name: "AI Governance", type: "Capability", count: 47, confidence: 91 },
      { name: "Azure", type: "Technology", count: 184, confidence: 98 },
      { name: "Government", type: "Industry", count: 76, confidence: 97 },
    ],
    relationships: [
      {
        from: "Opportunity",
        relation: "requires",
        to: "Capability",
        confidence: 94,
        source: "RFP / Human verified",
      },
      {
        from: "Opportunity",
        relation: "similar_to",
        to: "Opportunity",
        confidence: 78,
        source: "Semantic + structured similarity",
        method: "Embedding similarity over scope, industry and capability tags",
      },
    ],
    usedBy: ["Qualification Agent", "Solution Agent", "Proposal Agent"],
    owner: "Presales Leadership",
    refreshFrequency: "Daily",
    accessLevel: "All presales staff",
    lastUpdated: "18 Aug 2026",
  },
  {
    id: "delivery-knowledge",
    name: "Delivery Knowledge",
    description: "Completed project records, delivery outcomes, staffing and effort history.",
    recordLabel: "Documents",
    recordCount: 28912,
    sourceCount: 4,
    trustLevel: "Reference",
    health: 71,
    healthDetail: {
      completeness: 72,
      evidenceQuality: 74,
      humanVerified: 58,
      staleInformation: 21,
      conflictingInformation: 11,
      missingMetadata: 24,
    },
    entities: [
      { name: "S/4HANA Migration", type: "Project", count: 14, confidence: 92 },
      { name: "Cloud Engineering", type: "Capability", count: 61, confidence: 89 },
      { name: "AWS", type: "Technology", count: 97, confidence: 94 },
      { name: "Manufacturing", type: "Industry", count: 33, confidence: 90 },
    ],
    relationships: [
      {
        from: "Project",
        relation: "delivered",
        to: "Capability",
        confidence: 91,
        source: "Project records",
      },
      {
        from: "Project",
        relation: "uses",
        to: "Technology",
        confidence: 88,
        source: "Project records",
      },
    ],
    usedBy: ["Qualification Agent", "Solution Agent"],
    owner: "Delivery Operations",
    refreshFrequency: "Weekly",
    accessLevel: "Presales + Delivery leadership",
    lastUpdated: "12 Aug 2026",
  },
  {
    id: "capability-knowledge",
    name: "Capability Knowledge",
    description: "Organizational practice capabilities, certifications and delivery precedent.",
    recordLabel: "Documents",
    recordCount: 4812,
    sourceCount: 2,
    trustLevel: "Authoritative",
    health: 91,
    healthDetail: {
      completeness: 93,
      evidenceQuality: 95,
      humanVerified: 89,
      staleInformation: 5,
      conflictingInformation: 1,
      missingMetadata: 6,
    },
    entities: [
      { name: "AI/ML", type: "Capability", count: 22, confidence: 99 },
      { name: "AI Governance", type: "Capability", count: 18, confidence: 97 },
      { name: "Cloud Engineering", type: "Capability", count: 26, confidence: 98 },
      { name: "SAP", type: "Capability", count: 14, confidence: 96 },
    ],
    relationships: [
      {
        from: "Capability",
        relation: "requires",
        to: "Technology",
        confidence: 95,
        source: "Practice charter / Human verified",
      },
    ],
    usedBy: ["Qualification Agent", "Solution Agent", "Trend Intelligence"],
    owner: "Practice Leadership",
    refreshFrequency: "Monthly",
    accessLevel: "All staff",
    lastUpdated: "05 Aug 2026",
  },
  {
    id: "account-intelligence",
    name: "Account Intelligence",
    description: "Client relationships, account history, sponsors and engagement notes.",
    recordLabel: "Records",
    recordCount: 6420,
    sourceCount: 2,
    trustLevel: "Verified",
    health: 82,
    healthDetail: {
      completeness: 69,
      evidenceQuality: 80,
      humanVerified: 75,
      staleInformation: 17,
      conflictingInformation: 6,
      missingMetadata: 21,
    },
    entities: [
      { name: "National Infrastructure Authority", type: "Client", count: 1, confidence: 62 },
      { name: "Ministry of Digital Services", type: "Client", count: 1, confidence: 95 },
      { name: "Sterling Capital Bank", type: "Client", count: 1, confidence: 91 },
    ],
    relationships: [
      {
        from: "Client",
        relation: "operates in",
        to: "Industry",
        confidence: 97,
        source: "CRM",
      },
    ],
    usedBy: ["Qualification Agent", "Account Intelligence Agent"],
    owner: "Account Management",
    refreshFrequency: "Daily (CRM sync)",
    accessLevel: "Account teams + presales",
    lastUpdated: "19 Aug 2026",
  },
  {
    id: "market-intelligence",
    name: "Market Intelligence",
    description: "Industry trends, competitor signals and technology demand indicators.",
    recordLabel: "Records",
    recordCount: 1824,
    sourceCount: 2,
    trustLevel: "Reference",
    health: 68,
    healthDetail: {
      completeness: 61,
      evidenceQuality: 65,
      humanVerified: 40,
      staleInformation: 28,
      conflictingInformation: 14,
      missingMetadata: 33,
    },
    entities: [
      { name: "Agentic AI", type: "Technology", count: 41, confidence: 74 },
      { name: "AI Governance", type: "Capability", count: 29, confidence: 70 },
    ],
    relationships: [
      {
        from: "Industry",
        relation: "demands",
        to: "Technology",
        confidence: 66,
        source: "Analyst reports (unverified)",
      },
    ],
    usedBy: ["Trend Intelligence"],
    owner: "Strategy Office",
    refreshFrequency: "Monthly",
    accessLevel: "Leadership + presales",
    lastUpdated: "01 Aug 2026",
  },
];

export function getKnowledgeDomain(id: string) {
  return KNOWLEDGE_DOMAINS.find((d) => d.id === id);
}

export function domainLabel(id: string) {
  return getKnowledgeDomain(id)?.name ?? id;
}
