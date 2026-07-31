// ─────────────────────────────────────────────────────────────────────────────
// schemes.constants.ts
// KisanGPT — Government Schemes constants and mock data
// ─────────────────────────────────────────────────────────────────────────────

import type {
  HeroSchemeBrief,
  AIRecommendation,
  ApplicationTrackerItem,
  SchemeNotification,
  AIQuestion,
  SavedScheme,
} from "../types/schemes.types";

// ---------------------------------------------------------------------------
// Application status config
// ---------------------------------------------------------------------------

export const APPLICATION_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: string;
  }
> = {
  not_started: {
    label: "Not Started",
    color: "text-muted-foreground",
    bg: "bg-muted",
    icon: "\u25CB",
  },
  documents_pending: {
    label: "Documents Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: "\uD83D\uDCC4",
  },
  applied: {
    label: "Applied",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: "\u2709",
  },
  under_review: {
    label: "Under Review",
    color: "text-violet-600",
    bg: "bg-violet-50",
    icon: "\uD83D\uDD0D",
  },
  approved: {
    label: "Approved",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: "\u2705",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: "\u274C",
  },
  benefit_received: {
    label: "Benefit Received",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: "\uD83D\uDCB0",
  },
};

// ---------------------------------------------------------------------------
// Notification type config
// ---------------------------------------------------------------------------

export const NOTIFICATION_TYPE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  deadline: {
    label: "Deadline",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: "\u23F0",
  },
  document_reminder: {
    label: "Document Reminder",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: "\uD83D\uDCCB",
  },
  approval_update: {
    label: "Approval Update",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: "\u2705",
  },
  new_scheme: {
    label: "New Scheme",
    color: "text-violet-600",
    bg: "bg-violet-50",
    icon: "\u2B50",
  },
  policy_update: {
    label: "Policy Update",
    color: "text-slate-600",
    bg: "bg-slate-50",
    icon: "\uD83D\uDCCA",
  },
};

// ---------------------------------------------------------------------------
// Scheme category config
// ---------------------------------------------------------------------------

export const SCHEME_CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  "Direct Benefit": {
    label: "Direct Benefit",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  Insurance: {
    label: "Insurance",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  Irrigation: {
    label: "Irrigation",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  Advisory: {
    label: "Advisory",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  Credit: {
    label: "Credit",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  Subsidy: {
    label: "Subsidy",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
};

// ---------------------------------------------------------------------------
// Hero mock data
// ---------------------------------------------------------------------------

export const MOCK_HERO_BRIEF: HeroSchemeBrief = {
  totalEligibleSchemes: 12,
  estimatedTotalBenefits: "\u20B948,500",
  recentlyAddedCount: 3,
  upcomingDeadlines: 2,
  topCategories: [
    { label: "Income Support", count: 4, icon: "\uD83D\uDCB3" },
    { label: "Insurance", count: 3, icon: "\uD83D\uDEE1\uFE0F" },
    { label: "Subsidy", count: 3, icon: "\uD83C\uDF31" },
    { label: "Credit", count: 2, icon: "\uD83D\uDCB0" },
  ],
};

// ---------------------------------------------------------------------------
// AI Recommendation mock data
// ---------------------------------------------------------------------------

export const MOCK_AI_RECOMMENDATION: AIRecommendation = {
  scheme: {
    id: "pm-kisan",
    title: "PM-KISAN Samman Nidhi",
    category: "Direct Benefit",
    description:
      "Pradhan Mantri Kisan Samman Nidhi provides income support of \u20B96,000 per year to small and marginal farmer families, paid in 3 equal installments of \u20B92,000 each via direct benefit transfer.",
    eligibility:
      "All small and marginal farmer families with cultivable land. Subject to certain exclusion criteria for institutional landholders.",
    benefits: "\u20B96,000 per year in 3 installments of \u20B92,000 each.",
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
    benefitAmount: "\u20B96,000/year",
    summary:
      "Income support of \u20B96,000 per year paid in 3 installments to farmer families.",
    state: null,
    crop: null,
    farmerCategory: "small",
    schemeType: "income_support",
  },
  confidence: 0.95,
  estimatedBenefit: "\u20B96,000 per year",
  whyItMatches:
    "Based on your farm profile as a small farmer with 1.2 acres of cultivable land, you are eligible for direct income support under PM-KISAN. This scheme provides unconditional income support with no application fees.",
  requiredActions: [
    "Ensure Aadhaar is linked to your bank account",
    "Verify land records are updated",
    "Apply online at pmkisan.gov.in",
  ],
  isTopRecommendation: true,
};

// ---------------------------------------------------------------------------
// Application tracker mock data
// ---------------------------------------------------------------------------

export const MOCK_APPLICATIONS: ApplicationTrackerItem[] = [
  {
    id: "app-1",
    schemeId: "pm-kisan",
    schemeName: "PM-KISAN Samman Nidhi",
    currentStatus: "approved",
    appliedDate: "2025-11-15",
    lastUpdated: "2025-12-20",
    estimatedCompletion: null,
    statusHistory: [
      {
        status: "not_started",
        date: "2025-11-01",
        note: "Application not yet started",
      },
      {
        status: "documents_pending",
        date: "2025-11-10",
        note: "Gathering Aadhaar and land records",
      },
      {
        status: "applied",
        date: "2025-11-15",
        note: "Application submitted via pmkisan.gov.in",
      },
      {
        status: "under_review",
        date: "2025-11-20",
        note: "Verification by local revenue officer",
      },
      {
        status: "approved",
        date: "2025-12-20",
        note: "Approved. First installment of \u20B92,000 credited.",
      },
    ],
  },
  {
    id: "app-2",
    schemeId: "pmfby",
    schemeName: "PM Fasal Bima Yojana",
    currentStatus: "applied",
    appliedDate: "2026-01-10",
    lastUpdated: "2026-01-10",
    estimatedCompletion: "2026-03-15",
    statusHistory: [
      {
        status: "not_started",
        date: "2025-12-01",
        note: "Reviewing crop insurance options",
      },
      {
        status: "documents_pending",
        date: "2025-12-20",
        note: "Need sowing certificate from village patwari",
      },
      {
        status: "applied",
        date: "2026-01-10",
        note: "Applied through bank branch with required documents",
      },
    ],
  },
  {
    id: "app-3",
    schemeId: "pmksy",
    schemeName: "PM Krishi Sinchayee Yojana",
    currentStatus: "documents_pending",
    appliedDate: null,
    lastUpdated: "2026-01-18",
    estimatedCompletion: null,
    statusHistory: [
      {
        status: "not_started",
        date: "2025-12-15",
        note: "Interested in drip irrigation subsidy",
      },
      {
        status: "documents_pending",
        date: "2026-01-18",
        note: "Collecting water source proof and bank details",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Notifications mock data
// ---------------------------------------------------------------------------

export const MOCK_NOTIFICATIONS: SchemeNotification[] = [
  {
    id: "notif-1",
    type: "deadline",
    title: "PM-KISAN 16th Installment",
    message:
      "Ensure your Aadhaar and bank details are linked before the next installment date.",
    schemeId: "pm-kisan",
    schemeName: "PM-KISAN Samman Nidhi",
    createdAt: "2026-01-25",
    isRead: false,
  },
  {
    id: "notif-2",
    type: "document_reminder",
    title: "Sowing Certificate Needed",
    message:
      "Your PMFBY application requires a sowing certificate. Contact your local patwari.",
    schemeId: "pmfby",
    schemeName: "PM Fasal Bima Yojana",
    createdAt: "2026-01-20",
    isRead: false,
  },
  {
    id: "notif-3",
    type: "approval_update",
    title: "PM-KISAN Approved",
    message:
      "Your PM-KISAN application has been approved. First installment of \u20B92,000 credited.",
    schemeId: "pm-kisan",
    schemeName: "PM-KISAN Samman Nidhi",
    createdAt: "2025-12-20",
    isRead: true,
  },
  {
    id: "notif-4",
    type: "new_scheme",
    title: "New: Organic Farming Subsidy",
    message:
      "A new scheme for organic farming subsidies has been announced. Check your eligibility.",
    schemeId: null,
    schemeName: null,
    createdAt: "2026-01-22",
    isRead: false,
  },
  {
    id: "notif-5",
    type: "deadline",
    title: "KCC Renewal Due",
    message:
      "Your Kisan Credit Card is due for renewal. Visit your bank branch before Feb 28.",
    schemeId: "kcc",
    schemeName: "Kisan Credit Card",
    createdAt: "2026-01-28",
    isRead: false,
  },
];

// ---------------------------------------------------------------------------
// AI Assistant suggested questions
// ---------------------------------------------------------------------------

export const MOCK_AI_QUESTIONS: AIQuestion[] = [
  {
    id: "q1",
    question: "Am I eligible for PM-KISAN?",
    answer:
      "Yes, as a small farmer with cultivable land, you are eligible for PM-KISAN. You will receive \u20B96,000 per year in 3 installments of \u20B92,000 each via direct benefit transfer to your linked bank account.",
    relatedSchemeIds: ["pm-kisan"],
  },
  {
    id: "q2",
    question: "What documents do I need for crop insurance?",
    answer:
      "For PMFBY (crop insurance), you need: Aadhaar card, land records, sowing certificate from your local authority, and bank passbook. Apply through your bank or CSC before the sowing season.",
    relatedSchemeIds: ["pmfby"],
  },
  {
    id: "q3",
    question: "Can I apply for PM-KISAN online?",
    answer:
      "Yes, you can apply online at pmkisan.gov.in. You can also visit your nearest Common Service Centre (CSC) with your Aadhaar card, bank passbook, and land records.",
    relatedSchemeIds: ["pm-kisan"],
  },
  {
    id: "q4",
    question: "What are the benefits of Kisan Credit Card?",
    answer:
      "Kisan Credit Card provides crop loans at 4% p.a. interest (with prompt repayment rebate). It covers crop production, post-harvest expenses, and farm maintenance costs.",
    relatedSchemeIds: ["kcc"],
  },
  {
    id: "q5",
    question: "Which scheme gives the highest subsidy for irrigation?",
    answer:
      "PM Krishi Sinchayee Yojana (PMKSY) provides up to 55% subsidy for micro-irrigation equipment including drip and sprinkler systems. This is the highest irrigation subsidy available.",
    relatedSchemeIds: ["pmksy"],
  },
];

// ---------------------------------------------------------------------------
// Saved schemes mock data
// ---------------------------------------------------------------------------

export const MOCK_SAVED_SCHEMES: SavedScheme[] = [
  {
    schemeId: "pm-kisan",
    savedAt: "2026-01-15",
    note: "Applied and approved",
  },
  {
    schemeId: "kcc",
    savedAt: "2026-01-20",
    note: "Want to apply for crop loan",
  },
];

// ---------------------------------------------------------------------------
// Suggested search terms
// ---------------------------------------------------------------------------

export const SUGGESTED_SEARCHES = [
  { label: "PM-KISAN", icon: "\uD83C\uDF3E" },
  { label: "PMFBY", icon: "\uD83D\uDEE1\uFE0F" },
  { label: "Kisan Credit Card", icon: "\uD83D\uDCB3" },
  { label: "Soil Health Card", icon: "\uD83C\uDF31" },
  { label: "Micro Irrigation", icon: "\uD83D\uDCA7" },
];

// ---------------------------------------------------------------------------
// Eligibility checklist for detail view
// ---------------------------------------------------------------------------

export const MOCK_ELIGIBILITY_CHECKLIST = [
  { label: "Indian citizen", checked: true },
  { label: "Cultivable land owner", checked: true },
  { label: "Small or marginal farmer", checked: true },
  { label: "Aadhaar linked to bank", checked: true },
  { label: "Not institutional landholder", checked: true },
  { label: "Not retired pensioner", checked: true },
];

// ---------------------------------------------------------------------------
// FAQ mock data for detail view
// ---------------------------------------------------------------------------

export const MOCK_FAQS = [
  {
    question: "How often are installments paid?",
    answer:
      "Installments are paid every 4 months. The three installment periods are: April-July, August-November, and December-March.",
  },
  {
    question: "What if my application is rejected?",
    answer:
      "If rejected, you can check the rejection reason on pmkisan.gov.in. Common reasons include Aadhaar mismatch or land record issues. You can reapply after fixing the issue.",
  },
  {
    question: "Can I check my payment status?",
    answer:
      "Yes, visit pmkisan.gov.in and click on 'Beneficiary Status'. Enter your Aadhaar number or bank account number to check payment status.",
  },
  {
    question: "Is there any application fee?",
    answer:
      "No, there is no application fee for PM-KISAN. The scheme is completely free for eligible farmers.",
  },
];
