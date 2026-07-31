"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { MemoryCard } from "./MemoryCard";
import { MemoryEmpty } from "./MemoryEmpty";
import type { FarmMemoryItem } from "../types/memory.types";

interface MemoryTimelineProps {
  items: FarmMemoryItem[];
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
  onSave?: (id: string) => void;
  onSelect?: (item: FarmMemoryItem) => void;
  onAddClick: () => void;
}

function groupByMonth(items: FarmMemoryItem[]) {
  const groups: Record<string, FarmMemoryItem[]> = {};
  for (const item of items) {
    const d = new Date(item.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, groupItems]) => {
      const d = new Date(groupItems[0]!.timestamp);
      const label = d.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
      return { key, label, items: groupItems };
    });
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  items,
  onDelete,
  onPin,
  onSave,
  onSelect,
  onAddClick,
}) => {
  if (items.length === 0) {
    return <MemoryEmpty onAddClick={onAddClick} />;
  }

  const groups = groupByMonth(items);

  return (
    <div className="space-y-6">
      {groups.map((group, groupIdx) => (
        <motion.div
          key={group.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: groupIdx * 0.06 }}
        >
          {/* Month header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Calendar size={13} className="text-muted-foreground" />
            </div>
            <h3 className="text-xs font-bold text-foreground">{group.label}</h3>
            <span className="text-[10px] text-muted-foreground">
              ({group.items.length}{" "}
              {group.items.length === 1 ? "memory" : "memories"})
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Memory cards */}
          <div className="space-y-3 ml-3.5 border-l-2 border-border/40 pl-4">
            {group.items.map((item, idx) => (
              <MemoryCard
                key={item.id}
                item={item}
                index={idx}
                onDelete={onDelete}
                onPin={onPin}
                onSave={onSave}
                onSelect={onSelect}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

MemoryTimeline.displayName = "MemoryTimeline";
