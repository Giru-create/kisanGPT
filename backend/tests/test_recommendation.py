"""Tests for recommendation engine."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from app.schemas.memory import RecommendationRequest
from app.services.recommendation import RecommendationEngine


class FakeMemoryService:
    """Fake memory service for testing."""

    def __init__(self, memories: list | None = None) -> None:
        self.memories = memories or []

    async def get_user_memories(
        self,
        user_id: str,
        memory_type: str | None = None,
        limit: int = 50,
    ) -> list:
        return self.memories[:limit]


class FakeLLMProvider:
    """Fake LLM provider for testing."""

    def __init__(self, response: str = "") -> None:
        self._response = response
        self.call_count = 0

    async def generate(self, *, system_instruction: str, user_content: str) -> str:
        self.call_count += 1
        return self._response


@pytest.fixture
def fake_memory_service() -> FakeMemoryService:
    return FakeMemoryService()


@pytest.fixture
def fake_llm_provider() -> FakeLLMProvider:
    return FakeLLMProvider(
        response=(
            "1. Use organic fertilizer for better soil health."
            "\n2. Rotate crops every season."
        )
    )


@pytest.fixture
def recommendation_engine(
    fake_memory_service: FakeMemoryService,
    fake_llm_provider: FakeLLMProvider,
) -> RecommendationEngine:
    return RecommendationEngine(
        memory_service=fake_memory_service,
        llm_provider=fake_llm_provider,
    )


@pytest.mark.asyncio
async def test_generate_recommendations_with_llm(
    recommendation_engine: RecommendationEngine,
    fake_llm_provider: FakeLLMProvider,
) -> None:
    request = RecommendationRequest(crop="wheat", limit=5)
    recommendations = await recommendation_engine.generate_recommendations(
        user_id="user-123",
        request=request,
    )
    assert len(recommendations) >= 1
    assert fake_llm_provider.call_count == 1
    assert recommendations[0].user_id == "user-123"


@pytest.mark.asyncio
async def test_generate_recommendations_without_llm() -> None:
    engine = RecommendationEngine(
        memory_service=FakeMemoryService(),
        llm_provider=None,
    )
    request = RecommendationRequest(crop="wheat", limit=5)
    recommendations = await engine.generate_recommendations(
        user_id="user-123",
        request=request,
    )
    assert len(recommendations) >= 1
    assert recommendations[0].user_id == "user-123"


@pytest.mark.asyncio
async def test_recommendations_based_on_memory_patterns() -> None:
    memories = [
        MagicMock(memory_type="diagnosis", memory_id="mem-1"),
        MagicMock(memory_type="diagnosis", memory_id="mem-2"),
        MagicMock(memory_type="weather", memory_id="mem-3"),
        MagicMock(memory_type="weather", memory_id="mem-4"),
        MagicMock(memory_type="weather", memory_id="mem-5"),
    ]
    engine = RecommendationEngine(
        memory_service=FakeMemoryService(memories=memories),
        llm_provider=None,
    )
    request = RecommendationRequest(limit=5)
    recommendations = await engine.generate_recommendations(
        user_id="user-123",
        request=request,
    )
    # Should have recommendations based on diagnosis and weather patterns
    assert len(recommendations) >= 1
    titles = [r.title for r in recommendations]
    assert any("Crop Health" in t or "Weather" in t for t in titles)


@pytest.mark.asyncio
async def test_recommendations_with_crop_in_memories() -> None:
    memories = [
        MagicMock(memory_type="observation", memory_id="mem-1", crop="wheat"),
        MagicMock(memory_type="action", memory_id="mem-2", crop="wheat"),
    ]
    engine = RecommendationEngine(
        memory_service=FakeMemoryService(memories=memories),
        llm_provider=None,
    )
    request = RecommendationRequest(limit=5)
    recommendations = await engine.generate_recommendations(
        user_id="user-123",
        request=request,
    )
    assert len(recommendations) >= 1
    # Should have a crop rotation recommendation
    titles = [r.title for r in recommendations]
    assert any("Crop Rotation" in t for t in titles)


@pytest.mark.asyncio
async def test_recommendations_fallback_when_no_patterns() -> None:
    engine = RecommendationEngine(
        memory_service=FakeMemoryService(memories=[]),
        llm_provider=None,
    )
    request = RecommendationRequest(limit=5)
    recommendations = await engine.generate_recommendations(
        user_id="user-123",
        request=request,
    )
    assert len(recommendations) == 1
    assert recommendations[0].title == "Start Recording Farm Activities"


@pytest.mark.asyncio
async def test_llm_failure_falls_back() -> None:
    class FailingLLMProvider:
        async def generate(self, *, system_instruction: str, user_content: str) -> str:
            raise RuntimeError("LLM unavailable")

    engine = RecommendationEngine(
        memory_service=FakeMemoryService(),
        llm_provider=FailingLLMProvider(),
    )
    request = RecommendationRequest(limit=5)
    recommendations = await engine.generate_recommendations(
        user_id="user-123",
        request=request,
    )
    # Should fall back to basic recommendations
    assert len(recommendations) >= 1
