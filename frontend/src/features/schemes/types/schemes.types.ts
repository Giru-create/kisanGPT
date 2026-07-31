// ─────────────────────────────────────────────────────────────────────────────
// schemes.types.ts
// KisanGPT — Government Schemes feature types
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Scheme (existing)
// ---------------------------------------------------------------------------

export type SchemeStatusBadge =
  "Eligible" | "Action Needed" | "Applied" | "Approved" | "Closed";

export interface Scheme {
  id: string;
  title: string;
  category: string;
  description: string;
  eligibility: string;
  benefits: string;
  requiredDocuments: string[];
  applicationProcess: string;
  deadline: string | null;
  officialLink: string;
  statusBadge: SchemeStatusBadge;
  benefitAmount: string;
  summary: string;
  state: string | null;
  crop: string | null;
  farmerCategory: string | null;
  schemeType: string | null;
}

// ---------------------------------------------------------------------------
// List response
// ---------------------------------------------------------------------------

export interface SchemeListResponse {
  schemes: Scheme[];
  totalCount: number;
  page: number;
  pageSize: number;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Detail response
// ---------------------------------------------------------------------------

export interface SchemeDetailResponse {
  scheme: Scheme;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export interface SchemeFilters {
  state: string | null;
  crop: string | null;
  farmerCategory: string | null;
  schemeType: string | null;
  search: string;
  page: number;
  pageSize: number;
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

export interface HeroSchemeBrief {
  totalEligibleSchemes: number;
  estimatedTotalBenefits: string;
  recentlyAddedCount: number;
  upcomingDeadlines: number;
  topCategories: { label: string; count: number; icon: string }[];
}

// ---------------------------------------------------------------------------
// AI Recommendation
// ---------------------------------------------------------------------------

export interface AIRecommendation {
  scheme: Scheme;
  confidence: number;
  estimatedBenefit: string;
  whyItMatches: string;
  requiredActions: string[];
  isTopRecommendation: boolean;
}

// ---------------------------------------------------------------------------
// Application tracker
// ---------------------------------------------------------------------------

export type ApplicationStatus =
  | "not_started"
  | "documents_pending"
  | "applied"
  | "under_review"
  | "approved"
  | "rejected"
  | "benefit_received";

export interface ApplicationTrackerItem {
  id: string;
  schemeId: string;
  schemeName: string;
  currentStatus: ApplicationStatus;
  appliedDate: string | null;
  lastUpdated: string;
  statusHistory: { status: ApplicationStatus; date: string; note: string }[];
  estimatedCompletion: string | null;
}

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

export type NotificationType =
  | "deadline"
  | "document_reminder"
  | "approval_update"
  | "new_scheme"
  | "policy_update";

export interface SchemeNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  schemeId: string | null;
  schemeName: string | null;
  createdAt: string;
  isRead: boolean;
}

// ---------------------------------------------------------------------------
// AI Assistant
// ---------------------------------------------------------------------------

export interface AIQuestion {
  id: string;
  question: string;
  answer: string;
  relatedSchemeIds: string[];
}

// ---------------------------------------------------------------------------
// Saved scheme
// ---------------------------------------------------------------------------

export interface SavedScheme {
  schemeId: string;
  savedAt: string;
  note: string | null;
}

// ---------------------------------------------------------------------------
// UI state (discriminated union)
// ---------------------------------------------------------------------------

export type SchemesUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: SchemeListResponse }
  | { status: "error"; message: string };
