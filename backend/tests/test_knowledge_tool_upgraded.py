"""Tests for upgraded KnowledgeTool."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest

from app.rag.retriever import RetrievalResult
from app.tools.knowledge import KnowledgeTool


def _make_retrieval_result(
    doc_id: str = "doc1",
    content: str = "Test knowledge",
    score: float = 0.85,
    source: str = "/data/crops/rice.md",
    title: str = "Rice Guide",
    category: str = "crop",
    crop: str = "rice",
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
            "tags": [category, crop],
            "heading": "Overview",
        },
    )


class TestKnowledgeTool:
    """Tests for the upgraded KnowledgeTool."""

    @pytest.mark.asyncio
    async def test_basic_retrieval(self):
        tool = KnowledgeTool()
        with patch("app.rag.retriever.KnowledgeRetriever") as mock_retriever_cls:
            instance = AsyncMock()
            instance.retrieve.return_value = [_make_retrieval_result()]
            mock_retriever_cls.return_value = instance

            result = await tool.run("rice farming", {})

        assert result["success"]
        docs = result["data"]["documents"]
        assert len(docs) == 1
        assert docs[0]["score"] == 0.85
        assert docs[0]["title"] == "Rice Guide"
        assert docs[0]["metadata"]["category"] == "crop"

    @pytest.mark.asyncio
    async def test_empty_results(self):
        tool = KnowledgeTool()
        with patch("app.rag.retriever.KnowledgeRetriever") as mock_retriever_cls:
            instance = AsyncMock()
            instance.retrieve.return_value = []
            mock_retriever_cls.return_value = instance

            result = await tool.run("nonexistent", {})

        assert result["success"]
        assert result["data"]["count"] == 0

    @pytest.mark.asyncio
    async def test_filters_passed(self):
        tool = KnowledgeTool()
        with patch("app.rag.retriever.KnowledgeRetriever") as mock_retriever_cls:
            instance = AsyncMock()
            instance.retrieve.return_value = []
            mock_retriever_cls.return_value = instance

            await tool.run(
                "query",
                {"category": "crop", "crop": "wheat", "state": "Haryana"},
            )

            call_kwargs = instance.retrieve.call_args
            filters = call_kwargs.kwargs.get("filters") or call_kwargs[1].get("filters")
            assert filters.category == "crop"
            assert filters.crop == "wheat"
            assert filters.state == "Haryana"

    @pytest.mark.asyncio
    async def test_k_parameter(self):
        tool = KnowledgeTool()
        with patch("app.rag.retriever.KnowledgeRetriever") as mock_retriever_cls:
            instance = AsyncMock()
            instance.retrieve.return_value = []
            mock_retriever_cls.return_value = instance

            await tool.run("query", {"k": 10})

            call_kwargs = instance.retrieve.call_args
            top_k = call_kwargs.kwargs.get("top_k") or call_kwargs[1].get("top_k")
            assert top_k == 10

    @pytest.mark.asyncio
    async def test_exception_returns_error(self):
        tool = KnowledgeTool()
        with patch("app.rag.retriever.KnowledgeRetriever") as mock_retriever_cls:
            mock_retriever_cls.side_effect = RuntimeError("connection failed")
            result = await tool.run("query", {})

        assert not result["success"]
        assert "connection failed" in result["data"]["error"]

    @pytest.mark.asyncio
    async def test_source_citation_included(self):
        tool = KnowledgeTool()
        with patch("app.rag.retriever.KnowledgeRetriever") as mock_retriever_cls:
            instance = AsyncMock()
            instance.retrieve.return_value = [_make_retrieval_result()]
            mock_retriever_cls.return_value = instance

            result = await tool.run("query", {})

        doc = result["data"]["documents"][0]
        assert doc["source"] == "/data/crops/rice.md"
        assert doc["title"] == "Rice Guide"
