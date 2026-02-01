// llmNode.jsx - Refactored using BaseNode

import { createNode } from "./BaseNode";

export const LLMNode = createNode({
  title: "LLM",
  description: "This is a LLM.",
  inputs: [
    { id: "system", label: "system", style: { top: "33%" } },
    { id: "prompt", label: "prompt", style: { top: "66%" } },
  ],
  outputs: [{ id: "response" }],
  content: null, // No interactive content
});
