"use client";

import {
  Background,
  ReactFlow,
  useReactFlow,
  type ReactFlowProps,
} from "@xyflow/react";
import type {ReactNode} from "react";
import "@xyflow/react/dist/style.css";
import {toPng} from "html-to-image";
import {MdOutlineFileDownload} from "react-icons/md";
import {
  addEdge,
  type Connection,
  type Edge,
  type Node as ReactFlowNode,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import {PlusIcon, ZapIcon} from "lucide-react";
import {useCallback, useMemo, useRef} from "react";
import {Button} from "@/components/ui/button";

import {Node, NodeHeader, NodeTitle} from "@/components/ai/node";

import {Controls} from "@/components/ai/controls";
import {Panel} from "@/components/ai/panel";
import {nodeTypes} from "./toolbar";
import {VscActivateBreakpoints} from "react-icons/vsc";

type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
};

export const Canvas = ({children, ...props}: CanvasProps) => (
  <ReactFlow
    deleteKeyCode={["Backspace", "Delete"]}
    fitView
    panOnDrag={false}
    panOnScroll
    selectionOnDrag={true}
    zoomOnDoubleClick={false}
    nodeTypes={nodeTypes}
    {...props}
  >
    <Background bgColor="var(--sidebar)" />
    {children}
  </ReactFlow>
);

const AgentNode = ({data}: {data: {label: string}}) => (
  <Node handles={{target: true, source: true}} className="w-[100px] h-[50px]">
    <NodeHeader className="p-2">
      <NodeTitle className="flex items-center gap-1.5 text-xs">
        <VscActivateBreakpoints className="size-3" />
        {data.label}
      </NodeTitle>
    </NodeHeader>
  </Node>
);

const initialNodes: ReactFlowNode[] = [
  {id: "1", type: "agent", position: {x: 50, y: 100}, data: {label: "Input"}},
  {
    id: "2",
    type: "agent",
    position: {x: 300, y: 100},
    data: {label: "Process"},
  },
  {id: "3", type: "agent", position: {x: 550, y: 100}, data: {label: "Output"}},
];

const initialEdges: Edge[] = [
  {id: "e1-2", source: "1", target: "2"},
  {id: "e2-3", source: "2", target: "3"},
];

type FlowContentProps = {
  nodes: ReactFlowNode[];
  edges: Edge[];
  onNodesChange: ReturnType<typeof useNodesState>[2];
  onEdgesChange: ReturnType<typeof useEdgesState>[2];
  onConnect: (connection: Connection) => void;
  nodeTypes: ReactFlowProps["nodeTypes"];
  flowRef: React.RefObject<HTMLDivElement | null>;
  addNode: () => void;
};

function FlowContent({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  flowRef,
  addNode,
}: FlowContentProps) {
  const {fitView} = useReactFlow();

  const downloadImage = async () => {
    if (!flowRef.current) return;

    await fitView({padding: 0.2});
    await new Promise((r) => setTimeout(r, 200));

    const isDark = document.documentElement.classList.contains("dark");
    console.log(isDark);

    const edgePaths = flowRef.current.querySelectorAll<SVGPathElement>(
      ".react-flow__edge-path",
    );

    const originalStyles = Array.from(edgePaths).map((path) => ({
      stroke: path.style.stroke,
      strokeWidth: path.style.strokeWidth,
      opacity: path.style.opacity,
    }));

    edgePaths.forEach((path) => {
      path.style.stroke = isDark ? "#E5E7EB" : "#141414";
      path.style.strokeWidth = "0.6";
      path.style.opacity = "0.6";
    });

    const el = flowRef.current.querySelector(
      ".react-flow__viewport",
    ) as HTMLElement;

    const dataUrl = await toPng(el, {
      backgroundColor: isDark ? "#1f1f1f" : "#F8F9FA",
      pixelRatio: 2,
    });

    edgePaths.forEach((path, i) => {
      path.style.stroke = originalStyles[i].stroke;
      path.style.strokeWidth = originalStyles[i].strokeWidth;
      path.style.opacity = originalStyles[i].opacity;
    });

    const link = document.createElement("a");
    link.download = "flow.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <Canvas
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <Controls />
      <Panel position="top-right" className="flex gap-2">
        <Button variant={"outline"} size={"sm"} onClick={downloadImage}>
          {" "}
          <MdOutlineFileDownload className="size-4" />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={addNode}>
          {" "}
          <PlusIcon className="size-4" />
        </Button>
      </Panel>
    </Canvas>
  );
}
/** Demo component for preview */
export default function CanvasDemo() {
  const nodeTypes = useMemo(() => ({agent: AgentNode}), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = useCallback(() => {
    const id = `${Date.now()}`;
    const newNode: ReactFlowNode = {
      id,
      type: "agent",
      position: {x: Math.random() * 400 + 100, y: Math.random() * 200 + 50},
      data: {label: `Node ${nodes.length + 1}`},
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const flowRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={flowRef} className="h-screen w-full">
      <ReactFlowProvider>
        {/* <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <Panel position="top-right">
            <>
              <Button size="sm" variant="ghost" onClick={addNode}>
                <PlusIcon className="size-4" />
                Add Node
              </Button>
              <Button onClick={downloadImage}>Download Image</Button>
            </>
          </Panel>
        </Canvas> */}
        <FlowContent
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          flowRef={flowRef}
          addNode={addNode}
        />
      </ReactFlowProvider>
    </div>
  );
}
