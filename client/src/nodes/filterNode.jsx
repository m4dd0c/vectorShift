import { useState } from "react";
import { createNode } from "./BaseNode";
import { Filter } from "lucide-react";

const FilterContent = ({ data }) => {
  const [condition, setCondition] = useState(data?.condition || "contains");
  const [value, setValue] = useState(data?.value || "");

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-xs font-medium text-gray-700">Condition:</span>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="nodrag mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-700">Value:</span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="nodrag mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </label>
    </div>
  );
};

export const FilterNode = createNode({
  title: "Filter",
  icon: <Filter size={16} />,
  description: "Filter data based on conditions",
  inputs: [{ id: "input" }],
  outputs: [{ id: "output" }],
  content: FilterContent,
});
