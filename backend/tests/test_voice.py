from __future__ import annotations

import pytest

from app.agents.voice import MockSpeechToTextProvider, MockTextToSpeechProvider


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
