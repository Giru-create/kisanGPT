// ─────────────────────────────────────────────────────────────────────────────
// schemesMock.ts
// KisanGPT — Government Schemes Mock Service
// Provides fallback data when backend endpoints are unavailable
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Scheme,
  SchemeListResponse,
  SchemeDetailResponse,
  SchemeFilters,
} from "../types/schemes.types";

const MOCK_DELAY_MS = 800;

const mockDelay = (ms: number = MOCK_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    title: "PM-KISAN Samman Nidhi",
    category: "Direct Benefit",
    description:
      "Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to small and marginal farmer families, paid in 3 equal installments of ₹2,000 each via direct benefit transfer.",
    eligibility:
      "All small and marginal farmer families with cultivable land. Subject to certain exclusion criteria for institutional landholders.",
    benefits: "₹6,000 per year in 3 installments of ₹2,000 each.",
    requiredDocuments: [
      "Aadhaar card",
      "Bank passbook",
      "Land records (Khata/Khasra)",
    ],
    applicationProcess:
      "Apply online at pmkisan.gov.in or visit nearest CSC centre.",
    deadline: null,
    officialLink: "https://pmkisan.gov.in",
    statusBadge: "Eligible",
    benefitAmount: "₹6,000/year",
    summary:
      "Income support of ₹6,000 per year paid in 3 installments to farmer families.",
    state: null,
    crop: null,
    farmerCategory: "small",
    schemeType: "income_support",
  },
  {
    id: "pmfby",
    title: "Pradhan Mantri Fasal Bima Yojana",
    category: "Insurance",
    description:
      "Crop insurance scheme providing comprehensive insurance cover against crop loss due to natural calamities, pests, and diseases.",
    eligibility:
      "All farmers including sharecroppers and tenant farmers. Kharif: 2% premium, Rabi: 1.5% premium, Commercial: 5% premium.",
    benefits: "Full crop loss coverage at subsidized premium rates.",
    requiredDocuments: [
      "Aadhaar card",
      "Land records",
      "Sowing certificate",
      "Bank passbook",
    ],
    applicationProcess:
      "Apply through bank, CSC, or insurance company within sowing period.",
    deadline: "Before sowing season begins",
    officialLink: "https://pmfby.gov.in",
    statusBadge: "Action Needed",
    benefitAmount: "Full crop coverage",
    summary:
      "Crop insurance at 1-5% premium covering natural calamities, pests, and diseases.",
    state: null,
    crop: null,
    farmerCategory: "all",
    schemeType: "insurance",
  },
  {
    id: "pmksy",
    title: "Pradhatri Krishi Sinchayee Yojana",
    category: "Irrigation",
    description:
      "Promotes micro-irrigation including drip and sprinkler systems to improve water use efficiency and expand irrigated area.",
    eligibility: "All farmers with focus on small and marginal farmers.",
    benefits: "Up to 55% subsidy for micro-irrigation equipment.",
    requiredDocuments: [
      "Aadhaar card",
      "Land records",
      "Bank passbook",
      "Water source proof",
    ],
    applicationProcess:
      "Apply through state agriculture department or online portal.",
    deadline: "15 Feb 2026",
    officialLink: "https://pmksy.gov.in",
    statusBadge: "Action Needed",
    benefitAmount: "Up to 55% Subsidy",
    summary:
      "Get subsidized drip and sprinkler irrigation systems with up to 55% subsidy.",
    state: null,
    crop: null,
    farmerCategory: "small",
    schemeType: "subsidy",
  },
  {
    id: "soil-health-card",
    title: "Soil Health Card Scheme",
    category: "Advisory",
    description:
      "Provides soil health cards to farmers with crop-wise recommendations on nutrients and fertilizers.",
    eligibility: "All farmers.",
    benefits: "Free soil testing and personalized fertilizer recommendations.",
    requiredDocuments: ["Aadhaar card", "Land records"],
    applicationProcess: "Visit nearest soil testing laboratory or CSC centre.",
    deadline: null,
    officialLink: "https://soilhealth.dac.gov.in",
    statusBadge: "Eligible",
    benefitAmount: "Free soil testing",
    summary:
      "Free soil health card with crop-wise nutrient and fertilizer recommendations.",
    state: null,
    crop: null,
    farmerCategory: "all",
    schemeType: "training",
  },
  {
    id: "kcc",
    title: "Kisan Credit Card",
    category: "Credit",
    description:
      "Provides affordable credit to farmers for agricultural needs including crop production, post-harvest expenses, and maintenance.",
    eligibility: "All farmers, fishermen, and animal husbandry farmers.",
    benefits: "Crop loan at 4% p.a. (with prompt repayment rebate).",
    requiredDocuments: [
      "Aadhaar card",
      "Land records",
      "Bank passbook",
      "Passport-size photograph",
    ],
    applicationProcess: "Apply at nearest bank branch with required documents.",
    deadline: null,
    officialLink:
      "https://www.india.gov.in/programmes/pradhan-mantri-kisan-samman-nidhi/kisan-credit-card",
    statusBadge: "Eligible",
    benefitAmount: "4% p.a. interest",
    summary:
      "Credit card for farmers offering crop loans at subsidized interest rates.",
    state: null,
    crop: null,
    farmerCategory: "all",
    schemeType: "income_support",
  },
];

function filterSchemes(
  schemes: Scheme[],
  filters: Partial<SchemeFilters>,
): Scheme[] {
  let result = [...schemes];

  if (filters.state) {
    const s = filters.state.toLowerCase();
    result = result.filter((sc) => !sc.state || sc.state.toLowerCase() === s);
  }
  if (filters.crop) {
    const c = filters.crop.toLowerCase();
    result = result.filter((sc) => !sc.crop || sc.crop.toLowerCase() === c);
  }
  if (filters.farmerCategory) {
    const fc = filters.farmerCategory.toLowerCase();
    result = result.filter(
      (sc) =>
        !sc.farmerCategory ||
        sc.farmerCategory.toLowerCase() === fc ||
        sc.farmerCategory.toLowerCase() === "all",
    );
  }
  if (filters.schemeType) {
    const st = filters.schemeType.toLowerCase();
    result = result.filter(
      (sc) => sc.schemeType && sc.schemeType.toLowerCase() === st,
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (sc) =>
        sc.title.toLowerCase().includes(q) ||
        sc.description.toLowerCase().includes(q) ||
        sc.category.toLowerCase().includes(q) ||
        sc.summary.toLowerCase().includes(q),
    );
  }

  return result;
}

export const schemesMockService = {
  list: async (
    filters: Partial<SchemeFilters> = {},
  ): Promise<SchemeListResponse> => {
    await mockDelay();
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const filtered = filterSchemes(MOCK_SCHEMES, filters);
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return {
      schemes: paged,
      totalCount: filtered.length,
      page,
      pageSize,
      generatedAt: new Date().toISOString(),
    };
  },

  get: async (schemeId: string): Promise<SchemeDetailResponse> => {
    await mockDelay();
    const scheme = MOCK_SCHEMES.find((s) => s.id === schemeId);
    if (!scheme) {
      throw new Error(`Scheme not found: ${schemeId}`);
    }
    return {
      scheme,
      generatedAt: new Date().toISOString(),
    };
  },
};
