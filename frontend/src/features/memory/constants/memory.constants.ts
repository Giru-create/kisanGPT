// ─────────────────────────────────────────────────────────────────────────────
// memory.constants.ts
// KisanGPT — Farm Memory feature constants & mock items
// ─────────────────────────────────────────────────────────────────────────────

import type {
  MemoryCategory,
  FarmMemoryItem,
  PersonalizedRecommendation,
} from "../types/memory.types";

export const MEMORY_CATEGORIES: Array<{
  id: MemoryCategory;
  label: string;
  labelHi: string;
  iconName: string;
}> = [
  {
    id: "all",
    label: "All Memories",
    labelHi: "सभी यादें",
    iconName: "Layers",
  },
  {
    id: "soil",
    label: "Soil & Land",
    labelHi: "मिट्टी और भूमि",
    iconName: "Layers",
  },
  {
    id: "crop_yield",
    label: "Crop Yields",
    labelHi: "फसल उपज",
    iconName: "Wheat",
  },
  {
    id: "disease_history",
    label: "Disease History",
    labelHi: "बीमारी इतिहास",
    iconName: "Bug",
  },
  {
    id: "irrigation",
    label: "Irrigation",
    labelHi: "सिंचाई रिकॉर्ड",
    iconName: "Droplets",
  },
  {
    id: "fertilizer",
    label: "Fertilizers",
    labelHi: "उर्वरक उपयोग",
    iconName: "FlaskConical",
  },
  {
    id: "custom_note",
    label: "Farm Notes",
    labelHi: "किसान नोट्स",
    iconName: "FileText",
  },
];

export const MOCK_FARM_MEMORIES: FarmMemoryItem[] = [
  {
    id: "mem-1",
    category: "soil",
    title: "Karnal Farm Soil Test Results",
    description:
      "Soil analysis indicates pH 7.2 with slight deficiency in Organic Carbon (0.42%) and Potassium. Recommended addition of farmyard manure.",
    timestamp: "2026-06-15T10:30:00Z",
    location: "Karnal, Haryana",
    cropName: "Wheat / Paddy Rotation",
    metrics: {
      ph: 7.2,
      nitrogen: 180,
      phosphorus: 22,
      potassium: 110,
    },
    tags: ["Soil Health", "Karnal", "Organic Carbon"],
    isVerified: true,
  },
  {
    id: "mem-2",
    category: "crop_yield",
    title: "Rabi Season Wheat Harvesting Yield (PBW 550)",
    description:
      "Harvested 24.5 quintals per acre across Field 2. Sold at Karnal APMC Mandi at ₹2,275/qtl.",
    timestamp: "2026-04-20T14:15:00Z",
    location: "Karnal, Haryana",
    cropName: "Wheat (PBW 550)",
    season: "Rabi 2025-26",
    metrics: {
      yield_quintals: 24.5,
      area_acres: 3,
    },
    tags: ["Rabi", "Wheat", "Mandi"],
    isVerified: true,
  },
  {
    id: "mem-3",
    category: "disease_history",
    title: "Yellow Rust Spotting in Wheat Crop",
    description:
      "Spotted early yellow rust lesions on lower leaves. Treated with Propiconazole 25% EC (200ml/acre) within 48 hours. Spread successfully arrested.",
    timestamp: "2026-02-10T09:00:00Z",
    location: "Karnal, Haryana",
    cropName: "Wheat",
    season: "Rabi 2025-26",
    tags: ["Yellow Rust", "Fungicide", "Resolved"],
    isVerified: true,
  },
  {
    id: "mem-4",
    category: "irrigation",
    title: "Drip Irrigation & Canal Water Log",
    description:
      "Completed 4th irrigation cycle using canal supply supplemented with tube-well drip irrigation for 5 hours per plot.",
    timestamp: "2026-01-28T16:00:00Z",
    location: "Karnal, Haryana",
    cropName: "Wheat",
    metrics: {
      water_liters: 12000,
      area_acres: 3,
    },
    tags: ["Drip Irrigation", "Canal Water"],
    isVerified: false,
  },
  {
    id: "mem-5",
    category: "fertilizer",
    title: "Basal Fertilizer Application (N P K)",
    description:
      "Applied DAP (50kg/acre) and Urea (45kg/acre) split dose during first irrigation stage.",
    timestamp: "2025-11-15T08:30:00Z",
    location: "Karnal, Haryana",
    cropName: "Wheat",
    tags: ["DAP", "Urea", "Nutrient Management"],
    isVerified: true,
  },
];

export const MOCK_RECOMMENDATIONS: PersonalizedRecommendation[] = [
  {
    id: "rec-1",
    title: "Potassium Top-Dressing Recommended for Field 2",
    description:
      "Based on your June 2026 soil test showing 110 kg/ha Potassium, apply MOP (Muriate of Potash) @ 20kg/acre during next crop cycle to prevent leaf tip burning.",
    impact: "high",
    category: "Soil & Nutrient Management",
    actionLabel: "View Nutrient Advice",
    targetRoute: "/chat",
    dateGenerated: "2026-07-20T08:00:00Z",
    basedOnMemories: ["mem-1", "mem-5"],
  },
  {
    id: "rec-2",
    title: "Pre-Emptive Rust Monitoring for Next Rabi Season",
    description:
      "Since Yellow Rust was recorded in your farm history in Feb 2026, select resistant wheat varieties like DBW 187 or HD 3226 for the upcoming sowing season.",
    impact: "high",
    category: "Crop Protection",
    actionLabel: "Ask KisanGPT Doctor",
    targetRoute: "/disease",
    dateGenerated: "2026-07-18T10:00:00Z",
    basedOnMemories: ["mem-3"],
  },
  {
    id: "rec-3",
    title: "Optimal Paddy-to-Mustard Crop Rotation Advice",
    description:
      "Your historical yield logs show 24.5 qtl/acre wheat yield. Rotating with Mustard (Sarson) or Moong pulse will restore organic nitrogen and cut fertilizer expense by 15%.",
    impact: "medium",
    category: "Crop Planning",
    actionLabel: "Explore Crop Trends",
    targetRoute: "/market",
    dateGenerated: "2026-07-15T12:00:00Z",
    basedOnMemories: ["mem-1", "mem-2"],
  },
];
