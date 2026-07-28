"""Tests for the KnowledgeTool."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest

from app.tools.knowledge import KnowledgeTool


class FakeMemory:
    """Minimal in-memory memory object for tests."""

    def __init__(
        self,
        memory_id: str = "mem-1",
        content: str = "Wheat needs nitrogen fertilizer.",
        memory_type: str = "observation",
        crop: str | None = "wheat",
        location: str | None = "Punjab",
    ) -> None:
        self.memory_id = memory_id
        self.content = content
        self.memory_type = memory_type
        self.crop = crop
        self.location = location


class FakeMemoryService:
    """Fake MemoryService that returns predetermined memories."""

    def __init__(self, memories: list[FakeMemory] | None = None) -> None:
        self._memories = memories or []

    async def search_memories(self, user_id: str, request: Any) -> list[FakeMemory]:
        return self._memories


@pytest.mark.asyncio
async def test_knowledge_tool_returns_documents() -> None:
    mem = FakeMemory(
        memory_id="m1",
        content="Use neem oil for pest control.",
        memory_type="recommendation",
    )
    with patch(
        "app.tools.knowledge.MemoryService",
        return_value=FakeMemoryService([mem]),
    ):
        tool = KnowledgeTool()
        result = await tool.run("How to control pests?", {"user_id": "u1"})
    assert result["success"] is True
    docs = result["data"]["documents"]
    assert len(docs) == 1
    assert docs[0]["content"] == "Use neem oil for pest control."
    assert docs[0]["source"] == "recommendation"
    assert result["data"]["count"] == 1


@pytest.mark.asyncio
async def test_knowledge_tool_empty_retrieval() -> None:
    with patch(
        "app.tools.knowledge.MemoryService",
        return_value=FakeMemoryService([]),
    ):
        tool = KnowledgeTool()
        result = await tool.run("What is quantum farming?", {"user_id": "u1"})
    assert result["success"] is True
    assert result["data"]["documents"] == []
    assert result["data"]["count"] == 0


@pytest.mark.asyncio
async def test_knowledge_tool_no_user_id() -> None:
    tool = KnowledgeTool()
    result = await tool.run("query", {})
    assert result["success"] is True
    assert result["data"]["count"] == 0


@pytest.mark.asyncio
async def test_knowledge_tool_retriever_exception() -> None:
    class _FailingService:
        async def search_memories(self, user_id: str, request: Any) -> Any:
            raise RuntimeError("ChromaDB down")

    with patch(
        "app.tools.knowledge.MemoryService",
        return_value=_FailingService(),
    ):
        tool = KnowledgeTool()
        result = await tool.run("query", {"user_id": "u1"})
    assert result["success"] is False
    assert "ChromaDB down" in result["data"]["error"]


@pytest.mark.asyncio
async def test_knowledge_tool_passes_k_parameter() -> None:
    """Verify that ``k`` from context is forwarded to the search."""

    class _CaptureService:
        def __init__(self) -> None:
            self.captured_limit: int | None = None

        async def search_memories(self, user_id: str, request: Any) -> list[FakeMemory]:
            self.captured_limit = request.limit
            return []

    svc = _CaptureService()
    with patch("app.tools.knowledge.MemoryService", return_value=svc):
        tool = KnowledgeTool()
        await tool.run("query", {"user_id": "u1", "k": 12})
    assert svc.captured_limit == 12


@pytest.mark.asyncio
async def test_knowledge_tool_metadata_fields() -> None:
    mem = FakeMemory(
        memory_id="m2",
        content="Rice needs flooded fields.",
        memory_type="observation",
        crop="rice",
        location="Bihar",
    )
    with patch(
        "app.tools.knowledge.MemoryService",
        return_value=FakeMemoryService([mem]),
    ):
        tool = KnowledgeTool()
        result = await tool.run("rice tips", {"user_id": "u1"})
    doc = result["data"]["documents"][0]
    assert doc["id"] == "m2"
    assert doc["metadata"]["crop"] == "rice"
    assert doc["metadata"]["location"] == "Bihar"
    assert doc["metadata"]["memory_type"] == "observation"
