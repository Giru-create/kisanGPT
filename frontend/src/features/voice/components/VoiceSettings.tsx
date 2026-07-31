"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings, Gauge, Volume2, Mic, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_VOICE_SETTINGS } from "../constants/voice.constants";
import type { VoiceSettingsData } from "../types/voice.types";

interface VoiceSettingsProps {
  onToggleSetting?: (key: keyof VoiceSettingsData) => void;
  onChangeSpeed?: (speed: number) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  onToggleSetting,
  onChangeSpeed,
}) => {
  const [settings, setSettings] = React.useState<VoiceSettingsData>(
    DEFAULT_VOICE_SETTINGS,
  );

  const handleToggle = (key: keyof VoiceSettingsData) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    onToggleSetting?.(key);
  };

  const handleSpeedChange = (speed: number) => {
    setSettings((prev) => ({ ...prev, voiceSpeed: speed }));
    onChangeSpeed?.(speed);
  };

  return (
    <motion.section
      role="region"
      aria-label="Voice Settings"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Settings size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          Voice Settings
        </h2>
      </div>

      {/* Settings list */}
      <div className="space-y-3">
        {/* Voice Speed */}
        <div className="rounded-xl border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gauge size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                Voice Speed
              </span>
            </div>
            <span className="text-xs font-bold text-primary">
              {settings.voiceSpeed}x
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-colors",
                  settings.voiceSpeed === speed
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Toggle settings */}
        {[
          {
            key: "autoSpeak" as const,
            label: "Auto Speak",
            icon: <Volume2 size={14} />,
            desc: "AI speaks responses automatically",
          },
          {
            key: "noiseReduction" as const,
            label: "Noise Reduction",
            icon: <Mic size={14} />,
            desc: "Filter background noise during recording",
          },
          {
            key: "wakeWord" as const,
            label: "Wake Word",
            icon: <Mic size={14} />,
            desc: 'Say "Hey KisanGPT" to activate',
          },
          {
            key: "offlineMode" as const,
            label: "Offline Mode",
            icon: <WifiOff size={14} />,
            desc: "Basic commands work without internet",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-3 rounded-xl border border-border"
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{item.icon}</span>
              <div>
                <p className="text-xs font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-[9px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={cn(
                "relative w-10 h-6 rounded-full transition-colors",
                settings[item.key] ? "bg-primary" : "bg-border",
              )}
              role="switch"
              aria-checked={settings[item.key]}
              aria-label={item.label}
            >
              <span
                className={cn(
                  "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                  settings[item.key] ? "left-5" : "left-1",
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

VoiceSettings.displayName = "VoiceSettings";
