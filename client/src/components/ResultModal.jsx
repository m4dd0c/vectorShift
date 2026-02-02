import { useEffect } from "react";

export const ResultModal = ({ result, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!result) return null;

  const { num_nodes, num_edges, is_dag } = result;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "slideIn 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1C2536",
            }}
          >
            Pipeline Analysis Results
          </h2>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: "#f5f7fa",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontWeight: "600", color: "#555" }}>
              📊 Number of Nodes:
            </span>
            <span style={{ fontWeight: "bold", color: "#1C2536" }}>
              {num_nodes}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: "#f5f7fa",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontWeight: "600", color: "#555" }}>
              🔗 Number of Edges:
            </span>
            <span style={{ fontWeight: "bold", color: "#1C2536" }}>
              {num_edges}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: is_dag ? "#e8f5e9" : "#ffebee",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontWeight: "600", color: "#555" }}>
              {is_dag ? "✅" : "❌"} Is Valid DAG:
            </span>
            <span
              style={{
                fontWeight: "bold",
                color: is_dag ? "#2e7d32" : "#c62828",
              }}
            >
              {is_dag ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            backgroundColor: is_dag ? "#e3f2fd" : "#fff3e0",
            borderRadius: "8px",
            marginBottom: "24px",
            borderLeft: `4px solid ${is_dag ? "#2196f3" : "#ff9800"}`,
          }}
        >
          <p style={{ margin: 0, color: "#555", lineHeight: "1.5" }}>
            {is_dag
              ? "✓ Your pipeline is a valid Directed Acyclic Graph! All nodes can be processed in topological order without cycles."
              : "⚠ Warning: Your pipeline contains cycles and is not a valid DAG. This may cause infinite loops or processing errors."}
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: "bold",
              backgroundColor: "#1C2536",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#2a3f5f";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#1C2536";
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
