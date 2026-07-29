"""Document ingestion pipeline -- load, chunk, embed, store."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from app.core.config import settings
from app.core.logging import logger
from app.rag.chunker import SemanticChunker
from app.rag.collection import KnowledgeCollection
from app.rag.loader import DocumentLoader, LoadedDocument
from app.rag.metadata import MetadataExtractor
from app.services.embedding import EmbeddingProvider, get_default_embedding_provider

if TYPE_CHECKING:
    from pathlib import Path


class DocumentIngestor:
    """End-to-end document ingestion pipeline.

    Steps:
    1. Load documents from files/directories
    2. Extract metadata
    3. Chunk documents semantically
    4. Generate embeddings
    5. Store in ChromaDB with duplicate detection
    """

    def __init__(
        self,
        embedding_provider: EmbeddingProvider | None = None,
        collection: KnowledgeCollection | None = None,
    ) -> None:
        self._loader = DocumentLoader()
        self._chunker = SemanticChunker(
            chunk_size=settings.RAG_CHUNK_SIZE,
            chunk_overlap=settings.RAG_CHUNK_OVERLAP,
        )
        self._metadata = MetadataExtractor()
        self._embedding = embedding_provider or get_default_embedding_provider()
        self._collection = collection or KnowledgeCollection()

    async def ingest_file(self, path: str | Path) -> dict[str, int]:
        """Ingest a single file."""
        doc = self._loader.load_file(path)
        if doc is None:
            return {"added": 0, "updated": 0}
        return await self._ingest_documents([doc])

    async def ingest_directory(
        self, directory: str | Path, recursive: bool = True
    ) -> dict[str, int]:
        """Ingest all supported files from a directory."""
        docs = self._loader.load_directory(directory, recursive=recursive)
        if not docs:
            return {"added": 0, "updated": 0}
        return await self._ingest_documents(docs)

    async def _ingest_documents(self, docs: list[LoadedDocument]) -> dict[str, int]:
        """Process loaded documents through the pipeline."""
        total_added = 0
        total_updated = 0

        for doc in docs:
            meta = self._metadata.extract(
                source=doc.source,
                content=doc.content,
                extra=doc.metadata,
            )

            chunks = self._chunker.chunk(doc.content, metadata=meta)
            if not chunks:
                continue

            chunk_docs: list[str] = []
            chunk_ids: list[str] = []
            chunk_metas: list[dict[str, Any]] = []

            for chunk in chunks:
                chunk_id = f"{doc.doc_id}_{chunk.chunk_index}"
                chunk_meta = dict(meta)
                chunk_meta["chunk_index"] = chunk.chunk_index
                chunk_meta["heading"] = chunk.heading
                chunk_ids.append(chunk_id)
                chunk_docs.append(chunk.content)
                chunk_metas.append(chunk_meta)

            embeddings = await self._embedding.embed_batch(chunk_docs)

            result = await self._collection.upsert_documents(
                ids=chunk_ids,
                embeddings=embeddings,
                documents=chunk_docs,
                metadatas=chunk_metas,
            )
            total_added += result["added"]
            total_updated += result["updated"]

        logger.info(
            "Document ingestion completed",
            extra={
                "files": len(docs),
                "added": total_added,
                "updated": total_updated,
            },
        )
        return {"added": total_added, "updated": total_updated}
