// ─────────────────────────────────────────────────────────────────────────────
// AboutSection.tsx
// KisanGPT — About settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { Button } from "@/components/ui/Button";
import type { AppInfo } from "../types/settings.types";

interface AboutSectionProps {
  info: AppInfo;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ info }) => {
  return (
    <div className="space-y-4">
      <SettingsSection title="App Information">
        <SettingsCard label="Version">
          <span className="text-sm font-medium text-foreground">
            {info.version}
          </span>
        </SettingsCard>

        <SettingsCard label="Build Number">
          <span className="text-sm font-medium text-foreground">
            {info.buildNumber}
          </span>
        </SettingsCard>

        <SettingsCard label="Release Date">
          <span className="text-sm font-medium text-foreground">
            {info.releaseDate}
          </span>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Legal & Support"
        description="Help and legal information"
        delay={0.05}
      >
        <SettingsCard label="Terms of Service">
          <a
            href={info.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </SettingsCard>

        <SettingsCard label="Privacy Policy">
          <a
            href={info.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </SettingsCard>

        <SettingsCard label="Support">
          <a
            href={`mailto:${info.supportEmail}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            {info.supportEmail} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </SettingsCard>

        <SettingsCard label="Feedback">
          <a
            href={info.feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            Share Feedback <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </SettingsCard>

        <SettingsCard label="Open Source Licenses">
          <Button variant="outline" size="sm">
            View Licenses
          </Button>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Contact" delay={0.1}>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-1">
            Built with care for Indian farmers
          </p>
          <p className="text-xs text-muted-foreground">
            KisanGPT v{info.version} &mdash; {info.releaseDate}
          </p>
        </div>
      </SettingsSection>
    </div>
  );
};

AboutSection.displayName = "AboutSection";
