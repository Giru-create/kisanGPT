"""Pydantic schemas for the persistent memory and personalization system."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from pydantic import BaseModel, Field


class FarmerProfile(BaseModel):
    """Farmer identity and preferences stored across sessions."""

    farmer_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    user_id: str = Field(..., min_length=1)
    name: str = Field(default="", max_length=100)
    location: str = Field(default="", max_length=200)
    preferred_language: str = Field(default="en", max_length=10)
    crops: list[str] = Field(default_factory=list)
    farming_type: str = Field(default="", max_length=100)
    farm_size_hectares: float | None = None
    soil_type: str = Field(default="", max_length=100)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class FarmerProfileCreateRequest(BaseModel):
    """Request body for creating or updating a farmer profile."""

    name: str = Field(default="", max_length=100)
    location: str = Field(default="", max_length=200)
    preferred_language: str = Field(default="en", max_length=10)
    crops: list[str] = Field(default_factory=list)
    farming_type: str = Field(default="", max_length=100)
    farm_size_hectares: float | None = None
    soil_type: str = Field(default="", max_length=100)


class ConversationHistoryItem(BaseModel):
    """A single message in conversation history."""

    role: str = Field(..., pattern=r"^(user|assistant)$")
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class MemoryItem(BaseModel):
    """A persistent memory item extracted from conversations."""

    memory_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    user_id: str
    category: str = Field(
        ...,
        pattern=r"^(crop|location|preference|observation|action|fact)$",
    )
    key: str = Field(..., min_length=1, max_length=200)
    value: str = Field(..., min_length=1, max_length=5000)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    source: str = Field(default="conversation", max_length=100)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class MemoryItemCreateRequest(BaseModel):
    """Request body for creating a memory item."""

    category: str = Field(
        ...,
        pattern=r"^(crop|location|preference|observation|action|fact)$",
    )
    key: str = Field(..., min_length=1, max_length=200)
    value: str = Field(..., min_length=1, max_length=5000)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    source: str = Field(default="conversation", max_length=100)


class MemoryContext(BaseModel):
    """Full memory context passed to the orchestrator."""

    farmer_profile: FarmerProfile | None = None
    history: list[ConversationHistoryItem] = Field(default_factory=list)
    preferences: dict[str, str] = Field(default_factory=dict)
    facts: list[MemoryItem] = Field(default_factory=list)


class FarmerProfileResponse(BaseModel):
    """Response body for farmer profile operations."""

    profile: FarmerProfile
    message: str


class MemoryItemResponse(BaseModel):
    """Response body for memory item operations."""

    memory_item: MemoryItem
    message: str


class MemoryContextResponse(BaseModel):
    """Response body for memory context retrieval."""

    context: MemoryContext
    user_id: str
