from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.voice import (
    SpeechToTextResponse,
    TextToSpeechRequest,
    TextToSpeechResponse,
    VoiceChatRequest,
    VoiceChatResponse,
    VoiceCommand,
    VoiceCommandResponse,
    VoiceHealthResponse,
    VoiceSession,
)


class TestSpeechToTextResponse:
    def test_valid(self) -> None:
        r = SpeechToTextResponse(text="Hello", language="en-US")
        assert r.text == "Hello"
        assert r.confidence == 1.0

    def test_defaults(self) -> None:
        r = SpeechToTextResponse(text="Test", language="hi-IN")
        assert r.duration_seconds == 0


class TestTextToSpeechRequest:
    def test_valid(self) -> None:
        r = TextToSpeechRequest(text="Hello world")
        assert r.text == "Hello world"
        assert r.language == "hi-IN"

    def test_empty_text(self) -> None:
        with pytest.raises(ValidationError):
            TextToSpeechRequest(text="")

    def test_text_too_long(self) -> None:
        with pytest.raises(ValidationError):
            TextToSpeechRequest(text="x" * 5001)


class TestTextToSpeechResponse:
    def test_valid(self) -> None:
        r = TextToSpeechResponse(audio_base64="dGVzdA==", text="Hello")
        assert r.mime_type == "audio/mpeg"


class TestVoiceCommand:
    def test_valid(self) -> None:
        c = VoiceCommand(command="check weather")
        assert c.command == "check weather"
        assert c.language == "hi-IN"


class TestVoiceCommandResponse:
    def test_valid(self) -> None:
        r = VoiceCommandResponse(
            command="hello",
            intent="help",
            response_text="How can I help?",
            language="en-US",
        )
        assert r.intent == "help"
        assert r.parameters == {}


class TestVoiceChatRequest:
    def test_valid(self) -> None:
        r = VoiceChatRequest(text="Hello")
        assert r.text == "Hello"
        assert r.conversation_id is None

    def test_with_conversation_id(self) -> None:
        r = VoiceChatRequest(text="Hi", conversation_id="conv-123")
        assert r.conversation_id == "conv-123"


class TestVoiceChatResponse:
    def test_valid(self) -> None:
        r = VoiceChatResponse(response_text="Hello!", language="en-US")
        assert r.audio_base64 is None


class TestVoiceSession:
    def test_valid(self) -> None:
        s = VoiceSession(
            session_id="s1", language="hi-IN", created_at="2026-01-01T00:00:00Z"
        )
        assert s.is_active is True


class TestVoiceHealthResponse:
    def test_valid(self) -> None:
        h = VoiceHealthResponse(
            status="healthy",
            stt_available=True,
            tts_available=True,
            supported_languages=["hi-IN", "en-US"],
        )
        assert h.status == "healthy"
