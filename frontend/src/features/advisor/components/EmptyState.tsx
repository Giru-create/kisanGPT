"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState.tsx
// KisanGPT — Empty state for AI Advisor when no messages
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Brain, Sprout, BarChart3, CloudSun } from "lucide-react";

interface EmptyStateProps {
  onQuestionSelect: (question: string) => void;
}

const QUICK_STARTERS = [
  {
    icon: Sprout,
    question: "What's the best time to sow wheat in my region?",
    label: "Crop Advice",
  },
  {
    icon: BarChart3,
    question: "Current market prices for soybean",
    label: "Market Prices",
  },
  {
    icon: CloudSun,
    question: "Weather forecast for next 7 days",
    label: "Weather",
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onQuestionSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Brain size={32} className="text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        Welcome to KisanGPT AI Advisor
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Ask me anything about your crops, soil, market prices, or weather
        conditions. I&apos;m here to help you make informed farming decisions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {QUICK_STARTERS.map((starter) => (
          <button
            key={starter.question}
            type="button"
            onClick={() => onQuestionSelect(starter.question)}
            className="flex flex-col items-center gap-2 p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <starter.icon
              size={24}
              className="text-muted-foreground group-hover:text-primary transition-colors"
            />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary text-center">
              {starter.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

EmptyState.displayName = "EmptyState";
