"""ChromaDB collection management with duplicate detection and versioning."""

from __future__ import annotations

import hashlib
from typing import Any

from app.core.logging import logger
from app.services.vector_store import VectorStore, get_default_vector_store

KNOWLEDGE_COLLECTION = "farm_knowledge"


class KnowledgeCollection:
    """Manages the knowledge base ChromaDB collection.

    Supports:
    - Collection creation and access
    - Duplicate detection by content hash
    - Document versioning via source+hash
    - Incremental ingestion (skip unchanged)
    """

    def __init__(
        self,
        collection_name: str = KNOWLEDGE_COLLECTION,
        vector_store: VectorStore | None = None,
    ) -> None:
        self._name = collection_name
        self._store = vector_store or get_default_vector_store()

    @staticmethod
    def _content_hash(content: str) -> str:
        return hashlib.sha256(content.encode()).hexdigest()[:16]

    async def upsert_documents(
        self,
        ids: list[str],
        embeddings: list[list[float]],
        documents: list[str],
        metadatas: list[dict[str, Any]],
    ) -> dict[str, int]:
        """Add or update documents. Returns counts of added and updated."""
        added = 0
        updated = 0

        existing = await self._store.get(self._name, ids)
        existing_ids = {e["id"] for e in existing}

        new_ids: list[str] = []
        new_embeddings: list[list[float]] = []
        new_documents: list[str] = []
        new_metadatas: list[dict[str, Any]] = []

        for i, doc_id in enumerate(ids):
            content_hash = self._content_hash(documents[i])
            meta = dict(metadatas[i])
            meta["content_hash"] = content_hash
            meta["version"] = 1

            if doc_id in existing_ids:
                old = next(e for e in existing if e["id"] == doc_id)
                old_hash = old.get("metadata", {}).get("content_hash", "")
                if old_hash == content_hash:
                    continue
                old_version = old.get("metadata", {}).get("version", 0)
                meta["version"] = int(old_version) + 1
                updated += 1
            else:
                added += 1

            new_ids.append(doc_id)
            new_embeddings.append(embeddings[i])
            new_documents.append(documents[i])
            new_metadatas.append(meta)

        if new_ids:
            await self._store.add(
                collection=self._name,
                ids=new_ids,
                embeddings=new_embeddings,
                documents=new_documents,
                metadatas=new_metadatas,
            )

        logger.info(
            "Knowledge collection upserted",
            extra={
                "collection": self._name,
                "added": added,
                "updated": updated,
                "skipped": len(ids) - added - updated,
            },
        )
        return {"added": added, "updated": updated}

    async def count(self) -> int:
        return await self._store.count(self._name)

    async def delete_by_source(self, source: str) -> int:
        """Delete all documents from a given source path."""
        results = await self._store.search(
            collection=self._name,
            query_embedding=[0.0] * 768,
            n_results=1000,
            where={"source": source},
        )
        ids = [r["id"] for r in results]
        if ids:
            await self._store.delete(self._name, ids)
        return len(ids)

    async def get_all_sources(self) -> list[str]:
        """Return unique source paths in the collection."""
        results = await self._store.search(
            collection=self._name,
            query_embedding=[0.0] * 768,
            n_results=1000,
        )
        sources = {r["metadata"].get("source", "") for r in results}
        return sorted(s for s in sources if s)
