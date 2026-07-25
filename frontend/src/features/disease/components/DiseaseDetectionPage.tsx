// ─────────────────────────────────────────────────────────────────────────────
// DiseaseDetectionPage.tsx
// KisanGPT — Main disease detection page component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useCallback } from "react";
import { useDiseaseStore, selectDiseaseState } from "../store/diseaseStore";
import { useDiseaseDetection } from "../hooks/useDiseaseDetection";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { DetectionResultCard } from "./DetectionResultCard";
import { DetectionSkeleton } from "./DetectionSkeleton";
import { DetectionError } from "./DetectionError";
import { DetectionEmpty } from "./DetectionEmpty";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DiseaseDetectionPage: React.FC = () => {
  const uiState = useDiseaseStore(selectDiseaseState);
  const { detect, reset } = useDiseaseDetection();
  const setFile = useDiseaseStore((s) => s.setFile);
  const file = useDiseaseStore((s) => s.file);

  const handleFileSelected = useCallback(
    (selectedFile: File) => {
      setFile(selectedFile);
      detect(selectedFile);
    },
    [setFile, detect],
  );

  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <PageContainer
      title="Crop Disease Detection"
      description="Identify plant diseases and get treatment recommendations"
    >
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Idle state — show uploader */}
        {uiState.status === "idle" && (
          <>
            <DetectionEmpty />
            <ImageUploader onFileSelected={handleFileSelected} />
          </>
        )}

        {/* Uploading */}
        {uiState.status === "uploading" && (
          <DetectionSkeleton />
        )}

        {/* Analyzing */}
        {uiState.status === "analyzing" && (
          <>
            <ImagePreview
              src={uiState.previewUrl}
              onRemove={handleRetry}
            />
            <DetectionSkeleton />
          </>
        )}

        {/* Success */}
        {uiState.status === "success" && (
          <>
            <ImagePreview
              src={uiState.previewUrl}
              fileName={file?.name}
              onRemove={handleRetry}
            />
            <DetectionResultCard result={uiState.data} />
            <Button
              variant="outline"
              onClick={handleRetry}
              className="mt-2"
            >
              Scan Another Plant
            </Button>
          </>
        )}

        {/* Error */}
        {uiState.status === "error" && (
          <>
            {uiState.previewUrl && (
              <ImagePreview
                src={uiState.previewUrl}
                onRemove={handleRetry}
              />
            )}
            <DetectionError
              message={uiState.message}
              onRetry={handleRetry}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
};

DiseaseDetectionPage.displayName = "DiseaseDetectionPage";
