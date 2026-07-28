"""Pydantic schemas for farm memory features."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from pydantic import BaseModel, Field


class FarmMemory(BaseModel):
    """A single farm memory entry."""

    memory_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    user_id: str
    content: str = Field(..., min_length=1, max_length=10000)
    memory_type: str = Field(
        ...,
        pattern=r"^(observation|action|recommendation|diagnosis|weather|market)$",
    )
    crop: str | None = None
    location: str | None = None
    metadata: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class MemoryCreateRequest(BaseModel):
    """Request body for creating a memory."""

    content: str = Field(..., min_length=1, max_length=10000)
    memory_type: str = Field(
        ...,
        pattern=r"^(observation|action|recommendation|diagnosis|weather|market)$",
    )
    crop: str | None = None
    location: str | None = None
    metadata: dict = Field(default_factory=dict)


class MemorySearchRequest(BaseModel):
    """Request body for searching memories."""

    query: str = Field(..., min_length=1, max_length=1000)
    crop: str | None = None
    memory_type: str | None = None
    limit: int = Field(default=10, ge=1, le=50)


class MemoryResponse(BaseModel):
    """Response body for a memory operation."""

    memory: FarmMemory
    message: str


class MemorySearchResponse(BaseModel):
    """Response body for memory search."""

    memories: list[FarmMemory]
    total: int
    query: str


class Recommendation(BaseModel):
    """A personalized recommendation."""

    recommendation_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    user_id: str
    title: str
    content: str
    recommendation_type: str = Field(
        ...,
        pattern=r"^(crop|irrigation|fertilizer|pesticide|harvest|general)$",
    )
    priority: str = Field(default="medium", pattern=r"^(low|medium|high)$")
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    source_memories: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class RecommendationRequest(BaseModel):
    """Request body for generating recommendations."""

    crop: str | None = None
    location: str | None = None
    limit: int = Field(default=5, ge=1, le=10)


class RecommendationResponse(BaseModel):
    """Response body for recommendations."""

    recommendations: list[Recommendation]
    total: int
