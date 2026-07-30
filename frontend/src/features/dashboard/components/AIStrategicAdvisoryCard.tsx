"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export const AIStrategicAdvisoryCard: React.FC = () => {
  return (
    <section
      role="region"
      aria-label="AI Strategic Advisory"
      className="bg-primary text-primary-foreground rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <Sparkles size={20} className="text-emerald-300" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold">AI Strategic Advisory</h3>
        </div>
        <p className="text-base leading-relaxed max-w-2xl opacity-95">
          &quot;Ideal window for wheat sowing in{" "}
          <span className="font-bold underline decoration-2 underline-offset-4 decoration-emerald-400">
            Block A
          </span>{" "}
          opens tomorrow. Upcoming rain on Saturday (approx 12mm) will provide
          optimal soil moisture. Postpone urea application until Monday to
          prevent leaching.&quot;
        </p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Generate Sowing Plan
        </button>
        <button
          type="button"
          className="bg-white text-primary px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg transition-transform active:scale-95"
        >
          Accept &amp; Schedule
        </button>
      </div>

      <div
        aria-hidden="true"
        className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full"
      />
      <div
        aria-hidden="true"
        className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full"
      />
    </section>
  );
};

AIStrategicAdvisoryCard.displayName = "AIStrategicAdvisoryCard";
