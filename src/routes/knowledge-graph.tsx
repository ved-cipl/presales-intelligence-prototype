import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { GraphCanvas } from "@/features/presales/components/GraphCanvas";
import { PageContainer, PageHeader } from "@/features/presales/components/PageHeader";
import { clientNodeId } from "@/features/presales/data/graph";
import { DEMO_OPPORTUNITY_ID, getOpportunity } from "@/features/presales/data/opportunities";

export const Route = createFileRoute("/knowledge-graph")({
  validateSearch: z.object({ center: z.string().optional() }),
  component: KnowledgeGraphPage,
});

function KnowledgeGraphPage() {
  const { center } = Route.useSearch();
  const demo = getOpportunity(DEMO_OPPORTUNITY_ID)!;
  const defaultCenter = clientNodeId(demo.client);

  return (
    <PageContainer>
      <PageHeader
        title="Organizational Knowledge Graph"
        subtitle="Connected intelligence across opportunities, clients, capabilities and outcomes"
      />
      <div className="mt-5">
        <GraphCanvas
          key={center ?? defaultCenter}
          initialCenterId={center ?? defaultCenter}
          height={620}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Drag to pan, scroll to zoom, click a node for details, double-click (or “Explore
        intelligence”) to re-center the graph.
      </p>
    </PageContainer>
  );
}
