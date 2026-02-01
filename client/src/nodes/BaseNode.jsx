import { Handle, Position } from "reactflow";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { useStore } from "../store";

/**
 * BaseNode - A configurable node component with modern styling
 */
export const BaseNode = ({ id, data, config }) => {
  const {
    title,
    inputs = [],
    outputs = [],
    content: Content,
    className = "",
    description = "",
    icon = null,
  } = config;

  const removeNode = useStore((state) => state.removeNode);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        min-w-50 min-h-30
        bg-bg-card rounded-lg
        border border-border-industrial
        shadow-sm hover:shadow-lg hover:border-text-secondary/50
        transition-all duration-200
        ${className}
      `}
    >
      {/* Input Handles */}
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={input.position || Position.Left}
          id={`${id}-${input.id}`}
          style={
            input.style || {
              top: `${(100 / (inputs.length + 1)) * (index + 1)}%`,
            }
          }
          className="size-3! bg-bg-card! border-2! border-text-secondary! hover:border-text-primary! transition-colors rounded-full!"
        >
          {input.label && (
            <div className="absolute right-3 text-[10px] whitespace-nowrap bg-bg-card px-1.5 py-0.5 rounded-sm border border-border-industrial text-text-secondary font-mono">
              {input.label}
            </div>
          )}
        </Handle>
      ))}

      {/* Node Header */}
      <div className="bg-bg-panel text-text-primary px-3 py-2 border-b border-border-industrial rounded-t-lg flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="opacity-80 flex items-center justify-center w-5 h-5">
              {icon}
            </span>
          )}
          <span className="font-semibold tracking-tight">{title}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeNode(id);
          }}
          className="text-text-secondary hover:text-red-500 transition-colors p-0.5 rounded-sm hover:bg-red-50"
        >
          <X size={14} />
        </button>
      </div>

      {/* Node Body */}
      <div className="px-3 py-3">
        {/* Optional Description */}
        {description && (
          <div className="text-xs text-text-secondary mb-3 font-mono leading-tight">
            {description}
          </div>
        )}

        {/* Dynamic Content Area */}
        {Content && (
          <div className="mt-2">
            <Content id={id} data={data} />
          </div>
        )}
      </div>

      {/* Output Handles */}
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={output.position || Position.Right}
          id={`${id}-${output.id}`}
          style={
            output.style || {
              top: `${(100 / (outputs.length + 1)) * (index + 1)}%`,
            }
          }
          className="size-3! bg-bg-card! border-2! border-text-secondary! hover:border-text-primary! transition-colors rounded-full!"
        >
          {output.label && (
            <div className="absolute left-3 text-[10px] whitespace-nowrap bg-bg-card px-1.5 py-0.5 rounded-sm border border-border-industrial text-text-secondary font-mono">
              {output.label}
            </div>
          )}
        </Handle>
      ))}
    </motion.div>
  );
};

export const createNode = (config) => {
  const NodeComponent = ({ id, data }) => (
    <BaseNode id={id} data={data} config={config} />
  );
  NodeComponent.displayName = config.title || "NodeComponent";
  return NodeComponent;
};
