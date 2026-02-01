import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "reactflow";
import { useStore } from "../store";
import { X } from "lucide-react";

export default function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const removeEdge = useStore((state) => state.removeEdge);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              removeEdge(id);
            }}
            className="w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm border border-white"
          >
            <X size={10} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
