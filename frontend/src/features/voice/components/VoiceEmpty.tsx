// ─────────────────────────────────────────────────────────────────────────────
// VoiceEmpty.tsx
// KisanGPT — Onboarding Empty State & Example Prompts
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Mic, Sparkles, MessageSquarePlus } from "lucide-react";
import { EXAMPLE_PROMPTS } from "../constants/voice.constants";
import type { VoiceLanguage } from "../types/voice.types";

interface VoiceEmptyProps {
  language: VoiceLanguage;
  onSelectPrompt: (promptText: string) => void;
}

export const VoiceEmpty: React.FC<VoiceEmptyProps> = ({
  language,
  onSelectPrompt,
}) => {
  const prompts = EXAMPLE_PROMPTS[language] || EXAMPLE_PROMPTS["hi-IN"];

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-lg mx-auto space-y-6">
      {/* Icon Badge */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <Mic size={36} />
        </div>
        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
          <Sparkles size={16} />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {language === "hi-IN"
            ? "अपनी भाषा में बोलकर पूछें"
            : language === "pa-IN"
              ? "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਕੇ ਪੁੱਛੋ"
              : "Speak in Your Language"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "hi-IN"
            ? "मंडी भाव, फसल सुरक्षा, मौसम पूर्वानुमान या सरकारी योजनाओं के बारे में तुरंत जानकारी पाएं।"
            : language === "pa-IN"
              ? "ਮੰਡੀ ਭਾਅ, ਫ਼ਸਲ ਦੀ ਦੇਖਭਾਲ ਅਤੇ ਮੌਸਮ ਬਾਰੇ ਤੁਰੰਤ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ।"
              : "Ask about mandi prices, crop disease diagnosis, weather forecasts, or farming guidance."}
        </p>
      </div>

      {/* Suggested Prompts Cards */}
      <div className="w-full space-y-3 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider justify-center">
          <MessageSquarePlus size={14} />
          <span>
            {language === "hi-IN"
              ? "इन उदाहरणों को आज़माएं"
              : language === "pa-IN"
                ? "ਇਹ ਉਦਾਹਰਣਾਂ ਅਜ਼ਮਾਓ"
                : "Try Asking These"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {prompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="group flex items-start gap-3 p-3.5 rounded-2xl bg-card hover:bg-muted/50 border border-border/60 hover:border-primary/40 text-left transition-all shadow-xs min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
                {item.title}
              </span>
              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors flex-1 leading-snug">
                &quot;{item.prompt}&quot;
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

VoiceEmpty.displayName = "VoiceEmpty";
