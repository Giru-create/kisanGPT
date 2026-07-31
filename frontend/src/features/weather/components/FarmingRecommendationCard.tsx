"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FarmingRecommendationCard.tsx
// KisanGPT — AI-driven farming advice card with confidence and reasoning
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import {
  Sprout,
  Droplets,
  Droplet,
  Lightbulb,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Leaf,
  Scissors,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  SEVERITY_LABEL,
  SEVERITY_BADGE_VARIANT,
} from "../constants/weather.constants";
import type { FarmingRecommendation } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Left accent border color per severity
// ---------------------------------------------------------------------------

const SEVERITY_BORDER: Record<string, string> = {
  none: "border-l-emerald-500",
  low: "border-l-blue-500",
  moderate: "border-l-amber-400",
  high: "border-l-amber-500",
  extreme: "border-l-red-500",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FarmingRecommendationCardProps {
  recommendation: FarmingRecommendation;
  onChatRedirect?: (payload: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const FarmingRecommendationCard: React.FC<
  FarmingRecommendationCardProps
> = ({ recommendation, onChatRedirect }) => {
  const {
    severity,
    alertMessage,
    irrigationWindow,
    fertilizerTiming,
    sprayingAdvice,
    harvestGuidance,
    cropTip,
    confidence,
    reasoning,
    chatContextPayload,
  } = recommendation;

  const isAlert = severity === "high" || severity === "extreme";

  const handleChat = () => {
    if (chatContextPayload && onChatRedirect) {
      onChatRedirect(chatContextPayload);
    }
  };

  return (
    <motion.section
      role="region"
      aria-label="Today's farming advice"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border border-border bg-card shadow-sm",
        "border-l-4",
        SEVERITY_BORDER[severity] ?? "border-l-emerald-500",
      )}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Sprout size={16} className="text-primary" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-foreground">
                Today&apos;s Farming Advice
              </h2>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Based on weather for your farm
            </p>
          </div>

          <div className="flex items-center gap-2">
            {confidence > 0 && (
              <Badge
                variant="default"
                className="text-[10px] px-2 py-0.5 gap-1"
              >
                <Brain size={10} aria-hidden="true" />
                {confidence}%
              </Badge>
            )}
            {severity !== "none" && (
              <Badge
                variant={SEVERITY_BADGE_VARIANT[severity]}
                className="shrink-0"
              >
                {SEVERITY_LABEL[severity]}
              </Badge>
            )}
          </div>
        </div>

        {/* Alert message */}
        {alertMessage && (
          <div
            className={cn(
              "flex gap-2.5 rounded-lg p-3 mb-4 text-sm",
              isAlert
                ? "bg-amber-500/10 text-amber-900 dark:text-amber-200"
                : "bg-muted text-foreground",
            )}
            role={isAlert ? "alert" : undefined}
          >
            <AlertTriangle
              size={16}
              className="shrink-0 mt-0.5 text-amber-500"
              aria-hidden="true"
            />
            <p>{alertMessage}</p>
          </div>
        )}

        {/* Recommendation Items */}
        <div className="space-y-3 mb-5">
          {/* Irrigation Window */}
          {irrigationWindow && (
            <div className="flex gap-2.5">
              <CheckCircle2
                size={16}
                className="shrink-0 mt-0.5 text-blue-500"
                aria-hidden="true"
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  Best irrigation window:
                </p>
                <p className="text-muted-foreground">
                  {irrigationWindow.start} – {irrigationWindow.end}
                </p>
              </div>
            </div>
          )}

          {/* Fertilizer Timing */}
          {fertilizerTiming && (
            <div className="flex gap-2.5">
              <Leaf
                size={16}
                className="shrink-0 mt-0.5 text-emerald-500"
                aria-hidden="true"
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  Fertilizer timing:
                </p>
                <p className="text-muted-foreground">{fertilizerTiming}</p>
              </div>
            </div>
          )}

          {/* Spraying Advice */}
          {sprayingAdvice && (
            <div className="flex gap-2.5">
              <Droplet
                size={16}
                className="shrink-0 mt-0.5 text-purple-500"
                aria-hidden="true"
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  Spraying recommendation:
                </p>
                <p className="text-muted-foreground">{sprayingAdvice}</p>
              </div>
            </div>
          )}

          {/* Harvest Guidance */}
          {harvestGuidance && (
            <div className="flex gap-2.5">
              <Scissors
                size={16}
                className="shrink-0 mt-0.5 text-orange-500"
                aria-hidden="true"
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">Harvest guidance:</p>
                <p className="text-muted-foreground">{harvestGuidance}</p>
              </div>
            </div>
          )}

          {/* Crop Tip */}
          {cropTip && (
            <div className="flex gap-2.5">
              <Lightbulb
                size={16}
                className="shrink-0 mt-0.5 text-secondary"
                aria-hidden="true"
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">Crop tip:</p>
                <p className="text-muted-foreground">{cropTip}</p>
              </div>
            </div>
          )}

          {/* Default if no specific tips */}
          {!alertMessage &&
            !cropTip &&
            !fertilizerTiming &&
            !sprayingAdvice &&
            !harvestGuidance && (
              <div className="flex gap-2.5">
                <Droplets
                  size={16}
                  className="shrink-0 mt-0.5 text-blue-400"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  Conditions are good. No urgent actions required.
                </p>
              </div>
            )}
        </div>

        {/* Reasoning */}
        {reasoning && (
          <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-2">
              <Info
                size={14}
                className="shrink-0 mt-0.5 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  Why this recommendation?
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {reasoning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          variant="outline"
          size="md"
          rightIcon={<ArrowUpRight size={16} />}
          onClick={handleChat}
          className="w-full"
          aria-label="Ask KisanGPT about today's weather"
        >
          Ask KisanGPT about this
        </Button>
      </div>
    </motion.section>
  );
};

FarmingRecommendationCard.displayName = "FarmingRecommendationCard";
