// ─────────────────────────────────────────────────────────────────────────────
// MemoryEmpty.tsx
// KisanGPT — Onboarding Empty State for Farm Memory
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { BookOpen, Plus, Sparkles } from "lucide-react";

interface MemoryEmptyProps {
  onAddClick: () => void;
}

export const MemoryEmpty: React.FC<MemoryEmptyProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto space-y-5 bg-card/40 rounded-3xl border border-border/40 my-6 shadow-xs">
      <div className="relative">
        <div className="w-18 h-18 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <BookOpen size={32} />
        </div>
        <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md">
          <Sparkles size={14} />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-foreground tracking-tight">
          आपकी कोई याद दर्ज नहीं है (No Farm Memories)
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          अपनी मिट्टी की जांच, फसल की पैदावार, बीमारी का इतिहास और उर्वरक का
          रिकॉर्ड यहां जोड़ें। किसानजीपीटी एआई आपको व्यक्तिगत सुझाव देगा।
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Plus size={16} />
        <span>पहला रिकॉर्ड जोड़ें (Add First Record)</span>
      </button>
    </div>
  );
};

MemoryEmpty.displayName = "MemoryEmpty";
