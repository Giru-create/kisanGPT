from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.voice import (
    SpeechToTextRequest,
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


class TestSpeechToTextRequest:
    def test_default_language(self) -> None:
        r = SpeechToTextRequest()
        assert r.language == "hi-IN"

    def test_custom_language(self) -> None:
        r = SpeechToTextRequest(language="en-US")
        assert r.language == "en-US"

    def test_language_too_short(self) -> None:
        with pytest.raises(ValidationError):
            SpeechToTextRequest(language="a")

    def test_language_too_long(self) -> None:
        with pytest.raises(ValidationError):
            SpeechToTextRequest(language="a" * 11)


class TestSpeechToTextResponse:
    def test_valid(self) -> None:
        r = SpeechToTextResponse(text="Hello", language="en-US")
        assert r.text == "Hello"
        assert r.confidence == 1.0

    def test_defaults(self) -> None:
        r = SpeechToTextResponse(text="Test", language="hi-IN")
        assert r.duration_seconds == 0

    def test_custom_confidence(self) -> None:
        r = SpeechToTextResponse(text="Hi", language="en-US", confidence=0.85)
        assert r.confidence == 0.85

    def test_confidence_out_of_range(self) -> None:
        with pytest.raises(ValidationError):
            SpeechToTextResponse(text="Hi", language="en-US", confidence=1.5)

    def test_negative_duration(self) -> None:
        with pytest.raises(ValidationError):
            SpeechToTextResponse(text="Hi", language="en-US", duration_seconds=-1)


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

    def test_custom_voice(self) -> None:
        r = TextToSpeechRequest(text="Hi", voice="male")
        assert r.voice == "male"

    def test_voice_too_long(self) -> None:
        with pytest.raises(ValidationError):
            TextToSpeechRequest(text="Hi", voice="x" * 51)


class TestTextToSpeechResponse:
    def test_valid(self) -> None:
        r = TextToSpeechResponse(audio_base64="dGVzdA==", text="Hello")
        assert r.mime_type == "audio/mpeg"

    def test_custom_mime_type(self) -> None:
        r = TextToSpeechResponse(
            audio_base64="dGVzdA==", text="Hi", mime_type="audio/wav"
        )
        assert r.mime_type == "audio/wav"

    def test_zero_duration(self) -> None:
        r = TextToSpeechResponse(audio_base64="dGVzdA==", text="Hi")
        assert r.duration_seconds == 0


class TestVoiceCommand:
    def test_valid(self) -> None:
        c = VoiceCommand(command="check weather")
        assert c.command == "check weather"
        assert c.language == "hi-IN"

    def test_custom_language(self) -> None:
        c = VoiceCommand(command="hello", language="pa-IN")
        assert c.language == "pa-IN"


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

    def test_custom_parameters(self) -> None:
        r = VoiceCommandResponse(
            command="price wheat",
            intent="market_price",
            parameters={"commodity": "wheat"},
            response_text="Wheat price is Rs 2250",
            language="en-US",
        )
        assert r.parameters["commodity"] == "wheat"


class TestVoiceChatRequest:
    def test_valid(self) -> None:
        r = VoiceChatRequest(text="Hello")
        assert r.text == "Hello"
        assert r.conversation_id is None

    def test_with_conversation_id(self) -> None:
        r = VoiceChatRequest(text="Hi", conversation_id="conv-123")
        assert r.conversation_id == "conv-123"

    def test_empty_text(self) -> None:
        with pytest.raises(ValidationError):
            VoiceChatRequest(text="")

    def test_text_too_long(self) -> None:
        with pytest.raises(ValidationError):
            VoiceChatRequest(text="x" * 5001)

    def test_conversation_id_too_long(self) -> None:
        with pytest.raises(ValidationError):
            VoiceChatRequest(text="Hi", conversation_id="x" * 101)


class TestVoiceChatResponse:
    def test_valid(self) -> None:
        r = VoiceChatResponse(response_text="Hello!", language="en-US")
        assert r.audio_base64 is None

    def test_with_audio(self) -> None:
        r = VoiceChatResponse(
            response_text="Hi",
            audio_base64="audio-data",
            mime_type="audio/mpeg",
            language="hi-IN",
            conversation_id="conv-1",
        )
        assert r.audio_base64 == "audio-data"
        assert r.conversation_id == "conv-1"


class TestVoiceSession:
    def test_valid(self) -> None:
        s = VoiceSession(
            session_id="s1", language="hi-IN", created_at="2026-01-01T00:00:00Z"
        )
        assert s.is_active is True

    def test_inactive_session(self) -> None:
        s = VoiceSession(
            session_id="s2",
            language="en-US",
            is_active=False,
            created_at="2026-01-01T00:00:00Z",
        )
        assert s.is_active is False


class TestVoiceHealthResponse:
    def test_valid(self) -> None:
        h = VoiceHealthResponse(
            status="healthy",
            stt_available=True,
            tts_available=True,
            supported_languages=["hi-IN", "en-US"],
        )
        assert h.status == "healthy"

    def test_unavailable_providers(self) -> None:
        h = VoiceHealthResponse(
            status="degraded",
            stt_available=False,
            tts_available=False,
            supported_languages=[],
        )
        assert h.stt_available is False
        assert h.tts_available is False
