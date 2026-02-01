import { DraggableNode } from "./draggableNode";
import { motion } from "motion/react";
import {
  FileInput,
  FileOutput,
  Type,
  Filter,
  RefreshCw,
  Globe,
  GitBranch,
  Link2,
  Cpu,
} from "lucide-react";

export const PipelineToolbar = () => {
  const categories = {
    "I/O": [
      { type: "customInput", label: "Input", icon: <FileInput size={20} /> },
      { type: "customOutput", label: "Output", icon: <FileOutput size={20} /> },
      { type: "text", label: "Text", icon: <Type size={20} /> },
    ],
    Logic: [
      { type: "filter", label: "Filter", icon: <Filter size={20} /> },
      { type: "conditional", label: "Logic", icon: <GitBranch size={20} /> },
      { type: "aggregator", label: "Merge", icon: <Link2 size={20} /> },
    ],
    Tools: [
      { type: "llm", label: "LLM", icon: <Cpu size={20} /> },
      { type: "transform", label: "Transform", icon: <RefreshCw size={20} /> },
      { type: "api", label: "API", icon: <Globe size={20} /> },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card shadow-sm border-b border-border-industrial py-4 px-6 relative z-10"
    >
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center">
              Pipeline
              <span className="text-text-secondary font-light">Builder</span>
            </h1>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Design your workflow logic.
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-8">
          <div className="flex flex-wrap gap-8 justify-center md:justify-end">
            {Object.entries(categories).map(([category, nodes]) => (
              <div key={category} className="flex flex-col gap-2">
                <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider opacity-70">
                  {category}
                </h3>
                <div className="flex gap-2">
                  {nodes.map((node) => (
                    <DraggableNode
                      key={node.type}
                      type={node.type}
                      label={node.label}
                      icon={node.icon}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
