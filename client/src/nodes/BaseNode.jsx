import { Handle, Position } from "reactflow";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useStore } from "../lib/store";

/**
 * BaseNode - A configurable node component with modern styling
 *
 * Supports both static and dynamic inputs:
 * - Static: Use `createNode` with `inputs` array in config
 * - Dynamic: Use `createDynamicNode` which wraps the component with a hook provider
 */
export const BaseNode = ({
  id,
  data,
  config,
  // These are injected by createDynamicNode wrapper
  dynamicInputs = null,
  dynamicOutputs = null,
  dynamicStyle = null,
  dynamicAnimate = null,
  contentProps = null,
}) => {
  const {
    title,
    inputs: staticInputs = [],
    outputs: staticOutputs = [],
    content: Content,
    className = "",
    description = "",
    icon = null,
  } = config;

  const removeNode = useStore((state) => state.removeNode);

  // Use dynamic values if provided, otherwise fall back to static
  const inputs = dynamicInputs ?? staticInputs;
  const outputs = dynamicOutputs ?? staticOutputs;
  const animateHandles = dynamicInputs !== null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, ...dynamicAnimate }}
      transition={{ duration: 0.2 }}
      className={`
        min-w-50 min-h-30
        bg-bg-card rounded-lg
        border border-border-industrial
        shadow-sm hover:shadow-lg hover:border-text-secondary/50
        transition-all duration-200
        ${className}
      `}
      style={dynamicStyle}
    >
      {/* Input Handles - with optional AnimatePresence for dynamic inputs */}
      {animateHandles ? (
        <AnimatePresence>
          {inputs.map((input, index) => (
            <motion.div
              key={input.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Handle
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
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        inputs.map((input, index) => (
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
        ))
      )}

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
            <Content id={id} data={data} {...contentProps} />
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

/**
 * Factory function to create a static node component from a config
 */
export const createNode = (config) => {
  const NodeComponent = ({ id, data }) => (
    <BaseNode id={id} data={data} config={config} />
  );
  NodeComponent.displayName = config.title || "NodeComponent";
  return NodeComponent;
};

/**
 * Factory function to create a dynamic node component
 * The useNodeState hook is called in the wrapper component (not conditionally)
 * @param {object} config - Node configuration
 * @param {function} useNodeState - Hook that returns { inputs, outputs, style, animate, contentProps }
 */
export const createDynamicNode = (config, useNodeState) => {
  const DynamicNodeComponent = ({ id, data }) => {
    // Hook is called unconditionally in this wrapper component
    const nodeState = useNodeState(id, data);

    return (
      <BaseNode
        id={id}
        data={data}
        config={config}
        dynamicInputs={nodeState.inputs}
        dynamicOutputs={nodeState.outputs}
        dynamicStyle={nodeState.style}
        dynamicAnimate={nodeState.animate}
        contentProps={nodeState.contentProps}
      />
    );
  };
  DynamicNodeComponent.displayName = config.title || "DynamicNodeComponent";
  return DynamicNodeComponent;
};
