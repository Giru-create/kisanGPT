"""Tests for RAG retriever (mocked vector store and embeddings)."""

from __future__ import annotations

import pytest

from app.rag.retriever import KnowledgeRetriever, RetrievalFilter, RetrievalResult


class MockEmbeddingProvider:
    async def embed(self, text: str) -> list[float]:
        return [0.1] * 768

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return [[0.1] * 768 for _ in texts]


class MockVectorStore:
    def __init__(self, results: list[dict] | None = None) -> None:
        self._results = results or []
        self._last_where = None

    async def add(self, collection, ids, embeddings, documents, metadatas=None):
        pass

    async def search(self, collection, query_embedding, n_results=10, where=None):
        self._last_where = where
        return self._results[:n_results]

    async def delete(self, collection, ids):
        pass

    async def get(self, collection, ids):
        return []

    async def count(self, collection):
        return 0


def _make_result(
    doc_id: str = "doc1",
    content: str = "test content",
    distance: float = 0.5,
    metadata: dict | None = None,
) -> dict:
    return {
        "id": doc_id,
        "document": content,
        "distance": distance,
        "metadata": metadata or {},
    }


class TestKnowledgeRetriever:
    """Tests for knowledge retrieval."""

    @pytest.mark.asyncio
    async def test_retrieve_basic(self):
        results = [_make_result("d1", "Rice info", 0.5)]
        store = MockVectorStore(results)
        retriever = KnowledgeRetriever(vector_store=store)
        retriever._embedding = MockEmbeddingProvider()

        found = await retriever.retrieve("rice", top_k=5)
        assert len(found) == 1
        assert found[0].id == "d1"
        assert found[0].score > 0

    @pytest.mark.asyncio
    async def test_retrieve_empty(self):
        store = MockVectorStore([])
        retriever = KnowledgeRetriever(vector_store=store)
        retriever._embedding = MockEmbeddingProvider()

        found = await retriever.retrieve("nothing")
        assert found == []

    @pytest.mark.asyncio
    async def test_min_score_filter(self):
        results = [
            _make_result("d1", "good match", 0.3),
            _make_result("d2", "poor match", 1.8),
        ]
        store = MockVectorStore(results)
        retriever = KnowledgeRetriever(vector_store=store)
        retriever._embedding = MockEmbeddingProvider()

        found = await retriever.retrieve("query", min_score=0.5)
        assert len(found) == 1
        assert found[0].id == "d1"

    @pytest.mark.asyncio
    async def test_results_sorted_by_score(self):
        results = [
            _make_result("d1", "low", 0.1),
            _make_result("d2", "high", 1.5),
            _make_result("d3", "mid", 0.8),
        ]
        store = MockVectorStore(results)
        retriever = KnowledgeRetriever(vector_store=store)
        retriever._embedding = MockEmbeddingProvider()

        found = await retriever.retrieve("query", min_score=0.0)
        assert len(found) >= 2
        assert found[0].score >= found[1].score

    @pytest.mark.asyncio
    async def test_filter_category(self):
        store = MockVectorStore([])
        retriever = KnowledgeRetriever(vector_store=store)
        retriever._embedding = MockEmbeddingProvider()

        filters = RetrievalFilter(category="crop")
        await retriever.retrieve("query", filters=filters)
        assert store._last_where is not None

    @pytest.mark.asyncio
    async def test_filter_crop(self):
        store = MockVectorStore([])
        retriever = KnowledgeRetriever(vector_store=store)
        retriever._embedding = MockEmbeddingProvider()

        filters = RetrievalFilter(crop="rice")
        await retriever.retrieve("query", filters=filters)
        assert store._last_where is not None

    @pytest.mark.asyncio
    async def test_retrieval_result_fields(self):
        r = RetrievalResult(id="x", content="text", score=0.9, metadata={"a": 1})
        assert r.id == "x"
        assert r.content == "text"
        assert r.score == 0.9
        assert r.metadata["a"] == 1

    @pytest.mark.asyncio
    async def test_distance_to_score(self):
        assert KnowledgeRetriever._distance_to_score(0.0) == 1.0
        assert KnowledgeRetriever._distance_to_score(1.0) == 0.5
        assert KnowledgeRetriever._distance_to_score(2.0) == 0.0
        assert KnowledgeRetriever._distance_to_score(3.0) == 0.0
