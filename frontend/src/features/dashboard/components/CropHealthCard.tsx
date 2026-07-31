"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Leaf } from "lucide-react";
import type { CropHealthItem } from "../types/dashboard.types";

interface CropHealthCardProps {
  items: CropHealthItem[];
}

export const CropHealthCard: React.FC<CropHealthCardProps> = ({ items }) => {
  return (
    <section role="region" aria-label="Crop Health Monitoring">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const isAlert = item.status === "alert";

          return (
            <div
              key={item.id}
              className={`group relative rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md ${
                isAlert
                  ? "border-red-500/25 hover:border-red-500/40"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {isAlert && (
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-2xl"
                />
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isAlert
                        ? "bg-red-500/10"
                        : "bg-emerald-500/10"
                    }`}
                  >
                    {isAlert ? (
                      <AlertTriangle
                        size={20}
                        className="text-red-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <Leaf
                        size={20}
                        className="text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {item.cropName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.blockName} · {item.daysSinceSown}d old
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isAlert
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {isAlert ? "Alert" : "Healthy"}
                </span>
              </div>

              {isAlert && item.alertMessage && (
                <div className="bg-red-500/8 border border-red-500/15 p-3 rounded-xl mb-4">
                  <p className="text-xs font-medium text-red-700 dark:text-red-300 leading-relaxed">
                    {item.alertMessage}
                  </p>
                </div>
              )}

              {!isAlert && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Soil Moisture</span>
                    <span className="font-semibold text-foreground">
                      {item.moisturePercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all"
                      style={{ width: `${item.moisturePercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border/60 flex justify-between items-center">
                {isAlert && item.recommendation ? (
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {item.recommendation}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    AI-monitored
                  </span>
                )}

                {isAlert ? (
                  <button
                    type="button"
                    className="shrink-0 bg-red-500 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    View Protocol
                  </button>
                ) : (
                  <Link
                    href="/disease"
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Details
                    <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

CropHealthCard.displayName = "CropHealthCard";
