"""RAG module -- document ingestion, chunking, embedding, and retrieval."""

from __future__ import annotations

from app.rag.chunker import SemanticChunker
from app.rag.collection import KnowledgeCollection
from app.rag.ingest import DocumentIngestor
from app.rag.loader import DocumentLoader, LoadedDocument
from app.rag.metadata import MetadataExtractor
from app.rag.retriever import KnowledgeRetriever

__all__ = [
    "DocumentLoader",
    "LoadedDocument",
    "SemanticChunker",
    "MetadataExtractor",
    "KnowledgeCollection",
    "KnowledgeRetriever",
    "DocumentIngestor",
]
