from __future__ import annotations

import uuid
from datetime import UTC, datetime

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., pattern=r"^(user|assistant|system)$")
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: str | None = Field(None, max_length=100)


class ChatResponse(BaseModel):
    content: str
    conversation_id: str


class Conversation(BaseModel):
    conversation_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    user_id: str
    messages: list[ChatMessage] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
