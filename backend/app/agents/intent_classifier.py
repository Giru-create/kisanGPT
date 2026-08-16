"""Intent classifier -- LLM-first classification with keyword fallback."""

from __future__ import annotations

import json
from typing import TYPE_CHECKING

from app.agents.schemas import IntentClassification, IntentType
from app.core.logging import logger

if TYPE_CHECKING:
    from app.llm.provider import LLMProvider

# ---------------------------------------------------------------------------
# Intent classification prompt
# ---------------------------------------------------------------------------

INTENT_CLASSIFIER_SYSTEM_PROMPT = """\
You are an intent classifier for KisanGPT, an AI farming assistant for Indian farmers.\
 Your job is to classify the user's message into one of these intents:

- disease: crop disease diagnosis, pest detection, plant health issues
- weather: weather data, forecasts, irrigation, temperature, humidity
- market: commodity prices, market trends, selling advice, mandi rates
- scheme: government schemes, subsidies, insurance, yojana, PM-KISAN
- knowledge: farming guides, how-to questions, cultivation, fertilizers
- greeting: hello, hi, namaste, good morning/afternoon/evening
- general: anything else not covered by the above

Return ONLY a JSON object with this structure:
{
  "primary_intent": "intent_name",
  "secondary_intents": [],
  "confidence": 0.0 to 1.0,
  "entities": {},
  "reasoning": "brief explanation"
}

Rules:
- Return valid JSON only, no markdown fences, no extra text.
- primary_intent must be one of: disease, weather, market, scheme,
  knowledge, greeting, general.
- secondary_intents is a list of other relevant intents (can be empty).
- confidence indicates how sure you are (0.0 = not sure, 1.0 = very sure).
- entities should extract key information like: crop, commodity, location, symptoms.
- reasoning should briefly explain your classification.
- If the message is a greeting, classify as "greeting" even if it contains other words.
- If the message is ambiguous, classify as "general" with lower confidence.
"""

INTENT_CLASSIFIER_USER_TEMPLATE = """\
Classify this user message:

{message}
"""


# ---------------------------------------------------------------------------
# Keyword rules for fallback classification
# ---------------------------------------------------------------------------

INTENT_KEYWORDS: dict[IntentType, list[str]] = {
    IntentType.DISEASE: [
        "disease",
        "spots",
        "pest",
        "fungus",
        "blight",
        "infection",
        "infected",
        "yellow",
        "brown",
        "leaf",
        "wilting",
        "wilt",
        "rot",
        "bug",
    ],
    IntentType.WEATHER: [
        "weather",
        "rain",
        "rainfall",
        "forecast",
        "temperature",
        "drought",
        "irrigation",
        "irrigate",
        "humidity",
        "storm",
        "wind",
        "sun",
        "cold",
        "hot",
        "flood",
        "spray",
    ],
    IntentType.MARKET: [
        "price",
        "market",
        "sell",
        "selling",
        "mandi",
        "commodity",
        "msp",
        "rate",
        "buyer",
        "buy",
        "cost",
        "profit",
    ],
    IntentType.SCHEME: [
        "government",
        "subsidy",
        "scheme",
        "pm-kisan",
        "pm kisan",
        "insurance",
        "crop insurance",
        "government scheme",
        "yojana",
    ],
    IntentType.KNOWLEDGE: [
        "how to",
        "what is",
        "explain",
        "guide",
        "fertilizer",
        "fertiliser",
        "farming",
        "cultivation",
        "sow",
        "sowing",
        "harvest",
        "best practice",
        "soil",
        "manual",
        "documentation",
        "recommendations",
    ],
    IntentType.GREETING: [
        "hello",
        "hi ",
        "hi!",
        "hey",
        "namaste",
        "good morning",
        "good afternoon",
        "good evening",
    ],
}


class IntentClassifier:
    """Classify user messages into intents using LLM with keyword fallback.

    Uses the existing LLMProvider abstraction for LLM-based classification.
    Falls back to deterministic keyword matching when LLM is unavailable
    or returns invalid results.
    """

    def __init__(self, provider: LLMProvider | None = None) -> None:
        self._provider = provider

    async def classify(self, message: str) -> IntentClassification:
        """Classify a user message into an intent.

        Args:
            message: The user's natural-language message.

        Returns:
            IntentClassification with primary intent, secondary intents,
            confidence, entities, and reasoning.
        """
        # Handle edge cases
        if not message or not message.strip():
            return IntentClassification(
                primary_intent=IntentType.GENERAL,
                confidence=0.3,
                reasoning="Empty or whitespace-only message",
            )

        # Truncate very long messages to avoid token limits
        truncated = message[:2000]

        # Try LLM classification first
        if self._provider is not None:
            try:
                result = await self._llm_classify(truncated)
                logger.info(
                    "LLM intent classification succeeded",
                    extra={
                        "primary_intent": result.primary_intent.value,
                        "confidence": result.confidence,
                    },
                )
                return result
            except Exception as exc:
                logger.warning(
                    "LLM intent classification failed, using keyword fallback",
                    extra={"error": str(exc)},
                )

        # Keyword fallback
        return self._keyword_classify(truncated)

    async def _llm_classify(self, message: str) -> IntentClassification:
        """Use LLM to classify the message."""
        user_content = INTENT_CLASSIFIER_USER_TEMPLATE.format(message=message)
        raw = await self._provider.generate(  # type: ignore[union-attr]
            system_instruction=INTENT_CLASSIFIER_SYSTEM_PROMPT,
            user_content=user_content,
        )
        return self._parse_llm_response(raw)

    @staticmethod
    def _parse_llm_response(raw: str) -> IntentClassification:
        """Parse and validate the LLM JSON response."""
        text = raw.strip()

        # Strip markdown code fences if present
        if text.startswith("```"):
            lines = text.split("\n")
            lines = [ln for ln in lines if not ln.strip().startswith("```")]
            text = "\n".join(lines)

        data = json.loads(text)

        # Extract and validate primary_intent
        primary_str = data.get("primary_intent", "general")
        try:
            primary_intent = IntentType(primary_str)
        except ValueError:
            primary_intent = IntentType.GENERAL

        # Extract and validate secondary_intents
        secondary_strs = data.get("secondary_intents", [])
        secondary_intents: list[IntentType] = []
        for s in secondary_strs:
            try:
                secondary_intents.append(IntentType(s))
            except ValueError:
                continue

        # Extract confidence with bounds
        confidence = float(data.get("confidence", 0.5))
        confidence = max(0.0, min(1.0, confidence))

        # Extract entities and reasoning
        entities = data.get("entities", {})
        if not isinstance(entities, dict):
            entities = {}
        reasoning = data.get("reasoning", "")
        if not isinstance(reasoning, str):
            reasoning = ""

        return IntentClassification(
            primary_intent=primary_intent,
            secondary_intents=secondary_intents,
            confidence=confidence,
            entities=entities,
            reasoning=reasoning,
        )

    @staticmethod
    def _keyword_classify(message: str) -> IntentClassification:
        """Classify using deterministic keyword matching."""
        lower = message.lower()
        scores: dict[IntentType, int] = {intent: 0 for intent in IntentType}

        # Score each intent based on keyword matches
        for intent, keywords in INTENT_KEYWORDS.items():
            for kw in keywords:
                if kw in lower:
                    scores[intent] += 1

        # Find the intent with the highest score
        max_score = max(scores.values())

        if max_score == 0:
            # No keywords matched -- check for greeting patterns
            if _is_greeting(lower):
                return IntentClassification(
                    primary_intent=IntentType.GREETING,
                    confidence=0.7,
                    reasoning="Greeting detected by pattern matching",
                )
            return IntentClassification(
                primary_intent=IntentType.GENERAL,
                confidence=0.4,
                reasoning="No keyword matches, classified as general",
            )

        # Get all intents with max score
        top_intents = [i for i, s in scores.items() if s == max_score]
        primary = top_intents[0]
        secondary = [i for i in top_intents[1:]]

        # Calculate confidence based on score strength
        confidence = min(0.9, 0.5 + (max_score * 0.1))

        return IntentClassification(
            primary_intent=primary,
            secondary_intents=secondary,
            confidence=confidence,
            reasoning=f"Keyword match: {max_score} keyword(s) for {primary.value}",
        )


def _is_greeting(lower: str) -> bool:
    """Check if the message is a greeting."""
    greeting_patterns = [
        "hello",
        "hi ",
        "hi!",
        "hey",
        "namaste",
        "good morning",
        "good afternoon",
        "good evening",
    ]
    return any(pattern in lower for pattern in greeting_patterns)
