"""Memory service for long-term farm memory storage and retrieval."""

from __future__ import annotations

from app.core.logging import logger
from app.schemas.memory import FarmMemory, MemoryCreateRequest, MemorySearchRequest
from app.services.embedding import EmbeddingProvider, get_default_embedding_provider
from app.services.vector_store import VectorStore, get_default_vector_store

MEMORY_COLLECTION = "farm_memories"


class MemoryService:
    """Service for managing farm memories with vector embeddings."""

    def __init__(
        self,
        vector_store: VectorStore | None = None,
        embedding_provider: EmbeddingProvider | None = None,
    ) -> None:
        self._vector_store = vector_store or get_default_vector_store()
        self._embedding_provider = (
            embedding_provider or get_default_embedding_provider()
        )

    async def create_memory(
        self,
        user_id: str,
        request: MemoryCreateRequest,
    ) -> FarmMemory:
        """Create a new farm memory with vector embedding."""
        memory = FarmMemory(
            user_id=user_id,
            content=request.content,
            memory_type=request.memory_type,
            crop=request.crop,
            location=request.location,
            metadata=request.metadata,
        )

        # Generate embedding for the content
        embedding = await self._embedding_provider.embed(memory.content)

        # Store in vector store
        await self._vector_store.add(
            collection=MEMORY_COLLECTION,
            ids=[memory.memory_id],
            embeddings=[embedding],
            documents=[memory.content],
            metadatas=[
                {
                    "user_id": memory.user_id,
                    "memory_type": memory.memory_type,
                    "crop": memory.crop or "",
                    "location": memory.location or "",
                    "created_at": memory.created_at.isoformat(),
                }
            ],
        )

        logger.info(
            "Memory created",
            extra={"memory_id": memory.memory_id, "user_id": user_id},
        )

        return memory

    async def search_memories(
        self,
        user_id: str,
        request: MemorySearchRequest,
    ) -> list[FarmMemory]:
        """Search for memories using vector similarity."""
        # Generate embedding for the query
        query_embedding = await self._embedding_provider.embed(request.query)

        # Build where filter
        where: dict = {"user_id": user_id}
        if request.crop:
            where["crop"] = request.crop
        if request.memory_type:
            where["memory_type"] = request.memory_type

        # Search vector store
        results = await self._vector_store.search(
            collection=MEMORY_COLLECTION,
            query_embedding=query_embedding,
            n_results=request.limit,
            where=where,
        )

        # Convert results to FarmMemory objects
        memories = []
        for result in results:
            memory = FarmMemory(
                memory_id=result["id"],
                user_id=result["metadata"].get("user_id", user_id),
                content=result["document"],
                memory_type=result["metadata"].get("memory_type", "observation"),
                crop=result["metadata"].get("crop") or None,
                location=result["metadata"].get("location") or None,
                metadata={},
            )
            memories.append(memory)

        logger.info(
            "Memories searched",
            extra={
                "user_id": user_id,
                "query": request.query[:50],
                "results_count": len(memories),
            },
        )

        return memories

    async def get_memory(self, user_id: str, memory_id: str) -> FarmMemory | None:
        """Get a specific memory by ID."""
        results = await self._vector_store.get(
            collection=MEMORY_COLLECTION,
            ids=[memory_id],
        )

        if not results:
            return None

        result = results[0]
        if result["metadata"].get("user_id") != user_id:
            return None

        return FarmMemory(
            memory_id=result["id"],
            user_id=user_id,
            content=result["document"],
            memory_type=result["metadata"].get("memory_type", "observation"),
            crop=result["metadata"].get("crop") or None,
            location=result["metadata"].get("location") or None,
            metadata={},
        )

    async def delete_memory(self, user_id: str, memory_id: str) -> bool:
        """Delete a memory by ID."""
        memory = await self.get_memory(user_id, memory_id)
        if not memory:
            return False

        await self._vector_store.delete(
            collection=MEMORY_COLLECTION,
            ids=[memory_id],
        )

        logger.info(
            "Memory deleted",
            extra={"memory_id": memory_id, "user_id": user_id},
        )

        return True

    async def get_user_memories(
        self,
        user_id: str,
        memory_type: str | None = None,
        limit: int = 50,
    ) -> list[FarmMemory]:
        """Get all memories for a user."""
        where: dict = {"user_id": user_id}
        if memory_type:
            where["memory_type"] = memory_type

        # Use a generic query to get all user memories
        results = await self._vector_store.search(
            collection=MEMORY_COLLECTION,
            query_embedding=[0.0] * 768,  # Placeholder embedding
            n_results=limit,
            where=where,
        )

        memories = []
        for result in results:
            memory = FarmMemory(
                memory_id=result["id"],
                user_id=user_id,
                content=result["document"],
                memory_type=result["metadata"].get("memory_type", "observation"),
                crop=result["metadata"].get("crop") or None,
                location=result["metadata"].get("location") or None,
                metadata={},
            )
            memories.append(memory)

        return memories
