import * as React from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { DecisionFlowNode } from "@/features/presales/components/decision-designer/DecisionFlowNode";
import { NodeConfigPanel } from "@/features/presales/components/decision-designer/NodeConfigPanel";
import { NodeLibraryPanel } from "@/features/presales/components/decision-designer/NodeLibraryPanel";
import {
  NODE_LIBRARY,
  type DecisionNodeType,
  type DecisionPolicy,
  type DesignerEdge,
  type DesignerNode,
} from "@/features/presales/data/decision-designer";

const TONE_COLOR: Record<DesignerEdge["tone"], string> = {
  positive: "#16a34a",
  negative: "#dc2626",
  neutral: "#94a3b8",
};

const nodeTypes: NodeTypes = { decisionNode: DecisionFlowNode as unknown as NodeTypes[string] };

function isConsecutive(path: string[] | null, a: string, b: string) {
  if (!path) return false;
  const ia = path.indexOf(a);
  return ia !== -1 && path[ia + 1] === b;
}

function toFlowNode(n: DesignerNode, highlight: boolean, outcome?: string): Node {
  return {
    id: n.id,
    type: "decisionNode",
    position: n.position,
    data: { ...n, onHighlight: highlight, simulationOutcome: outcome } as unknown as Record<string, unknown>,
  };
}

function toFlowEdge(e: DesignerEdge, highlighted: boolean): Edge {
  const color = TONE_COLOR[e.tone];
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: highlighted,
    style: { stroke: highlighted ? "#2563eb" : color, strokeWidth: highlighted ? 2.5 : 1.5 },
    labelStyle: { fontSize: 10, fontWeight: 700, fill: highlighted ? "#2563eb" : color },
    labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
    markerEnd: { type: "arrowclosed" as const, color: highlighted ? "#2563eb" : color, width: 16, height: 16 },
  };
}

export interface DecisionDesignerHandle {
  getPolicy: () => { nodes: DesignerNode[]; edges: DesignerEdge[] };
  fitView: () => void;
}

function InnerCanvas({
  policy,
  highlightPath,
  edgeOutcomes,
  registerHandle,
}: {
  policy: DecisionPolicy;
  highlightPath: string[] | null;
  edgeOutcomes: Record<string, string> | null;
  registerHandle?: (handle: DecisionDesignerHandle) => void;
}) {
  const highlightSet = React.useMemo(() => new Set(highlightPath ?? []), [highlightPath]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    policy.nodes.map((n) => toFlowNode(n, highlightSet.has(n.id), edgeOutcomes?.[n.id])),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    policy.edges.map((e) =>
      toFlowEdge(e, isConsecutive(highlightPath, e.source, e.target)),
    ),
  );
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = React.useState<string | null>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  React.useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => {
        const outcome = edgeOutcomes?.[n.id];
        const isHi = highlightSet.has(n.id);
        return { ...n, data: { ...n.data, onHighlight: isHi, simulationOutcome: outcome } };
      }),
    );
    setEdges((prev) =>
      prev.map((e) => {
        const hi = isConsecutive(highlightPath, e.source, e.target);
        return { ...e, animated: hi, style: { stroke: hi ? "#2563eb" : e.style?.stroke, strokeWidth: hi ? 2.5 : 1.5 } };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightPath, edgeOutcomes]);

  React.useEffect(() => {
    if (!registerHandle) return;
    registerHandle({
      getPolicy: () => ({
        nodes: nodes.map((n) => n.data as unknown as DesignerNode),
        edges: edges.map((e) => {
          const orig = policy.edges.find((pe) => pe.id === e.id);
          return orig ?? { id: e.id, source: e.source, target: e.target, tone: "neutral" as const };
        }),
      }),
      fitView: () => fitView({ duration: 500, padding: 0.15 }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  const onConnect = React.useCallback(
    (connection: Connection) => {
      const id = `e-${connection.source}-${connection.target}-${Date.now()}`;
      setEdges((eds) => [
        ...eds,
        toFlowEdge({ id, source: connection.source!, target: connection.target!, tone: "neutral", label: "" }, false),
      ]);
    },
    [setEdges],
  );

  function addNode(type: DecisionNodeType, position: { x: number; y: number }) {
    const libItem = NODE_LIBRARY.find((l) => l.type === type)!;
    const id = `node-${type}-${Date.now()}`;
    const newNode: DesignerNode = {
      id,
      type,
      position,
      name: libItem.label,
      summary: [],
      status: "Draft",
      knowledgeDomainIds: [],
      fields: [{ key: "name", label: "Name", value: libItem.label, kind: "text" }],
    };
    setNodes((nds) => [...nds, toFlowNode(newNode, false)]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }

  function updateNode(nodeId: string, updater: (n: DesignerNode) => DesignerNode) {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: updater(n.data as unknown as DesignerNode) as unknown as Record<string, unknown> } : n)),
    );
  }

  function updateEdge(edgeId: string, updater: (e: DesignerEdge) => DesignerEdge) {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== edgeId) return e;
        const orig = policy.edges.find((pe) => pe.id === edgeId) ?? { id: edgeId, source: e.source, target: e.target, tone: "neutral" as const };
        const next = updater(orig);
        return { ...toFlowEdge(next, false), id: e.id };
      }),
    );
  }

  function deleteNode(nodeId: string) {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  }

  function deleteEdge(edgeId: string) {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdgeId(null);
  }

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)?.data as unknown as DesignerNode | undefined;
  const selectedEdgeFlow = edges.find((e) => e.id === selectedEdgeId);
  const selectedEdge: DesignerEdge | undefined = selectedEdgeFlow
    ? (policy.edges.find((pe) => pe.id === selectedEdgeFlow.id) ?? {
        id: selectedEdgeFlow.id,
        source: selectedEdgeFlow.source,
        target: selectedEdgeFlow.target,
        label: selectedEdgeFlow.label as string | undefined,
        tone: "neutral",
      })
    : undefined;

  return (
    <div className="flex h-full w-full min-w-0">
      <NodeLibraryPanel />
      <div
        className="relative min-w-0 flex-1"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const type = e.dataTransfer.getData("application/presales-node-type") as DecisionNodeType;
          if (!type) return;
          const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
          addNode(type, position);
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, n) => {
            setSelectedNodeId(n.id);
            setSelectedEdgeId(null);
          }}
          onEdgeClick={(_, e) => {
            setSelectedEdgeId(e.id);
            setSelectedNodeId(null);
          }}
          onPaneClick={() => {
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
          }}
          deleteKeyCode={["Backspace", "Delete"]}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="var(--border)" />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor={() => "var(--sidebar)"}
            maskColor="rgba(0,0,0,0.06)"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          />
        </ReactFlow>
      </div>
      <NodeConfigPanel
        node={selectedNode ?? null}
        edge={selectedEdge ?? null}
        onUpdateNode={updateNode}
        onUpdateEdge={updateEdge}
        onDeleteNode={deleteNode}
        onDeleteEdge={deleteEdge}
        onClose={() => {
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        }}
      />
    </div>
  );
}

export function DecisionDesignerCanvas(props: {
  policy: DecisionPolicy;
  highlightPath?: string[] | null;
  edgeOutcomes?: Record<string, string> | null;
  handleRef?: React.MutableRefObject<DecisionDesignerHandle | null>;
}) {
  return (
    <ReactFlowProvider>
      <InnerCanvas
        policy={props.policy}
        highlightPath={props.highlightPath ?? null}
        edgeOutcomes={props.edgeOutcomes ?? null}
        registerHandle={(h) => {
          if (props.handleRef) props.handleRef.current = h;
        }}
      />
    </ReactFlowProvider>
  );
}
