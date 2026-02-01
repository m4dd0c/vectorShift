import { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 200, height: 120 });
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

      // Also update width based on content
      const textLength = currText.length;

      // Calculate dynamic dimensions
      const newWidth = Math.max(
        200,
        Math.min(400, 100 + Math.floor(textLength / 2)),
      );
      const newHeight = Math.max(120, 100 + textareaRef.current.scrollHeight);

      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [currText]);

  // Detect variables in text using regex
  useEffect(() => {
    // Regex to match valid JavaScript variable names in {{}}
    // Valid: {{varName}}, {{input}}, {{my_var}}, {{$special}}
    // Invalid: {{123}}, {{var-name}}, {{var name}}
    const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = [...currText.matchAll(variableRegex)];
    const foundVariables = matches.map((match) => match[1].trim());

    // Remove duplicates while preserving order
    const uniqueVariables = [...new Set(foundVariables)];

    setVariables(uniqueVariables);
  }, [currText]);

  const nodeStyle = {
    width: dimensions.width,
    minHeight: dimensions.height,
    border: "1px solid black",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#fff",
    transition: "width 0.2s ease, height 0.2s ease",
  };

  return (
    <div style={nodeStyle}>
      {/* Dynamic Input Handles for Variables */}
      {variables.map((variable, index) => {
        const topPosition = `${(100 / (variables.length + 1)) * (index + 1)}%`;
        return (
          <Handle
            key={`${id}-${variable}`}
            type="target"
            position={Position.Left}
            id={`${id}-${variable}`}
            style={{ top: topPosition }}
          >
            <div
              style={{
                position: "absolute",
                right: "12px",
                fontSize: "10px",
                whiteSpace: "nowrap",
                backgroundColor: "#fff",
                padding: "2px 4px",
                borderRadius: "3px",
                border: "1px solid #ddd",
                color: "#333",
              }}
            >
              {variable}
            </div>
          </Handle>
        );
      })}

      {/* Node Header */}
      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Text</div>

      {/* Text Content */}
      <div>
        <label style={{ display: "block" }}>
          Text:
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            style={{
              width: "100%",
              marginTop: "4px",
              resize: "vertical",
              minHeight: "60px",
              overflow: "hidden",
              fontFamily: "monospace",
              fontSize: "13px",
              padding: "6px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Enter text with {{variables}}..."
          />
        </label>
      </div>

      {/* Display detected variables info */}
      {variables.length > 0 && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          Variables: {variables.join(", ")}
        </div>
      )}

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </div>
  );
};
