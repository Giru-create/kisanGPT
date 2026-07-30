// ─────────────────────────────────────────────────────────────────────────────
// dashboard.constants.ts
// KisanGPT — Farmer Dashboard constants and mock data
// ─────────────────────────────────────────────────────────────────────────────

import type { DashboardData } from "../types/dashboard.types";

export const QUICK_PROMPTS = [
  "How much Urea per acre for Wheat?",
  "Yellow rust symptoms on Wheat",
  "Will it rain in Karnal tomorrow?",
  "Current Mandi price of Mustard",
];

export const MOCK_DASHBOARD_DATA: DashboardData = {
  profile: {
    name: "Kisan",
    greetingPrefix: "Good Morning",
    village: "Ludhiana",
    district: "Ludhiana",
    state: "Punjab",
    activeCrop: "Wheat (PBW 550)",
    cropSeason: "Rabi Season 2026",
    farmSizeAcres: 4.5,
  },
  emergencyAlert: {
    id: "alert-001",
    severity: "warning",
    title: "Heatwave Warning: 38\u00b0C Expected Tomorrow",
    message:
      "High temperature alert for Ludhiana district. Soil moisture loss will be rapid.",
    actionAdvice:
      "Irrigate Wheat fields early morning (5:30 AM \u2013 7:30 AM). Avoid field work from 11 AM to 4 PM.",
    issuedAt: new Date(Date.now() - 30 * 60 * 1000),
    dismissible: true,
  },
  weatherSummary: {
    temperatureC: 28,
    feelsLikeC: 30,
    condition: "partly-cloudy",
    humidity: 42,
    windSpeedKmh: 12,
    advisory:
      "Ideal conditions for field work. Low precipitation expected in the next 6 hours.",
    advisorySafe: true,
  },
  cropHealthCards: [
    {
      id: "crop-1",
      cropName: "Wheat",
      blockName: "Block A",
      daysSinceSown: 15,
      status: "healthy",
      moisturePercent: 78,
    },
    {
      id: "crop-2",
      cropName: "Cotton",
      blockName: "Block B",
      daysSinceSown: 42,
      status: "alert",
      moisturePercent: 45,
      alertMessage: "Pest Alert: Pink Bollworm detected via satellite infra.",
      recommendation: "Recommended: Organic pesticide application.",
    },
  ],
  cropFields: [
    {
      id: "field-1",
      fieldName: "Block A",
      cropName: "Wheat",
      healthPercent: 78,
      status: "healthy",
      lastScanResult: "No diseases detected",
      lastScanDate: new Date(Date.now() - 48 * 3600 * 1000),
      nextAction: "Irrigate in 2 days",
    },
    {
      id: "field-2",
      fieldName: "Block B",
      cropName: "Cotton",
      healthPercent: 45,
      status: "at_risk",
      lastScanResult: "Pink Bollworm detected",
      lastScanDate: new Date(Date.now() - 12 * 3600 * 1000),
      nextAction: "Apply organic pesticide",
    },
  ],
  marketTrends: [
    {
      id: "trend-1",
      commodity: "Wheat (Dara)",
      price: "\u20b92,450",
      changePercent: 2.4,
      isRise: true,
    },
    {
      id: "trend-2",
      commodity: "Basmati Rice",
      price: "\u20b94,200",
      changePercent: -0.8,
      isRise: false,
    },
    {
      id: "trend-3",
      commodity: "Cotton (Long Staple)",
      price: "\u20b97,820",
      changePercent: 1.2,
      isRise: true,
    },
  ],
  aiAdvisorChats: [
    {
      id: "chat-1",
      title: "Optimizing Drip Irrigation",
      description:
        "Calculated water requirement for Block C based on ET0 values...",
      timestamp: "2 Hours Ago",
      iconType: "water",
    },
    {
      id: "chat-2",
      title: "Pest Identification: Aphids",
      description:
        "Visual scan confirmed stage 1 infestation. Recommended Neem oil...",
      timestamp: "Yesterday",
      iconType: "pest",
    },
  ],
  priorityAlerts: [
    {
      id: "priority-1",
      title: "Frost Warning",
      description: "Temperatures expected to drop below 4\u00b0C in 48 hours.",
      type: "frost",
      borderColor: "border-red-500",
    },
    {
      id: "priority-2",
      title: "New Subsidy: PM-Kisan Update",
      description:
        "New solar pump subsidy application window open for your district.",
      type: "subsidy",
      borderColor: "border-emerald-500",
    },
  ],
  mandiPrices: [
    {
      id: "mandi-1",
      commodity: "Wheat",
      variety: "PBW 550 / FAQ",
      mandiName: "Ludhiana APMC Mandi",
      pricePerQuintal: 2450,
      changeAmount: 45,
      changePercent: 2.02,
      isRise: true,
      mspDifference: 25,
      updatedAt: new Date(Date.now() - 2 * 3600 * 1000),
    },
    {
      id: "mandi-2",
      commodity: "Basmati Rice",
      variety: "1121 Raw",
      mandiName: "Ludhiana Mandi",
      pricePerQuintal: 4200,
      changeAmount: -30,
      changePercent: -0.53,
      isRise: false,
      mspDifference: 420,
      updatedAt: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      id: "mandi-3",
      commodity: "Cotton",
      variety: "Long Staple",
      mandiName: "Ludhiana Mandi",
      pricePerQuintal: 7820,
      changeAmount: 80,
      changePercent: 1.89,
      isRise: true,
      mspDifference: 150,
      updatedAt: new Date(Date.now() - 5 * 3600 * 1000),
    },
  ],
  schemes: [
    {
      id: "scheme-1",
      title: "PM-KISAN 17th Installment",
      category: "Direct Income Support",
      benefitAmount: "\u20b92,000 Direct Credit",
      statusBadge: "Eligible",
      deadline: "Check e-KYC status by 15 Aug",
      summary:
        "Annual financial support of \u20b96,000 in three equal installments to farmer families.",
    },
    {
      id: "scheme-2",
      title: "Subsidized Drip Irrigation Scheme",
      category: "Equipment & Water Subsidy",
      benefitAmount: "85% Subsidy",
      statusBadge: "Action Needed",
      deadline: "Applications close 31 Aug",
      summary:
        "Government scheme providing 85% subsidy on micro-irrigation equipment for small farmers.",
    },
  ],
  recentActivities: [
    {
      id: "act-1",
      type: "scan",
      title: "Scanned Wheat Field Leaf",
      description: "No diseases detected. Crop health is optimal at 78%.",
      timestamp: new Date(Date.now() - 12 * 3600 * 1000),
      targetHref: "/disease",
    },
    {
      id: "act-2",
      type: "chat",
      title: "Asked about Urea Dosage",
      description: "KisanGPT advised 45 kg/acre split application for Wheat.",
      timestamp: new Date(Date.now() - 24 * 3600 * 1000),
      targetHref: "/voice",
    },
    {
      id: "act-3",
      type: "mandi",
      title: "Checked Ludhiana Mandi Rates",
      description: "Wheat price rose by \u20b945 to \u20b92,450/qnt.",
      timestamp: new Date(Date.now() - 36 * 3600 * 1000),
      targetHref: "/market",
    },
  ],
  notifications: [
    {
      id: "notif-1",
      category: "reminder",
      title: "Irrigation Reminder",
      message:
        "Tomorrow 6:00 AM is the ideal irrigation window for Wheat Field #1.",
      timestamp: new Date(Date.now() - 1 * 3600 * 1000),
      read: false,
    },
    {
      id: "notif-2",
      category: "alert",
      title: "Weather Shift Alert",
      message:
        "Humidity expected to rise to 85% on Thursday. High fungal disease risk.",
      timestamp: new Date(Date.now() - 4 * 3600 * 1000),
      read: false,
    },
    {
      id: "notif-3",
      category: "update",
      title: "PM-KISAN e-KYC Portal Active",
      message:
        "Verify your Aadhaar link to receive the 17th installment without delay.",
      timestamp: new Date(Date.now() - 18 * 3600 * 1000),
      read: true,
    },
  ],
};
