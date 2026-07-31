"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_AI_RECOMMENDATION } from "../constants/schemes.constants";
import type { Scheme } from "../types/schemes.types";

interface AIRecommendationCardProps {
  onSelectScheme?: (scheme: Scheme) => void;
  onApply?: (scheme: Scheme) => void;
  onSave?: (scheme: Scheme) => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  onSelectScheme,
  onApply,
  onSave,
}) => {
  const rec = MOCK_AI_RECOMMENDATION;

  return (
    <motion.section
      role="region"
      aria-label="AI Recommendation"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-primary/20 bg-primary/5 shadow-sm overflow-hidden"
    >
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary to-emerald-400" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles size={16} className="text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                Top Recommendation
              </p>
              <h3 className="text-sm font-bold text-foreground">
                {rec.scheme.title}
              </h3>
            </div>
          </div>
          <Badge variant="success" className="text-[10px]">
            {Math.round(rec.confidence * 100)}% match
          </Badge>
        </div>

        {/* Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {rec.scheme.summary}
        </p>

        {/* Benefit highlight */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-4">
          <CheckCircle2
            size={16}
            className="text-emerald-600 shrink-0"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {rec.estimatedBenefit}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Estimated benefit for your farm
            </p>
          </div>
        </div>

        {/* Why it matches */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
            Why this matches you
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {rec.whyItMatches}
          </p>
        </div>

        {/* Required actions */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Required next steps
          </p>
          <ul className="space-y-1.5">
            {rec.requiredActions.map((action, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />
                {action}
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onApply?.(rec.scheme)}
            leftIcon={<ArrowRight size={14} />}
            className="flex-1 text-xs"
            size="sm"
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            onClick={() => onSave?.(rec.scheme)}
            leftIcon={<Bookmark size={14} />}
            className="text-xs"
            size="sm"
          >
            Save
          </Button>
          <Button
            variant="ghost"
            onClick={() => onSelectScheme?.(rec.scheme)}
            className="text-xs px-3"
            size="sm"
          >
            <ExternalLink size={14} />
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

AIRecommendationCard.displayName = "AIRecommendationCard";
