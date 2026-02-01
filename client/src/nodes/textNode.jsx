import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Type } from "lucide-react";
import { createDynamicNode } from "./BaseNode";

/**
 * Custom hook to manage TextNode's dynamic state
 * Returns computed inputs based on detected variables in text
 */
const useTextNodeState = (_id, data) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [dimensions, setDimensions] = useState({ width: 250, height: 140 });
  const textareaRef = useRef(null);

  // Compute variables from text using useMemo (no setState needed)
  const variables = useMemo(() => {
    const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = [...currText.matchAll(variableRegex)];
    return [...new Set(matches.map((match) => match[1].trim()))];
  }, [currText]);

  // Compute dynamic inputs from variables
  const inputs = useMemo(
    () =>
      variables.map((variable) => ({
        id: variable,
        label: variable,
      })),
    [variables],
  );

  return {
    inputs,
    outputs: [{ id: "output" }],
    style: { minWidth: 250, minHeight: 140 },
    animate: {
      width: dimensions.width,
      height: dimensions.height,
    },
    contentProps: {
      currText,
      setCurrText,
      variables,
      setDimensions,
      textareaRef,
    },
  };
};

/**
 * Content component for TextNode
 */
const TextNodeContent = ({
  currText,
  setCurrText,
  variables,
  setDimensions,
  textareaRef,
}) => {
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
  }, [currText, setDimensions, textareaRef]);

  return (
    <div>
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
  );
};

export const TextNode = createDynamicNode(
  {
    title: "Text",
    icon: <Type size={16} />,
    content: TextNodeContent,
  },
  useTextNodeState,
);
