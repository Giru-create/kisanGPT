// ─────────────────────────────────────────────────────────────────────────────
// profile.types.ts
// KisanGPT — Farmer Profile feature types
// ─────────────────────────────────────────────────────────────────────────────

export type MembershipTier = "free" | "basic" | "premium" | "enterprise";

export type AchievementCategory =
  | "early_adopter"
  | "ai_explorer"
  | "disease_detective"
  | "market_expert"
  | "weather_ready"
  | "scheme_expert"
  | "sustainable_farmer"
  | "smart_decision";

export type ActivityType =
  | "ai_chat"
  | "disease_scan"
  | "weather_check"
  | "market_check"
  | "recommendation_saved"
  | "report_downloaded"
  | "scheme_application";

export type DocumentType =
  | "land_record"
  | "soil_health"
  | "insurance"
  | "government_id"
  | "certificate"
  | "image"
  | "farm_document";

export type PrivacySetting =
  | "data_sharing"
  | "ai_memory"
  | "location_tracking"
  | "analytics"
  | "marketing";

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  preferredLanguage:
    "hi" | "en" | "pa" | "gu" | "mr" | "ta" | "te" | "kn" | "bn";
  state: string;
  district: string;
  village: string;
  occupation: string;
  farmingExperience: number;
  membershipTier: MembershipTier;
  membershipExpiry?: string;
  lastSyncTime: string;
  createdAt: string;
}

export interface FarmOverview {
  farmName: string;
  totalLandArea: number;
  unit: "acres" | "hectares";
  numberOfFields: number;
  primaryCrops: string[];
  currentCropStage: string;
  soilType: string;
  waterSource: string;
  irrigationMethod: string;
  livestock: string[];
  coordinates?: { lat: number; lng: number };
}

export interface Field {
  id: string;
  name: string;
  area: number;
  crop: string;
  stage: string;
  soilHealth: "excellent" | "good" | "average" | "poor";
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: "active" | "maintenance" | "idle";
  lastServiced?: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  phone?: string;
  joinDate: string;
}

export interface LivestockEntry {
  id: string;
  type: string;
  count: number;
  breed?: string;
}

export interface AIPersonalizationData {
  knowledgeScore: number;
  memoryCount: number;
  recommendationsGenerated: number;
  totalConversations: number;
  savedReports: number;
  voiceUsageHours: number;
  profileCompleteness: number;
  learningProgress: number;
  topTopics: Array<{ topic: string; count: number }>;
  monthlyActivity: Array<{ month: string; conversations: number }>;
}

export interface Achievement {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface FarmDocument {
  id: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  expiryDate?: string;
  isVerified: boolean;
}

export interface PrivacySettings {
  dataSharing: boolean;
  aiMemory: boolean;
  locationTracking: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  loginTime: string;
  isActive: boolean;
}

export interface ProfileData {
  profile: FarmerProfile;
  farm: FarmOverview;
  fields: Field[];
  equipment: Equipment[];
  workers: Worker[];
  livestock: LivestockEntry[];
  aiPersonalization: AIPersonalizationData;
  achievements: Achievement[];
  recentActivity: ActivityItem[];
  documents: FarmDocument[];
  privacySettings: PrivacySettings;
  connectedDevices: ConnectedDevice[];
  loginSessions: LoginSession[];
}

export type ProfileTab =
  | "overview"
  | "farm"
  | "personal"
  | "ai"
  | "achievements"
  | "activity"
  | "documents"
  | "privacy";

export type ProfileUIState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: ProfileData };
