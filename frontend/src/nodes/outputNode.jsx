import { useState } from "react";
import { createNode } from "./BaseNode";

const OutputContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_"),
  );
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  return (
    <>
      <label style={{ display: "block", marginBottom: "5px" }}>
        Name:
        <input
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          style={{ width: "100%", marginTop: "2px" }}
        />
      </label>
      <label style={{ display: "block" }}>
        Type:
        <select
          value={outputType}
          onChange={(e) => setOutputType(e.target.value)}
          style={{ width: "100%", marginTop: "2px" }}
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </>
  );
};

export const OutputNode = createNode({
  title: "Output",
  inputs: [{ id: "value" }],
  content: OutputContent,
});
