from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class AgentContext:
    """Carries request-scoped state through the orchestration pipeline.

    Populated by the API layer and consumed by tools and the planner.
    """

    user_id: str = ""
    city: str | None = None
    lat: float | None = None
    lon: float | None = None
    commodity: str | None = None
    conversation_id: str | None = None
    extras: dict[str, Any] = field(default_factory=dict)

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
