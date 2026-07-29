"""Tests for RAG ingestion pipeline (mocked embeddings and vector store)."""

from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

from app.rag.collection import KnowledgeCollection
from app.rag.ingest import DocumentIngestor

if TYPE_CHECKING:
    from pathlib import Path


class MockEmbeddingProvider:
    async def embed(self, text: str) -> list[float]:
        return [0.1] * 768

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return [[0.1] * 768 for _ in texts]


class MockVectorStore:
    def __init__(self) -> None:
        self._store: dict[str, dict] = {}

    async def add(self, collection, ids, embeddings, documents, metadatas=None):
        for i, doc_id in enumerate(ids):
            self._store[doc_id] = {
                "document": documents[i],
                "embedding": embeddings[i],
                "metadata": metadatas[i] if metadatas else {},
            }

    async def search(self, collection, query_embedding, n_results=10, where=None):
        return []

    async def delete(self, collection, ids):
        for doc_id in ids:
            self._store.pop(doc_id, None)

    async def get(self, collection, ids):
        return [
            {
                "id": i,
                "document": self._store[i]["document"],
                "metadata": self._store[i]["metadata"],
            }
            for i in ids
            if i in self._store
        ]

    async def count(self, collection):
        return len(self._store)


@pytest.fixture
def mock_deps():
    embedding = MockEmbeddingProvider()
    store = MockVectorStore()
    collection = KnowledgeCollection(vector_store=store)
    return embedding, store, collection


class TestDocumentIngestor:
    """Tests for the ingestion pipeline."""

    @pytest.mark.asyncio
    async def test_ingest_txt_file(self, tmp_path: Path, mock_deps):
        embedding, store, collection = mock_deps
        f = tmp_path / "test.txt"
        f.write_text("This is test content about rice farming.")

        ingestor = DocumentIngestor(embedding_provider=embedding, collection=collection)
        result = await ingestor.ingest_file(f)
        assert result["added"] >= 1

    @pytest.mark.asyncio
    async def test_ingest_md_file(self, tmp_path: Path, mock_deps):
        embedding, store, collection = mock_deps
        f = tmp_path / "guide.md"
        f.write_text("# Rice Guide\n\nRice is a staple crop.\n\nIt grows in water.")

        ingestor = DocumentIngestor(embedding_provider=embedding, collection=collection)
        result = await ingestor.ingest_file(f)
        assert result["added"] >= 1

    @pytest.mark.asyncio
    async def test_ingest_directory(self, tmp_path: Path, mock_deps):
        embedding, store, collection = mock_deps
        (tmp_path / "a.txt").write_text(
            "This is a unique document about cotton farming in Gujarat."
        )
        (tmp_path / "b.md").write_text(
            "# Wheat Guide\n\nWheat is a major crop in Haryana."
        )

        ingestor = DocumentIngestor(embedding_provider=embedding, collection=collection)
        result = await ingestor.ingest_directory(tmp_path)
        assert result["added"] >= 1

    @pytest.mark.asyncio
    async def test_ingest_nonexistent_file(self, mock_deps):
        embedding, store, collection = mock_deps
        ingestor = DocumentIngestor(embedding_provider=embedding, collection=collection)
        result = await ingestor.ingest_file("/nonexistent/file.txt")
        assert result["added"] == 0

    @pytest.mark.asyncio
    async def test_ingest_empty_directory(self, tmp_path: Path, mock_deps):
        embedding, store, collection = mock_deps
        ingestor = DocumentIngestor(embedding_provider=embedding, collection=collection)
        result = await ingestor.ingest_directory(tmp_path)
        assert result["added"] == 0

    @pytest.mark.asyncio
    async def test_duplicate_detection(self, tmp_path: Path, mock_deps):
        embedding, store, collection = mock_deps
        f = tmp_path / "test.txt"
        f.write_text("Same content twice")

        ingestor = DocumentIngestor(embedding_provider=embedding, collection=collection)
        await ingestor.ingest_file(f)
        result = await ingestor.ingest_file(f)
        assert result["added"] == 0
        assert result["updated"] == 0

    @pytest.mark.asyncio
    async def test_content_change_triggers_update(self, tmp_path: Path, mock_deps):
        embedding, store, collection = mock_deps
        f = tmp_path / "test.txt"
        f.write_text("Version 1 of the document")

        ingestor = DocumentIngestor(embedding_provider=embedding, collection=collection)
        await ingestor.ingest_file(f)
        f.write_text("Version 2 of the document")
        result = await ingestor.ingest_file(f)
        assert result["updated"] >= 1
