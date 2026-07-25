// ─────────────────────────────────────────────────────────────────────────────
// dashboard.types.ts
// KisanGPT — Farmer Dashboard feature types
// ─────────────────────────────────────────────────────────────────────────────

import type { WeatherCondition } from "@/features/weather/types/weather.types";

// ---------------------------------------------------------------------------
// Farmer Profile & Greeting (Section 1)
// ---------------------------------------------------------------------------

export interface FarmerProfile {
  name: string;
  greetingPrefix: string; // e.g. "Ram Ram" / "Sat Sri Akal"
  village: string;
  district: string;
  state: string;
  activeCrop: string;
  cropSeason: string; // e.g. "Rabi Season 2026"
  farmSizeAcres: number;
}

// ---------------------------------------------------------------------------
// Emergency Alert (Section 11)
// ---------------------------------------------------------------------------

export type EmergencySeverity = "warning" | "critical";

export interface EmergencyAlert {
  id: string;
  severity: EmergencySeverity;
  title: string;
  message: string;
  actionAdvice: string;
  issuedAt: Date;
  dismissible: boolean;
}

// ---------------------------------------------------------------------------
// Crop Health Summary (Section 4)
// ---------------------------------------------------------------------------

export interface CropFieldStatus {
  id: string;
  fieldName: string;
  cropName: string;
  healthPercent: number; // 0-100
  status: "healthy" | "at_risk" | "action_required";
  lastScanResult?: string;
  lastScanDate?: Date;
  nextAction?: string;
}

// ---------------------------------------------------------------------------
// Mandi Market Price (Section 5)
// ---------------------------------------------------------------------------

export interface MandiPriceItem {
  id: string;
  commodity: string;
  variety: string;
  mandiName: string;
  pricePerQuintal: number;
  changeAmount: number;
  changePercent: number;
  isRise: boolean;
  mspDifference: number; // Difference from Minimum Support Price
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Government Scheme (Section 6)
// ---------------------------------------------------------------------------

export interface GovtSchemeItem {
  id: string;
  title: string;
  category: string;
  benefitAmount: string; // e.g. "₹2,000 Direct Transfer"
  statusBadge: "Eligible" | "Action Needed" | "Applied" | "Approved";
  deadline?: string;
  summary: string;
}

// ---------------------------------------------------------------------------
// Recent Activity Log (Section 9)
// ---------------------------------------------------------------------------

export type ActivityType = "scan" | "chat" | "mandi" | "scheme" | "irrigation";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  targetHref?: string;
}

// ---------------------------------------------------------------------------
// Notification Item (Section 10)
// ---------------------------------------------------------------------------

export type NotificationCategory = "reminder" | "alert" | "update";

export interface DashboardNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// ---------------------------------------------------------------------------
// Aggregated Dashboard Data
// ---------------------------------------------------------------------------

export interface DashboardData {
  profile: FarmerProfile;
  emergencyAlert?: EmergencyAlert;
  weatherSummary: {
    temperatureC: number;
    feelsLikeC: number;
    condition: WeatherCondition;
    humidity: number;
    windSpeedKmh: number;
    advisory: string;
    advisorySafe: boolean;
  };
  cropFields: CropFieldStatus[];
  mandiPrices: MandiPriceItem[];
  schemes: GovtSchemeItem[];
  recentActivities: ActivityItem[];
  notifications: DashboardNotification[];
}

// ---------------------------------------------------------------------------
// UI State (Discriminated Union)
// ---------------------------------------------------------------------------

export type DashboardUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: DashboardData }
  | { status: "error"; message: string };
