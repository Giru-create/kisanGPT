"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import type { CropHealthItem } from "../types/dashboard.types";

interface CropHealthCardProps {
  items: CropHealthItem[];
}

export const CropHealthCard: React.FC<CropHealthCardProps> = ({ items }) => {
  return (
    <section
      role="region"
      aria-label="Crop Health Monitoring"
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base text-foreground">
          Crop Health Monitoring
        </h2>
        <button
          type="button"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All Fields
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const isAlert = item.status === "alert";

          return (
            <div
              key={item.id}
              className={`bg-card border rounded-xl p-4 shadow-sm group hover:border-primary transition-all relative overflow-hidden ${
                isAlert ? "border-red-500/30" : "border-border"
              }`}
            >
              {isAlert && (
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 w-1 h-full bg-red-500"
                />
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border border-border overflow-hidden">
                    <span className="text-lg font-bold text-muted-foreground">
                      {item.cropName[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      {item.cropName} - {item.blockName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Sown: {item.daysSinceSown} Days ago
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isAlert
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {isAlert && <AlertTriangle size={12} aria-hidden="true" />}
                  {isAlert ? "Alert" : "Healthy"}
                </span>
              </div>

              {isAlert && item.alertMessage && (
                <div className="bg-red-500/10 p-2.5 rounded-lg mb-3">
                  <p className="text-xs font-bold text-red-700 dark:text-red-300">
                    {item.alertMessage}
                  </p>
                </div>
              )}

              {!isAlert && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Moisture Index
                    </span>
                    <span className="font-bold">{item.moisturePercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.moisturePercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                {isAlert && item.recommendation ? (
                  <span className="text-xs text-muted-foreground italic">
                    {item.recommendation}
                  </span>
                ) : (
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-card flex items-center justify-center text-[8px] text-white font-bold">
                      AI
                    </div>
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                      <span className="text-[8px] text-muted-foreground">
                        \u2699
                      </span>
                    </div>
                  </div>
                )}

                {isAlert && (
                  <button
                    type="button"
                    className="bg-red-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full"
                  >
                    Protocol
                  </button>
                )}

                {!isAlert && (
                  <button
                    type="button"
                    className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Details \u2192
                  </button>
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
