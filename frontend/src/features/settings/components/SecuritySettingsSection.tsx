// ─────────────────────────────────────────────────────────────────────────────
// SecuritySettingsSection.tsx
// KisanGPT — Security settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { ToggleSwitch } from "./ToggleSwitch";
import { Button } from "@/components/ui/Button";
import type { SecuritySettings } from "../types/settings.types";

interface SecuritySettingsSectionProps {
  settings: SecuritySettings;
  onUpdate: (updates: { security: SecuritySettings }) => void;
}

export const SecuritySettingsSection: React.FC<
  SecuritySettingsSectionProps
> = ({ settings, onUpdate }) => {
  const handleToggle2FA = (twoFactorEnabled: boolean) => {
    onUpdate({ security: { ...settings, twoFactorEnabled } });
  };

  return (
    <div className="space-y-4">
      <SettingsSection title="Authentication" description="Secure your account">
        <SettingsCard
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        >
          <ToggleSwitch
            checked={settings.twoFactorEnabled}
            onChange={handleToggle2FA}
            label="Two-factor authentication"
          />
        </SettingsCard>

        <SettingsCard
          label="Change Password"
          description={`Last changed: ${settings.lastPasswordChange}`}
        >
          <Button variant="outline" size="sm">
            Change
          </Button>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Sessions & Devices"
        description="Manage your active sessions"
        delay={0.05}
      >
        <SettingsCard
          label="Active Sessions"
          description={`${settings.activeSessions} active sessions`}
        >
          <span className="text-sm font-medium text-foreground">
            {settings.activeSessions} sessions
          </span>
        </SettingsCard>

        <SettingsCard
          label="Trusted Devices"
          description={`${settings.trustedDevices} trusted devices`}
        >
          <span className="text-sm font-medium text-foreground">
            {settings.trustedDevices} devices
          </span>
        </SettingsCard>

        <SettingsCard
          label="Backup Codes"
          description={
            settings.backupCodesGenerated
              ? "Backup codes have been generated"
              : "Generate backup codes for account recovery"
          }
        >
          <Button variant="outline" size="sm">
            {settings.backupCodesGenerated ? "Regenerate" : "Generate"}
          </Button>
        </SettingsCard>

        <div className="pt-2">
          <Button variant="danger" size="sm">
            Sign Out All Devices
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
};

SecuritySettingsSection.displayName = "SecuritySettingsSection";
