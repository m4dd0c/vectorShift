import { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "../lib/store";
import { shallow } from "zustand/shallow";
import { InputNode } from "../nodes/inputNode";
import { LLMNode } from "../nodes/llmNode";
import { OutputNode } from "../nodes/outputNode";
import { TextNode } from "../nodes/textNode";
import { FilterNode } from "../nodes/filterNode";
import { TransformNode } from "../nodes/transformNode";
import { APINode } from "../nodes/apiNode";
import { ConditionalNode } from "../nodes/conditionalNode";
import { AggregatorNode } from "../nodes/aggregatorNode";

import { useSubmit, ResultModal } from "./submit";
import DeletableEdge from "./DeletableEdge";
import { motion, AnimatePresence } from "motion/react";
import { Play } from "lucide-react";
import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  transform: TransformNode,
  api: APINode,
  conditional: ConditionalNode,
  aggregator: AggregatorNode,
};

const edgeTypes = {
  deletable: DeletableEdge,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  removeEdge: state.removeEdge,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    removeEdge,
  } = useStore(selector, shallow);

  const { handleSubmit, loading, result, showModal, setShowModal } =
    useSubmit();

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow"),
        );
        const type = appData?.nodeType;

        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-[calc(100vh-180px)] bg-bg-dark relative"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeDoubleClick={(_, edge) => removeEdge(edge.id)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
      >
        <Background color="#e4e4e7" gap={gridSize} className="bg-bg-dark" />
        <Controls className="bg-bg-card border border-border-industrial shadow-md rounded-md fill-black stroke-black text-black" />
        <MiniMap
          className="bg-bg-card border border-border-industrial shadow-md rounded-md"
          maskColor="rgba(250, 250, 250, 0.6)"
          nodeColor={(_) => {
            return "#e4e4e7"; // Zinc 200 for nodes in minimap
          }}
        />
      </ReactFlow>

      {/* Floating Run Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ position: "absolute", top: "2%", right: "25px", zIndex: 20 }}
        className="px-4 py-2 bg-linear-to-b from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white font-medium text-xs rounded-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-slate-800 border-t-slate-600 ring-1 ring-white/10"
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="size-3 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <Play size={14} fill="currentColor" />
        )}
        <div className="flex flex-col items-start leading-none gap-[3px]">
          <span className="hidden sm:inline">Run</span>
          <span className="text-[9px] opacity-70 font-mono hidden sm:inline-block">
            Cmd+Enter
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {showModal && result && (
          <ResultModal result={result} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
