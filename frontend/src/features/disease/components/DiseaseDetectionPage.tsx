"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useDiseaseDetection } from "../hooks/useDiseaseDetection";
import { useDiseaseStore, selectDiseaseState } from "../store/diseaseStore";
import { HeroSection } from "./HeroSection";
import { ImageCapture } from "./ImageCapture";
import { AIAnalysis } from "./AIAnalysis";
import { DiagnosisResultCard } from "./DiagnosisResultCard";
import { TreatmentPlan } from "./TreatmentPlan";
import { AIExplanationCard } from "./AIExplanationCard";
import { RelatedInfoCard } from "./RelatedInfoCard";
import { FollowUpActions } from "./FollowUpActions";
import { DiagnosisHistory } from "./DiagnosisHistory";
import { DiseaseEmpty } from "./DiseaseEmpty";
import { DiseaseSkeleton } from "./DiseaseSkeleton";
import { DetectionError } from "./DetectionError";
import { MOCK_DIAGNOSIS_HISTORY } from "../constants/disease.constants";

export const DiseaseDetectionPage: React.FC = () => {
  const router = useRouter();
  const uiState = useDiseaseStore(selectDiseaseState);
  const { detect } = useDiseaseDetection();
  const resetStore = useDiseaseStore((s) => s.reset);

  const handleFileSelected = (file: File) => {
    detect(file);
  };

  const handleRetry = () => {
    resetStore();
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="ds-page-title">Disease Detection</h1>
            <p className="ds-page-subtitle">AI-powered crop diagnosis</p>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Idle */}
          {uiState.status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              <HeroSection
                recentDiagnosis={MOCK_DIAGNOSIS_HISTORY[0]}
                onStartDiagnosis={() => {
                  document.getElementById("disease-upload-trigger")?.click();
                }}
              />
              <ImageCapture onFileSelected={handleFileSelected} />
              <DiseaseEmpty />
              <DiagnosisHistory history={MOCK_DIAGNOSIS_HISTORY} />
            </motion.div>
          )}

          {/* Uploading */}
          {uiState.status === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              <DiseaseSkeleton />
            </motion.div>
          )}

          {/* Analyzing */}
          {uiState.status === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              <AIAnalysis previewUrl={uiState.previewUrl} />
            </motion.div>
          )}

          {/* Success */}
          {uiState.status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              {/* Diagnosis result */}
              <DiagnosisResultCard result={uiState.data} />

              {/* Treatment plan */}
              {uiState.data.treatments.length > 0 && (
                <TreatmentPlan
                  treatments={uiState.data.treatments.map((t, i) => ({
                    ...t,
                    id: `treatment-${i}`,
                  }))}
                />
              )}

              {/* AI Explanation */}
              {uiState.data.ai_explanation && (
                <AIExplanationCard explanation={uiState.data.ai_explanation} />
              )}

              {/* Related info */}
              {uiState.data.related_info && (
                <RelatedInfoCard info={uiState.data.related_info} />
              )}

              {/* Follow-up actions */}
              <FollowUpActions
                onAskAI={() => {
                  router.push("/advisor");
                }}
                onScanAnother={handleRetry}
              />

              {/* Diagnosis history */}
              <DiagnosisHistory history={MOCK_DIAGNOSIS_HISTORY} />
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
              <DetectionError message={uiState.message} onRetry={handleRetry} />
              <ImageCapture onFileSelected={handleFileSelected} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

DiseaseDetectionPage.displayName = "DiseaseDetectionPage";
