import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { ComingSoon } from "@/features/presales/components/ComingSoon";

export const Route = createFileRoute("/knowledge")({
  component: () => (
    <ComingSoon
      icon={BookOpen}
      title="Knowledge"
      description="The Knowledge Agent will find and synthesize institutional knowledge across documents, past projects and individual expertise."
      points={[
        "Full-text search across RFPs, proposals and case studies",
        "Expertise directory linking capabilities to named practitioners",
        "Synthesized answers grounded in traceable organizational sources",
      ]}
    />
  ),
});
