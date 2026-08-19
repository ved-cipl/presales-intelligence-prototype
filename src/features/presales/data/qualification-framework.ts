export interface StandardDimension {
  key: string;
  label: string;
  weight: number;
  minimum: "High" | "Medium" | "Low";
  requiredEvidence: string[];
  status: string;
}

export const QUALIFICATION_STANDARDS: StandardDimension[] = [
  {
    key: "strategicFit",
    label: "Strategic Fit",
    weight: 15,
    minimum: "Medium",
    requiredEvidence: [
      "Alignment with current growth priorities",
      "Executive sponsorship signal",
      "Multi-year potential",
    ],
    status: "Active — applied to 96 assessed opportunities",
  },
  {
    key: "capabilityFit",
    label: "Capability Fit",
    weight: 15,
    minimum: "Medium",
    requiredEvidence: [
      "Relevant capability",
      "Relevant technology",
      "Relevant delivery experience",
    ],
    status: "Active — applied to 96 assessed opportunities",
  },
  {
    key: "economicAttractiveness",
    label: "Economic Value",
    weight: 15,
    minimum: "Medium",
    requiredEvidence: [
      "Confirmed or estimated budget",
      "Margin expectation",
      "Follow-on / renewal potential",
    ],
    status: "Active — budget confirmation missing on 41% of opportunities",
  },
  {
    key: "winability",
    label: "Winability",
    weight: 15,
    minimum: "Low",
    requiredEvidence: ["Relationship signal", "Competitive intelligence", "Decision timeline"],
    status: "Active — applied to 96 assessed opportunities",
  },
  {
    key: "relationshipStrength",
    label: "Relationship Strength",
    weight: 8,
    minimum: "Low",
    requiredEvidence: [
      "Named contact or sponsor",
      "Prior engagement history",
      "Account team assignment",
    ],
    status: "Active — most frequently Unknown dimension",
  },
  {
    key: "competitivePosition",
    label: "Competitive Position",
    weight: 8,
    minimum: "Low",
    requiredEvidence: ["Known competitor set", "Incumbent status", "Differentiation angle"],
    status: "Active — second most frequently Unknown dimension",
  },
  {
    key: "deliveryRisk",
    label: "Delivery Risk",
    weight: 8,
    minimum: "Medium",
    requiredEvidence: [
      "Scope complexity assessment",
      "Resourcing feasibility",
      "Comparable delivery precedent",
    ],
    status: "Active — applied to 96 assessed opportunities",
  },
  {
    key: "presalesEffort",
    label: "Presales Effort",
    weight: 5,
    minimum: "Low",
    requiredEvidence: ["Estimated response effort", "Reusable proposal material available"],
    status: "Active — applied to 96 assessed opportunities",
  },
  {
    key: "timingUrgency",
    label: "Timing / Urgency",
    weight: 6,
    minimum: "Low",
    requiredEvidence: ["Stated deadline or mandate", "Budget cycle alignment"],
    status: "Active — applied to 96 assessed opportunities",
  },
  {
    key: "strategicAccountValue",
    label: "Strategic Account Value",
    weight: 5,
    minimum: "Low",
    requiredEvidence: ["Account tier classification", "Expansion / land-and-expand potential"],
    status: "Active — applied to existing-account opportunities",
  },
];
