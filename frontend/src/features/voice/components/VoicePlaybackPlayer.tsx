// ─────────────────────────────────────────────────────────────────────────────
// VoicePlaybackPlayer.tsx
// KisanGPT — Audio Response Playback Controls Player Widget
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface VoicePlaybackPlayerProps {
  onPlayToggle?: () => void;
  isPlaying?: boolean;
}

export const VoicePlaybackPlayer: React.FC<VoicePlaybackPlayerProps> = ({
  onPlayToggle,
  isPlaying = false,
}) => {
  const [speed, setSpeed] = useState<number>(1.0);
  const speeds = [1.0, 1.25, 1.5];

  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx] || 1.0);
  };

  return (
    <div
      aria-label="Voice response player"
      className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/50 border border-border/40 mt-3"
    >
      <button
        type="button"
        onClick={onPlayToggle}
        aria-label={isPlaying ? "Pause audio response" : "Play audio response"}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-sm hover:scale-105 transition-transform min-w-[44px] focus-visible:outline-none focus:ring-2 focus:ring-primary"
      >
        {isPlaying ? (
          <Pause size={18} />
        ) : (
          <Play size={18} className="ml-0.5" />
        )}
      </button>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1">
            <Volume2 size={12} /> Voice Response
          </span>
          <span>{isPlaying ? "Playing" : "Voice Response"}</span>
        </div>
        <div className="h-1.5 w-full bg-border/60 rounded-full overflow-hidden">
          <div
            className={`h-full bg-primary rounded-full transition-all duration-300 ${
              isPlaying ? "w-2/3" : "w-0"
            }`}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={cycleSpeed}
        aria-label={`Playback speed: ${speed}x. Click to change.`}
        className="px-2 py-1 text-[11px] font-bold rounded-lg bg-background text-foreground border border-border/50 hover:bg-muted transition-colors min-h-[44px]"
      >
        {speed}x
      </button>
    </div>
  );
};

VoicePlaybackPlayer.displayName = "VoicePlaybackPlayer";
