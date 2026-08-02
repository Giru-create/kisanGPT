"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSchemes } from "../hooks/useSchemes";
import { HeroSection } from "./HeroSection";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { SchemeExplorer } from "./SchemeExplorer";
import { SchemeCard } from "./SchemeCard";
import { ApplicationTracker } from "./ApplicationTracker";
import { AIAssistant } from "./AIAssistant";
import { SchemeNotifications } from "./SchemeNotifications";
import { SchemeDetailView } from "./SchemeDetailView";
import { SchemesEmpty } from "./SchemesEmpty";
import { SchemesSkeleton } from "./SchemesSkeleton";
import { SchemeError } from "./SchemeError";
import {
  MOCK_APPLICATIONS,
  MOCK_NOTIFICATIONS,
} from "../constants/schemes.constants";

export const SchemesPage: React.FC = () => {
  const {
    uiState,
    filters,
    selectedScheme,
    isDetailOpen,
    refresh,
    setState,
    setCrop,
    setFarmerCategory,
    setSchemeType,
    setSearch,
    setPage,
    resetFilters,
    openDetail,
    closeDetail,
  } = useSchemes();

  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-10 pt-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="ds-page-title">Government Schemes</h1>
            <p className="ds-page-subtitle">
              AI-powered scheme discovery &amp; tracking
            </p>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Loading */}
          {uiState.status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SchemesSkeleton />
            </motion.div>
          )}

          {/* Error */}
          {uiState.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              <SchemeError message={uiState.message} onRetry={refresh} />
              <Button
                variant="outline"
                onClick={refresh}
                leftIcon={<RefreshCw size={14} />}
                className="text-xs"
              >
                Retry
              </Button>
            </motion.div>
          )}

          {/* Idle / Success */}
          {(uiState.status === "idle" || uiState.status === "success") && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* Hero */}
              <HeroSection onQuickSearch={setSearch} />

              {/* AI Recommendation */}
              <AIRecommendationCard
                onSelectScheme={openDetail}
                onApply={openDetail}
              />

              {/* Scheme Explorer + Cards */}
              <SchemeExplorer
                filters={filters}
                onSetState={setState}
                onSetCrop={setCrop}
                onSetFarmerCategory={setFarmerCategory}
                onSetSchemeType={setSchemeType}
                onSetSearch={setSearch}
                onReset={resetFilters}
              />

              {/* Scheme results */}
              {uiState.status === "success" && (
                <>
                  {uiState.data.schemes.length === 0 ? (
                    <SchemesEmpty onSearch={setSearch} />
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Showing {uiState.data.schemes.length} of{" "}
                        {uiState.data.totalCount} schemes
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {uiState.data.schemes.map((scheme, i) => (
                          <SchemeCard
                            key={scheme.id}
                            scheme={scheme}
                            index={i}
                            onSelect={openDetail}
                          />
                        ))}
                      </div>
                      {uiState.data.totalCount > uiState.data.pageSize && (
                        <div className="flex justify-center gap-2 pt-4">
                          <button
                            type="button"
                            disabled={filters.page <= 1}
                            onClick={() => setPage(filters.page - 1)}
                            className="px-4 py-2 text-sm font-semibold rounded-xl border border-border bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2 text-sm text-muted-foreground">
                            Page {filters.page}
                          </span>
                          <button
                            type="button"
                            disabled={
                              uiState.data.schemes.length < filters.pageSize
                            }
                            onClick={() => setPage(filters.page + 1)}
                            className="px-4 py-2 text-sm font-semibold rounded-xl border border-border bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Idle: show empty state */}
              {uiState.status === "idle" && (
                <SchemesEmpty onSearch={setSearch} />
              )}

              {/* Application Tracker */}
              <ApplicationTracker
                applications={MOCK_APPLICATIONS}
                onSelectScheme={(schemeId) => {
                  const mockScheme = {
                    id: schemeId,
                    title: schemeId.toUpperCase(),
                    category: "Direct Benefit",
                    description: "",
                    eligibility: "",
                    benefits: "",
                    requiredDocuments: [],
                    applicationProcess: "",
                    deadline: null,
                    officialLink: "",
                    statusBadge: "Eligible" as const,
                    benefitAmount: "",
                    summary: "",
                    state: null,
                    crop: null,
                    farmerCategory: null,
                    schemeType: null,
                  };
                  openDetail(mockScheme);
                }}
              />

              {/* Notifications */}
              <SchemeNotifications notifications={MOCK_NOTIFICATIONS} />

              {/* AI Assistant */}
              <AIAssistant />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Panel */}
        <SchemeDetailView
          scheme={selectedScheme}
          isOpen={isDetailOpen}
          onClose={closeDetail}
          onApply={closeDetail}
        />
      </div>
    </section>
  );
};

SchemesPage.displayName = "SchemesPage";
