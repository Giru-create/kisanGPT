"""Pydantic schemas for LLM planner and generator responses."""

from __future__ import annotations

from pydantic import BaseModel, Field


class PlannerResponse(BaseModel):
    """Structured output from the LLM planner."""

    tools: list[str] = Field(
        default_factory=list,
        description="List of tool names the planner decided to use.",
    )


class ToolResult(BaseModel):
    """A single tool execution result passed to the generator."""

    tool: str
    success: bool
    data: dict | list | str | None = None
