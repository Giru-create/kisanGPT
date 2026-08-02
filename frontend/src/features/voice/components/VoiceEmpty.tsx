"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { EXAMPLE_PROMPTS } from "../constants/voice.constants";
import type { VoiceLanguage } from "../types/voice.types";

interface VoiceEmptyProps {
  language: VoiceLanguage;
  onSelectPrompt?: (prompt: string) => void;
}

export const VoiceEmpty: React.FC<VoiceEmptyProps> = ({
  language,
  onSelectPrompt,
}) => {
  const prompts = EXAMPLE_PROMPTS[language] || EXAMPLE_PROMPTS["hi-IN"];

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-8 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="flex items-center justify-center mb-4"
      >
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mic size={28} className="text-primary" />
        </div>
      </motion.div>

      {/* Title */}
      <h3 className="ds-heading-sm text-foreground mb-2">Start Speaking</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed mb-5">
        Ask anything about farming. Our AI understands multiple Indian languages
        and provides expert advice.
      </p>

      {/* Example prompts */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Try saying
        </p>
        {prompts.map((prompt) => (
          <button
            key={prompt.title}
            onClick={() => onSelectPrompt?.(prompt.prompt)}
            className="w-full text-left p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <p className="text-[10px] font-bold text-foreground mb-0.5">
              {prompt.title}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              &ldquo;{prompt.prompt}&rdquo;
            </p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

VoiceEmpty.displayName = "VoiceEmpty";
