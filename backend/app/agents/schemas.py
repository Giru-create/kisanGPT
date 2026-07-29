"""Schemas for the multi-agent system."""

from __future__ import annotations

import time
from typing import Any

from pydantic import BaseModel, Field


class AgentResult(BaseModel):
    """Standardised result returned by every agent.

    All agents must return this schema. Never return raw dicts.
    """

    name: str = Field(..., min_length=1)
    success: bool = True
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    execution_time_ms: float = 0.0
    data: dict[str, Any] = Field(default_factory=dict)
    sources: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    errors: list[str] = Field(default_factory=list)
    timestamp: float = Field(default_factory=time.time)

    def to_tool_result(self) -> dict[str, Any]:
        """Convert to the legacy tool_result dict format for backward compat."""
        return {
            "tool": self.name,
            "success": self.success,
            "data": self.data,
        }


class AgentConfig(BaseModel):
    """Configuration for an agent's behaviour."""

    timeout_seconds: float = Field(default=10.0, gt=0)
    max_retries: int = Field(default=1, ge=0)
    enabled: bool = True
    priority: int = Field(default=0, ge=0)


class AgentMetrics(BaseModel):
    """Observability metrics for a single agent invocation."""

    agent_name: str
    started_at: float = Field(default_factory=time.time)
    finished_at: float | None = None
    duration_ms: float = 0.0
    success: bool = False
    retry_count: int = 0
    error_message: str | None = None

    def mark_finished(self, success: bool, error: str | None = None) -> None:
        """Record completion time and status."""
        self.finished_at = time.time()
        self.duration_ms = (self.finished_at - self.started_at) * 1000
        self.success = success
        self.error_message = error
