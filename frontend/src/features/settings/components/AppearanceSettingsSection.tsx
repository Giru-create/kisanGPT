// ─────────────────────────────────────────────────────────────────────────────
// AppearanceSettingsSection.tsx
// KisanGPT — Appearance settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/store/themeStore";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { ToggleSwitch } from "./ToggleSwitch";
import { RadioGroup } from "./RadioGroup";
import type {
  AppearanceSettings,
  ThemeMode,
  FontSize,
  Contrast,
} from "../types/settings.types";
import {
  FONT_SIZE_OPTIONS,
  CONTRAST_OPTIONS,
} from "../constants/settings.constants";

const THEME_ICONS: Record<string, React.FC<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

interface AppearanceSettingsSectionProps {
  settings: AppearanceSettings;
  onUpdate: (updates: { appearance: AppearanceSettings }) => void;
}

export const AppearanceSettingsSection: React.FC<
  AppearanceSettingsSectionProps
> = ({ settings, onUpdate }) => {
  const { setTheme } = useTheme();

  // Sync theme changes to the actual theme store
  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme, setTheme]);

  // Apply font size to document root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--font-size-base",
      FONT_SIZE_MAP[settings.fontSize],
    );
  }, [settings.fontSize]);

  // Apply contrast setting
  useEffect(() => {
    const root = document.documentElement;
    if (settings.contrast === "high") {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [settings.contrast]);

  // Apply reduce motion setting
  useEffect(() => {
    const root = document.documentElement;
    if (settings.reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [settings.reduceMotion]);

  const handleThemeChange = (theme: string) => {
    onUpdate({ appearance: { ...settings, theme: theme as ThemeMode } });
  };

  const handleFontSizeChange = (fontSize: string) => {
    onUpdate({ appearance: { ...settings, fontSize: fontSize as FontSize } });
  };

  const handleContrastChange = (contrast: string) => {
    onUpdate({ appearance: { ...settings, contrast: contrast as Contrast } });
  };

  const handleToggleAnimations = (animations: boolean) => {
    onUpdate({ appearance: { ...settings, animations } });
  };

  const handleToggleReduceMotion = (reduceMotion: boolean) => {
    onUpdate({ appearance: { ...settings, reduceMotion } });
  };

  const handleToggleCompactMode = (compactMode: boolean) => {
    onUpdate({ appearance: { ...settings, compactMode } });
  };

  return (
    <div className="space-y-4">
      <SettingsSection
        title="Theme"
        description="Choose your preferred color theme"
      >
        <div className="grid grid-cols-3 gap-3">
          {(["light", "dark", "system"] as ThemeMode[]).map((theme) => {
            const Icon = THEME_ICONS[theme];
            const isSelected = settings.theme === theme;
            return (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                  "min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-border/80",
                )}
                aria-pressed={isSelected}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="text-sm font-medium capitalize">{theme}</span>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Text & Display"
        description="Adjust text size and display options"
        delay={0.05}
      >
        <SettingsCard label="Font Size">
          <RadioGroup
            name="fontSize"
            value={settings.fontSize}
            options={FONT_SIZE_OPTIONS}
            onChange={handleFontSizeChange}
          />
        </SettingsCard>

        <SettingsCard label="Contrast">
          <RadioGroup
            name="contrast"
            value={settings.contrast}
            options={CONTRAST_OPTIONS}
            onChange={handleContrastChange}
          />
        </SettingsCard>

        <SettingsCard
          label="Compact Mode"
          description="Show more content with less spacing"
        >
          <ToggleSwitch
            checked={settings.compactMode}
            onChange={handleToggleCompactMode}
            label="Compact mode"
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Motion"
        description="Control animations and transitions"
        delay={0.1}
      >
        <SettingsCard
          label="Animations"
          description="Enable smooth transitions and animations"
        >
          <ToggleSwitch
            checked={settings.animations}
            onChange={handleToggleAnimations}
            label="Animations"
          />
        </SettingsCard>

        <SettingsCard
          label="Reduce Motion"
          description="Minimize non-essential animations"
        >
          <ToggleSwitch
            checked={settings.reduceMotion}
            onChange={handleToggleReduceMotion}
            label="Reduce motion"
          />
        </SettingsCard>
      </SettingsSection>
    </div>
  );
};

AppearanceSettingsSection.displayName = "AppearanceSettingsSection";
