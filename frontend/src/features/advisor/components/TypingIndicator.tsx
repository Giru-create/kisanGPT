"use client";

// ─────────────────────────────────────────────────────────────────────────────
// TypingIndicator.tsx
// KisanGPT — AI typing/loading indicator
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Brain } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4">
      <div
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-md"
        aria-hidden="true"
      >
        <Brain size={20} className="text-primary animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5 pt-3">
        <span
          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="sr-only">AI is thinking...</span>
    </div>
  );
};

TypingIndicator.displayName = "TypingIndicator";
