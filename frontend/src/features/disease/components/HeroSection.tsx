"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Sparkles, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SUPPORTED_CROPS } from "../constants/disease.constants";
import type { DiagnosisHistoryItem } from "../types/disease.types";

interface HeroSectionProps {
  recentDiagnosis?: DiagnosisHistoryItem;
  onStartDiagnosis?: () => void;
  onViewHistory?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  recentDiagnosis,
  onStartDiagnosis,
  onViewHistory,
}) => {
  return (
    <motion.section
      role="region"
      aria-label="AI Disease Detection"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles size={16} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              AI Disease Detection
            </h2>
            <p className="text-[10px] text-muted-foreground">
              Quick diagnosis powered by AI
            </p>
          </div>
        </div>
        <Badge variant="success" className="text-[10px]">
          <CheckCircle2 size={10} className="mr-1" />
          AI Ready
        </Badge>
      </div>

      {/* Supported crops strip */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-muted-foreground shrink-0">
          Supported:
        </span>
        {SUPPORTED_CROPS.slice(0, 6).map((crop) => (
          <span
            key={crop.name}
            className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground"
          >
            {crop.emoji} {crop.name}
          </span>
        ))}
      </div>

      {/* Recent diagnosis shortcut */}
      {recentDiagnosis && (
        <button
          onClick={onViewHistory}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors mb-4 text-left"
        >
          <Clock size={14} className="text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              Last scan: {recentDiagnosis.disease_name} on{" "}
              {recentDiagnosis.crop}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {new Date(recentDiagnosis.created_at).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                },
              )}
            </p>
          </div>
          <ArrowRight size={14} className="text-muted-foreground shrink-0" />
        </button>
      )}

      {/* Start button */}
      <Button
        onClick={onStartDiagnosis}
        leftIcon={<Leaf size={16} />}
        className="w-full"
      >
        Start Diagnosis
      </Button>
    </motion.section>
  );
};

HeroSection.displayName = "HeroSection";
