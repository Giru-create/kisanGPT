// ─────────────────────────────────────────────────────────────────────────────
// advisor.types.ts
// KisanGPT — AI Advisor feature types
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// API Request / Response
// ---------------------------------------------------------------------------

export interface ChatRequest {
  message: string;
  conversationId?: string;
  city?: string;
  lat?: number;
  lon?: number;
  commodity?: string;
  images?: string[];
}

export interface AgentResponse {
  message: string;
  plannedTools: string[];
  toolResults: Record<string, unknown>[];
}

export interface ChatApiResponse {
  content: string;
  conversationId: string;
}

// ---------------------------------------------------------------------------
// Response Card Types
// ---------------------------------------------------------------------------

export type ResponseCardType =
  | "weather"
  | "market"
  | "disease"
  | "government_scheme"
  | "checklist"
  | "action_plan"
  | "warning"
  | "next_steps";

export interface WeatherCardData {
  type: "weather";
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  advisory: string;
  safeToSpray: boolean;
}

export interface MarketCardData {
  type: "market";
  commodity: string;
  price: number;
  unit: string;
  market: string;
  trend: "up" | "down" | "stable";
  change: number;
}

export interface DiseaseCardData {
  type: "disease";
  diseaseName: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  symptoms: string[];
  treatments: string[];
}

export interface GovernmentSchemeCardData {
  type: "government_scheme";
  schemeName: string;
  description: string;
  eligibility: string;
  deadline: string;
  link: string;
}

export interface ChecklistCardData {
  type: "checklist";
  title: string;
  items: { id: string; text: string; checked: boolean }[];
}

export interface ActionPlanCardData {
  type: "action_plan";
  title: string;
  steps: { id: string; text: string; priority: "high" | "medium" | "low" }[];
}

export interface WarningCardData {
  type: "warning";
  message: string;
  severity: "info" | "warning" | "critical";
}

export interface NextStepsCardData {
  type: "next_steps";
  steps: string[];
}

export type ResponseCardData =
  | WeatherCardData
  | MarketCardData
  | DiseaseCardData
  | GovernmentSchemeCardData
  | ChecklistCardData
  | ActionPlanCardData
  | WarningCardData
  | NextStepsCardData;

// ---------------------------------------------------------------------------
// Chat Message
// ---------------------------------------------------------------------------

export interface ChatSource {
  id: string;
  title: string;
  tooltip: string;
}

export interface ThinkingStep {
  id: string;
  text: string;
}

export interface RecommendedAction {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: ChatSource[];
  thinkingSteps?: ThinkingStep[];
  responseCards?: ResponseCardData[];
  recommendedActions?: RecommendedAction[];
  confidence?: number;
  isStreaming?: boolean;
  imagePreview?: string;
}

// ---------------------------------------------------------------------------
// Conversation
// ---------------------------------------------------------------------------

export interface ConversationHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  preview?: string;
  unread?: boolean;
}

// ---------------------------------------------------------------------------
// Farm Context
// ---------------------------------------------------------------------------

export interface FarmContext {
  farmName: string;
  location: string;
  activeCrop: string;
  soilPH: string;
  soilHealth: string;
}

export interface WeatherSummary {
  temperature: number;
  condition: string;
  humidity: number;
  advisory: string;
}

export interface FarmAlert {
  id: string;
  title: string;
  type: "warning" | "info" | "success";
  timestamp: string;
}

export interface MemorySummary {
  totalInteractions: number;
  topTopics: string[];
  lastInteraction: string;
}

export interface SavedRecommendation {
  id: string;
  title: string;
  category: string;
  savedAt: string;
}

// ---------------------------------------------------------------------------
// Voice State
// ---------------------------------------------------------------------------

export type VoiceStatus =
  "idle" | "listening" | "thinking" | "speaking" | "error";

export interface VoiceState {
  status: VoiceStatus;
  volume: number;
  transcript: string;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Image Upload State
// ---------------------------------------------------------------------------

export type ImageUploadStatus =
  "idle" | "dragging" | "uploading" | "preview" | "error";

export interface ImageUploadState {
  status: ImageUploadStatus;
  file: File | null;
  preview: string | null;
  progress: number;
  error: string | null;
}

// ---------------------------------------------------------------------------
// UI State (Discriminated Union)
// ---------------------------------------------------------------------------

export type AdvisorStatus =
  "idle" | "loading" | "streaming" | "error" | "success";

export interface AdvisorUIState {
  status: AdvisorStatus;
  messages: ChatMessage[];
  inputValue: string;
  conversationId: string | null;
  errorMessage: string | null;
  voiceState: VoiceState;
  imageUpload: ImageUploadState;
  conversationTitle: string;
  showRightPanel: boolean;
}
