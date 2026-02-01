import { Handle, Position } from "reactflow";

const BaseNode = ({ id, data, config }) => {
  const {
    title,
    inputs = [],
    outputs = [],
    content,
    style = {},
    description = "",
  } = config;

  const Content = content;

  const defaultStyle = {
    minWidth: 200,
    minHeight: 80,
    border: "1px solid black",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#fff",
    ...style,
  };
  return (
    <div style={defaultStyle}>
      {inputs.map((input, idx) => (
        <Handle
          key={input.id}
          type="target"
          position={input.position || Position.Left}
          id={`${id}-${input.id}`}
          style={
            input.style || {
              top: `${(100 / (inputs.length + 1)) * (idx + 1)}%`,
            }
          }
        >
          {input.label && (
            <div
              style={{
                position: "absolute",
                right: "10px",
                fontSize: "10px",
                whiteSpace: "nowrap",
              }}
            >
              {input.label}
            </div>
          )}
        </Handle>
      ))}

      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>{title}</div>

      {description && (
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
          {description}
        </div>
      )}
      {Content && (
        <div style={{ marginTop: "8px" }}>
          <Content id={id} data={data} />
        </div>
      )}

      {outputs.map((output, idx) => (
        <Handle
          key={output.id}
          type="source"
          position={output.position || Position.Right}
          id={`${id}-${output.id}`}
          style={
            output.style || {
              top: `${(100 / (outputs.length + 1)) * (idx + 1)}%`,
            }
          }
        >
          {output.label && (
            <div
              style={{
                position: "absolute",
                left: "10px",
                fontSize: "10px",
                whiteSpace: "nowrap",
              }}
            >
              {output.label}
            </div>
          )}
        </Handle>
      ))}
    </div>
  );
};

export const createNode = (config) => {
  return ({ id, data }) => <BaseNode id={id} data={data} config={config} />;
};
