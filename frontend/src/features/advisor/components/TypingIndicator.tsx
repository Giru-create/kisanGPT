"use client";

// ─────────────────────────────────────────────────────────────────────────────
// TypingIndicator.tsx
// KisanGPT — AI typing/loading indicator with animation
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      <div
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-md"
        aria-hidden="true"
      >
        <Brain size={20} className="text-primary animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5 pt-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-primary/60 rounded-full"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="sr-only">AI is thinking...</span>
    </motion.div>
  );
};

TypingIndicator.displayName = "TypingIndicator";
