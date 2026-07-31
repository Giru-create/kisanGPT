// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Farmer Profile feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { ProfilePage } from "./components/ProfilePage";

// Components
export { ProfileHero } from "./components/ProfileHero";
export { FarmOverviewCard } from "./components/FarmOverview";
export { PersonalInfo } from "./components/PersonalInfo";
export { AIPersonalization } from "./components/AIPersonalization";
export { Achievements } from "./components/Achievements";
export { ActivityTimeline } from "./components/ActivityTimeline";
export { Documents } from "./components/Documents";
export { PrivacySecurity } from "./components/PrivacySecurity";
export { ProfileSkeleton } from "./components/ProfileSkeleton";

// Hooks
export { useProfile } from "./hooks/useProfile";
export {
  useProfileQuery,
  useUpdateProfileMutation,
  useUpdateFarmMutation,
  useUpdatePrivacyMutation,
  useDeleteAccountMutation,
} from "./hooks/useProfileData";

// Store
export {
  useProfileStore,
  selectActiveTab,
  selectIsEditing,
  selectIsDeleteModalOpen,
} from "./store/profileStore";

// Services
export { profileService } from "./services/profileService";
export { profileApi } from "./services/profileApi";
export { profileMockService } from "./services/profileMock";

// Types
export type {
  MembershipTier,
  AchievementCategory,
  ActivityType,
  DocumentType,
  PrivacySetting,
  FarmerProfile,
  FarmOverview,
  Field,
  Equipment,
  Worker,
  LivestockEntry,
  AIPersonalizationData,
  Achievement,
  ActivityItem,
  FarmDocument,
  PrivacySettings,
  ConnectedDevice,
  LoginSession,
  ProfileData,
  ProfileTab,
  ProfileUIState,
} from "./types/profile.types";
