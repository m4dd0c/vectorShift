import { useState } from "react";
import { createNode } from "./BaseNode";
import { RefreshCcw } from "lucide-react";

const TransformContent = ({ data }) => {
  const [operation, setOperation] = useState(data?.operation || "uppercase");

  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-700">Operation:</span>
      <select
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
        className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      >
        <option value="uppercase">Uppercase</option>
        <option value="lowercase">Lowercase</option>
        <option value="trim">Trim</option>
        <option value="reverse">Reverse</option>
        <option value="json">To JSON</option>
      </select>
    </label>
  );
};

export const TransformNode = createNode({
  title: "Transform",
  icon: <RefreshCcw size={16} />,
  description: "Transform data format",
  inputs: [{ id: "input" }],
  outputs: [{ id: "output" }],
  content: TransformContent,
});
