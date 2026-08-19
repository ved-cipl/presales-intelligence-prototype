export type Industry = "Government" | "BFSI" | "Manufacturing" | "Retail" | "Healthcare";

export type OpportunityType =
  "RFP" | "Existing Account" | "New Lead" | "Expansion" | "Strategic Account";

export type Priority = "High" | "Monitor" | "Discovery" | "Low";

export type QualificationStatus =
  "Qualify for Discovery" | "Qualified" | "Monitor" | "Insufficient Information" | "Deprioritized";

export type DimensionLevel = "High" | "Medium" | "Low" | "Unknown";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type SourceType =
  "RFP" | "CRM" | "Client communication" | "Historical project" | "Case study" | "Human input";

export interface EvidencePoint {
  id: string;
  text: string;
  source: string;
  sourceType: SourceType;
  confidence: ConfidenceLevel;
  timestamp: string;
  interpretation: string;
  supportsLabel: string;
  supportsDimension: string;
}

export interface QualificationDimension {
  key: string;
  label: string;
  level: DimensionLevel;
  score: number;
  weight: number;
  assessment: string;
  evidenceIds: string[];
}

export interface UnknownItem {
  id: string;
  label: string;
  status: "Unknown" | "Low confidence";
  whyItMatters: string;
  actionLabel: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  actor: "AI" | "Human" | "System";
}

export interface DecisionRecord {
  id: string;
  date: string;
  aiRecommendation: string;
  humanDecision: "Agree" | "Override" | "Need more information";
  reason?: string;
  notes?: string;
  decidedBy: string;
}

export interface WhyReason {
  title: string;
  detail: string;
  polarity: "positive" | "negative";
}

export interface Opportunity {
  id: string;
  name: string;
  client: string;
  industry: Industry;
  geography: string;
  type: OpportunityType;
  estimatedValueLabel: string;
  estimatedValueMid: number;
  timeline: string;
  existingAccount: "Yes" | "No" | "Unknown";
  decisionStage: string;
  competition: string;
  procurementModel: string;
  owner: string;
  ownerInitials: string;
  lastUpdated: string;
  priority: Priority;
  winability: number;
  effort: number;
  confidence: number;
  strategicFit: number;
  capabilityFit: number;
  recommendation: string;
  qualificationStatus: QualificationStatus;
  summary: string;
  whyReasons: WhyReason[];
  whatWouldChange: string;
  technologies: string[];
  capabilities: string[];
  badges: string[];
  dimensions: QualificationDimension[];
  evidence: EvidencePoint[];
  unknowns: UnknownItem[];
  similarOpportunityIds: string[];
  timelineEvents: TimelineEvent[];
  decisions: DecisionRecord[];
}
