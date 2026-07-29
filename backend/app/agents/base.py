"""Abstract base class for all specialist agents."""

from __future__ import annotations

import abc
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.agents.context import AgentContext

from app.agents.schemas import AgentConfig, AgentResult


class BaseAgent(abc.ABC):
    """Every specialist agent must inherit from this class.

    Each agent exposes:
        - name: unique identifier
        - description: human-readable purpose
        - supported_intents: which intents this agent handles
        - priority: higher = runs first
    """

    name: str
    description: str
    supported_intents: list[str]
    priority: int = 0

    def __init__(self, config: AgentConfig | None = None) -> None:
        self.config = config or AgentConfig()

    @abc.abstractmethod
    async def run(self, context: AgentContext) -> AgentResult:
        """Execute the agent's logic and return a structured result."""
        ...

    def can_handle(self, intent: str) -> bool:
        """Return True if this agent handles the given intent."""
        return intent in self.supported_intents
