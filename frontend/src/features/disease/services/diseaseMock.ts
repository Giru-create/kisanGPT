// ─────────────────────────────────────────────────────────────────────────────
// diseaseMock.ts
// KisanGPT — Crop Disease Detection Mock Service
// Provides fallback data when backend endpoints are unavailable
// ─────────────────────────────────────────────────────────────────────────────

import type { DiagnosisResult } from "../types/disease.types";

const MOCK_DELAY_MS = 2500;

const mockDelay = (ms: number = MOCK_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_DIAGNOSIS: DiagnosisResult = {
  disease_name: "Late Blight",
  crop: "Tomato",
  confidence: 0.92,
  severity: "high",
  description:
    "Late blight is a potentially devastating disease of tomato, caused by the fungus-like organism Phytophthora infestans. It causes large, irregular, water-soaked lesions on leaves and stems, often with a white fungal growth on the underside of lesions in humid conditions.",
  is_healthy: false,
  treatments: [
    {
      type: "chemical",
      name: "Chlorothalonil",
      description:
        "Apply chlorothalonil-based fungicide (e.g., Daconil) at 2ml/L water. Spray thoroughly covering both sides of leaves. Repeat every 7-10 days.",
      urgency: "immediate",
    },
    {
      type: "biological",
      name: "Trichoderma viride",
      description:
        "Apply Trichoderma viride-based bio-fungicide at 5g/L water. Use as soil drench and foliar spray. Best used preventively.",
      urgency: "within_days",
    },
    {
      type: "cultural",
      name: "Remove Infected Parts",
      description:
        "Immediately remove and destroy all infected plant parts. Do not compost. Increase plant spacing for air circulation.",
      urgency: "immediate",
    },
  ],
  prevention: [
    "Use certified disease-free seeds and seedlings",
    "Maintain proper spacing between plants for air circulation",
    "Avoid overhead irrigation — water at the base of plants",
    "Apply preventive fungicide during humid weather",
    "Rotate crops — avoid planting tomatoes in the same spot for 2-3 years",
  ],
  similar_diseases: ["Early Blight", "Bacterial Spot", "Septoria Leaf Spot"],
  image_hash: "a1b2c3d4e5f6g7h8",
};

export const diseaseMockService = {
  detect: async (_file: File): Promise<DiagnosisResult> => {
    void _file;
    await mockDelay();
    return { ...MOCK_DIAGNOSIS, image_hash: `mock-${Date.now()}` };
  },
};
