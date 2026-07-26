from __future__ import annotations

from pydantic import BaseModel, Field


class SpeechToTextRequest(BaseModel):
    language: str = Field(
        default="hi-IN",
        min_length=2,
        max_length=10,
        description="BCP-47 language code",
    )


class SpeechToTextResponse(BaseModel):
    text: str
    language: str
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    duration_seconds: float = Field(default=0, ge=0)


class TextToSpeechRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    language: str = Field(
        default="hi-IN",
        min_length=2,
        max_length=10,
    )
    voice: str = Field(
        default="default",
        max_length=50,
    )


class TextToSpeechResponse(BaseModel):
    audio_base64: str
    mime_type: str = "audio/mpeg"
    duration_seconds: float = Field(default=0, ge=0)
    text: str


class VoiceCommand(BaseModel):
    command: str
    language: str = "hi-IN"


class VoiceCommandResponse(BaseModel):
    command: str
    intent: str
    parameters: dict[str, str] = Field(default_factory=dict)
    response_text: str
    language: str


class VoiceChatRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    language: str = Field(
        default="hi-IN",
        min_length=2,
        max_length=10,
    )
    conversation_id: str | None = Field(None, max_length=100)


class VoiceChatResponse(BaseModel):
    response_text: str
    audio_base64: str | None = None
    mime_type: str = "audio/mpeg"
    language: str
    conversation_id: str | None = None


class VoiceSession(BaseModel):
    session_id: str
    language: str
    is_active: bool = True
    created_at: str


class VoiceHealthResponse(BaseModel):
    status: str
    stt_available: bool
    tts_available: bool
    supported_languages: list[str]
