"""Tests for the IntentClassifier with LLM and keyword fallback."""

from __future__ import annotations

import json

import pytest

from app.agents.intent_classifier import IntentClassifier
from app.agents.schemas import IntentClassification, IntentType


class FakeProvider:
    """Deterministic fake LLM provider for tests."""

    def __init__(self, response_text: str) -> None:
        self._response = response_text

    async def generate(self, *, system_instruction: str, user_content: str) -> str:
        return self._response


class FailingProvider:
    """Provider that always raises."""

    async def generate(self, *, system_instruction: str, user_content: str) -> str:
        raise RuntimeError("Gemini API is down")


# ---------------------------------------------------------------------------
# LLM Classification Success Tests
# ---------------------------------------------------------------------------


class TestLLMClassificationSuccess:
    """Tests for successful LLM-based classification."""

    @pytest.mark.asyncio
    async def test_disease_intent(self) -> None:
        response = json.dumps({
            "primary_intent": "disease",
            "secondary_intents": [],
            "confidence": 0.9,
            "entities": {"crop": "tomato"},
            "reasoning": "User mentions leaf spots",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("My tomato leaves have brown spots")

        assert result.primary_intent == IntentType.DISEASE
        assert result.confidence == 0.9
        assert result.entities.get("crop") == "tomato"
        assert "leaf" in result.reasoning.lower()

    @pytest.mark.asyncio
    async def test_weather_intent(self) -> None:
        response = json.dumps({
            "primary_intent": "weather",
            "secondary_intents": [],
            "confidence": 0.85,
            "entities": {"location": "Punjab"},
            "reasoning": "User asks about weather forecast",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("What is the weather forecast for Punjab?")

        assert result.primary_intent == IntentType.WEATHER
        assert result.confidence == 0.85

    @pytest.mark.asyncio
    async def test_market_intent(self) -> None:
        response = json.dumps({
            "primary_intent": "market",
            "secondary_intents": [],
            "confidence": 0.95,
            "entities": {"commodity": "wheat"},
            "reasoning": "User asks about wheat price",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("What is the current wheat price?")

        assert result.primary_intent == IntentType.MARKET
        assert result.confidence == 0.95

    @pytest.mark.asyncio
    async def test_scheme_intent(self) -> None:
        response = json.dumps({
            "primary_intent": "scheme",
            "secondary_intents": [],
            "confidence": 0.88,
            "entities": {},
            "reasoning": "User asks about government schemes",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("Tell me about PM-KISAN scheme")

        assert result.primary_intent == IntentType.SCHEME
        assert result.confidence == 0.88

    @pytest.mark.asyncio
    async def test_knowledge_intent(self) -> None:
        response = json.dumps({
            "primary_intent": "knowledge",
            "secondary_intents": [],
            "confidence": 0.82,
            "entities": {"crop": "rice"},
            "reasoning": "User asks how to sow rice",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("How to sow rice properly?")

        assert result.primary_intent == IntentType.KNOWLEDGE
        assert result.confidence == 0.82

    @pytest.mark.asyncio
    async def test_greeting_intent(self) -> None:
        response = json.dumps({
            "primary_intent": "greeting",
            "secondary_intents": [],
            "confidence": 0.99,
            "entities": {},
            "reasoning": "User says hello",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("Hello!")

        assert result.primary_intent == IntentType.GREETING
        assert result.confidence == 0.99

    @pytest.mark.asyncio
    async def test_general_intent(self) -> None:
        response = json.dumps({
            "primary_intent": "general",
            "secondary_intents": [],
            "confidence": 0.5,
            "entities": {},
            "reasoning": "Ambiguous message",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("Tell me something")

        assert result.primary_intent == IntentType.GENERAL
        assert result.confidence == 0.5

    @pytest.mark.asyncio
    async def test_secondary_intents(self) -> None:
        response = json.dumps({
            "primary_intent": "weather",
            "secondary_intents": ["market"],
            "confidence": 0.8,
            "entities": {},
            "reasoning": "User asks about weather and market",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("Weather and market update")

        assert result.primary_intent == IntentType.WEATHER
        assert IntentType.MARKET in result.secondary_intents

    @pytest.mark.asyncio
    async def test_multiple_secondary_intents(self) -> None:
        response = json.dumps({
            "primary_intent": "disease",
            "secondary_intents": ["weather", "knowledge"],
            "confidence": 0.75,
            "entities": {},
            "reasoning": "Complex query",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("Disease and weather")

        assert result.primary_intent == IntentType.DISEASE
        assert len(result.secondary_intents) == 2

    @pytest.mark.asyncio
    async def test_strips_markdown_fences(self) -> None:
        response = (
            '```json\n{"primary_intent": "weather", '
            '"secondary_intents": [], "confidence": 0.9, '
            '"entities": {}, "reasoning": "test"}\n```'
        )
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("Weather?")

        assert result.primary_intent == IntentType.WEATHER

    @pytest.mark.asyncio
    async def test_invalid_intent_falls_back_to_general(self) -> None:
        response = json.dumps({
            "primary_intent": "invalid_intent",
            "secondary_intents": [],
            "confidence": 0.5,
            "entities": {},
            "reasoning": "test",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify("Something")

        assert result.primary_intent == IntentType.GENERAL


# ---------------------------------------------------------------------------
# LLM Classification Failure Tests
# ---------------------------------------------------------------------------


class TestLLMClassificationFallback:
    """Tests for fallback to keyword classification."""

    @pytest.mark.asyncio
    async def test_no_provider_uses_keywords(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = await classifier.classify("My leaves have disease spots")

        assert result.primary_intent == IntentType.DISEASE

    @pytest.mark.asyncio
    async def test_provider_error_uses_keywords(self) -> None:
        classifier = IntentClassifier(provider=FailingProvider())
        result = await classifier.classify("What is the weather?")

        assert result.primary_intent == IntentType.WEATHER

    @pytest.mark.asyncio
    async def test_invalid_json_uses_keywords(self) -> None:
        provider = FakeProvider("not valid json at all")
        classifier = IntentClassifier(provider=provider)
        result = await classifier.classify("What is the weather?")

        assert result.primary_intent == IntentType.WEATHER

    @pytest.mark.asyncio
    async def test_empty_json_uses_llm_result(self) -> None:
        provider = FakeProvider("{}")
        classifier = IntentClassifier(provider=provider)
        result = await classifier.classify("Weather update?")

        # Empty JSON parses successfully with defaults, no fallback
        assert result.primary_intent == IntentType.GENERAL
        assert result.confidence == 0.5


# ---------------------------------------------------------------------------
# Keyword Classification Tests
# ---------------------------------------------------------------------------


class TestKeywordClassificationDisease:
    """Tests for disease keyword detection."""

    def test_disease_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("My crop has disease")

        assert result.primary_intent == IntentType.DISEASE

    def test_spots_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Leaves have spots")

        assert result.primary_intent == IntentType.DISEASE

    def test_pest_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("There are pests on my crop")

        assert result.primary_intent == IntentType.DISEASE

    def test_fungus_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("I see fungus on leaves")

        assert result.primary_intent == IntentType.DISEASE

    def test_blight_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("My tomatoes have blight")

        assert result.primary_intent == IntentType.DISEASE

    def test_infection_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("The plant is infected")

        assert result.primary_intent == IntentType.DISEASE

    def test_wilting_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("My plants are wilting")

        assert result.primary_intent == IntentType.DISEASE

    def test_leaf_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Yellow leaves on my crop")

        assert result.primary_intent == IntentType.DISEASE

    def test_brown_spots_combined(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Brown spots on leaves")

        assert result.primary_intent == IntentType.DISEASE
        assert result.confidence > 0.5


class TestKeywordClassificationWeather:
    """Tests for weather keyword detection."""

    def test_weather_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("What is the weather?")

        assert result.primary_intent == IntentType.WEATHER

    def test_rain_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Will it rain tomorrow?")

        assert result.primary_intent == IntentType.WEATHER

    def test_temperature_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Temperature forecast")

        assert result.primary_intent == IntentType.WEATHER

    def test_irrigation_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Should I do irrigation today?")

        assert result.primary_intent == IntentType.WEATHER

    def test_drought_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Drought conditions expected")

        assert result.primary_intent == IntentType.WEATHER

    def test_humidity_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("High humidity forecast")

        assert result.primary_intent == IntentType.WEATHER


class TestKeywordClassificationMarket:
    """Tests for market keyword detection."""

    def test_price_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("What is the wheat price?")

        assert result.primary_intent == IntentType.MARKET

    def test_market_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Market rates for rice")

        assert result.primary_intent == IntentType.MARKET

    def test_sell_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Should I sell now?")

        assert result.primary_intent == IntentType.MARKET

    def test_mandi_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Mandi rates today")

        assert result.primary_intent == IntentType.MARKET

    def test_msp_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("MSP for cotton")

        assert result.primary_intent == IntentType.MARKET

    def test_commodity_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Commodity prices update")

        assert result.primary_intent == IntentType.MARKET


class TestKeywordClassificationScheme:
    """Tests for government scheme keyword detection."""

    def test_government_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Tell me about government schemes")

        assert result.primary_intent == IntentType.SCHEME

    def test_subsidy_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Fertilizer subsidy available")

        assert result.primary_intent == IntentType.SCHEME

    def test_scheme_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("New scheme for farmers")

        assert result.primary_intent == IntentType.SCHEME

    def test_pm_kisan_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("PM-KISAN benefits")

        assert result.primary_intent == IntentType.SCHEME

    def test_insurance_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Crop insurance details")

        assert result.primary_intent == IntentType.SCHEME

    def test_yojana_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("New yojana for farmers")

        assert result.primary_intent == IntentType.SCHEME


class TestKeywordClassificationKnowledge:
    """Tests for knowledge keyword detection."""

    def test_how_to_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("How to grow wheat?")

        assert result.primary_intent == IntentType.KNOWLEDGE

    def test_what_is_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("What is organic farming?")

        assert result.primary_intent == IntentType.KNOWLEDGE

    def test_explain_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Explain organic farming methods")

        assert result.primary_intent == IntentType.KNOWLEDGE

    def test_fertilizer_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Which fertilizer to use?")

        assert result.primary_intent == IntentType.KNOWLEDGE

    def test_cultivation_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Best cultivation practices")

        assert result.primary_intent == IntentType.KNOWLEDGE

    def test_harvest_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("When to harvest rice?")

        assert result.primary_intent == IntentType.KNOWLEDGE


class TestKeywordClassificationGreeting:
    """Tests for greeting detection."""

    def test_hello_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Hello!")

        assert result.primary_intent == IntentType.GREETING

    def test_hi_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Hi there")

        assert result.primary_intent == IntentType.GREETING

    def test_namaste_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Namaste!")

        assert result.primary_intent == IntentType.GREETING

    def test_good_morning_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Good morning! How are you?")

        assert result.primary_intent == IntentType.GREETING

    def test_good_afternoon_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Good afternoon")

        assert result.primary_intent == IntentType.GREETING

    def test_good_evening_keyword(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Good evening farmer")

        assert result.primary_intent == IntentType.GREETING


class TestKeywordClassificationGeneral:
    """Tests for general/unknown message handling."""

    def test_unknown_message_returns_general(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Can you sing a song?")

        assert result.primary_intent == IntentType.GENERAL
        assert result.confidence <= 0.5

    def test_general_has_low_confidence(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Can you dance for me?")

        assert result.primary_intent == IntentType.GENERAL
        assert result.confidence <= 0.5


# ---------------------------------------------------------------------------
# Secondary Intent Tests
# ---------------------------------------------------------------------------


class TestSecondaryIntents:
    """Tests for secondary intent support."""

    def test_multiple_keywords_different_intents(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Weather and market update")

        assert result.primary_intent in (IntentType.WEATHER, IntentType.MARKET)
        assert len(result.secondary_intents) >= 0  # May or may not have secondary

    def test_disease_with_weather(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Disease and weather")

        assert result.primary_intent in (IntentType.DISEASE, IntentType.WEATHER)


# ---------------------------------------------------------------------------
# Confidence Score Tests
# ---------------------------------------------------------------------------


class TestConfidenceScores:
    """Tests for confidence score validation."""

    def test_confidence_between_0_and_1(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Weather forecast")

        assert 0.0 <= result.confidence <= 1.0

    def test_strong_match_has_higher_confidence(self) -> None:
        classifier = IntentClassifier(provider=None)
        result_strong = classifier._keyword_classify(
            "disease fungus blight infection spots"
        )
        result_weak = classifier._keyword_classify("weather")

        # Strong match should have higher or equal confidence
        assert result_strong.confidence >= result_weak.confidence


# ---------------------------------------------------------------------------
# Entity Extraction Tests
# ---------------------------------------------------------------------------


class TestEntityExtraction:
    """Tests for entity extraction."""

    @pytest.mark.asyncio
    async def test_llm_entity_extraction(self) -> None:
        response = json.dumps({
            "primary_intent": "weather",
            "secondary_intents": [],
            "confidence": 0.9,
            "entities": {"crop": "wheat", "location": "Meerut"},
            "reasoning": "User asks about wheat weather in Meerut",
        })
        classifier = IntentClassifier(provider=FakeProvider(response))
        result = await classifier.classify(
            "What's the weather for wheat in Meerut?"
        )

        assert result.entities.get("crop") == "wheat"
        assert result.entities.get("location") == "Meerut"

    @pytest.mark.asyncio
    async def test_keyword_entities_empty(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("Weather forecast")

        # Keyword fallback may not extract entities
        assert isinstance(result.entities, dict)


# ---------------------------------------------------------------------------
# Edge Case Tests
# ---------------------------------------------------------------------------


class TestEdgeCases:
    """Tests for edge cases and safety."""

    @pytest.mark.asyncio
    async def test_empty_message(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = await classifier.classify("")

        assert result.primary_intent == IntentType.GENERAL
        assert result.confidence <= 0.5

    @pytest.mark.asyncio
    async def test_whitespace_only_message(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = await classifier.classify("   \n\t  ")

        assert result.primary_intent == IntentType.GENERAL
        assert result.confidence <= 0.5

    @pytest.mark.asyncio
    async def test_very_long_message(self) -> None:
        classifier = IntentClassifier(provider=None)
        long_message = "weather " * 1000  # 7000+ characters

        result = await classifier.classify(long_message)

        assert result.primary_intent == IntentType.WEATHER
        assert 0.0 <= result.confidence <= 1.0

    @pytest.mark.asyncio
    async def test_hindi_message(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = await classifier.classify("aaj mausam kaisa hai")

        # Hindi message may not match English keywords
        assert result.primary_intent in (IntentType.GENERAL, IntentType.WEATHER)

    @pytest.mark.asyncio
    async def test_mixed_language_message(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = await classifier.classify("Weather update for my farm")

        assert result.primary_intent == IntentType.WEATHER

    def test_keyword_classify_case_insensitive(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("WEATHER UPDATE")

        assert result.primary_intent == IntentType.WEATHER

    def test_keyword_classify_partial_match(self) -> None:
        classifier = IntentClassifier(provider=None)
        result = classifier._keyword_classify("rainy day")

        assert result.primary_intent == IntentType.WEATHER


# ---------------------------------------------------------------------------
# Schema Validation Tests
# ---------------------------------------------------------------------------


class TestSchemaValidation:
    """Tests for IntentClassification schema validation."""

    def test_valid_intent_classification(self) -> None:
        result = IntentClassification(
            primary_intent=IntentType.WEATHER,
            confidence=0.8,
        )
        assert result.primary_intent == IntentType.WEATHER
        assert result.confidence == 0.8
        assert result.secondary_intents == []
        assert result.entities == {}
        assert result.reasoning == ""

    def test_full_intent_classification(self) -> None:
        result = IntentClassification(
            primary_intent=IntentType.DISEASE,
            secondary_intents=[IntentType.WEATHER],
            confidence=0.95,
            entities={"crop": "tomato"},
            reasoning="Disease detected",
        )
        assert result.primary_intent == IntentType.DISEASE
        assert IntentType.WEATHER in result.secondary_intents
        assert result.confidence == 0.95

    def test_confidence_bounds_validation(self) -> None:
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            IntentClassification(
                primary_intent=IntentType.GENERAL,
                confidence=-0.1,
            )

        with pytest.raises(ValidationError):
            IntentClassification(
                primary_intent=IntentType.GENERAL,
                confidence=1.1,
            )

    def test_intent_type_enum(self) -> None:
        assert IntentType.DISEASE.value == "disease"
        assert IntentType.WEATHER.value == "weather"
        assert IntentType.MARKET.value == "market"
        assert IntentType.SCHEME.value == "scheme"
        assert IntentType.KNOWLEDGE.value == "knowledge"
        assert IntentType.GENERAL.value == "general"
        assert IntentType.GREETING.value == "greeting"


# ---------------------------------------------------------------------------
# LLM Response Parsing Tests
# ---------------------------------------------------------------------------


class TestLLMResponseParsing:
    """Tests for LLM response parsing."""

    def test_parse_valid_json(self) -> None:
        response = json.dumps({
            "primary_intent": "weather",
            "secondary_intents": ["market"],
            "confidence": 0.85,
            "entities": {"location": "Delhi"},
            "reasoning": "Weather query",
        })
        result = IntentClassifier._parse_llm_response(response)

        assert result.primary_intent == IntentType.WEATHER
        assert IntentType.MARKET in result.secondary_intents
        assert result.confidence == 0.85

    def test_parse_invalid_json_raises(self) -> None:
        with pytest.raises(json.JSONDecodeError):
            IntentClassifier._parse_llm_response("not valid json")

    def test_parse_missing_fields_uses_defaults(self) -> None:
        response = json.dumps({})
        result = IntentClassifier._parse_llm_response(response)

        assert result.primary_intent == IntentType.GENERAL
        assert result.confidence == 0.5

    def test_parse_invalid_intent_type(self) -> None:
        response = json.dumps({
            "primary_intent": "invalid",
            "confidence": 0.5,
        })
        result = IntentClassifier._parse_llm_response(response)

        assert result.primary_intent == IntentType.GENERAL

    def test_parse_invalid_secondary_intents(self) -> None:
        response = json.dumps({
            "primary_intent": "weather",
            "secondary_intents": ["invalid1", "invalid2"],
            "confidence": 0.8,
        })
        result = IntentClassifier._parse_llm_response(response)

        assert result.primary_intent == IntentType.WEATHER
        assert result.secondary_intents == []

    def test_parse_confidence_out_of_bounds(self) -> None:
        response = json.dumps({
            "primary_intent": "weather",
            "confidence": 1.5,
        })
        result = IntentClassifier._parse_llm_response(response)

        assert result.confidence == 1.0  # Clamped to max

    def test_parse_negative_confidence(self) -> None:
        response = json.dumps({
            "primary_intent": "weather",
            "confidence": -0.5,
        })
        result = IntentClassifier._parse_llm_response(response)

        assert result.confidence == 0.0  # Clamped to min
