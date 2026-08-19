import type { TrustLevel } from "./knowledge-domains";

export interface KnowledgeSource {
  id: string;
  name: string;
  domainId: string;
  type: string;
  documentCount: number;
  lastSync: string;
  trustLevel: TrustLevel;
  health: number;
  status: "Connected" | "Syncing" | "Error" | "Not Connected";
}

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: "src-presales-sharepoint",
    name: "Presales SharePoint",
    domainId: "presales-knowledge",
    type: "SharePoint",
    documentCount: 8421,
    lastSync: "19 Aug 2026, 06:12",
    trustLevel: "Verified",
    health: 88,
    status: "Connected",
  },
  {
    id: "src-proposal-archive",
    name: "Proposal Archive (Folder)",
    domainId: "presales-knowledge",
    type: "Folder",
    documentCount: 3210,
    lastSync: "18 Aug 2026, 22:40",
    trustLevel: "Reference",
    health: 76,
    status: "Connected",
  },
  {
    id: "src-case-study-db",
    name: "Case Study Database",
    domainId: "presales-knowledge",
    type: "Database",
    documentCount: 852,
    lastSync: "19 Aug 2026, 04:00",
    trustLevel: "Verified",
    health: 90,
    status: "Connected",
  },
  {
    id: "src-project-repo",
    name: "Historical Project Repository",
    domainId: "delivery-knowledge",
    type: "Database",
    documentCount: 18241,
    lastSync: "17 Aug 2026, 03:00",
    trustLevel: "Reference",
    health: 62,
    status: "Connected",
  },
  {
    id: "src-delivery-sharepoint",
    name: "Delivery SharePoint",
    domainId: "delivery-knowledge",
    type: "SharePoint",
    documentCount: 9820,
    lastSync: "19 Aug 2026, 05:30",
    trustLevel: "Reference",
    health: 68,
    status: "Connected",
  },
  {
    id: "src-staffing-api",
    name: "Staffing System API",
    domainId: "delivery-knowledge",
    type: "API",
    documentCount: 851,
    lastSync: "10 Aug 2026, 11:00",
    trustLevel: "Unverified",
    health: 44,
    status: "Error",
  },
  {
    id: "src-practice-charter",
    name: "Practice Charter (Manual)",
    domainId: "capability-knowledge",
    type: "Manual Knowledge",
    documentCount: 214,
    lastSync: "05 Aug 2026, 09:00",
    trustLevel: "Authoritative",
    health: 97,
    status: "Connected",
  },
  {
    id: "src-cert-registry",
    name: "Certification Registry",
    domainId: "capability-knowledge",
    type: "Database",
    documentCount: 4598,
    lastSync: "19 Aug 2026, 01:15",
    trustLevel: "Authoritative",
    health: 89,
    status: "Connected",
  },
  {
    id: "src-crm-accounts",
    name: "CRM — Accounts",
    domainId: "account-intelligence",
    type: "CRM",
    documentCount: 5980,
    lastSync: "19 Aug 2026, 07:00",
    trustLevel: "Verified",
    health: 85,
    status: "Connected",
  },
  {
    id: "src-account-notes",
    name: "Account Notes (Manual Knowledge)",
    domainId: "account-intelligence",
    type: "Manual Knowledge",
    documentCount: 440,
    lastSync: "19 Aug 2026, 07:00",
    trustLevel: "Verified",
    health: 71,
    status: "Connected",
  },
  {
    id: "src-analyst-feeds",
    name: "Analyst Report Feed",
    domainId: "market-intelligence",
    type: "API",
    documentCount: 1102,
    lastSync: "01 Aug 2026, 12:00",
    trustLevel: "Reference",
    health: 60,
    status: "Syncing",
  },
  {
    id: "src-market-uploads",
    name: "Market Research Uploads",
    domainId: "market-intelligence",
    type: "Upload Documents",
    documentCount: 722,
    lastSync: "28 Jul 2026, 16:00",
    trustLevel: "Unverified",
    health: 51,
    status: "Not Connected",
  },
];

export function sourcesForDomain(domainId: string) {
  return KNOWLEDGE_SOURCES.filter((s) => s.domainId === domainId);
}
