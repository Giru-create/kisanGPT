"""Tests for the KnowledgeTool."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest

from app.rag.retriever import RetrievalResult
from app.tools.knowledge import KnowledgeTool


def _make_result(
    doc_id: str = "m1",
    content: str = "Wheat needs nitrogen fertilizer.",
    score: float = 0.85,
    source: str = "/data/crops/wheat.md",
    title: str = "Wheat Guide",
    category: str = "crop",
    crop: str = "wheat",
) -> RetrievalResult:
    return RetrievalResult(
        id=doc_id,
        content=content,
        score=score,
        metadata={
            "source": source,
            "title": title,
            "category": category,
            "crop": crop,
            "state": "Punjab",
            "language": "en",
            "tags": [category],
            "heading": "",
        },
    )


@pytest.mark.asyncio
async def test_knowledge_tool_returns_documents() -> None:
    result_obj = _make_result(
        doc_id="m1",
        content="Use neem oil for pest control.",
        source="/data/diseases/pest.md",
        title="Pest Guide",
        category="disease",
        crop="",
    )
    with patch("app.rag.retriever.KnowledgeRetriever") as mock_cls:
        instance = AsyncMock()
        instance.retrieve.return_value = [result_obj]
        mock_cls.return_value = instance

        tool = KnowledgeTool()
        result = await tool.run("How to control pests?", {"user_id": "u1"})

    assert result["success"] is True
    docs = result["data"]["documents"]
    assert len(docs) == 1
    assert docs[0]["content"] == "Use neem oil for pest control."
    assert docs[0]["source"] == "/data/diseases/pest.md"
    assert result["data"]["count"] == 1


@pytest.mark.asyncio
async def test_knowledge_tool_empty_retrieval() -> None:
    with patch("app.rag.retriever.KnowledgeRetriever") as mock_cls:
        instance = AsyncMock()
        instance.retrieve.return_value = []
        mock_cls.return_value = instance

        tool = KnowledgeTool()
        result = await tool.run("What is quantum farming?", {"user_id": "u1"})

    assert result["success"] is True
    assert result["data"]["documents"] == []
    assert result["data"]["count"] == 0


@pytest.mark.asyncio
async def test_knowledge_tool_no_user_id() -> None:
    with patch("app.rag.retriever.KnowledgeRetriever") as mock_cls:
        instance = AsyncMock()
        instance.retrieve.return_value = []
        mock_cls.return_value = instance

        tool = KnowledgeTool()
        result = await tool.run("query", {})

    assert result["success"] is True
    assert result["data"]["count"] == 0


@pytest.mark.asyncio
async def test_knowledge_tool_retriever_exception() -> None:
    with patch("app.rag.retriever.KnowledgeRetriever") as mock_cls:
        mock_cls.side_effect = RuntimeError("ChromaDB down")
        tool = KnowledgeTool()
        result = await tool.run("query", {"user_id": "u1"})

    assert result["success"] is False
    assert "ChromaDB down" in result["data"]["error"]


@pytest.mark.asyncio
async def test_knowledge_tool_passes_k_parameter() -> None:
    """Verify that ``k`` from context is forwarded to the search."""
    with patch("app.rag.retriever.KnowledgeRetriever") as mock_cls:
        instance = AsyncMock()
        instance.retrieve.return_value = []
        mock_cls.return_value = instance

        tool = KnowledgeTool()
        await tool.run("query", {"user_id": "u1", "k": 12})

        call_kwargs = instance.retrieve.call_args
        top_k = call_kwargs.kwargs.get("top_k") or call_kwargs[1].get("top_k")
        assert top_k == 12


@pytest.mark.asyncio
async def test_knowledge_tool_metadata_fields() -> None:
    result_obj = _make_result(
        doc_id="m2",
        content="Rice needs flooded fields.",
        source="/data/crops/rice.md",
        title="Rice Guide",
        crop="rice",
    )
    with patch("app.rag.retriever.KnowledgeRetriever") as mock_cls:
        instance = AsyncMock()
        instance.retrieve.return_value = [result_obj]
        mock_cls.return_value = instance

        tool = KnowledgeTool()
        result = await tool.run("rice tips", {"user_id": "u1"})

    doc = result["data"]["documents"][0]
    assert doc["id"] == "m2"
    assert doc["metadata"]["crop"] == "rice"
    assert doc["source"] == "/data/crops/rice.md"
    assert doc["title"] == "Rice Guide"
