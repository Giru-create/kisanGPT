// ─────────────────────────────────────────────────────────────────────────────
// PersonalizedRecommendations.tsx
// KisanGPT — Personalized AI Recommendations Component based on Farm Memory RAG
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Sparkles, ArrowRight, Lightbulb, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { PersonalizedRecommendation } from "../types/memory.types";

interface PersonalizedRecommendationsProps {
  recommendations: PersonalizedRecommendation[];
}

export const PersonalizedRecommendations: React.FC<
  PersonalizedRecommendationsProps
> = ({ recommendations }) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Sparkles size={18} />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Personalized AI Advice (व्यक्तिगत सलाह)
          </h2>
          <p className="text-xs text-muted-foreground">
            Generated from your farm memory history and ChromaDB context
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-4 rounded-2xl border transition-all shadow-xs flex flex-col justify-between space-y-3 ${
              rec.impact === "high"
                ? "bg-amber-500/5 border-amber-500/30"
                : "bg-card border-border/60"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary">
                  {rec.category}
                </span>
                {rec.impact === "high" && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <ShieldAlert size={12} /> High Priority
                  </span>
                )}
              </div>

              <h3 className="text-xs font-bold text-foreground leading-snug flex items-start gap-1.5">
                <Lightbulb
                  size={15}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <span>{rec.title}</span>
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {rec.description}
              </p>
            </div>

            <div className="pt-2 border-t border-border/30 flex items-center justify-between">
              <span className="text-[10px] font-medium text-muted-foreground">
                Based on {rec.basedOnMemories.length} historical logs
              </span>

              {rec.targetRoute ? (
                <Link
                  href={rec.targetRoute}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>{rec.actionLabel}</span>
                  <ArrowRight size={13} />
                </Link>
              ) : (
                <span className="text-xs font-bold text-primary">
                  {rec.actionLabel}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

PersonalizedRecommendations.displayName = "PersonalizedRecommendations";
