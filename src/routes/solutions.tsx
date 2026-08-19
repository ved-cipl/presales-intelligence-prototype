import { createFileRoute } from "@tanstack/react-router";
import { Blocks } from "lucide-react";

import { ComingSoon } from "@/features/presales/components/ComingSoon";

export const Route = createFileRoute("/solutions")({
  component: () => (
    <ComingSoon
      icon={Blocks}
      title="Solutioning"
      description="The Solution Agent will map qualified requirements to organizational capabilities, reference architectures and reusable solution patterns."
      points={[
        "Auto-suggested solution components from the capability catalogue",
        "Reusable delivery patterns from past, comparable engagements",
        "Effort and staffing estimates grounded in historical delivery data",
      ]}
    />
  ),
});
