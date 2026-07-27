// ─────────────────────────────────────────────────────────────────────────────
// voice.types.ts
// KisanGPT — Voice Assistant feature types
// ─────────────────────────────────────────────────────────────────────────────

export type VoiceLanguage = "hi-IN" | "pa-IN" | "en-US";

export type VoiceStatus =
  "idle" | "listening" | "processing" | "speaking" | "error";

export type VoiceErrorCode =
  "PERMISSION_DENIED" | "NETWORK_ERROR" | "NO_SPEECH" | "TIMEOUT" | "UNKNOWN";

// ---------------------------------------------------------------------------
// Speech-to-text
// ---------------------------------------------------------------------------

export interface STTResult {
  text: string;
  language: string;
  confidence: number;
  duration_seconds: number;
}

// ---------------------------------------------------------------------------
// Text-to-speech
// ---------------------------------------------------------------------------

export interface TTSResult {
  audio_base64: string;
  mime_type: string;
  duration_seconds: number;
  text: string;
}

// ---------------------------------------------------------------------------
// Voice command
// ---------------------------------------------------------------------------

export interface VoiceCommandResult {
  command: string;
  intent: string;
  parameters: Record<string, string>;
  response_text: string;
  language: string;
}

// ---------------------------------------------------------------------------
// Voice chat
// ---------------------------------------------------------------------------

export interface VoiceChatResult {
  response_text: string;
  audio_base64: string | null;
  mime_type: string;
  language: string;
  conversation_id: string | null;
}

// ---------------------------------------------------------------------------
// Chat message (for conversation display)
// ---------------------------------------------------------------------------

export interface VoiceMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
  audio_base64?: string;
  intent?: string;
  suggested_actions?: string[];
}

// ---------------------------------------------------------------------------
// UI state (discriminated union)
// ---------------------------------------------------------------------------

export type VoiceUIState =
  | { status: "idle" }
  | { status: "listening"; volumeLevel?: number }
  | { status: "processing" }
  | {
      status: "speaking";
      audioBase64?: string;
      mimeType?: string;
      durationSeconds?: number;
    }
  | { status: "error"; message: string; code?: VoiceErrorCode };
