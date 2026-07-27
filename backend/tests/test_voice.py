from __future__ import annotations

import pytest

from app.agents.voice import (
    MockSpeechToTextProvider,
    MockTextToSpeechProvider,
    SpeechToTextProvider,
    TextToSpeechProvider,
)
from app.schemas.voice import (
    SpeechToTextResponse,
    TextToSpeechResponse,
    VoiceChatResponse,
    VoiceCommandResponse,
)
from app.services.voice import VoiceService, _detect_intent


class TestSpeechToTextProviderABC:
    def test_cannot_instantiate_directly(self) -> None:
        with pytest.raises(TypeError):
            SpeechToTextProvider().transcribe(b"", "en-US")  # type: ignore[abstract]

    def test_mock_implements_interface(self) -> None:
        assert issubclass(MockSpeechToTextProvider, SpeechToTextProvider)


class TestTextToSpeechProviderABC:
    def test_cannot_instantiate_directly(self) -> None:
        with pytest.raises(TypeError):
            TextToSpeechProvider().synthesize("hi", "en-US", "default")  # type: ignore[abstract]

    def test_mock_implements_interface(self) -> None:
        assert issubclass(MockTextToSpeechProvider, TextToSpeechProvider)


class TestMockSpeechToTextProvider:
    @pytest.mark.asyncio
    async def test_transcribe_returns_text(self) -> None:
        provider = MockSpeechToTextProvider()
        result = await provider.transcribe(b"fake-audio-data", "hi-IN")
        assert "text" in result
        assert isinstance(result["text"], str)
        assert len(result["text"]) > 0

    @pytest.mark.asyncio
    async def test_transcribe_confidence_range(self) -> None:
        provider = MockSpeechToTextProvider()
        result = await provider.transcribe(b"test", "en-US")
        assert 0.0 <= result["confidence"] <= 1.0

    @pytest.mark.asyncio
    async def test_transcribe_different_languages(self) -> None:
        provider = MockSpeechToTextProvider()
        hi = await provider.transcribe(b"audio1", "hi-IN")
        en = await provider.transcribe(b"audio1", "en-US")
        assert hi["text"] != en["text"]

    @pytest.mark.asyncio
    async def test_transcribe_empty_audio(self) -> None:
        provider = MockSpeechToTextProvider()
        result = await provider.transcribe(b"", "hi-IN")
        assert result["duration_seconds"] >= 0

    @pytest.mark.asyncio
    async def test_transcribe_punjabi(self) -> None:
        provider = MockSpeechToTextProvider()
        result = await provider.transcribe(b"audio", "pa-IN")
        assert "ਪੀਲੇ" in result["text"]

    @pytest.mark.asyncio
    async def test_transcribe_unknown_language_falls_back_to_english(self) -> None:
        provider = MockSpeechToTextProvider()
        result = await provider.transcribe(b"audio", "fr-FR")
        assert "yellow leaves" in result["text"]

    @pytest.mark.asyncio
    async def test_transcribe_duration_minimum(self) -> None:
        provider = MockSpeechToTextProvider()
        result = await provider.transcribe(b"", "en-US")
        assert result["duration_seconds"] >= 0.5

    @pytest.mark.asyncio
    async def test_transcribe_keys(self) -> None:
        provider = MockSpeechToTextProvider()
        result = await provider.transcribe(b"data", "en-US")
        assert set(result.keys()) == {
            "text",
            "language",
            "confidence",
            "duration_seconds",
        }


class TestMockTextToSpeechProvider:
    @pytest.mark.asyncio
    async def test_synthesize_returns_audio(self) -> None:
        provider = MockTextToSpeechProvider()
        result = await provider.synthesize("Hello", "en-US", "default")
        assert "audio_base64" in result
        assert result["mime_type"] == "audio/mpeg"

    @pytest.mark.asyncio
    async def test_synthesize_preserves_text(self) -> None:
        provider = MockTextToSpeechProvider()
        text = "Test speech"
        result = await provider.synthesize(text, "hi-IN", "default")
        assert result["text"] == text

    @pytest.mark.asyncio
    async def test_synthesize_duration_positive(self) -> None:
        provider = MockTextToSpeechProvider()
        result = await provider.synthesize("Hello", "en-US", "default")
        assert result["duration_seconds"] > 0

    @pytest.mark.asyncio
    async def test_synthesize_keys(self) -> None:
        provider = MockTextToSpeechProvider()
        result = await provider.synthesize("Hello", "en-US", "default")
        assert set(result.keys()) == {
            "audio_base64",
            "mime_type",
            "duration_seconds",
            "text",
        }

    @pytest.mark.asyncio
    async def test_synthesize_empty_text(self) -> None:
        provider = MockTextToSpeechProvider()
        result = await provider.synthesize("", "en-US", "default")
        assert result["text"] == ""
        assert result["duration_seconds"] >= 0.5


class TestVoiceServiceTranscribe:
    @pytest.mark.asyncio
    async def test_transcribe_returns_response(self) -> None:
        svc = VoiceService()
        result = await svc.transcribe(b"audio-data", "hi-IN")
        assert isinstance(result, SpeechToTextResponse)
        assert len(result.text) > 0

    @pytest.mark.asyncio
    async def test_transcribe_language_passed_to_provider(self) -> None:
        svc = VoiceService()
        result = await svc.transcribe(b"data", "en-US")
        assert result.language == "en-US"

    @pytest.mark.asyncio
    async def test_transcribe_with_custom_provider(self) -> None:
        class CustomSTT(SpeechToTextProvider):
            async def transcribe(
                self, audio_bytes: bytes, language: str
            ) -> dict[str, object]:
                return {
                    "text": "custom result",
                    "language": language,
                    "confidence": 0.95,
                    "duration_seconds": 1.0,
                }

        svc = VoiceService(stt_provider=CustomSTT())
        result = await svc.transcribe(b"data", "hi-IN")
        assert result.text == "custom result"

    @pytest.mark.asyncio
    async def test_transcribe_propagates_provider_error(self) -> None:
        class FailingSTT(SpeechToTextProvider):
            async def transcribe(
                self, audio_bytes: bytes, language: str
            ) -> dict[str, object]:
                raise RuntimeError("STT unavailable")

        svc = VoiceService(stt_provider=FailingSTT())
        with pytest.raises(RuntimeError, match="STT unavailable"):
            await svc.transcribe(b"data", "en-US")


class TestVoiceServiceSynthesize:
    @pytest.mark.asyncio
    async def test_synthesize_returns_response(self) -> None:
        svc = VoiceService()
        result = await svc.synthesize("Hello", "en-US", "default")
        assert isinstance(result, TextToSpeechResponse)
        assert len(result.audio_base64) > 0

    @pytest.mark.asyncio
    async def test_synthesize_preserves_text(self) -> None:
        svc = VoiceService()
        result = await svc.synthesize("Test message", "hi-IN", "default")
        assert result.text == "Test message"

    @pytest.mark.asyncio
    async def test_synthesize_with_custom_provider(self) -> None:
        class CustomTTS(TextToSpeechProvider):
            async def synthesize(
                self, text: str, language: str, voice: str
            ) -> dict[str, object]:
                return {
                    "audio_base64": "custom-audio",
                    "mime_type": "audio/wav",
                    "duration_seconds": 2.0,
                    "text": text,
                }

        svc = VoiceService(tts_provider=CustomTTS())
        result = await svc.synthesize("Hello", "en-US", "custom")
        assert result.audio_base64 == "custom-audio"
        assert result.mime_type == "audio/wav"

    @pytest.mark.asyncio
    async def test_synthesize_propagates_provider_error(self) -> None:
        class FailingTTS(TextToSpeechProvider):
            async def synthesize(
                self, text: str, language: str, voice: str
            ) -> dict[str, object]:
                raise RuntimeError("TTS unavailable")

        svc = VoiceService(tts_provider=FailingTTS())
        with pytest.raises(RuntimeError, match="TTS unavailable"):
            await svc.synthesize("Hello", "en-US", "default")


class TestVoiceServiceProcessCommand:
    @pytest.mark.asyncio
    async def test_process_command_returns_response(self) -> None:
        svc = VoiceService()
        result = await svc.process_command("check weather", "en-US")
        assert isinstance(result, VoiceCommandResponse)
        assert result.intent == "weather_query"

    @pytest.mark.asyncio
    async def test_process_command_general_query(self) -> None:
        svc = VoiceService()
        result = await svc.process_command("xyz random", "en-US")
        assert result.intent == "general_query"

    @pytest.mark.asyncio
    async def test_process_command_preserves_original_text(self) -> None:
        svc = VoiceService()
        result = await svc.process_command("check disease", "hi-IN")
        assert result.command == "check disease"
        assert result.language == "hi-IN"


class TestVoiceServiceVoiceChat:
    @pytest.mark.asyncio
    async def test_voice_chat_returns_response(self) -> None:
        svc = VoiceService()
        result = await svc.voice_chat("help", "en-US", None)
        assert isinstance(result, VoiceChatResponse)
        assert len(result.response_text) > 0
        assert result.audio_base64 is not None

    @pytest.mark.asyncio
    async def test_voice_chat_generates_conversation_id(self) -> None:
        svc = VoiceService()
        result = await svc.voice_chat("help", "en-US", None)
        assert result.conversation_id is not None
        assert len(result.conversation_id) > 0

    @pytest.mark.asyncio
    async def test_voice_chat_preserves_conversation_id(self) -> None:
        svc = VoiceService()
        result = await svc.voice_chat("help", "en-US", "my-conv-123")
        assert result.conversation_id == "my-conv-123"

    @pytest.mark.asyncio
    async def test_voice_chat_includes_audio(self) -> None:
        svc = VoiceService()
        result = await svc.voice_chat("weather", "hi-IN", None)
        assert result.audio_base64 is not None
        assert result.mime_type == "audio/mpeg"


class TestVoiceServiceSession:
    def test_create_session(self) -> None:
        svc = VoiceService()
        session = svc.create_session("hi-IN")
        assert "session_id" in session
        assert session["language"] == "hi-IN"
        assert session["is_active"] is True
        assert "created_at" in session

    def test_end_session(self) -> None:
        svc = VoiceService()
        session = svc.create_session("en-US")
        result = svc.end_session(session["session_id"])
        assert result is True

    def test_end_nonexistent_session(self) -> None:
        svc = VoiceService()
        result = svc.end_session("nonexistent-id")
        assert result is False

    def test_create_multiple_sessions(self) -> None:
        svc = VoiceService()
        s1 = svc.create_session("hi-IN")
        s2 = svc.create_session("en-US")
        assert s1["session_id"] != s2["session_id"]


class TestDetectIntent:
    def test_disease_keywords(self) -> None:
        assert _detect_intent("my crop has disease")["intent"] == "disease_detection"
        assert _detect_intent("bimari kya hai")["intent"] == "disease_detection"
        assert _detect_intent("leaf yellow spot")["intent"] == "disease_detection"
        assert _detect_intent("pest problem")["intent"] == "disease_detection"

    def test_weather_keywords(self) -> None:
        assert _detect_intent("what is the weather")["intent"] == "weather_query"
        assert _detect_intent("mausam kaisa hai")["intent"] == "weather_query"
        assert _detect_intent("barish hogi")["intent"] == "weather_query"
        assert _detect_intent("rain today")["intent"] == "weather_query"
        assert _detect_intent("temperature high")["intent"] == "weather_query"

    def test_price_keywords(self) -> None:
        assert _detect_intent("daam kitna hai")["intent"] == "market_price"
        assert _detect_intent("mandi rate")["intent"] == "market_price"
        assert _detect_intent("sell rice")["intent"] == "market_price"
        assert _detect_intent("market rate")["intent"] == "market_price"

    def test_msp_keywords(self) -> None:
        assert _detect_intent("msp for rice")["intent"] == "msp_query"
        assert _detect_intent("samarthan mully")["intent"] == "msp_query"

    def test_irrigation_keywords(self) -> None:
        assert _detect_intent("irrigation advice")["intent"] == "irrigation_advice"
        assert _detect_intent("sinchai kaise kare")["intent"] == "irrigation_advice"
        assert _detect_intent("drip irrigation")["intent"] == "irrigation_advice"
        assert _detect_intent("water requirement")["intent"] == "irrigation_advice"

    def test_scheme_keywords(self) -> None:
        assert _detect_intent("government scheme")["intent"] == "govt_scheme"
        assert _detect_intent("yojana kya hai")["intent"] == "govt_scheme"
        assert _detect_intent("pm-kisan benefit")["intent"] == "govt_scheme"
        assert _detect_intent("subsidy available")["intent"] == "govt_scheme"

    def test_help_keywords(self) -> None:
        assert _detect_intent("help me")["intent"] == "help"
        assert _detect_intent("madad karo")["intent"] == "help"
        assert _detect_intent("what can you do")["intent"] == "help"
        assert _detect_intent("kaise kare")["intent"] == "help"

    def test_general_query_fallback(self) -> None:
        assert _detect_intent("random unrelated text")["intent"] == "general_query"
        assert _detect_intent("")["intent"] == "general_query"
