"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const AIStrategicAdvisoryCard: React.FC = () => {
  return (
    <section
      role="region"
      aria-label="AI Strategic Advisory"
      className="relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />

      <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 text-primary-foreground">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={18} className="text-emerald-300" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">AI Advisory</h3>
              <Badge variant="success" className="text-[10px] font-bold bg-white/15 text-emerald-200 border-white/20">
                Live
              </Badge>
            </div>
          </div>

          <p className="text-base sm:text-lg leading-relaxed max-w-2xl opacity-95 font-medium">
            &quot;Ideal window for wheat sowing in{" "}
            <span className="font-bold underline decoration-2 underline-offset-4 decoration-emerald-400/80">
              Block A
            </span>{" "}
            opens tomorrow. Upcoming rain on Saturday (approx 12mm) will provide
            optimal soil moisture. Postpone urea application until Monday to
            prevent leaching.&quot;
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-8">
          <Link
            href="/advisor"
            className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Generate Sowing Plan
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm"
            disabled
            title="Scheduling coming soon"
          >
            <Clock size={14} aria-hidden="true" />
            Schedule
          </button>
          <div className="hidden sm:flex items-center gap-1.5 ml-auto text-xs text-white/60">
            <Check size={14} aria-hidden="true" />
            <span>Based on real-time weather + soil data</span>
          </div>
        </div>
      </div>
    </section>
  );
};

AIStrategicAdvisoryCard.displayName = "AIStrategicAdvisoryCard";
