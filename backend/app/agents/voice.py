from __future__ import annotations

import abc
import base64
import hashlib
import random


class SpeechToTextProvider(abc.ABC):
    """Abstract base class for speech-to-text providers."""

    @abc.abstractmethod
    async def transcribe(
        self, audio_bytes: bytes, language: str
    ) -> dict[str, object]: ...


class TextToSpeechProvider(abc.ABC):
    """Abstract base class for text-to-speech providers."""

    @abc.abstractmethod
    async def synthesize(
        self, text: str, language: str, voice: str
    ) -> dict[str, object]: ...


class MockSpeechToTextProvider(SpeechToTextProvider):
    """Mock STT provider for development and testing."""

    MOCK_TRANSCRIPTIONS: dict[str, str] = {
        "hi-IN": "मेरी फसल में पीले पत्ते दिख रहे हैं, क्या करूं?",
        "pa-IN": "ਮੇਰੀ ਫ਼ਸਲ ਵਿੱਚ ਪੀਲੇ ਪੱਤੇ ਦਿਖ ਰਹੇ ਹਨ, ਕੀ ਕਰਾਂ?",
        "en-US": "I am seeing yellow leaves on my crop, what should I do?",
    }

    async def transcribe(self, audio_bytes: bytes, language: str) -> dict[str, object]:
        seed = hashlib.sha256(audio_bytes).hexdigest()[:8]
        rng = random.Random(seed)
        confidence = round(rng.uniform(0.85, 0.99), 2)

        text = self.MOCK_TRANSCRIPTIONS.get(language, self.MOCK_TRANSCRIPTIONS["en-US"])

        duration = round(len(audio_bytes) / 16000, 2) if audio_bytes else 0

        return {
            "text": text,
            "language": language,
            "confidence": confidence,
            "duration_seconds": max(duration, 0.5),
        }


class MockTextToSpeechProvider(TextToSpeechProvider):
    """Mock TTS provider for development and testing."""

    async def synthesize(
        self, text: str, language: str, voice: str
    ) -> dict[str, object]:
        mock_audio = f"mock-audio-{hashlib.sha256(text.encode()).hexdigest()[:8]}"
        audio_b64 = base64.b64encode(mock_audio.encode()).decode()

        duration = round(len(text) / 15, 1)

        return {
            "audio_base64": audio_b64,
            "mime_type": "audio/mpeg",
            "duration_seconds": max(duration, 0.5),
            "text": text,
        }
