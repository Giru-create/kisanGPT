"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SUGGESTED_SEARCHES } from "../constants/schemes.constants";

interface SchemesEmptyProps {
  onSearch?: (term: string) => void;
}

export const SchemesEmpty: React.FC<SchemesEmptyProps> = ({ onSearch }) => {
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
          {"\uD83C\uDFE6"}
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
        Discover Government Schemes
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed mb-5">
        Search for schemes you&apos;re eligible for, track applications, and get
        AI-powered recommendations tailored to your farm.
      </p>

      {/* Suggested searches */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="text-[10px] text-muted-foreground">
          Try searching:
        </span>
        {SUGGESTED_SEARCHES.map((term) => (
          <button
            key={term.label}
            onClick={() => onSearch?.(term.label)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-background text-[10px] font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
          >
            {term.icon} {term.label}
          </button>
        ))}
      </div>

      {/* CTA */}
      <Button
        onClick={() => onSearch?.("PM-KISAN")}
        leftIcon={<Search size={16} />}
        className="text-xs"
      >
        Search Schemes
      </Button>
    </motion.div>
  );
};

SchemesEmpty.displayName = "SchemesEmpty";
