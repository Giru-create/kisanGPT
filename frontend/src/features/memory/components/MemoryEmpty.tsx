"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Sparkles,
  MessageCircle,
  Wheat,
  Cloud,
} from "lucide-react";

interface MemoryEmptyProps {
  onAddClick: () => void;
}

const SUGGESTED_PROMPTS = [
  {
    icon: <Wheat size={14} className="text-emerald-600" />,
    text: "Record my wheat harvest yield",
  },
  {
    icon: <Cloud size={14} className="text-sky-600" />,
    text: "Log today's irrigation schedule",
  },
  {
    icon: <MessageCircle size={14} className="text-primary" />,
    text: "Save this AI advice about soil health",
  },
];

export const MemoryEmpty: React.FC<MemoryEmptyProps> = ({ onAddClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto space-y-5 rounded-2xl border border-border bg-card p-8"
    >
      <div className="relative">
        <div className="w-18 h-18 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <BookOpen size={32} />
        </div>
        <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md">
          <Sparkles size={14} />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-foreground mb-2">
          No memories yet
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed mb-5">
          Start building your farm&apos;s AI memory. KisanGPT will remember soil
          tests, crop yields, disease history, and every conversation you have.
        </p>
      </div>

      {/* Suggested prompts */}
      <div className="w-full space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Try saying
        </p>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <div
            key={prompt.text}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50 text-left"
          >
            {prompt.icon}
            <span className="text-[11px] text-muted-foreground">
              &quot;{prompt.text}&quot;
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Plus size={16} />
        <span>Add First Memory</span>
      </button>
    </motion.div>
  );
};

MemoryEmpty.displayName = "MemoryEmpty";
