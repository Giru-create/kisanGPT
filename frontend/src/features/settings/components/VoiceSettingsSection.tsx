// ─────────────────────────────────────────────────────────────────────────────
// VoiceSettingsSection.tsx
// KisanGPT — Voice settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { ToggleSwitch } from "./ToggleSwitch";
import { RadioGroup } from "./RadioGroup";
import { SelectDropdown } from "./SelectDropdown";
import type { VoiceSettings, VoiceSpeed } from "../types/settings.types";
import {
  VOICE_LANGUAGE_OPTIONS,
  VOICE_OPTIONS,
  SPEECH_SPEED_OPTIONS,
} from "../constants/settings.constants";

interface VoiceSettingsSectionProps {
  settings: VoiceSettings;
  onUpdate: (updates: { voice: VoiceSettings }) => void;
}

export const VoiceSettingsSection: React.FC<VoiceSettingsSectionProps> = ({
  settings,
  onUpdate,
}) => {
  const handleLanguageChange = (preferredLanguage: string) => {
    onUpdate({ voice: { ...settings, preferredLanguage } });
  };

  const handleVoiceChange = (voiceId: string) => {
    onUpdate({ voice: { ...settings, voiceId } });
  };

  const handleSpeedChange = (speechSpeed: string) => {
    onUpdate({
      voice: { ...settings, speechSpeed: speechSpeed as VoiceSpeed },
    });
  };

  const handleWakeWordChange = (wakeWord: string) => {
    onUpdate({ voice: { ...settings, wakeWord } });
  };

  const handleToggleAutoSpeak = (autoSpeak: boolean) => {
    onUpdate({ voice: { ...settings, autoSpeak } });
  };

  const handleToggleNoiseReduction = (noiseReduction: boolean) => {
    onUpdate({ voice: { ...settings, noiseReduction } });
  };

  const handleToggleMicrophone = (microphoneEnabled: boolean) => {
    onUpdate({ voice: { ...settings, microphoneEnabled } });
  };

  const handleToggleSpeaker = (speakerEnabled: boolean) => {
    onUpdate({ voice: { ...settings, speakerEnabled } });
  };

  return (
    <div className="space-y-4">
      <SettingsSection
        title="Voice Language"
        description="Choose your preferred language for voice interactions"
      >
        <SettingsCard
          label="Preferred Language"
          description="Language for voice input and output"
        >
          <SelectDropdown
            value={settings.preferredLanguage}
            options={VOICE_LANGUAGE_OPTIONS}
            onChange={handleLanguageChange}
          />
        </SettingsCard>

        <SettingsCard
          label="Wake Word"
          description="Phrase to activate voice assistant"
        >
          <input
            type="text"
            value={settings.wakeWord}
            onChange={(e) => handleWakeWordChange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm w-36 focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Wake word"
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Voice Selection"
        description="Pick your AI voice assistant"
        delay={0.05}
      >
        <SettingsCard
          label="Voice"
          description="Choose the voice for AI responses"
        >
          <RadioGroup
            name="voiceId"
            value={settings.voiceId}
            options={VOICE_OPTIONS.map((v) => ({
              id: v.id,
              label: v.label,
              description: v.description,
            }))}
            onChange={handleVoiceChange}
          />
        </SettingsCard>

        <SettingsCard label="Speech Speed" description="How fast the AI speaks">
          <RadioGroup
            name="speechSpeed"
            value={settings.speechSpeed}
            options={SPEECH_SPEED_OPTIONS}
            onChange={handleSpeedChange}
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Audio Controls"
        description="Fine-tune audio input and output"
        delay={0.1}
      >
        <SettingsCard
          label="Auto Speak"
          description="Automatically read AI responses aloud"
        >
          <ToggleSwitch
            checked={settings.autoSpeak}
            onChange={handleToggleAutoSpeak}
            label="Auto speak"
          />
        </SettingsCard>

        <SettingsCard
          label="Noise Reduction"
          description="Reduce background noise during voice input"
        >
          <ToggleSwitch
            checked={settings.noiseReduction}
            onChange={handleToggleNoiseReduction}
            label="Noise reduction"
          />
        </SettingsCard>

        <SettingsCard
          label="Microphone"
          description="Enable microphone for voice input"
        >
          <ToggleSwitch
            checked={settings.microphoneEnabled}
            onChange={handleToggleMicrophone}
            label="Microphone"
          />
        </SettingsCard>

        <SettingsCard
          label="Speaker"
          description="Enable speaker for voice output"
        >
          <ToggleSwitch
            checked={settings.speakerEnabled}
            onChange={handleToggleSpeaker}
            label="Speaker"
          />
        </SettingsCard>
      </SettingsSection>
    </div>
  );
};

VoiceSettingsSection.displayName = "VoiceSettingsSection";
