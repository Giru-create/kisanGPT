"use client";

import React from "react";
import { useMemory } from "../hooks/useMemory";
import { MemoryHeader } from "./MemoryHeader";
import { HeroSection } from "./HeroSection";
import { MemorySummaryCard } from "./MemorySummaryCard";
import { AIMemoryInsights } from "./AIMemoryInsights";
import { MemorySearchBar } from "./MemorySearchBar";
import { MemoryTimeline } from "./MemoryTimeline";
import { PersonalizedRecommendations } from "./PersonalizedRecommendations";
import { AddMemoryModal } from "./AddMemoryModal";
import { MemoryDetailModal } from "./MemoryDetailModal";
import { MemorySkeleton } from "./MemorySkeleton";
import { MemoryError } from "./MemoryError";
import { LiveRegion } from "@/components/accessibility/LiveRegion";

export const MemoryPage: React.FC = () => {
  const {
    memories,
    recommendations,
    selectedCategory,
    searchQuery,
    filterTab,
    selectedMemory,
    isDetailModalOpen,
    isAddModalOpen,
    isLoading,
    error,
    setSelectedCategory,
    setAddModalOpen,
    setSearchQuery,
    setFilterTab,
    handleAddMemory,
    handleDeleteMemory,
    handleTogglePin,
    handleToggleSave,
    handleSelectMemory,
    handleClearFilters,
    closeDetail,
    refreshMemories,
  } = useMemory();

  const verifiedCount = memories.filter((m) => m.isVerified).length;
  const pinnedCount = memories.filter((m) => m.isPinned).length;
  const savedCount = memories.filter((m) => m.isSaved).length;

  return (
    <section className="min-h-screen bg-background">
      <LiveRegion>
        {isLoading
          ? "Loading farm memory records"
          : `Displaying ${memories.length} farm memories`}
      </LiveRegion>

      {/* Page Header */}
      <MemoryHeader
        totalCount={memories.length}
        verifiedCount={verifiedCount}
        pinnedCount={pinnedCount}
        savedCount={savedCount}
        onAddClick={() => setAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5">
        {/* Hero Section — Stats & Overview */}
        <HeroSection />

        {/* AI Memory Summary — What KisanGPT Knows */}
        <MemorySummaryCard />

        {/* Search & Filters */}
        <MemorySearchBar
          search={searchQuery}
          category={selectedCategory}
          filterTab={filterTab}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onFilterTabChange={setFilterTab}
          onClear={handleClearFilters}
        />

        {/* AI Insights */}
        <AIMemoryInsights />

        {/* Error State Banner */}
        {error && <MemoryError message={error} onRetry={refreshMemories} />}

        {/* Loading Shimmer or Timeline Feed */}
        {isLoading ? (
          <MemorySkeleton />
        ) : (
          <MemoryTimeline
            items={memories}
            onDelete={handleDeleteMemory}
            onPin={handleTogglePin}
            onSave={handleToggleSave}
            onSelect={handleSelectMemory}
            onAddClick={() => setAddModalOpen(true)}
          />
        )}

        {/* Personalized AI Recommendations Section */}
        <PersonalizedRecommendations recommendations={recommendations} />
      </div>

      {/* Add Record Form Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddMemory}
      />

      {/* Memory Detail Modal */}
      <MemoryDetailModal
        item={selectedMemory}
        isOpen={isDetailModalOpen}
        onClose={closeDetail}
        onDelete={handleDeleteMemory}
        onPin={handleTogglePin}
        onSave={handleToggleSave}
      />
    </section>
  );
};

MemoryPage.displayName = "MemoryPage";
