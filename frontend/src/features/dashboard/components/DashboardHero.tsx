"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  TrendingUp,
  Zap,
  CheckCircle2,
} from "lucide-react";

export const DashboardHero: React.FC = () => {
  return (
    <motion.section
      role="region"
      aria-label="AI Daily Briefing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[360px] flex flex-col"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_rgba(59,130,246,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,_rgba(16,185,129,0.1)_0%,_transparent_50%)]" />

      {/* Animated glow */}
      <motion.div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 lg:p-10">
        {/* Top: Badge + Source */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={20} className="text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-white/90 text-sm font-semibold">AI Daily Briefing</h2>
              <p className="text-white/40 text-xs mt-0.5">Based on your farm data + real-time conditions</p>
            </div>
          </div>
          <span className="text-white/30 text-xs font-medium hidden sm:block">
            Updated 2 min ago
          </span>
        </div>

        {/* Center: Main recommendation */}
        <div className="flex-1 flex flex-col justify-center py-6 sm:py-8">
          <p className="text-white/95 text-xl sm:text-2xl lg:text-3xl font-bold leading-snug max-w-3xl tracking-tight">
            Ideal window for wheat sowing opens{" "}
            <span className="text-emerald-400">tomorrow</span>. Rain expected
            Saturday will provide optimal soil moisture.
          </p>
          <p className="text-white/50 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Postpone urea application until Monday to prevent leaching. Block A
            shows highest yield potential this season.
          </p>
        </div>

        {/* Bottom: Key metrics + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                <ShieldAlert size={16} className="text-red-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider">Biggest Risk</p>
                <p className="text-white/90 text-sm font-semibold">Frost warning Sat night</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider">Best Opportunity</p>
                <p className="text-white/90 text-sm font-semibold">Wheat price up 4.2% today</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Zap size={16} className="text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider">AI Confidence</p>
                <p className="text-white/90 text-sm font-semibold">94% accuracy</p>
              </div>
            </div>
          </div>

          <Link
            href="/advisor"
            className="group inline-flex items-center gap-2.5 bg-white text-[#0f172a] px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/15 transition-all active:scale-[0.98] shrink-0"
          >
            <CheckCircle2 size={16} aria-hidden="true" />
            Ask KisanGPT AI
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

DashboardHero.displayName = "DashboardHero";
