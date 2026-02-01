import { useState } from "react";
import { createNode } from "./BaseNode";

const InputContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_"),
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");

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
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          style={{ width: "100%", marginTop: "2px" }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </>
  );
};

export const InputNode = createNode({
  title: "Input",
  outputs: [{ id: "value" }],
  content: InputContent,
});
