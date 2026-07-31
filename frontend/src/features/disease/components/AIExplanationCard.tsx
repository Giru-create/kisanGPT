"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Eye,
  Search,
  AlertCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIExplanation } from "../types/disease.types";

interface AIExplanationCardProps {
  explanation: AIExplanation;
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({
  explanation,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("why");

  const toggle = (id: string) =>
    setExpandedSection((prev) => (prev === id ? null : id));

  const sections = [
    {
      id: "why",
      label: "Why this diagnosis",
      icon: <Brain size={14} className="text-primary" />,
      content: explanation.whyDiagnosis,
    },
    {
      id: "symptoms",
      label: "Visible symptoms",
      icon: <Eye size={14} className="text-violet-500" />,
      items: explanation.visibleSymptoms,
    },
    {
      id: "evidence",
      label: "Key evidence found",
      icon: <Search size={14} className="text-blue-500" />,
      items: explanation.keyEvidence,
    },
    {
      id: "alternatives",
      label: "Alternative possibilities",
      icon: <AlertCircle size={14} className="text-amber-500" />,
      items: explanation.alternativePossibilities,
    },
    {
      id: "expert",
      label: "When to seek expert help",
      icon: <HelpCircle size={14} className="text-emerald-500" />,
      content: explanation.whenToSeekExpert,
    },
  ];

  return (
    <motion.section
      role="region"
      aria-label="AI Explanation"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Brain size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          How AI Reached This Diagnosis
        </h2>
      </div>

      {/* Accordion sections */}
      <div className="space-y-2">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className="rounded-xl border border-border">
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-2.5 p-3 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={isExpanded}
              >
                {section.icon}
                <span className="text-xs font-medium text-foreground flex-1">
                  {section.label}
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-muted-foreground transition-transform",
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
                      {section.content && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      )}
                      {section.items && (
                        <ul className="space-y-1.5">
                          {section.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-[11px] text-muted-foreground"
                            >
                              <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
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

AIExplanationCard.displayName = "AIExplanationCard";
