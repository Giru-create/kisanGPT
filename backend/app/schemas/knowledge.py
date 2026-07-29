"""Pydantic schemas for knowledge retrieval."""

from __future__ import annotations

from pydantic import BaseModel, Field


class KnowledgeDocument(BaseModel):
    """A single retrieved knowledge document."""

    id: str = Field(..., description="Unique document identifier.")
    content: str = Field(..., description="Document text content.")
    source: str = Field(default="", description="Document source or collection.")
    score: float = Field(default=0.0, description="Relevance score (0.0-1.0).")
    metadata: dict = Field(default_factory=dict, description="Additional metadata.")


class KnowledgeSearchRequest(BaseModel):
    """Request body for knowledge search endpoint."""

    query: str = Field(..., min_length=1, max_length=1000)
    k: int = Field(default=5, ge=1, le=20, description="Number of results.")
    category: str | None = Field(default=None, description="Filter by category.")
    crop: str | None = Field(default=None, description="Filter by crop.")
    state: str | None = Field(default=None, description="Filter by state.")
    language: str | None = Field(default=None, description="Filter by language.")


class KnowledgeSearchResponse(BaseModel):
    """Response body for knowledge search endpoint."""

    documents: list[KnowledgeDocument]
    count: int
    query: str


class KnowledgeToolResult(BaseModel):
    """Structured result from the KnowledgeTool."""

    documents: list[KnowledgeDocument] = Field(default_factory=list)
    count: int = 0
    success: bool = True
    error: str | None = None
