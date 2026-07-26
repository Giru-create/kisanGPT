from __future__ import annotations

import uuid
from datetime import UTC, datetime

from app.agents.voice import (
    MockSpeechToTextProvider,
    MockTextToSpeechProvider,
    SpeechToTextProvider,
    TextToSpeechProvider,
)
from app.core.logging import logger
from app.schemas.voice import (
    SpeechToTextResponse,
    TextToSpeechResponse,
    VoiceChatResponse,
    VoiceCommandResponse,
)

INTENT_MAP: dict[str, dict[str, object]] = {
    "disease": {
        "intent": "disease_detection",
        "response": (
            "Please take a photo of your crop leaf using "
            "the Disease Detection feature, and I will analyze it."
        ),
    },
    "weather": {
        "intent": "weather_query",
        "response": (
            "Let me check the weather for your area. "
            "Please share your location or district name."
        ),
    },
    "price": {
        "intent": "market_price",
        "response": (
            "Which commodity would you like to check the price for? "
            "You can say Wheat, Mustard, Paddy, or others."
        ),
    },
    "msp": {
        "intent": "msp_query",
        "response": (
            "The current MSP for Wheat is ₹2,250 per quintal "
            "and for Mustard is ₹5,500 per quintal."
        ),
    },
    "irrigation": {
        "intent": "irrigation_advice",
        "response": (
            "For irrigation advice, I recommend checking the "
            "Weather Intelligence page for the best irrigation windows."
        ),
    },
    "scheme": {
        "intent": "govt_scheme",
        "response": (
            "You can check available government schemes "
            "on the Dashboard. PM-KISAN offers ₹6,000 per year."
        ),
    },
    "help": {
        "intent": "help",
        "response": (
            "I can help you with: crop diseases, weather, "
            "market prices, irrigation, and government schemes. "
            "What would you like to know?"
        ),
    },
}


class VoiceService:
    """Orchestrates speech-to-text, text-to-speech, and voice commands."""

    def __init__(
        self,
        stt_provider: SpeechToTextProvider | None = None,
        tts_provider: TextToSpeechProvider | None = None,
    ) -> None:
        self._stt = stt_provider or MockSpeechToTextProvider()
        self._tts = tts_provider or MockTextToSpeechProvider()
        self._sessions: dict[str, dict[str, object]] = {}

    async def transcribe(
        self, audio_bytes: bytes, language: str
    ) -> SpeechToTextResponse:
        logger.info(
            "Transcribing audio",
            extra={"language": language, "size": len(audio_bytes)},
        )
        try:
            raw = await self._stt.transcribe(audio_bytes, language)
        except Exception:
            logger.exception("Speech-to-text failed")
            raise

        return SpeechToTextResponse(**raw)

    async def synthesize(
        self, text: str, language: str, voice: str
    ) -> TextToSpeechResponse:
        logger.info(
            "Synthesizing speech",
            extra={"language": language, "text_length": len(text)},
        )
        try:
            raw = await self._tts.synthesize(text, language, voice)
        except Exception:
            logger.exception("Text-to-speech failed")
            raise

        return TextToSpeechResponse(**raw)

    async def process_command(self, text: str, language: str) -> VoiceCommandResponse:
        intent_data = _detect_intent(text)
        intent = str(intent_data["intent"])
        response_text = str(intent_data["response"])

        logger.info(
            "Voice command processed",
            extra={"text": text[:50], "intent": intent},
        )

        return VoiceCommandResponse(
            command=text,
            intent=intent,
            parameters={},
            response_text=response_text,
            language=language,
        )

    async def voice_chat(
        self, text: str, language: str, conversation_id: str | None
    ) -> VoiceChatResponse:
        command_response = await self.process_command(text, language)

        tts_result = await self.synthesize(
            command_response.response_text, language, "default"
        )

        if not conversation_id:
            conversation_id = str(uuid.uuid4())

        logger.info(
            "Voice chat response generated",
            extra={
                "conversation_id": conversation_id,
                "intent": command_response.intent,
            },
        )

        return VoiceChatResponse(
            response_text=command_response.response_text,
            audio_base64=tts_result.audio_base64,
            mime_type=tts_result.mime_type,
            language=language,
            conversation_id=conversation_id,
        )

    def create_session(self, language: str) -> dict[str, object]:
        session_id = str(uuid.uuid4())
        self._sessions[session_id] = {
            "language": language,
            "is_active": True,
            "created_at": datetime.now(UTC).isoformat(),
        }
        return {"session_id": session_id, **self._sessions[session_id]}

    def end_session(self, session_id: str) -> bool:
        if session_id in self._sessions:
            self._sessions[session_id]["is_active"] = False
            return True
        return False


def _detect_intent(text: str) -> dict[str, object]:
    text_lower = text.lower()

    keywords: dict[str, list[str]] = {
        "disease": [
            "disease",
            "bimari",
            "rog",
            "पत्त",
            "leaf",
            "yellow",
            "spot",
            "blight",
            "rust",
            "wilt",
            "pest",
            "कीट",
        ],
        "weather": [
            "weather",
            "mausam",
            "मौसम",
            "rain",
            "barish",
            "बारिश",
            "temperature",
            "tapman",
            "गर्मी",
            "सर्दी",
            "cold",
            "heat",
        ],
        "price": [
            "price",
            "daam",
            "दाम",
            "mandi",
            "बाजार",
            "market",
            "sell",
            "bech",
            "बेच",
            "rate",
        ],
        "msp": [
            "msp",
            "samarthan",
            "समर्थन",
            "minimum support",
        ],
        "irrigation": [
            "irrigation",
            "sinchai",
            "सिंचाई",
            "water",
            "पानी",
            "paani",
            "drip",
            "sprinkler",
        ],
        "scheme": [
            "scheme",
            "yojana",
            "योजना",
            "government",
            "सरकार",
            "subsidy",
            "pm-kisan",
            "kcc",
        ],
        "help": [
            "help",
            "madad",
            "मदद",
            "kya",
            "क्या",
            "how",
            "kaise",
            "कैसे",
            "what",
        ],
    }

    for intent, words in keywords.items():
        if any(w in text_lower for w in words):
            return INTENT_MAP[intent]

    return {
        "intent": "general_query",
        "response": (
            "I am not sure I understand. You can ask about "
            "crop diseases, weather, market prices, irrigation, "
            "or government schemes."
        ),
    }


voice_service = VoiceService()
