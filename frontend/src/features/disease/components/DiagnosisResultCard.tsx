"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Info, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  SEVERITY_CONFIG,
  CATEGORY_CONFIG,
  PLANT_PART_CONFIG,
  SPREAD_RISK_CONFIG,
} from "../constants/disease.constants";
import type { DiagnosisResult } from "../types/disease.types";

interface DiagnosisResultCardProps {
  result: DiagnosisResult;
}

const confidencePercent = (c: number) => `${Math.round(c * 100)}%`;

const confidenceColor = (c: number) =>
  c >= 0.8 ? "text-emerald-600" : c >= 0.5 ? "text-amber-600" : "text-red-500";

export const DiagnosisResultCard: React.FC<DiagnosisResultCardProps> = ({
  result,
}) => {
  const severityCfg = SEVERITY_CONFIG[result.severity];
  const categoryCfg = result.disease_category
    ? CATEGORY_CONFIG[result.disease_category]
    : undefined;
  const partCfg = result.affected_part
    ? PLANT_PART_CONFIG[result.affected_part]
    : undefined;
  const spreadCfg = result.spread_risk
    ? SPREAD_RISK_CONFIG[result.spread_risk]
    : undefined;

  return (
    <motion.section
      role="region"
      aria-label="Diagnosis result"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {/* Accent bar */}
      <div
        className={cn(
          "h-1.5",
          result.is_healthy
            ? "bg-emerald-500"
            : result.severity === "critical" || result.severity === "high"
              ? "bg-red-500"
              : result.severity === "medium"
                ? "bg-amber-500"
                : "bg-emerald-400",
        )}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {result.is_healthy ? (
                <ShieldCheck size={18} className="text-emerald-500" />
              ) : (
                <ShieldAlert size={18} className="text-amber-500" />
              )}
              <h2 className="text-base font-bold text-foreground">
                {result.is_healthy ? "Healthy Plant" : result.disease_name}
              </h2>
            </div>
            {result.scientific_name && (
              <p className="text-xs text-muted-foreground italic ml-7">
                {result.scientific_name}
              </p>
            )}
            <p className="text-xs text-muted-foreground ml-7">
              Detected on {result.crop}
            </p>
          </div>
          <Badge
            className={cn("text-[10px]", severityCfg.color, severityCfg.bg)}
          >
            {severityCfg.icon} {severityCfg.label}
          </Badge>
        </div>

        {/* Confidence meter */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              AI Confidence
            </span>
            <span
              className={cn(
                "text-sm font-bold",
                confidenceColor(result.confidence),
              )}
            >
              {confidencePercent(result.confidence)}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                result.confidence >= 0.8
                  ? "bg-emerald-500"
                  : result.confidence >= 0.5
                    ? "bg-amber-500"
                    : "bg-red-500",
              )}
            />
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryCfg && (
            <Badge
              className={cn("text-[10px]", categoryCfg.color, categoryCfg.bg)}
            >
              {categoryCfg.icon} {categoryCfg.label}
            </Badge>
          )}
          {partCfg && (
            <Badge variant="info" className="text-[10px]">
              {partCfg.icon} {partCfg.label}
            </Badge>
          )}
          {spreadCfg && (
            <Badge className={cn("text-[10px]", spreadCfg.color, spreadCfg.bg)}>
              <Activity size={10} className="mr-1" />
              {spreadCfg.label}
            </Badge>
          )}
        </div>

        {/* AI Summary */}
        {result.ai_summary && (
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 mb-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Info size={12} className="text-primary" />
              <span className="text-xs font-semibold text-foreground">
                AI Summary
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {result.ai_summary}
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {result.description}
        </p>

        {/* Similar diseases */}
        {result.similar_diseases.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">
              Similar conditions
            </p>
            <div className="flex flex-wrap gap-1">
              {result.similar_diseases.map((d) => (
                <span
                  key={d}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[9px] text-muted-foreground mt-4 pt-3 border-t border-border">
          AI-generated diagnosis. For critical issues, consult a local
          agricultural expert.
        </p>
      </div>
    </motion.section>
  );
};

DiagnosisResultCard.displayName = "DiagnosisResultCard";
