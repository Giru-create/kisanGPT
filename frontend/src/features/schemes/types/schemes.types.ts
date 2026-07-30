// ─────────────────────────────────────────────────────────────────────────────
// schemes.types.ts
// KisanGPT — Government Schemes feature types
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Scheme
// ---------------------------------------------------------------------------

export type SchemeStatusBadge =
  "Eligible" | "Action Needed" | "Applied" | "Approved";

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
// UI state (discriminated union)
// ---------------------------------------------------------------------------

export type SchemesUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: SchemeListResponse }
  | { status: "error"; message: string };
