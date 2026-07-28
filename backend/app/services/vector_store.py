"""Vector store service using ChromaDB for memory embeddings."""

from __future__ import annotations

import abc
from typing import Any

from app.core.config import settings
from app.core.logging import logger


class VectorStore(abc.ABC):
    """Abstract interface for vector store operations."""

    @abc.abstractmethod
    async def add(
        self,
        collection: str,
        ids: list[str],
        embeddings: list[list[float]],
        documents: list[str],
        metadatas: list[dict[str, Any]] | None = None,
    ) -> None:
        """Add vectors to the store."""
        ...

    @abc.abstractmethod
    async def search(
        self,
        collection: str,
        query_embedding: list[float],
        n_results: int = 10,
        where: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """Search for similar vectors."""
        ...

    @abc.abstractmethod
    async def delete(self, collection: str, ids: list[str]) -> None:
        """Delete vectors by IDs."""
        ...

    @abc.abstractmethod
    async def get(self, collection: str, ids: list[str]) -> list[dict[str, Any]]:
        """Get vectors by IDs."""
        ...

    @abc.abstractmethod
    async def count(self, collection: str) -> int:
        """Count vectors in a collection."""
        ...


class ChromaVectorStore(VectorStore):
    """ChromaDB implementation of the vector store."""

    def __init__(
        self,
        host: str | None = None,
        port: int | None = None,
    ) -> None:
        self._host = host or settings.CHROMA_HOST
        self._port = port or settings.CHROMA_PORT
        self._client: Any = None

    def _get_client(self) -> Any:
        """Lazy-initialize the ChromaDB client."""
        if self._client is None:
            try:
                import chromadb

                self._client = chromadb.HttpClient(
                    host=self._host,
                    port=self._port,
                )
                logger.info(
                    "ChromaDB client connected",
                    extra={"host": self._host, "port": self._port},
                )
            except Exception:
                logger.warning(
                    "ChromaDB connection failed, using in-memory fallback",
                    extra={"host": self._host, "port": self._port},
                )
                import chromadb

                self._client = chromadb.Client()
        return self._client

    def _get_collection(self, name: str) -> Any:
        """Get or create a collection."""
        client = self._get_client()
        return client.get_or_create_collection(name=name)

    async def add(
        self,
        collection: str,
        ids: list[str],
        embeddings: list[list[float]],
        documents: list[str],
        metadatas: list[dict[str, Any]] | None = None,
    ) -> None:
        """Add vectors to the store."""
        col = self._get_collection(collection)
        col.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
        )
        logger.info(
            "Vectors added to store",
            extra={"collection": collection, "count": len(ids)},
        )

    async def search(
        self,
        collection: str,
        query_embedding: list[float],
        n_results: int = 10,
        where: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """Search for similar vectors."""
        col = self._get_collection(collection)
        kwargs: dict[str, Any] = {
            "query_embeddings": [query_embedding],
            "n_results": n_results,
        }
        if where:
            kwargs["where"] = where

        results = col.query(**kwargs)

        output = []
        if results and results["ids"]:
            for i, doc_id in enumerate(results["ids"][0]):
                doc = results["documents"][0][i] if results["documents"] else ""
                meta = results["metadatas"][0][i] if results["metadatas"] else {}
                dist = results["distances"][0][i] if results["distances"] else 0.0
                output.append(
                    {
                        "id": doc_id,
                        "document": doc,
                        "metadata": meta,
                        "distance": dist,
                    }
                )
        return output

    async def delete(self, collection: str, ids: list[str]) -> None:
        """Delete vectors by IDs."""
        col = self._get_collection(collection)
        col.delete(ids=ids)
        logger.info(
            "Vectors deleted from store",
            extra={"collection": collection, "count": len(ids)},
        )

    async def get(self, collection: str, ids: list[str]) -> list[dict[str, Any]]:
        """Get vectors by IDs."""
        col = self._get_collection(collection)
        results = col.get(ids=ids)

        output = []
        if results and results["ids"]:
            for i, doc_id in enumerate(results["ids"]):
                doc = results["documents"][i] if results["documents"] else ""
                meta = results["metadatas"][i] if results["metadatas"] else {}
                output.append(
                    {
                        "id": doc_id,
                        "document": doc,
                        "metadata": meta,
                    }
                )
        return output

    async def count(self, collection: str) -> int:
        """Count vectors in a collection."""
        col = self._get_collection(collection)
        return col.count()


default_vector_store: VectorStore | None = None


def get_default_vector_store() -> VectorStore:
    """Return the default vector store, creating it on first call."""
    global default_vector_store  # noqa: PLW0603
    if default_vector_store is None:
        default_vector_store = ChromaVectorStore()
    return default_vector_store
