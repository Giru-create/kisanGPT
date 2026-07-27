// ─────────────────────────────────────────────────────────────────────────────
// MemoryTimeline.tsx
// KisanGPT — Chronological Farm Memory Timeline Component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { MemoryCard } from "./MemoryCard";
import { MemoryEmpty } from "./MemoryEmpty";
import type { FarmMemoryItem } from "../types/memory.types";

interface MemoryTimelineProps {
  items: FarmMemoryItem[];
  onDelete?: (id: string) => void;
  onAddClick: () => void;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  items,
  onDelete,
  onAddClick,
}) => {
  if (items.length === 0) {
    return <MemoryEmpty onAddClick={onAddClick} />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <MemoryCard key={item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
};

MemoryTimeline.displayName = "MemoryTimeline";
