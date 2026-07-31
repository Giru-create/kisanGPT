"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SuggestedQuestions.tsx
// KisanGPT — Suggested question chips for AI Advisor
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import { MOCK_SUGGESTED_QUESTIONS } from "../constants/advisor.constants";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelect,
}) => {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Suggested questions:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {MOCK_SUGGESTED_QUESTIONS.map((question, i) => (
          <motion.button
            key={question}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            type="button"
            onClick={() => onSelect(question)}
            className="text-left p-3 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <p className="text-sm font-medium text-muted-foreground group-hover:text-primary">
              {question}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

SuggestedQuestions.displayName = "SuggestedQuestions";
