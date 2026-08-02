"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Sparkles,
  Globe,
  Radio,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  VOICE_LANGUAGES,
  MOCK_RECENT_CONVERSATIONS,
} from "../constants/voice.constants";
import type { VoiceLanguage, VoiceStatus } from "../types/voice.types";

interface HeroSectionProps {
  language: VoiceLanguage;
  voiceStatus: VoiceStatus;
  onStartConversation?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  voiceStatus,
  onStartConversation,
}) => {
  const lang = VOICE_LANGUAGES.find((l) => l.code === language);

  const statusConfig: Record<
    VoiceStatus,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    idle: {
      label: "Ready",
      color: "text-emerald-600",
      icon: <Radio size={10} />,
    },
    listening: {
      label: "Listening",
      color: "text-blue-600",
      icon: <Mic size={10} />,
    },
    processing: {
      label: "Thinking",
      color: "text-amber-600",
      icon: <Sparkles size={10} />,
    },
    speaking: {
      label: "Speaking",
      color: "text-violet-600",
      icon: <MessageCircle size={10} />,
    },
    error: { label: "Error", color: "text-red-600", icon: <Radio size={10} /> },
  };

  const cfg = statusConfig[voiceStatus];

  return (
    <motion.section
      role="region"
      aria-label="Voice Assistant"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mic size={16} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="ds-heading-sm text-foreground">Voice Assistant</h2>
            <p className="ds-caption text-muted-foreground">
              Speak naturally, get expert advice
            </p>
          </div>
        </div>
        <Badge
          variant={voiceStatus === "error" ? "error" : "success"}
          className="text-[10px]"
        >
          {cfg.icon}
          <span className="ml-1">{cfg.label}</span>
        </Badge>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
          <Globe size={14} className="text-primary mx-auto mb-1" />
          <p className="text-[11px] font-bold text-foreground">
            {lang?.nativeLabel ?? "Hindi"}
          </p>
          <p className="text-[9px] text-muted-foreground">Language</p>
        </div>
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-center">
          <Mic size={14} className="text-emerald-600 mx-auto mb-1" />
          <p className="text-[11px] font-bold text-foreground capitalize">
            {voiceStatus}
          </p>
          <p className="text-[9px] text-muted-foreground">Mic Status</p>
        </div>
        <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 p-3 text-center">
          <Radio size={14} className="text-violet-600 mx-auto mb-1" />
          <p className="text-[11px] font-bold text-foreground">Connected</p>
          <p className="text-[9px] text-muted-foreground">AI Status</p>
        </div>
      </div>

      {/* Recent conversations */}
      {MOCK_RECENT_CONVERSATIONS.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Recent Conversations
          </p>
          <div className="space-y-1.5">
            {MOCK_RECENT_CONVERSATIONS.slice(0, 2).map((conv) => (
              <div
                key={conv.id}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <MessageCircle
                  size={12}
                  className="text-muted-foreground shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-foreground truncate">
                    {conv.title}
                  </p>
                  <p className="text-[9px] text-muted-foreground truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                <ArrowRight
                  size={12}
                  className="text-muted-foreground shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={onStartConversation}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors min-h-[48px]"
      >
        <Mic size={16} />
        Start Conversation
      </button>
    </motion.section>
  );
};

HeroSection.displayName = "HeroSection";
