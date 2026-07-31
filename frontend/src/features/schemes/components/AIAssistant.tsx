"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_AI_QUESTIONS } from "../constants/schemes.constants";

interface AIAssistantProps {
  onAskQuestion?: (question: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onAskQuestion }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState("");

  const toggleQuestion = (id: string) =>
    setExpandedQuestion((prev) => (prev === id ? null : id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuery.trim()) {
      onAskQuestion?.(customQuery.trim());
      setCustomQuery("");
    }
  };

  return (
    <motion.section
      role="region"
      aria-label="AI Scheme Assistant"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <MessageCircle
            size={14}
            className="text-primary"
            aria-hidden="true"
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Ask AI About Schemes
          </h2>
          <p className="text-[10px] text-muted-foreground">
            Get instant answers about eligibility and benefits
          </p>
        </div>
      </div>

      {/* Custom question input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about any scheme..."
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
            aria-label="Ask a question about schemes"
          />
          <button
            type="submit"
            disabled={!customQuery.trim()}
            className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            aria-label="Submit question"
          >
            <Send size={14} />
          </button>
        </div>
      </form>

      {/* Suggested questions */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Common questions
        </p>
        {MOCK_AI_QUESTIONS.map((q) => {
          const isExpanded = expandedQuestion === q.id;

          return (
            <div key={q.id} className="rounded-xl border border-border">
              <button
                onClick={() => toggleQuestion(q.id)}
                className="w-full flex items-center gap-2.5 p-3 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={isExpanded}
              >
                <Sparkles
                  size={12}
                  className="text-primary shrink-0"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-foreground flex-1">
                  {q.question}
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-muted-foreground transition-transform shrink-0",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-0">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

AIAssistant.displayName = "AIAssistant";
