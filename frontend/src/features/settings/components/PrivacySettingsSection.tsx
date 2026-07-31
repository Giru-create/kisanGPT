// ─────────────────────────────────────────────────────────────────────────────
// PrivacySettingsSection.tsx
// KisanGPT — Privacy settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState } from "react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { ToggleSwitch } from "./ToggleSwitch";
import { Button } from "@/components/ui/Button";
import type { PrivacySettings } from "../types/settings.types";

interface PrivacySettingsSectionProps {
  settings: PrivacySettings;
  onUpdate: (updates: { privacy: PrivacySettings }) => void;
}

export const PrivacySettingsSection: React.FC<PrivacySettingsSectionProps> = ({
  settings,
  onUpdate,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const update = (key: keyof PrivacySettings, value: boolean) => {
    onUpdate({ privacy: { ...settings, [key]: value } });
  };

  return (
    <div className="space-y-4">
      <SettingsSection
        title="AI & Data"
        description="Control how your data is used"
      >
        <SettingsCard
          label="AI Memory"
          description="Allow AI to remember your preferences"
        >
          <ToggleSwitch
            checked={settings.aiMemory}
            onChange={(v) => update("aiMemory", v)}
            label="AI memory"
          />
        </SettingsCard>

        <SettingsCard
          label="Conversation History"
          description="Save past conversations for context"
        >
          <ToggleSwitch
            checked={settings.conversationHistory}
            onChange={(v) => update("conversationHistory", v)}
            label="Conversation history"
          />
        </SettingsCard>

        <SettingsCard
          label="Data Sharing"
          description="Share anonymized data to improve AI models"
        >
          <ToggleSwitch
            checked={settings.dataSharing}
            onChange={(v) => update("dataSharing", v)}
            label="Data sharing"
          />
        </SettingsCard>

        <SettingsCard
          label="Analytics"
          description="Help improve KisanGPT with usage analytics"
        >
          <ToggleSwitch
            checked={settings.analytics}
            onChange={(v) => update("analytics", v)}
            label="Analytics"
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Data Management"
        description="Export or delete your data"
        delay={0.05}
      >
        <SettingsCard
          label="Connected Devices"
          description={`${settings.connectedDevices} devices connected to your account`}
        >
          <span className="text-sm font-medium text-foreground">
            {settings.connectedDevices} devices
          </span>
        </SettingsCard>

        <SettingsCard label="Permissions">
          <div className="flex flex-wrap gap-1.5">
            {settings.permissions.map((perm) => (
              <span
                key={perm}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              >
                {perm}
              </span>
            ))}
          </div>
        </SettingsCard>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete All Data
          </Button>
        </div>

        {showDeleteConfirm && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
            <p className="text-sm text-red-600 mb-3">
              This action cannot be undone. All your data will be permanently
              deleted.
            </p>
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Confirm Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </SettingsSection>
    </div>
  );
};

PrivacySettingsSection.displayName = "PrivacySettingsSection";
