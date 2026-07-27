// ─────────────────────────────────────────────────────────────────────────────
// VoiceLanguageSelector.tsx
// KisanGPT — Multilingual Voice Language Selector
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Globe } from "lucide-react";
import { VOICE_LANGUAGES } from "../constants/voice.constants";
import type { VoiceLanguage } from "../types/voice.types";

interface VoiceLanguageSelectorProps {
  selected: VoiceLanguage;
  onSelect: (language: VoiceLanguage) => void;
}

export const VoiceLanguageSelector: React.FC<VoiceLanguageSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="Select voice assistant language"
      className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border/40"
    >
      <div className="flex items-center pl-2 pr-1 text-muted-foreground hidden sm:flex" aria-hidden="true">
        <Globe size={16} />
      </div>
      {VOICE_LANGUAGES.map((lang) => {
        const isSelected = selected === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Select ${lang.label} (${lang.nativeLabel})`}
            onClick={() => onSelect(lang.code)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-200 min-h-[44px] min-w-[64px] flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm font-bold scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <span>{lang.nativeLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

VoiceLanguageSelector.displayName = "VoiceLanguageSelector";
