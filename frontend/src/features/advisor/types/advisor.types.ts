// ─────────────────────────────────────────────────────────────────────────────
// advisor.types.ts
// KisanGPT — AI Advisor feature types
// ─────────────────────────────────────────────────────────────────────────────

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

export interface ConversationHistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

export interface FarmContext {
  farmName: string;
  location: string;
  activeCrop: string;
  soilPH: string;
  soilHealth: string;
}

export interface AdvisorUIState {
  status: "idle" | "loading" | "streaming" | "error";
  messages: ChatMessage[];
  inputValue: string;
}

export type AdvisorAction =
  | { type: "SET_INPUT"; value: string }
  | { type: "ADD_USER_MESSAGE"; message: ChatMessage }
  | { type: "ADD_ASSISTANT_MESSAGE"; message: ChatMessage }
  | { type: "SET_STATUS"; status: AdvisorUIState["status"] }
  | { type: "CLEAR_MESSAGES" };
