"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SchemesPage.tsx
// KisanGPT — Government Schemes page assembly
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useSchemes } from "../hooks/useSchemes";
import { SchemeFiltersBar } from "./SchemeFiltersBar";
import { SchemeListCard } from "./SchemeListCard";
import { SchemeDetailPanel } from "./SchemeDetailPanel";
import { SchemeSkeleton } from "./SchemeSkeleton";
import { SchemeEmpty } from "./SchemeEmpty";
import { SchemeError } from "./SchemeError";

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
    <section
      role="region"
      aria-label="Government Schemes"
      className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-foreground">
          Government Schemes &amp; Subsidies
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore subsidies, PM-Kisan DBT updates, crop insurance, and
          agricultural loan schemes tailored to your needs.
        </p>
      </div>

      {/* Filters */}
      <SchemeFiltersBar
        filters={filters}
        onSetState={setState}
        onSetCrop={setCrop}
        onSetFarmerCategory={setFarmerCategory}
        onSetSchemeType={setSchemeType}
        onSetSearch={setSearch}
        onReset={resetFilters}
      />

      {/* Content */}
      {uiState.status === "loading" && <SchemeSkeleton />}
      {uiState.status === "error" && (
        <SchemeError message={uiState.message} onRetry={refresh} />
      )}
      {uiState.status === "success" && uiState.data.schemes.length === 0 && (
        <SchemeEmpty onReset={resetFilters} />
      )}
      {uiState.status === "success" && uiState.data.schemes.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground">
            Showing {uiState.data.schemes.length} of {uiState.data.totalCount}{" "}
            schemes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uiState.data.schemes.map((scheme) => (
              <SchemeListCard
                key={scheme.id}
                scheme={scheme}
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
                disabled={uiState.data.schemes.length < filters.pageSize}
                onClick={() => setPage(filters.page + 1)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-border bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Panel */}
      <SchemeDetailPanel
        scheme={selectedScheme}
        isOpen={isDetailOpen}
        onClose={closeDetail}
      />
    </section>
  );
};

SchemesPage.displayName = "SchemesPage";
