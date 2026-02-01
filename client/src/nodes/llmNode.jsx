import { Cpu } from "lucide-react";
import { createNode } from "./BaseNode";

export const LLMNode = createNode({
  title: "LLM",
  icon: <Cpu size={16} />,
  description: "Large Language Model",
  inputs: [
    { id: "system", label: "System", style: { top: "33%" } },
    { id: "prompt", label: "Prompt", style: { top: "66%" } },
  ],
  outputs: [{ id: "response", label: "Response" }],
  content: null,
  className: "min-h-[100px]",
});
