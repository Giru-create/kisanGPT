// ─────────────────────────────────────────────────────────────────────────────
// SettingsPage.tsx
// KisanGPT — Main settings page component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "../hooks/useSettings";
import { SettingsSkeleton } from "./SettingsSkeleton";
import { SettingsSearch } from "./SettingsSearch";
import { SettingsSidebar } from "./SettingsSidebar";
import { AISettingsSection } from "./AISettingsSection";
import { VoiceSettingsSection } from "./VoiceSettingsSection";
import { NotificationSettingsSection } from "./NotificationSettingsSection";
import { AppearanceSettingsSection } from "./AppearanceSettingsSection";
import { FarmSettingsSection } from "./FarmSettingsSection";
import { PrivacySettingsSection } from "./PrivacySettingsSection";
import { SecuritySettingsSection } from "./SecuritySettingsSection";
import { IntegrationsSettingsSection } from "./IntegrationsSettingsSection";
import { AboutSection } from "./AboutSection";
import { LiveRegion } from "@/components/accessibility/LiveRegion";
import { SETTINGS_CATEGORIES } from "../constants/settings.constants";

export const SettingsPage: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    activeCategory,
    searchQuery,
    isMobileNavOpen,
    setSearchQuery,
    setMobileNavOpen,
    handleUpdate,
    handleNavigate,
  } = useSettings();

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return SETTINGS_CATEGORIES.filter(
      (cat) =>
        cat.label.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  if (isLoading) {
    return (
    <section className="min-h-screen bg-background">
        <SettingsSkeleton />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Failed to load settings
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            {error ?? "An unexpected error occurred."}
          </p>
        </div>
      </section>
    );
  }

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case "ai":
        return <AISettingsSection settings={data.ai} onUpdate={handleUpdate} />;
      case "voice":
        return (
          <VoiceSettingsSection settings={data.voice} onUpdate={handleUpdate} />
        );
      case "notifications":
        return (
          <NotificationSettingsSection
            settings={data.notifications}
            onUpdate={handleUpdate}
          />
        );
      case "appearance":
        return (
          <AppearanceSettingsSection
            settings={data.appearance}
            onUpdate={handleUpdate}
          />
        );
      case "farm":
        return (
          <FarmSettingsSection settings={data.farm} onUpdate={handleUpdate} />
        );
      case "privacy":
        return (
          <PrivacySettingsSection
            settings={data.privacy}
            onUpdate={handleUpdate}
          />
        );
      case "security":
        return (
          <SecuritySettingsSection
            settings={data.security}
            onUpdate={handleUpdate}
          />
        );
      case "integrations":
        return <IntegrationsSettingsSection integrations={data.integrations} />;
      case "about":
        return <AboutSection info={data.about} />;
      default:
        return null;
    }
  };

  const activeCategoryInfo = SETTINGS_CATEGORIES.find(
    (c) => c.id === activeCategory,
  );

  return (
    <section className="min-h-screen bg-background">
      <LiveRegion>
        {isLoading
          ? "Loading settings..."
          : `Settings - ${activeCategoryInfo?.label ?? ""}`}
      </LiveRegion>

      <div className="mx-auto max-w-2xl px-4 pb-10 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="ds-page-title">Settings</h1>
          <p className="ds-page-subtitle">
            Personalize your KisanGPT experience
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile nav toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm",
                "bg-card hover:bg-muted/50 transition-colors",
              )}
              aria-label="Toggle navigation"
            >
              {isMobileNavOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              {activeCategoryInfo?.label ?? "Menu"}
            </button>
          </div>

          {/* Sidebar */}
          <div
            className={cn(
              "lg:w-64 shrink-0",
              isMobileNavOpen ? "block" : "hidden lg:block",
            )}
          >
            <div className="sticky top-20 space-y-4">
              <SettingsSearch value={searchQuery} onChange={setSearchQuery} />
              <SettingsSidebar
                activeCategory={activeCategory}
                onNavigate={handleNavigate}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {filteredCategories && filteredCategories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-sm text-muted-foreground">
                  No settings found for &ldquo;{searchQuery}&rdquo;
                </p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-4"
                >
                  <h2 className="text-lg font-semibold text-foreground">
                    {activeCategoryInfo?.label}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeCategoryInfo?.description}
                  </p>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {renderCategoryContent()}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

SettingsPage.displayName = "SettingsPage";
