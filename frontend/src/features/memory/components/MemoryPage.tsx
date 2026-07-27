// ─────────────────────────────────────────────────────────────────────────────
// MemoryPage.tsx
// KisanGPT — Farm Memory Main Feature Page Component
// Multilingual mobile-first farm memory logbook and personalized AI advice
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { useMemory } from "../hooks/useMemory";
import { MemoryHeader } from "./MemoryHeader";
import { MemoryCategoryFilter } from "./MemoryCategoryFilter";
import { MemoryTimeline } from "./MemoryTimeline";
import { PersonalizedRecommendations } from "./PersonalizedRecommendations";
import { AddMemoryModal } from "./AddMemoryModal";
import { MemorySkeleton } from "./MemorySkeleton";
import { MemoryError } from "./MemoryError";
import { LiveRegion } from "@/components/accessibility/LiveRegion";

export const MemoryPage: React.FC = () => {
  const {
    memories,
    recommendations,
    selectedCategory,
    isAddModalOpen,
    isLoading,
    error,
    setSelectedCategory,
    setAddModalOpen,
    handleAddMemory,
    handleDeleteMemory,
    refreshMemories,
  } = useMemory();

  const verifiedCount = memories.filter((m) => m.isVerified).length;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <LiveRegion>
        {isLoading
          ? "Loading farm memory records"
          : `Displaying ${memories.length} farm memory records`}
      </LiveRegion>

      {/* Page Header */}
      <MemoryHeader
        totalCount={memories.length}
        verifiedCount={verifiedCount}
        onAddClick={() => setAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 space-y-6 max-w-4xl mx-auto w-full">
        {/* Category Tabs */}
        <MemoryCategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Personalized AI Recommendations Section */}
        <PersonalizedRecommendations recommendations={recommendations} />

        {/* Error State Banner */}
        {error && <MemoryError message={error} onRetry={refreshMemories} />}

        {/* Loading Shimmer or Timeline Feed */}
        {isLoading ? (
          <MemorySkeleton />
        ) : (
          <MemoryTimeline
            items={memories}
            onDelete={handleDeleteMemory}
            onAddClick={() => setAddModalOpen(true)}
          />
        )}
      </main>

      {/* Add Record Form Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddMemory}
      />
    </div>
  );
};

MemoryPage.displayName = "MemoryPage";
