"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, MapPin, Calendar, Sprout, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RelatedInfo } from "../types/disease.types";

interface RelatedInfoCardProps {
  info: RelatedInfo;
}

export const RelatedInfoCard: React.FC<RelatedInfoCardProps> = ({ info }) => {
  const items = [
    {
      icon: <Cloud size={14} className="text-sky-500" />,
      label: "Weather Influence",
      content: info.weatherInfluence,
      color: "border-sky-200 bg-sky-50/50",
    },
    {
      icon: <MapPin size={14} className="text-red-500" />,
      label: "Nearby Outbreaks",
      content: info.nearbyOutbreakAlerts,
      color: "border-red-200 bg-red-50/50",
    },
    {
      icon: <Calendar size={14} className="text-amber-500" />,
      label: "Seasonal Risk",
      content: info.seasonalRisk,
      color: "border-amber-200 bg-amber-50/50",
    },
    {
      icon: <Sprout size={14} className="text-emerald-500" />,
      label: "Crop Stage Impact",
      content: info.cropStageImpact,
      color: "border-emerald-200 bg-emerald-50/50",
    },
  ];

  return (
    <motion.section
      role="region"
      aria-label="Related information"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          Related Information
        </h2>
      </div>

      {/* Info cards */}
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className={cn("rounded-xl border p-3", item.color)}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {item.icon}
              <span className="text-xs font-semibold text-foreground">
                {item.label}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {item.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Similar diseases */}
      {info.similarDiseases.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-[10px] font-semibold text-muted-foreground mb-2">
            Similar diseases to watch for
          </p>
          <div className="flex flex-wrap gap-1">
            {info.similarDiseases.map((d) => (
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
    </motion.section>
  );
};

RelatedInfoCard.displayName = "RelatedInfoCard";
