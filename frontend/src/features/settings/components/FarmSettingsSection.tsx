// ─────────────────────────────────────────────────────────────────────────────
// FarmSettingsSection.tsx
// KisanGPT — Farm settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { SelectDropdown } from "./SelectDropdown";
import type { FarmSettingsData, Units } from "../types/settings.types";
import {
  SOIL_TYPE_OPTIONS,
  IRRIGATION_OPTIONS,
  UNIT_OPTIONS,
} from "../constants/settings.constants";

interface FarmSettingsSectionProps {
  settings: FarmSettingsData;
  onUpdate: (updates: { farm: FarmSettingsData }) => void;
}

export const FarmSettingsSection: React.FC<FarmSettingsSectionProps> = ({
  settings,
  onUpdate,
}) => {
  const handleLocationChange = (farmLocation: string) => {
    onUpdate({ farm: { ...settings, farmLocation } });
  };

  const handleWeatherLocationChange = (weatherLocation: string) => {
    onUpdate({ farm: { ...settings, weatherLocation } });
  };

  const handleSoilTypeChange = (soilType: string) => {
    onUpdate({ farm: { ...settings, soilType } });
  };

  const handleIrrigationChange = (irrigationType: string) => {
    onUpdate({ farm: { ...settings, irrigationType } });
  };

  const handleUnitsChange = (units: string) => {
    onUpdate({ farm: { ...settings, units: units as Units } });
  };

  return (
    <div className="space-y-4">
      <SettingsSection
        title="Farm Location"
        description="Configure your farm details"
      >
        <SettingsCard label="Farm Location">
          <input
            type="text"
            value={settings.farmLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm w-48 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Farm location"
          />
        </SettingsCard>

        <SettingsCard label="Weather Location">
          <input
            type="text"
            value={settings.weatherLocation}
            onChange={(e) => handleWeatherLocationChange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm w-48 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Weather location"
          />
        </SettingsCard>

        <SettingsCard label="Number of Fields">
          <span className="text-sm font-medium text-foreground">
            {settings.fieldCount} fields
          </span>
        </SettingsCard>

        <SettingsCard label="Crop Types">
          <div className="flex flex-wrap gap-1.5">
            {settings.cropTypes.map((crop) => (
              <span
                key={crop}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {crop}
              </span>
            ))}
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Soil & Irrigation"
        description="Configure soil and irrigation details"
        delay={0.05}
      >
        <SettingsCard label="Soil Type">
          <SelectDropdown
            value={settings.soilType}
            options={SOIL_TYPE_OPTIONS}
            onChange={handleSoilTypeChange}
          />
        </SettingsCard>

        <SettingsCard label="Irrigation Type">
          <SelectDropdown
            value={settings.irrigationType}
            options={IRRIGATION_OPTIONS}
            onChange={handleIrrigationChange}
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Units & Markets"
        description="Measurement units and preferred markets"
        delay={0.1}
      >
        <SettingsCard label="Measurement Units">
          <SelectDropdown
            value={settings.units}
            options={UNIT_OPTIONS}
            onChange={handleUnitsChange}
          />
        </SettingsCard>

        <SettingsCard label="Preferred Markets">
          <div className="flex flex-wrap gap-1.5">
            {settings.preferredMarkets.map((market) => (
              <span
                key={market}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20"
              >
                {market}
              </span>
            ))}
          </div>
        </SettingsCard>
      </SettingsSection>
    </div>
  );
};

FarmSettingsSection.displayName = "FarmSettingsSection";
