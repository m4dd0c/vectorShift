import { useState } from "react";
import { createNode } from "./BaseNode";
import { FileOutput } from "lucide-react";

const OutputContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_"),
  );
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-text-secondary">Name:</span>
        <input
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          className="mt-1 block w-full px-2 py-1.5 text-xs border border-border-industrial rounded-md bg-white text-text-primary focus:border-text-secondary focus:outline-none transition-all font-mono"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-text-secondary">Type:</span>
        <select
          value={outputType}
          onChange={(e) => setOutputType(e.target.value)}
          className="mt-1 block w-full px-2 py-1.5 text-xs border border-border-industrial rounded-md bg-white text-text-primary focus:border-text-secondary focus:outline-none transition-all font-mono"
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </div>
  );
};

export const OutputNode = createNode({
  title: "Output",
  icon: <FileOutput size={16} />,
  inputs: [{ id: "value", label: "Artifact" }],
  content: OutputContent,
});
