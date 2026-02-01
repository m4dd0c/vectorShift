import { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";
import { motion, AnimatePresence } from "motion/react";
import { Type } from "lucide-react";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 250, height: 140 });
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";

      const textLength = currText.length;

      const newWidth = Math.max(
        250,
        Math.min(450, 250 + Math.floor(textLength / 2)),
      );
      const newHeight = Math.max(140, 120 + textareaRef.current.scrollHeight);

      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [currText]);

  // Detect variables in text using regex
  useEffect(() => {
    const validateVariable = () => {
      const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
      const matches = [...currText.matchAll(variableRegex)];
      const foundVariables = [
        ...new Set(matches.map((match) => match[1].trim())),
      ];
      setVariables(foundVariables);
    };

    validateVariable();
  }, [currText]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        width: dimensions.width,
        height: dimensions.height,
      }}
      transition={{ duration: 0.2 }}
      className="bg-bg-card rounded-lg border border-border-industrial shadow-sm hover:shadow-lg hover:border-text-secondary/50 transition-all"
      style={{ minWidth: 250, minHeight: 140 }}
    >
      {/* Dynamic Input Handles for Variables */}
      <AnimatePresence>
        {variables.map((variable, index) => {
          const topPosition = `${(100 / (variables.length + 1)) * (index + 1)}%`;
          return (
            <motion.div
              key={`${id}-${variable}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={`${id}-${variable}`}
                style={{ top: topPosition }}
                className="size-3! bg-bg-card! border-2! border-text-secondary! hover:border-text-primary! transition-colors rounded-full!"
              >
                <div className="absolute right-3 text-[10px] whitespace-nowrap bg-bg-card px-1.5 py-0.5 rounded-sm border border-border-industrial text-text-secondary font-mono">
                  {variable}
                </div>
              </Handle>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Node Header */}
      {/* Node Header */}
      <div className="bg-bg-panel text-text-primary px-3 py-2 border-b border-border-industrial rounded-t-lg flex items-center gap-2">
        <Type className="text-text-secondary" size={16} />
        <span className="font-semibold text-sm tracking-tight">Text</span>
      </div>

      {/* Node Body */}
      <div className="px-4 py-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-700">Content:</span>
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            placeholder="Enter text with {{variables}}..."
            className="nodrag mt-1 block w-full px-3 py-2 text-xs border border-border-industrial rounded-md bg-white text-text-primary focus:border-text-secondary focus:outline-none transition-all resize-none overflow-hidden font-mono leading-relaxed"
            rows={1}
          />
        </label>

        {/* Display detected variables info */}
        <AnimatePresence>
          {variables.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-[10px] text-gray-500 italic flex flex-wrap gap-1"
            >
              <span className="font-semibold">Variables:</span>
              {variables.map((v) => (
                <span
                  key={v}
                  className="bg-bg-panel border border-border-industrial text-text-secondary px-1.5 py-0.5 rounded-sm"
                >
                  {v}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="size-3! bg-bg-card! border-2! border-text-secondary! hover:border-text-primary! transition-colors rounded-full!"
      />
    </motion.div>
  );
};
