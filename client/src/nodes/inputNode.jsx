import { useState } from "react";
import { createNode } from "./BaseNode";
import { FileInput } from "lucide-react";

const InputContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_"),
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-xs font-medium text-gray-700">Name:</span>
        <input
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          className="nodrag mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-700">Type:</span>
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          className="nodrag mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </div>
  );
};

export const InputNode = createNode({
  title: "Input",
  icon: <FileInput size={16} />,
  outputs: [{ id: "value" }],
  content: InputContent,
});
