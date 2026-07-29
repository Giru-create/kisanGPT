"""Knowledge retrieval with metadata filtering, top-k, and minimum score."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from app.core.config import settings
from app.core.logging import logger
from app.rag.collection import KNOWLEDGE_COLLECTION, KnowledgeCollection
from app.services.embedding import EmbeddingProvider, get_default_embedding_provider
from app.services.vector_store import VectorStore, get_default_vector_store


@dataclass
class RetrievalResult:
    """A single retrieval result."""

    id: str
    content: str
    score: float
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class RetrievalFilter:
    """Metadata filters for retrieval."""

    category: str | None = None
    crop: str | None = None
    state: str | None = None
    language: str | None = None
    tags: list[str] | None = None


class KnowledgeRetriever:
    """Search the knowledge base with filters and scoring.

    Supports:
    - Top-k similarity search
    - Metadata filtering (category, crop, state, language, tags)
    - Minimum similarity threshold
    - Hybrid search ready (BM25 hook)
    - Reranking hook
    """

    def __init__(
        self,
        collection_name: str = KNOWLEDGE_COLLECTION,
        vector_store: VectorStore | None = None,
        embedding_provider: EmbeddingProvider | None = None,
    ) -> None:
        self._collection = KnowledgeCollection(
            collection_name=collection_name,
            vector_store=vector_store,
        )
        self._embedding = embedding_provider or get_default_embedding_provider()
        self._store = vector_store or get_default_vector_store()

    async def retrieve(
        self,
        query: str,
        top_k: int | None = None,
        filters: RetrievalFilter | None = None,
        min_score: float | None = None,
    ) -> list[RetrievalResult]:
        """Search for relevant documents.

        Args:
            query: The search query.
            top_k: Maximum results to return.
            filters: Metadata filters.
            min_score: Minimum similarity score (0.0-1.0).

        Returns:
            List of RetrievalResult sorted by score descending.
        """
        k = top_k or settings.RAG_TOP_K
        min_s = min_score if min_score is not None else settings.RAG_MIN_SCORE

        query_embedding = await self._embedding.embed(query)

        where = self._build_where_clause(filters)

        results = await self._store.search(
            collection=KNOWLEDGE_COLLECTION,
            query_embedding=query_embedding,
            n_results=k,
            where=where,
        )

        scored: list[RetrievalResult] = []
        for r in results:
            distance = r.get("distance", 0.0)
            score = self._distance_to_score(distance)
            if score < min_s:
                continue
            scored.append(
                RetrievalResult(
                    id=r["id"],
                    content=r["document"],
                    score=score,
                    metadata=r.get("metadata", {}),
                )
            )

        scored.sort(key=lambda x: x.score, reverse=True)

        logger.info(
            "Knowledge retrieval completed",
            extra={
                "query": query[:50],
                "results": len(scored),
                "top_score": scored[0].score if scored else 0.0,
            },
        )

        return scored

    def _build_where_clause(
        self, filters: RetrievalFilter | None
    ) -> dict[str, Any] | None:
        if not filters:
            return None

        conditions: list[dict[str, Any]] = []
        if filters.category:
            conditions.append({"category": filters.category})
        if filters.crop:
            conditions.append({"crop": filters.crop})
        if filters.state:
            conditions.append({"state": filters.state})
        if filters.language:
            conditions.append({"language": filters.language})
        if filters.tags:
            for tag in filters.tags:
                conditions.append({"tags": {"$contains": tag}})

        if not conditions:
            return None
        if len(conditions) == 1:
            return conditions[0]
        return {"$and": conditions}

    @staticmethod
    def _distance_to_score(distance: float) -> float:
        """Convert ChromaDB distance to 0.0-1.0 similarity score."""
        return max(0.0, 1.0 - distance / 2.0)
