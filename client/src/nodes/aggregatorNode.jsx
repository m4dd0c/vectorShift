import { useState } from "react";
import { createNode } from "./BaseNode";
import { Link2 } from "lucide-react";

const AggregatorContent = ({ data }) => {
  const [operation, setOperation] = useState(data?.operation || "concat");

  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-700">Operation:</span>
      <select
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
        className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      >
        <option value="concat">Concatenate</option>
        <option value="merge">Merge Objects</option>
        <option value="sum">Sum</option>
        <option value="average">Average</option>
      </select>
    </label>
  );
};

export const AggregatorNode = createNode({
  title: "Aggregator",
  icon: <Link2 size={16} />,
  description: "Combine multiple inputs",
  inputs: [
    { id: "input1", label: "In1", style: { top: "20%" } },
    { id: "input2", label: "In2", style: { top: "40%" } },
    { id: "input3", label: "In3", style: { top: "60%" } },
    { id: "input4", label: "In4", style: { top: "80%" } },
  ],
  outputs: [{ id: "output" }],
  content: AggregatorContent,
  className: "min-h-[160px]",
});
