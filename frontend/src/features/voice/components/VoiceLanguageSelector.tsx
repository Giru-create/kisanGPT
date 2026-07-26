// ─────────────────────────────────────────────────────────────────────────────
// VoiceLanguageSelector.tsx
// KisanGPT — Language selector for voice interaction
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Volume2 } from "lucide-react";
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
      aria-label="Select voice language"
      className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl"
    >
      <Volume2
        size={14}
        className="text-muted-foreground ml-2 hidden sm:inline"
        aria-hidden="true"
      />
      {VOICE_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          role="radio"
          aria-checked={selected === lang.code}
          aria-label={`${lang.label} (${lang.nativeLabel})`}
          onClick={() => onSelect(lang.code)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
            selected === lang.code
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

VoiceLanguageSelector.displayName = "VoiceLanguageSelector";
