export const DECISION_KPIS = [
  { label: "AI Decisions", value: "312", subtext: "Illustrative prototype data" },
  { label: "Human Override Rate", value: "18%", subtext: "Illustrative prototype data" },
  { label: "GO → Win Rate", value: "62%", subtext: "Illustrative prototype data" },
  { label: "NO-GO → Win Rate", value: "7%", subtext: "Illustrative prototype data (declined pursuit anyway)" },
];

export const DECISION_DISTRIBUTION = [
  { decision: "GO", count: 82 },
  { decision: "DISCOVERY", count: 101 },
  { decision: "NO-GO", count: 129 },
];

export const OVERRIDE_REASONS = [
  { reason: "Relationship intelligence", count: 21 },
  { reason: "Competitive information", count: 16 },
  { reason: "Strategic account considerations", count: 12 },
  { reason: "Budget information", count: 8 },
  { reason: "Capability exceptions", count: 5 },
];

export const POLICY_PERFORMANCE = [
  { decision: "GO", opportunities: 82, winRate: "62%", avgEffort: "18 hrs" },
  { decision: "Discovery", opportunities: 101, winRate: "31%", avgEffort: "8 hrs" },
  { decision: "NO-GO", opportunities: 129, winRate: "7%", avgEffort: "2 hrs" },
];

export const POLICY_LEARNING_INSIGHT = {
  title: "Relationship intelligence is underrepresented in the qualification model",
  body: "18% of AI recommendations were overridden by humans. The largest source of overrides was relationship intelligence, suggesting that relationship strength is currently underrepresented in the qualification model.",
};
