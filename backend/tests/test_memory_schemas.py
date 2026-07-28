"""Tests for memory schemas."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.memory import (
    FarmMemory,
    MemoryCreateRequest,
    MemorySearchRequest,
    Recommendation,
    RecommendationRequest,
)


class TestFarmMemory:
    """Tests for FarmMemory schema."""

    def test_create_minimal(self) -> None:
        memory = FarmMemory(
            user_id="user-123",
            content="Observed yellow leaves on wheat crop",
            memory_type="observation",
        )
        assert memory.user_id == "user-123"
        assert memory.content == "Observed yellow leaves on wheat crop"
        assert memory.memory_type == "observation"
        assert memory.memory_id is not None
        assert len(memory.memory_id) == 12

    def test_create_with_optional_fields(self) -> None:
        memory = FarmMemory(
            user_id="user-123",
            content="Applied fertilizer to wheat field",
            memory_type="action",
            crop="wheat",
            location="Punjab",
            metadata={"field": "north"},
        )
        assert memory.crop == "wheat"
        assert memory.location == "Punjab"
        assert memory.metadata == {"field": "north"}

    def test_invalid_memory_type(self) -> None:
        with pytest.raises(ValidationError):
            FarmMemory(
                user_id="user-123",
                content="Test",
                memory_type="invalid",
            )

    def test_valid_memory_types(self) -> None:
        valid_types = [
            "observation",
            "action",
            "recommendation",
            "diagnosis",
            "weather",
            "market",
        ]
        for memory_type in valid_types:
            memory = FarmMemory(
                user_id="user-123",
                content="Test",
                memory_type=memory_type,
            )
            assert memory.memory_type == memory_type


class TestMemoryCreateRequest:
    """Tests for MemoryCreateRequest schema."""

    def test_create_request(self) -> None:
        request = MemoryCreateRequest(
            content="Test memory content",
            memory_type="observation",
        )
        assert request.content == "Test memory content"
        assert request.memory_type == "observation"
        assert request.crop is None
        assert request.location is None
        assert request.metadata == {}

    def test_create_request_with_options(self) -> None:
        request = MemoryCreateRequest(
            content="Test memory content",
            memory_type="action",
            crop="rice",
            location="Haryana",
            metadata={"season": "kharif"},
        )
        assert request.crop == "rice"
        assert request.location == "Haryana"
        assert request.metadata == {"season": "kharif"}

    def test_empty_content(self) -> None:
        with pytest.raises(ValidationError):
            MemoryCreateRequest(
                content="",
                memory_type="observation",
            )


class TestMemorySearchRequest:
    """Tests for MemorySearchRequest schema."""

    def test_search_request(self) -> None:
        request = MemorySearchRequest(query="wheat disease")
        assert request.query == "wheat disease"
        assert request.crop is None
        assert request.memory_type is None
        assert request.limit == 10

    def test_search_request_with_filters(self) -> None:
        request = MemorySearchRequest(
            query="disease symptoms",
            crop="wheat",
            memory_type="diagnosis",
            limit=5,
        )
        assert request.crop == "wheat"
        assert request.memory_type == "diagnosis"
        assert request.limit == 5

    def test_invalid_limit(self) -> None:
        with pytest.raises(ValidationError):
            MemorySearchRequest(query="test", limit=0)
        with pytest.raises(ValidationError):
            MemorySearchRequest(query="test", limit=51)


class TestRecommendation:
    """Tests for Recommendation schema."""

    def test_create_recommendation(self) -> None:
        rec = Recommendation(
            user_id="user-123",
            title="Use organic fertilizer",
            content="Based on your soil test, organic fertilizer is recommended.",
            recommendation_type="fertilizer",
        )
        assert rec.user_id == "user-123"
        assert rec.title == "Use organic fertilizer"
        assert rec.recommendation_type == "fertilizer"
        assert rec.priority == "medium"
        assert rec.confidence == 0.5
        assert rec.source_memories == []

    def test_recommendation_with_source_memories(self) -> None:
        rec = Recommendation(
            user_id="user-123",
            title="Rotate crops",
            content="Crop rotation improves soil health.",
            recommendation_type="crop",
            priority="high",
            confidence=0.8,
            source_memories=["mem-1", "mem-2"],
        )
        assert rec.source_memories == ["mem-1", "mem-2"]
        assert rec.priority == "high"
        assert rec.confidence == 0.8


class TestRecommendationRequest:
    """Tests for RecommendationRequest schema."""

    def test_default_request(self) -> None:
        request = RecommendationRequest()
        assert request.crop is None
        assert request.location is None
        assert request.limit == 5

    def test_custom_request(self) -> None:
        request = RecommendationRequest(
            crop="maize",
            location="Maharashtra",
            limit=10,
        )
        assert request.crop == "maize"
        assert request.location == "Maharashtra"
        assert request.limit == 10
