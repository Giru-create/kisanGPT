// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — AI Advisor feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

export { AIAdvisor } from "./components/AIAdvisor";
export { ChatWindow } from "./components/ChatWindow";
export { ChatMessage } from "./components/ChatMessage";
export { ChatInput } from "./components/ChatInput";
export { SuggestedQuestions } from "./components/SuggestedQuestions";
export { TypingIndicator } from "./components/TypingIndicator";
export { EmptyState } from "./components/EmptyState";
export { AdvisorTopBar } from "./components/AdvisorTopBar";
export { FarmContextSidebar } from "./components/FarmContextSidebar";

export { useAdvisor } from "./hooks/useAdvisor";
export { useAdvisorStore } from "./store/advisorStore";

export type {
  ChatMessage as ChatMessageType,
  ChatSource,
  ThinkingStep,
  ConversationHistoryItem,
  FarmContext,
  AdvisorUIState,
} from "./types/advisor.types";
