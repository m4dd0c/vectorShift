import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useStore } from "../lib/store";
import { shallow } from "zustand/shallow";
import { CheckCircle2, AlertTriangle, X, Terminal } from "lucide-react";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const useSubmit = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const pipelineData = {
        nodes: nodes.map((node) => ({ id: node.id })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
      };

      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting pipeline:", error);
      alert(
        `Error: Failed to analyze pipeline.\n\n${error.message}\n\nMake sure the backend server is running on http://localhost:8000`,
      );
    } finally {
      setLoading(false);
    }
  }, [nodes, edges]);

  // Keyboard shortcut: Ctrl+Enter to run pipeline
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !loading) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, loading]);

  return { handleSubmit, loading, result, showModal, setShowModal };
};

export const ResultModal = ({ result, onClose }) => {
  const { num_nodes, num_edges, is_dag } = result;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!result) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-bg-card border border-border-industrial rounded-lg shadow-2xl max-w-md w-full overflow-hidden text-text-primary"
      >
        <div className="bg-bg-panel px-6 py-4 border-b border-border-industrial flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2 tracking-tight">
            <Terminal size={20} className="text-blue-600" />
            Analysis Results
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors rounded-sm hover:bg-black/5 p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center p-3 bg-bg-panel rounded-lg border border-border-industrial"
          >
            <span className="font-medium text-text-secondary text-sm flex items-center gap-2">
              <span className="text-blue-500">●</span>
              Nodes
            </span>
            <span className="text-lg font-mono font-bold text-text-primary">
              {num_nodes}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center p-3 bg-bg-panel rounded-lg border border-border-industrial"
          >
            <span className="font-medium text-text-secondary text-sm flex items-center gap-2">
              <span className="text-purple-500">●</span>
              Edges
            </span>
            <span className="text-lg font-mono font-bold text-text-primary">
              {num_edges}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex justify-between items-center p-3 rounded-lg border ${
              is_dag
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <span className="font-medium text-sm flex items-center gap-2">
              {is_dag ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              Valid DAG
            </span>
            <span className="text-lg font-mono font-bold">
              {is_dag ? "Yes" : "No"}
            </span>
          </motion.div>
        </div>

        <div className="px-6 py-4 bg-bg-panel border-t border-border-industrial flex justify-end">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-bg-card hover:bg-bg-panel text-text-primary border border-border-industrial font-medium rounded-md shadow-sm transition-all text-sm"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
