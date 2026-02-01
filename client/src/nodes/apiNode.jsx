import { useState } from "react";
import { createNode } from "./BaseNode";
import { Globe } from "lucide-react";

const APIContent = ({ data }) => {
  const [method, setMethod] = useState(data?.method || "GET");

  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-700">Method:</span>
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
    </label>
  );
};

export const APINode = createNode({
  title: "API Call",
  icon: <Globe size={16} />,
  description: "Make HTTP requests",
  inputs: [
    { id: "url", label: "URL", style: { top: "25%" } },
    { id: "body", label: "Body", style: { top: "75%" } },
  ],
  outputs: [
    { id: "response", label: "Response", style: { top: "33%" } },
    { id: "error", label: "Error", style: { top: "66%" } },
  ],
  content: APIContent,
  className: "min-h-[140px]",
});
