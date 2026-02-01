import { motion } from "motion/react";

export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <motion.div
      draggable
      onDragStart={(event) => onDragStart(event, type)}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`
        cursor-grab active:cursor-grabbing
        min-w-[80px] h-[80px]
        flex flex-col items-center justify-center gap-2
        bg-bg-card hover:bg-bg-panel
        text-text-primary font-medium text-xs
        rounded-xl shadow-sm hover:shadow-lg
        transition-all duration-200 ease-out
        border border-border-industrial hover:border-text-secondary
        hover:-translate-y-[2px]
      `}
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
};
