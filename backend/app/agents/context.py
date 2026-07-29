"""Extended agent context carrying request-scoped state through the pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class AgentContext:
    """Carries request-scoped state through the orchestration pipeline.

    Populated by the API layer and consumed by tools, agents, and the
    planner.  Agents may enrich this context during execution.
    """

    user_id: str = ""
    city: str | None = None
    lat: float | None = None
    lon: float | None = None
    commodity: str | None = None
    conversation_id: str | None = None
    extras: dict[str, Any] = field(default_factory=dict)

    # Sprint 6 multi-agent fields
    message: str = ""
    language: str | None = None
    location: str | None = None
    history: list[dict[str, Any]] = field(default_factory=list)
    memory: dict[str, Any] = field(default_factory=dict)
    documents: list[dict[str, Any]] = field(default_factory=list)
    weather: dict[str, Any] = field(default_factory=dict)
    market: dict[str, Any] = field(default_factory=dict)
    diagnosis: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Serialise to a plain dict suitable for tool adapters."""
        return {
            "user_id": self.user_id,
            "city": self.city,
            "lat": self.lat,
            "lon": self.lon,
            "commodity": self.commodity,
            "conversation_id": self.conversation_id,
            **self.extras,
        }
