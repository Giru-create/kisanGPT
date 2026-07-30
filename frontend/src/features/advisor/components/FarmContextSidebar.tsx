"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FarmContextSidebar.tsx
// KisanGPT — Right sidebar with farm context and conversation history
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Sprout, MapPin, Star } from "lucide-react";
import {
  MOCK_FARM_CONTEXT,
  MOCK_CONVERSATION_HISTORY,
} from "../constants/advisor.constants";

export const FarmContextSidebar: React.FC = () => {
  return (
    <aside
      className="hidden xl:flex flex-col w-80 h-full border-l border-border bg-card/50 px-5 py-6 gap-6 shrink-0 overflow-y-auto"
      aria-label="Farm Context Sidebar"
    >
      {/* Farm Context Card */}
      <section>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Farm Context
        </h3>
        <div className="bg-muted/50 rounded-xl p-4 border border-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sprout size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {MOCK_FARM_CONTEXT.farmName}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin size={12} aria-hidden="true" />
                {MOCK_FARM_CONTEXT.location}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background px-2.5 py-1.5 rounded-lg">
              <p className="text-[10px] text-muted-foreground">Active Crop</p>
              <p className="text-sm font-medium">
                {MOCK_FARM_CONTEXT.activeCrop}
              </p>
            </div>
            <div className="bg-background px-2.5 py-1.5 rounded-lg">
              <p className="text-[10px] text-muted-foreground">Soil PH</p>
              <p className="text-sm font-medium">
                {MOCK_FARM_CONTEXT.soilPH} ({MOCK_FARM_CONTEXT.soilHealth})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conversation History */}
      <section>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Conversation History
        </h3>
        <div className="space-y-1">
          {MOCK_CONVERSATION_HISTORY.map((item) => (
            <div
              key={item.id}
              className="block w-full p-2.5 rounded-lg border-l-2 border-transparent"
            >
              <p className="text-sm font-medium truncate text-foreground">
                {item.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {item.timestamp}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pro Feature Upsell */}
      <section className="mt-auto">
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Star size={14} className="text-primary" />
            <p className="text-sm font-semibold text-primary">Pro Feature</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Enable real-time satellite field monitoring for accurate rust
            prediction.
          </p>
          <button
            type="button"
            disabled
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors opacity-70 cursor-not-allowed"
          >
            Upgrade Plan
          </button>
        </div>
      </section>
    </aside>
  );
};

FarmContextSidebar.displayName = "FarmContextSidebar";
