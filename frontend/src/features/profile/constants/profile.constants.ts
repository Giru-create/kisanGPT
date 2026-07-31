// ─────────────────────────────────────────────────────────────────────────────
// profile.constants.ts
// KisanGPT — Farmer Profile feature constants & mock data
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ProfileData,
  Achievement,
  ActivityItem,
  FarmDocument,
  ProfileTab,
} from "../types/profile.types";

export const PROFILE_TABS: Array<{
  id: ProfileTab;
  label: string;
  icon: string;
}> = [
  { id: "overview", label: "Overview", icon: "👤" },
  { id: "farm", label: "Farm", icon: "🌾" },
  { id: "personal", label: "Personal", icon: "📋" },
  { id: "ai", label: "AI Insights", icon: "🤖" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "activity", label: "Activity", icon: "📊" },
  { id: "documents", label: "Documents", icon: "📁" },
  { id: "privacy", label: "Privacy", icon: "🔒" },
];

export const MEMBERSHIP_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  free: {
    label: "Free",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
  },
  basic: {
    label: "Basic",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  premium: {
    label: "Premium",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  enterprise: {
    label: "Enterprise",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
};

export const ACTIVITY_TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; color: string; bg: string }
> = {
  ai_chat: {
    label: "AI Chat",
    icon: "💬",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  disease_scan: {
    label: "Disease Scan",
    icon: "🔍",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  weather_check: {
    label: "Weather Check",
    icon: "🌤️",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  market_check: {
    label: "Market Check",
    icon: "📈",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  recommendation_saved: {
    label: "Saved Recommendation",
    icon: "🔖",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  report_downloaded: {
    label: "Report Downloaded",
    icon: "📄",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  scheme_application: {
    label: "Scheme Application",
    icon: "🏛️",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
};

export const DOCUMENT_TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; color: string; bg: string }
> = {
  land_record: {
    label: "Land Record",
    icon: "🗺️",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  soil_health: {
    label: "Soil Health",
    icon: "🌱",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  insurance: {
    label: "Insurance",
    icon: "🛡️",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  government_id: {
    label: "Government ID",
    icon: "🪪",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  certificate: {
    label: "Certificate",
    icon: "📜",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  image: {
    label: "Image",
    icon: "🖼️",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  farm_document: {
    label: "Farm Document",
    icon: "📑",
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    category: "early_adopter",
    title: "Early Adopter",
    description: "Joined KisanGPT in the first 1000 farmers",
    icon: "🌟",
    unlockedAt: "2025-06-15T00:00:00Z",
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
  },
  {
    id: "ach-2",
    category: "ai_explorer",
    title: "AI Explorer",
    description: "Completed 50 conversations with KisanGPT AI",
    icon: "🤖",
    unlockedAt: "2025-09-20T00:00:00Z",
    progress: 50,
    maxProgress: 50,
    isUnlocked: true,
  },
  {
    id: "ach-3",
    category: "disease_detective",
    title: "Disease Detective",
    description: "Successfully identified and treated 5 crop diseases",
    icon: "🔍",
    progress: 4,
    maxProgress: 5,
    isUnlocked: false,
  },
  {
    id: "ach-4",
    category: "market_expert",
    title: "Market Expert",
    description: "Checked market prices 100 times",
    icon: "📈",
    unlockedAt: "2026-01-10T00:00:00Z",
    progress: 100,
    maxProgress: 100,
    isUnlocked: true,
  },
  {
    id: "ach-5",
    category: "weather_ready",
    title: "Weather Ready",
    description: "Used weather intelligence for 30 farming decisions",
    icon: "🌤️",
    progress: 22,
    maxProgress: 30,
    isUnlocked: false,
  },
  {
    id: "ach-6",
    category: "scheme_expert",
    title: "Scheme Expert",
    description: "Applied for 3 government schemes through KisanGPT",
    icon: "🏛️",
    progress: 2,
    maxProgress: 3,
    isUnlocked: false,
  },
  {
    id: "ach-7",
    category: "sustainable_farmer",
    title: "Sustainable Farmer",
    description: "Practiced sustainable farming for 2 consecutive seasons",
    icon: "♻️",
    progress: 1,
    maxProgress: 2,
    isUnlocked: false,
  },
  {
    id: "ach-8",
    category: "smart_decision",
    title: "Smart Decision Maker",
    description: "Made 20 data-driven farming decisions with AI",
    icon: "🧠",
    unlockedAt: "2026-03-05T00:00:00Z",
    progress: 20,
    maxProgress: 20,
    isUnlocked: true,
  },
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "ai_chat",
    title: "Asked about wheat irrigation schedule",
    description:
      "KisanGPT recommended irrigating Field 1 and Field 2 every 8 days during the tillering stage.",
    timestamp: "2026-07-28T14:30:00Z",
  },
  {
    id: "act-2",
    type: "disease_scan",
    title: "Scanned wheat leaves for yellow rust",
    description:
      "AI detected early signs of yellow rust. Recommended Propiconazole treatment.",
    timestamp: "2026-07-27T09:15:00Z",
  },
  {
    id: "act-3",
    type: "weather_check",
    title: "Checked 7-day weather forecast",
    description:
      "Rain expected on July 30-31. KisanGPT advised postponing fertilizer application.",
    timestamp: "2026-07-26T07:00:00Z",
  },
  {
    id: "act-4",
    type: "market_check",
    title: "Checked wheat mandi prices",
    description:
      "Wheat price at Karnal APMC: ₹2,275/quintal. Price trend: upward.",
    timestamp: "2026-07-25T16:45:00Z",
  },
  {
    id: "act-5",
    type: "recommendation_saved",
    title: "Saved crop rotation recommendation",
    description:
      "Saved AI recommendation to rotate wheat with mustard for the upcoming Rabi season.",
    timestamp: "2026-07-24T11:20:00Z",
  },
  {
    id: "act-6",
    type: "scheme_application",
    title: "Applied for PM-KISAN scheme",
    description:
      "Submitted application for PM-KISAN Samman Nidhi through KisanGPT.",
    timestamp: "2026-07-22T10:00:00Z",
  },
  {
    id: "act-7",
    type: "report_downloaded",
    title: "Downloaded soil health report",
    description:
      "Downloaded comprehensive soil health analysis report for all 3 fields.",
    timestamp: "2026-07-20T08:30:00Z",
  },
  {
    id: "act-8",
    type: "ai_chat",
    title: "Asked about DAP fertilizer dosage",
    description:
      "KisanGPT recommended 50kg/acre DAP during first irrigation for wheat.",
    timestamp: "2026-07-18T15:10:00Z",
  },
];

export const MOCK_DOCUMENTS: FarmDocument[] = [
  {
    id: "doc-1",
    type: "land_record",
    name: "Land Record - Karnal Farm",
    fileName: "land_record_karnal.pdf",
    fileSize: 245000,
    uploadedAt: "2025-06-20T00:00:00Z",
    isVerified: true,
  },
  {
    id: "doc-2",
    type: "soil_health",
    name: "Soil Health Card 2026",
    fileName: "soil_health_2026.pdf",
    fileSize: 180000,
    uploadedAt: "2026-06-15T00:00:00Z",
    expiryDate: "2027-06-15T00:00:00Z",
    isVerified: true,
  },
  {
    id: "doc-3",
    type: "insurance",
    name: "PMFBY Insurance Policy",
    fileName: "pmfby_policy_2026.pdf",
    fileSize: 320000,
    uploadedAt: "2026-04-10T00:00:00Z",
    expiryDate: "2027-03-31T00:00:00Z",
    isVerified: true,
  },
  {
    id: "doc-4",
    type: "government_id",
    name: "Aadhaar Card",
    fileName: "aadhaar_card.pdf",
    fileSize: 150000,
    uploadedAt: "2025-06-15T00:00:00Z",
    isVerified: true,
  },
  {
    id: "doc-5",
    type: "certificate",
    name: "Farmer Certificate",
    fileName: "farmer_certificate.pdf",
    fileSize: 95000,
    uploadedAt: "2025-08-01T00:00:00Z",
    isVerified: false,
  },
];

export const MOCK_PRIVACY_SETTINGS = {
  dataSharing: true,
  aiMemory: true,
  locationTracking: false,
  analytics: true,
  marketing: false,
};

export const MOCK_CONNECTED_DEVICES = [
  {
    id: "dev-1",
    name: "Samsung Galaxy S24",
    type: "Mobile",
    lastActive: "2026-07-28T14:30:00Z",
    isCurrent: true,
  },
  {
    id: "dev-2",
    name: "Windows Laptop",
    type: "Desktop",
    lastActive: "2026-07-27T20:00:00Z",
    isCurrent: false,
  },
];

export const MOCK_LOGIN_SESSIONS = [
  {
    id: "sess-1",
    device: "Samsung Galaxy S24",
    location: "Karnal, Haryana",
    ipAddress: "103.21.58.xxx",
    loginTime: "2026-07-28T14:30:00Z",
    isActive: true,
  },
  {
    id: "sess-2",
    device: "Windows Laptop",
    location: "Karnal, Haryana",
    ipAddress: "103.21.58.xxx",
    loginTime: "2026-07-27T20:00:00Z",
    isActive: false,
  },
  {
    id: "sess-3",
    device: "Samsung Galaxy S24",
    location: "Karnal, Haryana",
    ipAddress: "103.21.58.xxx",
    loginTime: "2026-07-26T08:15:00Z",
    isActive: false,
  },
];

export const MOCK_PROFILE_DATA: ProfileData = {
  profile: {
    id: "farmer-001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    dateOfBirth: "1985-03-15",
    avatarUrl: undefined,
    preferredLanguage: "hi",
    state: "Haryana",
    district: "Karnal",
    village: "Gharaunda",
    occupation: "Farmer",
    farmingExperience: 18,
    membershipTier: "premium",
    membershipExpiry: "2027-06-15T00:00:00Z",
    lastSyncTime: "2026-07-28T14:30:00Z",
    createdAt: "2025-06-15T00:00:00Z",
  },
  farm: {
    farmName: "Kumar Family Farm",
    totalLandArea: 12,
    unit: "acres",
    numberOfFields: 3,
    primaryCrops: ["Wheat", "Paddy", "Mustard"],
    currentCropStage: "Wheat — Tillering Stage",
    soilType: "Alluvial Loam",
    waterSource: "Canal + Tube Well",
    irrigationMethod: "Drip + Flood",
    livestock: ["2 Buffaloes", "1 Cow"],
    coordinates: { lat: 29.6857, lng: 76.9906 },
  },
  fields: [
    {
      id: "field-1",
      name: "Field 1 — North",
      area: 4,
      crop: "Wheat (PBW 550)",
      stage: "Tillering",
      soilHealth: "good",
    },
    {
      id: "field-2",
      name: "Field 2 — East",
      area: 3.5,
      crop: "Wheat (HD 3226)",
      stage: "Tillering",
      soilHealth: "excellent",
    },
    {
      id: "field-3",
      name: "Field 3 — South",
      area: 4.5,
      crop: "Mustard (RLC 3)",
      stage: "Germination",
      soilHealth: "average",
    },
  ],
  equipment: [
    {
      id: "eq-1",
      name: "Sonalika DI 750",
      type: "Tractor",
      status: "active",
      lastServiced: "2026-06-01T00:00:00Z",
    },
    {
      id: "eq-2",
      name: "Drip Irrigation System",
      type: "Irrigation",
      status: "active",
      lastServiced: "2026-05-15T00:00:00Z",
    },
    {
      id: "eq-3",
      name: "Seed Drill",
      type: "Planting",
      status: "idle",
      lastServiced: "2025-11-01T00:00:00Z",
    },
  ],
  workers: [
    {
      id: "wk-1",
      name: "Suresh",
      role: "Farm Worker",
      phone: "+91 98765 11111",
      joinDate: "2024-01-15T00:00:00Z",
    },
    {
      id: "wk-2",
      name: "Ram Prasad",
      role: "Equipment Operator",
      phone: "+91 98765 22222",
      joinDate: "2025-03-01T00:00:00Z",
    },
  ],
  livestock: [
    { id: "ls-1", type: "Buffalo", count: 2, breed: "Murrah" },
    { id: "ls-2", type: "Cow", count: 1, breed: "HF Cross" },
  ],
  aiPersonalization: {
    knowledgeScore: 78,
    memoryCount: 12,
    recommendationsGenerated: 34,
    totalConversations: 156,
    savedReports: 8,
    voiceUsageHours: 12.5,
    profileCompleteness: 85,
    learningProgress: 72,
    topTopics: [
      { topic: "Irrigation", count: 45 },
      { topic: "Fertilizer", count: 38 },
      { topic: "Disease", count: 32 },
      { topic: "Market", count: 28 },
      { topic: "Weather", count: 25 },
    ],
    monthlyActivity: [
      { month: "Feb", conversations: 12 },
      { month: "Mar", conversations: 18 },
      { month: "Apr", conversations: 22 },
      { month: "May", conversations: 15 },
      { month: "Jun", conversations: 28 },
      { month: "Jul", conversations: 35 },
    ],
  },
  achievements: MOCK_ACHIEVEMENTS,
  recentActivity: MOCK_ACTIVITIES,
  documents: MOCK_DOCUMENTS,
  privacySettings: MOCK_PRIVACY_SETTINGS,
  connectedDevices: MOCK_CONNECTED_DEVICES,
  loginSessions: MOCK_LOGIN_SESSIONS,
};
