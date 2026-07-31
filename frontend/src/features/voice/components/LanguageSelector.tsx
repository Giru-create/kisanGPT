"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { VOICE_LANGUAGES } from "../constants/voice.constants";
import type { VoiceLanguage } from "../types/voice.types";

interface LanguageSelectorProps {
  selected: VoiceLanguage;
  onSelect: (lang: VoiceLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentLang = VOICE_LANGUAGES.find((l) => l.code === selected);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Globe size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          Select Language
        </h2>
      </div>

      {/* Current language display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 mb-4 hover:bg-primary/10 transition-colors"
        aria-expanded={isOpen}
        aria-label="Change language"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLang?.flag}</span>
          <div className="text-left">
            <p className="text-xs font-bold text-foreground">
              {currentLang?.label}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {currentLang?.nativeLabel}
            </p>
          </div>
        </div>
        <Globe
          size={14}
          className={cn(
            "text-muted-foreground transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Language grid */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-3 gap-2"
        >
          {VOICE_LANGUAGES.map((lang) => {
            const isSelected = lang.code === selected;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelect(lang.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30 text-foreground",
                )}
                aria-label={`Select ${lang.label}`}
                aria-pressed={isSelected}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-[10px] font-bold">{lang.label}</span>
                <span className="text-[9px] text-muted-foreground">
                  {lang.nativeLabel}
                </span>
                {isSelected && (
                  <Check size={10} className="text-primary mt-0.5" />
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

LanguageSelector.displayName = "LanguageSelector";
