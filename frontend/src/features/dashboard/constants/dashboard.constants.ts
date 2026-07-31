// ─────────────────────────────────────────────────────────────────────────────
// dashboard.constants.ts
// KisanGPT — Farmer Dashboard constants
// ─────────────────────────────────────────────────────────────────────────────

import type { DashboardData } from "../types/dashboard.types";

export const QUICK_PROMPTS = [
  "How much Urea per acre for Wheat?",
  "Yellow rust symptoms on Wheat",
  "Will it rain in Karnal tomorrow?",
  "Current Mandi price of Mustard",
];

export const DEFAULT_DASHBOARD_DATA: DashboardData = {
  profile: {
    name: "Farmer",
    greetingPrefix: "Hello",
    village: "",
    district: "",
    state: "",
    activeCrop: "",
    cropSeason: "",
    farmSizeAcres: 0,
  },
  emergencyAlert: undefined,
  weatherSummary: {
    temperatureC: 0,
    feelsLikeC: 0,
    condition: "sunny",
    humidity: 0,
    windSpeedKmh: 0,
    advisory: "No weather data available.",
    advisorySafe: true,
  },
  cropFields: [],
  cropHealthCards: [],
  mandiPrices: [],
  marketTrends: [],
  aiAdvisorChats: [],
  priorityAlerts: [],
  schemes: [],
  recentActivities: [],
  notifications: [],
};
