// ─────────────────────────────────────────────────────────────────────────────
// NotificationSettingsSection.tsx
// KisanGPT — Notification settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { ToggleSwitch } from "./ToggleSwitch";
import type { NotificationSettings } from "../types/settings.types";

interface NotificationSettingsSectionProps {
  settings: NotificationSettings;
  onUpdate: (updates: { notifications: NotificationSettings }) => void;
}

export const NotificationSettingsSection: React.FC<
  NotificationSettingsSectionProps
> = ({ settings, onUpdate }) => {
  const update = (key: keyof NotificationSettings, value: boolean | string) => {
    onUpdate({ notifications: { ...settings, [key]: value } });
  };

  return (
    <div className="space-y-4">
      <SettingsSection
        title="Alert Types"
        description="Choose which alerts you want to receive"
      >
        <SettingsCard
          label="Weather Alerts"
          description="Severe weather warnings and forecasts"
        >
          <ToggleSwitch
            checked={settings.weatherAlerts}
            onChange={(v) => update("weatherAlerts", v)}
            label="Weather alerts"
          />
        </SettingsCard>

        <SettingsCard
          label="Market Alerts"
          description="Price changes and market opportunities"
        >
          <ToggleSwitch
            checked={settings.marketAlerts}
            onChange={(v) => update("marketAlerts", v)}
            label="Market alerts"
          />
        </SettingsCard>

        <SettingsCard
          label="Disease Alerts"
          description="Crop disease risk notifications"
        >
          <ToggleSwitch
            checked={settings.diseaseAlerts}
            onChange={(v) => update("diseaseAlerts", v)}
            label="Disease alerts"
          />
        </SettingsCard>

        <SettingsCard
          label="Government Scheme Alerts"
          description="New schemes and application deadlines"
        >
          <ToggleSwitch
            checked={settings.schemeAlerts}
            onChange={(v) => update("schemeAlerts", v)}
            label="Scheme alerts"
          />
        </SettingsCard>

        <SettingsCard
          label="Application Reminders"
          description="Reminders for pending tasks and applications"
        >
          <ToggleSwitch
            checked={settings.appReminders}
            onChange={(v) => update("appReminders", v)}
            label="Application reminders"
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Delivery Channels"
        description="How you receive notifications"
        delay={0.05}
      >
        <SettingsCard
          label="Push Notifications"
          description="Notifications on your mobile device"
        >
          <ToggleSwitch
            checked={settings.pushEnabled}
            onChange={(v) => update("pushEnabled", v)}
            label="Push notifications"
          />
        </SettingsCard>

        <SettingsCard
          label="Email Notifications"
          description="Notifications sent to your email"
        >
          <ToggleSwitch
            checked={settings.emailEnabled}
            onChange={(v) => update("emailEnabled", v)}
            label="Email notifications"
          />
        </SettingsCard>

        <SettingsCard
          label="SMS Notifications"
          description="Notifications sent via text message"
        >
          <ToggleSwitch
            checked={settings.smsEnabled}
            onChange={(v) => update("smsEnabled", v)}
            label="SMS notifications"
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Quiet Hours"
        description="Set times when notifications are silenced"
        delay={0.1}
      >
        <SettingsCard
          label="Enable Quiet Hours"
          description="Silence notifications during specific hours"
        >
          <ToggleSwitch
            checked={settings.quietHoursEnabled}
            onChange={(v) => update("quietHoursEnabled", v)}
            label="Quiet hours"
          />
        </SettingsCard>

        {settings.quietHoursEnabled && (
          <>
            <SettingsCard label="Start Time">
              <input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => update("quietHoursStart", e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Quiet hours start"
              />
            </SettingsCard>

            <SettingsCard label="End Time">
              <input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => update("quietHoursEnd", e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Quiet hours end"
              />
            </SettingsCard>
          </>
        )}
      </SettingsSection>
    </div>
  );
};

NotificationSettingsSection.displayName = "NotificationSettingsSection";
