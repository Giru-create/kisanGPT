// ─────────────────────────────────────────────────────────────────────────────
// disease.constants.ts
// KisanGPT — Crop Disease Detection feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type {
  DiseaseSeverity,
  DiseaseCategory,
  PlantPart,
  SpreadRisk,
  SupportedCrop,
  AIExplanation,
  RelatedInfo,
  DiagnosisHistoryItem,
} from "../types/disease.types";

// ---------------------------------------------------------------------------
// Supported Crops
// ---------------------------------------------------------------------------

export const SUPPORTED_CROPS: SupportedCrop[] = [
  {
    name: "Wheat",
    emoji: "\uD83C\uDF3E",
    commonDiseases: ["Rust", "Powdery Mildew", "Spot Blotch", "Karnal Bunt"],
  },
  {
    name: "Rice",
    emoji: "\uD83C\uDF5A",
    commonDiseases: [
      "Blast",
      "Bacterial Leaf Blight",
      "Sheath Blight",
      "Tungro",
    ],
  },
  {
    name: "Tomato",
    emoji: "\uD83C\uDF45",
    commonDiseases: [
      "Late Blight",
      "Early Blight",
      "Bacterial Spot",
      "Fusarium Wilt",
    ],
  },
  {
    name: "Cotton",
    emoji: "\u2601\uFE0F",
    commonDiseases: [
      "Boll Rot",
      "Fusarium Wilt",
      "Bacterial Blight",
      "Leaf Curl Virus",
    ],
  },
  {
    name: "Maize",
    emoji: "\uD83C\uDF3D",
    commonDiseases: [
      "Downy Mildew",
      "Turcicum Leaf Blight",
      "Common Rust",
      "Stalk Rot",
    ],
  },
  {
    name: "Potato",
    emoji: "\uD83E\uDD54",
    commonDiseases: ["Late Blight", "Early Blight", "Black Scurf", "Wart"],
  },
  {
    name: "Soybean",
    emoji: "\uD83C\uDF31",
    commonDiseases: ["Rust", "Frogeye Leaf Spot", "Brown Spot", "Charcoal Rot"],
  },
  {
    name: "Onion",
    emoji: "\uD83E\uDDC5",
    commonDiseases: [
      "Downy Mildew",
      "Purple Blotch",
      "Leaf Blight",
      "Pink Root",
    ],
  },
];

// ---------------------------------------------------------------------------
// Severity config
// ---------------------------------------------------------------------------

export const SEVERITY_CONFIG: Record<
  DiseaseSeverity,
  { label: string; color: string; bg: string; icon: string }
> = {
  low: {
    label: "Low",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: "\u2705",
  },
  medium: {
    label: "Medium",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: "\u26A0\uFE0F",
  },
  high: {
    label: "High",
    color: "text-orange-600",
    bg: "bg-orange-50",
    icon: "\uD83D\uDD34",
  },
  critical: {
    label: "Critical",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: "\uD83D\uDEA8",
  },
};

// ---------------------------------------------------------------------------
// Disease category config
// ---------------------------------------------------------------------------

export const CATEGORY_CONFIG: Record<
  DiseaseCategory,
  { label: string; color: string; bg: string; icon: string }
> = {
  fungal: {
    label: "Fungal",
    color: "text-violet-600",
    bg: "bg-violet-50",
    icon: "\uD83C\uDF44",
  },
  bacterial: {
    label: "Bacterial",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: "\uD83E\uDDA0",
  },
  viral: {
    label: "Viral",
    color: "text-red-500",
    bg: "bg-red-50",
    icon: "\uD83D\uDD25",
  },
  pest: {
    label: "Pest",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: "\uD83D\uDC1B",
  },
  nutrient_deficiency: {
    label: "Nutrient Deficiency",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    icon: "\u26A0\uFE0F",
  },
  environmental: {
    label: "Environmental",
    color: "text-sky-600",
    bg: "bg-sky-50",
    icon: "\uD83C\uDF26\uFE0F",
  },
  healthy: {
    label: "Healthy",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: "\uD83C\uDF3F",
  },
};

// ---------------------------------------------------------------------------
// Plant part config
// ---------------------------------------------------------------------------

export const PLANT_PART_CONFIG: Record<
  PlantPart,
  { label: string; icon: string }
> = {
  leaf: { label: "Leaf", icon: "\uD83C\uDF3F" },
  stem: { label: "Stem", icon: "\uD83C\uDF33" },
  root: { label: "Root", icon: "\uD83C\uDF31" },
  fruit: { label: "Fruit", icon: "\uD83C\uDF4E" },
  flower: { label: "Flower", icon: "\uD83C\uDF38" },
  seed: { label: "Seed", icon: "\uD83C\uDF30" },
  multiple: { label: "Multiple Parts", icon: "\uD83C\uDF3E" },
};

// ---------------------------------------------------------------------------
// Spread risk config
// ---------------------------------------------------------------------------

export const SPREAD_RISK_CONFIG: Record<
  SpreadRisk,
  { label: string; color: string; bg: string; description: string }
> = {
  low: {
    label: "Low Risk",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    description: "Unlikely to spread rapidly to nearby plants",
  },
  moderate: {
    label: "Moderate Risk",
    color: "text-amber-600",
    bg: "bg-amber-50",
    description: "May spread under favorable conditions",
  },
  high: {
    label: "High Risk",
    color: "text-orange-600",
    bg: "bg-orange-50",
    description: "Likely to spread quickly in current conditions",
  },
  very_high: {
    label: "Very High Risk",
    color: "text-red-600",
    bg: "bg-red-50",
    description: "Immediate action needed to prevent crop-wide infection",
  },
};

// ---------------------------------------------------------------------------
// Scanning steps for AI Analysis animation
// ---------------------------------------------------------------------------

export const SCANNING_STEPS = [
  {
    id: "upload",
    label: "Uploading image",
    icon: "\uD83D\uDCE4",
    duration: 800,
  },
  {
    id: "plant",
    label: "Detecting plant",
    icon: "\uD83C\uDF3F",
    duration: 1200,
  },
  {
    id: "leaf",
    label: "Analyzing leaf structure",
    icon: "\uD83C\uDF43",
    duration: 1500,
  },
  {
    id: "disease",
    label: "Identifying disease",
    icon: "\uD83D\uDD0D",
    duration: 1800,
  },
  {
    id: "confidence",
    label: "Calculating confidence",
    icon: "\uD83E\uDDE0",
    duration: 1000,
  },
];

// ---------------------------------------------------------------------------
// Suggested examples for empty state
// ---------------------------------------------------------------------------

export const SUGGESTED_EXAMPLES = [
  { label: "Wheat leaf", crop: "Wheat", icon: "\uD83C\uDF3E" },
  { label: "Rice plant", crop: "Rice", icon: "\uD83C\uDF5A" },
  { label: "Tomato leaf", crop: "Tomato", icon: "\uD83C\uDF45" },
  { label: "Cotton leaf", crop: "Cotton", icon: "\u2601\uFE0F" },
  { label: "Maize leaf", crop: "Maize", icon: "\uD83C\uDF3D" },
];

// ---------------------------------------------------------------------------
// Mock enhanced diagnosis result
// ---------------------------------------------------------------------------

export const MOCK_DIAGNOSIS_ENHANCED = {
  disease_name: "Late Blight",
  scientific_name: "Phytophthora infestans",
  crop: "Tomato",
  confidence: 0.92,
  severity: "high" as DiseaseSeverity,
  description:
    "Late Blight is a devastating fungal disease caused by Phytophthora infestans. It spreads rapidly in cool, humid conditions and can destroy entire tomato crops within days. The disease appears as water-soaked lesions on leaves that quickly turn brown or black, often with a pale green halo. White fuzzy growth may appear on the undersides of leaves in humid conditions.",
  is_healthy: false,
  treatments: [
    {
      type: "chemical" as const,
      name: "Chlorothalonil 75% WP",
      description:
        "Apply Chlorothalonil at 2g/L water as a foliar spray. Cover both upper and lower leaf surfaces thoroughly.",
      urgency: "immediate" as const,
      dosage: "2g per liter of water",
      applicationMethod: "Foliar spray",
      frequency: "Every 7-10 days",
      waitingPeriod: "7 days before harvest",
      cost: "\u20B9150-200 per hectare",
      availability: "Available at local agricultural stores",
    },
    {
      type: "biological" as const,
      name: "Trichoderma viride",
      description:
        "Apply Trichoderma viride-based bio-fungicide as soil drench and foliar spray. This beneficial fungus competitively excludes the pathogen.",
      urgency: "within_days" as const,
      dosage: "5g per liter of water",
      applicationMethod: "Soil drench and foliar spray",
      frequency: "Every 15 days",
      waitingPeriod: "No waiting period",
      cost: "\u20B980-120 per hectare",
      availability: "Available at Krishi Vigyan Kendra",
    },
    {
      type: "cultural" as const,
      name: "Remove Infected Parts",
      description:
        "Immediately remove and destroy all infected leaves, stems, and fruits. Do not compost infected material. Prune lower branches to improve air circulation.",
      urgency: "immediate" as const,
      applicationMethod: "Manual removal",
      frequency: "Daily until controlled",
      cost: "No cost",
    },
    {
      type: "chemical" as const,
      name: "Metalaxyl 35% WS",
      description:
        "Seed treatment before sowing to prevent early infection. Mix 3g per kg of seed.",
      urgency: "preventive" as const,
      dosage: "3g per kg seed",
      applicationMethod: "Seed treatment",
      frequency: "Before sowing only",
      waitingPeriod: "N/A",
      cost: "\u20B950 per kg seed",
      availability: "Available at authorized dealers",
    },
  ],
  prevention: [
    "Ensure proper spacing between plants (60cm x 45cm) for air circulation",
    "Avoid overhead irrigation; use drip irrigation instead",
    "Apply copper-based fungicide preventively during high humidity periods",
    "Choose resistant varieties when available (e.g., 'Arka Rakshak')",
    "Rotate crops on a 3-year cycle to break disease cycle",
    "Remove plant debris after harvest to reduce inoculum load",
  ],
  similar_diseases: ["Early Blight", "Bacterial Spot", "Septoria Leaf Spot"],
  image_hash: "mock-1722445200000",
  affected_part: "leaf" as PlantPart,
  disease_category: "fungal" as DiseaseCategory,
  spread_risk: "high" as SpreadRisk,
  ai_summary:
    "Your tomato plant shows classic symptoms of Late Blight (Phytophthora infestans). The dark, water-soaked lesions with pale green halos are distinctive. Immediate action is required to prevent spread to healthy plants.",
};

// ---------------------------------------------------------------------------
// Mock AI Explanation
// ---------------------------------------------------------------------------

export const MOCK_AI_EXPLANATION: AIExplanation = {
  whyDiagnosis:
    "The AI identified Late Blight based on the characteristic dark, water-soaked lesions on the leaf surface, combined with the pale green halo pattern. The lesion shape, color gradient, and distribution pattern are highly consistent with Phytophthora infestans infection.",
  visibleSymptoms: [
    "Dark brown to black water-soaked lesions on leaf surface",
    "Pale green halos surrounding the dark lesions",
    "Lesion pattern starting from leaf edges",
    "Slight fuzzy white growth on leaf underside (indicative of sporulation)",
  ],
  keyEvidence: [
    "Lesion color: Dark brown/black with water-soaked appearance",
    "Lesion shape: Irregular, expanding from edges inward",
    "Halo pattern: Pale green surrounding zone",
    "Distribution: Concentrated on older, lower leaves first",
    "Leaf texture: Soft, mushy areas within lesions",
  ],
  alternativePossibilities: [
    "Early Blight (Alternaria solani) - similar lesions but with concentric rings",
    "Bacterial Spot (Xanthomonas) - smaller, more angular lesions",
    "Septoria Leaf Spot - smaller, circular lesions with grey centers",
  ],
  whenToSeekExpert:
    "If the disease does not improve within 5-7 days of treatment, or if more than 30% of your crop is affected, consult your local Krishi Vigyan Kendra (KVK) or District Agriculture Officer for in-person assessment.",
};

// ---------------------------------------------------------------------------
// Mock Related Info
// ---------------------------------------------------------------------------

export const MOCK_RELATED_INFO: RelatedInfo = {
  weatherInfluence:
    "Current weather conditions (cool, humid, 18-22\u00B0C) are highly favorable for Late Blight development. Rain forecast in the next 3 days will increase infection risk significantly.",
  nearbyOutbreakAlerts:
    "2 Late Blight outbreaks reported within 15km in the last week. Farmers in your area are advised to apply preventive fungicide.",
  seasonalRisk:
    "Late Blight risk is currently HIGH for the monsoon season. Peak risk period: July to September.",
  cropStageImpact:
    "Tomato plants in the fruiting stage are most vulnerable. Fruit infection can cause complete crop loss if untreated.",
  similarDiseases: [
    "Early Blight",
    "Bacterial Leaf Spot",
    "Septoria Leaf Spot",
    "Fusarium Wilt",
  ],
};

// ---------------------------------------------------------------------------
// Mock Diagnosis History
// ---------------------------------------------------------------------------

export const MOCK_DIAGNOSIS_HISTORY: DiagnosisHistoryItem[] = [
  {
    id: "1",
    disease_name: "Late Blight",
    crop: "Tomato",
    confidence: 0.92,
    severity: "high",
    status: "completed",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    improvement_trend: "stable",
  },
  {
    id: "2",
    disease_name: "Leaf Rust",
    crop: "Wheat",
    confidence: 0.87,
    severity: "medium",
    status: "completed",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    improvement_trend: "improving",
  },
  {
    id: "3",
    disease_name: "Powdery Mildew",
    crop: "Grape",
    confidence: 0.78,
    severity: "low",
    status: "completed",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    improvement_trend: "improving",
  },
  {
    id: "4",
    disease_name: "Bacterial Wilt",
    crop: "Cucumber",
    confidence: 0.95,
    severity: "critical",
    status: "completed",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    improvement_trend: "worsening",
  },
];
