"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { useProfile } from "../hooks/useProfile";
import { ProfileHero } from "./ProfileHero";
import { FarmOverviewCard } from "./FarmOverview";
import { PersonalInfo } from "./PersonalInfo";
import { AIPersonalization } from "./AIPersonalization";
import { Achievements } from "./Achievements";
import { ActivityTimeline } from "./ActivityTimeline";
import { Documents } from "./Documents";
import { PrivacySecurity } from "./PrivacySecurity";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { PROFILE_TABS } from "../constants/profile.constants";
import { LiveRegion } from "@/components/accessibility/LiveRegion";
import { cn } from "@/lib/utils";

export const ProfilePage: React.FC = () => {
  const {
    profileData,
    activeTab,
    isDeleteModalOpen,
    isLoading,
    error,
    setActiveTab,
    setIsEditing,
    setDeleteModalOpen,
    handleDeleteAccount,
    refreshProfile,
  } = useProfile();

  if (isLoading) {
    return (
      <section className="min-h-screen bg-background">
        <ProfileSkeleton />
      </section>
    );
  }

  if (error || !profileData) {
    return (
      <section className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center space-y-3 max-w-sm">
          <p className="text-sm font-semibold text-foreground">
            Failed to load profile
          </p>
          <p className="text-xs text-muted-foreground">
            {error ?? "Unknown error"}
          </p>
          <button
            onClick={refreshProfile}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const {
    profile,
    farm,
    fields,
    equipment,
    livestock,
    aiPersonalization,
    achievements,
    recentActivity,
    documents,
    privacySettings,
    connectedDevices,
    loginSessions,
  } = profileData;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <ProfileHero profile={profile} onEdit={() => setIsEditing(true)} />
            <FarmOverviewCard
              farm={farm}
              fields={fields}
              equipment={equipment}
              livestock={livestock}
            />
            <AIPersonalization data={aiPersonalization} />
          </div>
        );
      case "farm":
        return (
          <FarmOverviewCard
            farm={farm}
            fields={fields}
            equipment={equipment}
            livestock={livestock}
            onEdit={() => setIsEditing(true)}
          />
        );
      case "personal":
        return (
          <PersonalInfo profile={profile} onEdit={() => setIsEditing(true)} />
        );
      case "ai":
        return <AIPersonalization data={aiPersonalization} />;
      case "achievements":
        return <Achievements achievements={achievements} />;
      case "activity":
        return <ActivityTimeline activities={recentActivity} />;
      case "documents":
        return <Documents documents={documents} onUpload={() => {}} />;
      case "privacy":
        return (
          <PrivacySecurity
            privacySettings={privacySettings}
            connectedDevices={connectedDevices}
            loginSessions={loginSessions}
            onExportData={() => {}}
            onDeleteAccount={() => setDeleteModalOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-background">
      <LiveRegion>
        {isLoading
          ? "Loading farmer profile"
          : `Showing profile for ${profile.name}`}
      </LiveRegion>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 flex flex-col gap-5">
        {/* Tabs */}
        <nav
          role="tablist"
          aria-label="Profile sections"
          className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none"
        >
          {PROFILE_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all min-h-[44px] flex items-center gap-1.5",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteModalOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <div>
                <h3
                  id="delete-account-title"
                  className="text-base font-bold text-foreground"
                >
                  Delete Account Data
                </h3>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will permanently delete all your data including memories,
              activity history, documents, and preferences. You will need to
              create a new account to use KisanGPT again.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors min-h-[44px]"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

ProfilePage.displayName = "ProfilePage";
