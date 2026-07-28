from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class AgentRequest(BaseModel):
    """Request body for the agent chat endpoint."""

    message: str = Field(..., min_length=1, max_length=4000)
    city: str | None = None
    lat: float | None = None
    lon: float | None = None
    commodity: str | None = None
    conversation_id: str | None = None


class AgentResponse(BaseModel):
    """Response body for the agent chat endpoint."""

    message: str
    planned_tools: list[str]
    tool_results: list[dict[str, Any]]
