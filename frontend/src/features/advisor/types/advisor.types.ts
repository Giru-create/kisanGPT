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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: ChatSource[];
  thinkingSteps?: ThinkingStep[];
}

// ---------------------------------------------------------------------------
// Conversation
// ---------------------------------------------------------------------------

export interface ConversationHistoryItem {
  id: string;
  title: string;
  timestamp: string;
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
}
