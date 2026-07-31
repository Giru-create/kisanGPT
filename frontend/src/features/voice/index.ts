// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Voice Assistant feature entry point
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { VoicePage } from "./components/VoicePage";

// New components
export { HeroSection } from "./components/HeroSection";
export { VoiceInterface } from "./components/VoiceInterface";
export { ConversationView } from "./components/ConversationView";
export { LanguageSelector } from "./components/LanguageSelector";
export { QuickVoiceActions } from "./components/QuickVoiceActions";
export { AIContextPanel } from "./components/AIContextPanel";
export { VoiceSettings } from "./components/VoiceSettings";

// Existing components
export { VoiceRecordButton } from "./components/VoiceRecordButton";
export { VoiceWaveform } from "./components/VoiceWaveform";
export { VoicePlaybackPlayer } from "./components/VoicePlaybackPlayer";
export { VoiceEmpty } from "./components/VoiceEmpty";
export { VoiceError } from "./components/VoiceError";
export { VoiceSkeleton } from "./components/VoiceSkeleton";
export { VoiceInputBar } from "./components/VoiceInputBar";

// Hooks
export { useVoice } from "./hooks/useVoice";
export { useAudioRecorder } from "./hooks/useAudioRecorder";
export { useAudioPlayer } from "./hooks/useAudioPlayer";

// Store
export {
  useVoiceStore,
  selectVoiceState,
  selectLanguage,
  selectMessages,
  selectConversationId,
  selectIsFloatingOpen,
} from "./store/voiceStore";

// Services
export { voiceService } from "./services/voiceService";
export { voiceApi } from "./services/voiceApi";
export { voiceMockService } from "./services/voiceMock";

// Types
export type {
  VoiceLanguage,
  VoiceStatus,
  VoiceErrorCode,
  STTResult,
  TTSResult,
  VoiceCommandResult,
  VoiceChatResult,
  VoiceMessage,
  VoiceUIState,
  QuickVoiceAction,
  AIContextData,
  VoiceSettingsData,
  RecentConversation,
} from "./types/voice.types";
