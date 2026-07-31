"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_FARMER_ACTIONS } from "../constants/market.constants";

interface FarmerActionsProps {
  onAction?: (id: string) => void;
}

const VARIANT_CONFIG: Record<
  string,
  { border: string; bg: string; hover: string }
> = {
  primary: {
    border: "border-primary/30",
    bg: "bg-primary/5",
    hover: "hover:bg-primary/10",
  },
  secondary: {
    border: "border-border",
    bg: "bg-background",
    hover: "hover:bg-muted",
  },
  ghost: {
    border: "border-transparent",
    bg: "bg-background",
    hover: "hover:bg-muted",
  },
};

export const FarmerActions: React.FC<FarmerActionsProps> = ({ onAction }) => {
  return (
    <motion.section
      role="region"
      aria-label="Quick Actions"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
      </div>

      {/* Action grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {MOCK_FARMER_ACTIONS.map((action, i) => {
          const cfg = VARIANT_CONFIG[action.variant];

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              onClick={() => onAction?.(action.id)}
              className={cn(
                "flex flex-col items-center text-center p-3 rounded-xl border transition-all",
                cfg?.border,
                cfg?.bg,
                cfg?.hover,
                "hover:shadow-sm",
              )}
              aria-label={action.label}
            >
              <span className="text-xl mb-1.5" aria-hidden="true">
                {action.icon}
              </span>
              <p className="text-[11px] font-semibold text-foreground mb-0.5">
                {action.label}
              </p>
              <p className="text-[9px] text-muted-foreground leading-tight">
                {action.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
};

FarmerActions.displayName = "FarmerActions";
