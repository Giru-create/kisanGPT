"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SUGGESTED_EXAMPLES } from "../constants/disease.constants";

interface DiseaseEmptyProps {
  onStartDiagnosis?: () => void;
}

export const DiseaseEmpty: React.FC<DiseaseEmptyProps> = ({
  onStartDiagnosis,
}) => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-8 text-center"
    >
      {/* Icon cluster */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="text-3xl"
        >
          {"\uD83C\uDF3F"}
        </motion.span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-2xl opacity-60"
        >
          {"\uD83D\uDD0D"}
        </motion.span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-3xl"
        >
          {"\uD83C\uDF48"}
        </motion.span>
      </div>

      {/* Title */}
      <h3 className="ds-heading-sm text-foreground mb-2">
        Detect Crop Diseases
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed mb-5">
        Take a photo or upload an image of your crop. Our AI will identify
        diseases and recommend treatments in seconds.
      </p>

      {/* Suggested examples */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="text-[10px] text-muted-foreground">Try scanning:</span>
        {SUGGESTED_EXAMPLES.map((ex) => (
          <span
            key={ex.label}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-background text-[10px] font-medium text-muted-foreground"
          >
            {ex.icon} {ex.label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Button
        onClick={onStartDiagnosis}
        leftIcon={<Sparkles size={16} />}
        className="text-xs"
      >
        Start First Diagnosis
      </Button>
    </motion.div>
  );
};

DiseaseEmpty.displayName = "DiseaseEmpty";
