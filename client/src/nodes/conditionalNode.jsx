import { useState } from "react";
import { createNode } from "./BaseNode";
import { GitBranch } from "lucide-react";

const ConditionalContent = ({ data }) => {
  const [operator, setOperator] = useState(data?.operator || ">");
  const [threshold, setThreshold] = useState(data?.threshold || "0");

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-xs font-medium text-gray-700">Operator:</span>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="nodrag mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value=">">Greater Than</option>
          <option value="<">Less Than</option>
          <option value="===">Equals</option>
          <option value="!==">Not Equals</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-700">Threshold:</span>
        <input
          type="text"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="nodrag mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </label>
    </div>
  );
};

export const ConditionalNode = createNode({
  title: "Conditional",
  icon: <GitBranch size={16} />,
  description: "Route based on condition",
  inputs: [{ id: "input" }],
  outputs: [
    { id: "true", label: "True", style: { top: "33%" } },
    { id: "false", label: "False", style: { top: "66%" } },
  ],
  content: ConditionalContent,
  className: "min-h-[140px]",
});
