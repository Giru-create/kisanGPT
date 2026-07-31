// ─────────────────────────────────────────────────────────────────────────────
// AISettingsSection.tsx
// KisanGPT — AI settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { ToggleSwitch } from "./ToggleSwitch";
import { RadioGroup } from "./RadioGroup";
import { SelectDropdown } from "./SelectDropdown";
import type {
  AISettings,
  ResponseLength,
  LanguageStyle,
  ConfidenceThreshold,
} from "../types/settings.types";
import {
  PERSONALITY_OPTIONS,
  RESPONSE_LENGTH_OPTIONS,
  LANGUAGE_STYLE_OPTIONS,
  CONFIDENCE_OPTIONS,
} from "../constants/settings.constants";

interface AISettingsSectionProps {
  settings: AISettings;
  onUpdate: (updates: { ai: AISettings }) => void;
}

export const AISettingsSection: React.FC<AISettingsSectionProps> = ({
  settings,
  onUpdate,
}) => {
  const handlePersonalityChange = (personality: string) => {
    onUpdate({ ai: { ...settings, personality } });
  };

  const handleResponseLengthChange = (responseLength: string) => {
    onUpdate({
      ai: { ...settings, responseLength: responseLength as ResponseLength },
    });
  };

  const handleLanguageStyleChange = (languageStyle: string) => {
    onUpdate({
      ai: { ...settings, languageStyle: languageStyle as LanguageStyle },
    });
  };

  const handleConfidenceChange = (confidenceThreshold: string) => {
    onUpdate({
      ai: {
        ...settings,
        confidenceThreshold: confidenceThreshold as ConfidenceThreshold,
      },
    });
  };

  const handleToggleAutoRecommendations = (autoRecommendations: boolean) => {
    onUpdate({ ai: { ...settings, autoRecommendations } });
  };

  const handleToggleMemory = (memoryEnabled: boolean) => {
    onUpdate({ ai: { ...settings, memoryEnabled } });
  };

  const handleToggleFollowUp = (followUpSuggestions: boolean) => {
    onUpdate({ ai: { ...settings, followUpSuggestions } });
  };

  const handleContextWindowChange = (value: string) => {
    const contextWindow = parseInt(value, 10);
    if (!isNaN(contextWindow) && contextWindow > 0) {
      onUpdate({ ai: { ...settings, contextWindow } });
    }
  };

  return (
    <div className="space-y-4">
      <SettingsSection
        title="AI Personality"
        description="Choose how your AI assistant communicates"
      >
        <SettingsCard
          label="Personality Style"
          description="How your AI assistant talks to you"
        >
          <SelectDropdown
            value={settings.personality}
            options={PERSONALITY_OPTIONS.map((p) => ({
              id: p.id,
              label: p.label,
            }))}
            onChange={handlePersonalityChange}
          />
        </SettingsCard>

        <SettingsCard
          label="Response Length"
          description="How detailed the AI responses are"
        >
          <RadioGroup
            name="responseLength"
            value={settings.responseLength}
            options={RESPONSE_LENGTH_OPTIONS}
            onChange={handleResponseLengthChange}
          />
        </SettingsCard>

        <SettingsCard
          label="Language Style"
          description="The tone of AI responses"
        >
          <RadioGroup
            name="languageStyle"
            value={settings.languageStyle}
            options={LANGUAGE_STYLE_OPTIONS}
            onChange={handleLanguageStyleChange}
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Recommendations"
        description="Control AI-powered suggestions"
        delay={0.05}
      >
        <SettingsCard
          label="Auto Recommendations"
          description="Get proactive suggestions based on your farm data"
        >
          <ToggleSwitch
            checked={settings.autoRecommendations}
            onChange={handleToggleAutoRecommendations}
            label="Auto recommendations"
          />
        </SettingsCard>

        <SettingsCard
          label="Follow-up Suggestions"
          description="Show suggested follow-up questions after AI responses"
        >
          <ToggleSwitch
            checked={settings.followUpSuggestions}
            onChange={handleToggleFollowUp}
            label="Follow-up suggestions"
          />
        </SettingsCard>

        <SettingsCard
          label="Confidence Threshold"
          description="Minimum confidence level for AI recommendations"
        >
          <RadioGroup
            name="confidenceThreshold"
            value={settings.confidenceThreshold}
            options={CONFIDENCE_OPTIONS}
            onChange={handleConfidenceChange}
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Memory & Context"
        description="Control how AI remembers your preferences"
        delay={0.1}
      >
        <SettingsCard
          label="AI Memory"
          description="Allow AI to remember your preferences and past interactions"
        >
          <ToggleSwitch
            checked={settings.memoryEnabled}
            onChange={handleToggleMemory}
            label="AI memory"
          />
        </SettingsCard>

        <SettingsCard
          label="Context Window"
          description="Number of past conversations AI considers (1-20)"
        >
          <SelectDropdown
            value={String(settings.contextWindow)}
            options={Array.from({ length: 20 }, (_, i) => ({
              id: String(i + 1),
              label: String(i + 1),
            }))}
            onChange={handleContextWindowChange}
          />
        </SettingsCard>
      </SettingsSection>
    </div>
  );
};

AISettingsSection.displayName = "AISettingsSection";
