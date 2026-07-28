"""Tests for memory service."""

from __future__ import annotations

from typing import Any

import pytest

from app.schemas.memory import MemoryCreateRequest, MemorySearchRequest
from app.services.memory import MemoryService


class FakeVectorStore:
    """Fake vector store for testing."""

    def __init__(self) -> None:
        self.store: dict[str, dict[str, Any]] = {}

    async def add(
        self,
        collection: str,
        ids: list[str],
        embeddings: list[list[float]],
        documents: list[str],
        metadatas: list[dict[str, Any]] | None = None,
    ) -> None:
        for i, doc_id in enumerate(ids):
            self.store[doc_id] = {
                "document": documents[i],
                "metadata": metadatas[i] if metadatas else {},
            }

    async def search(
        self,
        collection: str,
        query_embedding: list[float],
        n_results: int = 10,
        where: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        results = []
        for doc_id, data in self.store.items():
            if where:
                match = True
                for key, value in where.items():
                    if data["metadata"].get(key) != value:
                        match = False
                        break
                if not match:
                    continue
            results.append(
                {
                    "id": doc_id,
                    "document": data["document"],
                    "metadata": data["metadata"],
                    "distance": 0.1,
                }
            )
        return results[:n_results]

    async def delete(self, collection: str, ids: list[str]) -> None:
        for doc_id in ids:
            self.store.pop(doc_id, None)

    async def get(self, collection: str, ids: list[str]) -> list[dict[str, Any]]:
        results = []
        for doc_id in ids:
            if doc_id in self.store:
                results.append(
                    {
                        "id": doc_id,
                        "document": self.store[doc_id]["document"],
                        "metadata": self.store[doc_id]["metadata"],
                    }
                )
        return results

    async def count(self, collection: str) -> int:
        return len(self.store)


class FakeEmbeddingProvider:
    """Fake embedding provider for testing."""

    async def embed(self, text: str) -> list[float]:
        return [0.1] * 768

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return [[0.1] * 768 for _ in texts]


@pytest.fixture
def fake_vector_store() -> FakeVectorStore:
    return FakeVectorStore()


@pytest.fixture
def fake_embedding_provider() -> FakeEmbeddingProvider:
    return FakeEmbeddingProvider()


@pytest.fixture
def memory_service(
    fake_vector_store: FakeVectorStore,
    fake_embedding_provider: FakeEmbeddingProvider,
) -> MemoryService:
    return MemoryService(
        vector_store=fake_vector_store,
        embedding_provider=fake_embedding_provider,
    )


@pytest.mark.asyncio
async def test_create_memory(memory_service: MemoryService) -> None:
    request = MemoryCreateRequest(
        content="Observed yellow leaves on wheat",
        memory_type="observation",
        crop="wheat",
    )
    memory = await memory_service.create_memory("user-123", request)
    assert memory.user_id == "user-123"
    assert memory.content == "Observed yellow leaves on wheat"
    assert memory.memory_type == "observation"
    assert memory.crop == "wheat"


@pytest.mark.asyncio
async def test_search_memories(memory_service: MemoryService) -> None:
    # Create a memory first
    request = MemoryCreateRequest(
        content="Applied fertilizer to wheat field",
        memory_type="action",
        crop="wheat",
    )
    await memory_service.create_memory("user-123", request)

    # Search for it
    search = MemorySearchRequest(query="fertilizer wheat")
    results = await memory_service.search_memories("user-123", search)
    assert len(results) >= 1
    assert results[0].content == "Applied fertilizer to wheat field"


@pytest.mark.asyncio
async def test_get_memory(memory_service: MemoryService) -> None:
    # Create a memory
    request = MemoryCreateRequest(
        content="Test memory",
        memory_type="observation",
    )
    created = await memory_service.create_memory("user-123", request)

    # Get it
    retrieved = await memory_service.get_memory("user-123", created.memory_id)
    assert retrieved is not None
    assert retrieved.content == "Test memory"


@pytest.mark.asyncio
async def test_get_memory_not_found(memory_service: MemoryService) -> None:
    result = await memory_service.get_memory("user-123", "nonexistent")
    assert result is None


@pytest.mark.asyncio
async def test_delete_memory(memory_service: MemoryService) -> None:
    # Create a memory
    request = MemoryCreateRequest(
        content="Memory to delete",
        memory_type="observation",
    )
    created = await memory_service.create_memory("user-123", request)

    # Delete it
    deleted = await memory_service.delete_memory("user-123", created.memory_id)
    assert deleted is True

    # Verify it's gone
    retrieved = await memory_service.get_memory("user-123", created.memory_id)
    assert retrieved is None


@pytest.mark.asyncio
async def test_delete_memory_not_found(memory_service: MemoryService) -> None:
    deleted = await memory_service.delete_memory("user-123", "nonexistent")
    assert deleted is False


@pytest.mark.asyncio
async def test_get_user_memories(memory_service: MemoryService) -> None:
    # Create multiple memories
    for i in range(3):
        request = MemoryCreateRequest(
            content=f"Memory {i}",
            memory_type="observation",
        )
        await memory_service.create_memory("user-123", request)

    # Get all memories
    memories = await memory_service.get_user_memories("user-123")
    assert len(memories) == 3


@pytest.mark.asyncio
async def test_get_user_memories_with_type(memory_service: MemoryService) -> None:
    # Create memories with different types
    for memory_type in ["observation", "action", "diagnosis"]:
        request = MemoryCreateRequest(
            content=f"Memory type {memory_type}",
            memory_type=memory_type,
        )
        await memory_service.create_memory("user-123", request)

    # Get only observations
    memories = await memory_service.get_user_memories(
        "user-123", memory_type="observation"
    )
    assert len(memories) == 1
    assert memories[0].memory_type == "observation"
