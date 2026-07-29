"""Agent router -- selects which specialist agents to invoke."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from app.core.logging import logger

if TYPE_CHECKING:
    from app.agents.base import BaseAgent


class AgentRouter:
    """Selects agents using the existing planner logic plus keyword fallback.

    Reuses the LLMPlanner from app.llm.planner -- no duplicated
    planning code.
    """

    def __init__(
        self,
        agents: list[BaseAgent] | None = None,
        llm_provider: Any | None = None,
    ) -> None:
        self._agents: dict[str, BaseAgent] = {}
        self._provider = llm_provider
        if agents:
            for agent in agents:
                self._agents[agent.name] = agent

    def register(self, agent: BaseAgent) -> None:
        """Register a specialist agent."""
        self._agents[agent.name] = agent

    def get(self, name: str) -> BaseAgent | None:
        """Retrieve an agent by name."""
        return self._agents.get(name)

    def list_agents(self) -> list[BaseAgent]:
        """Return all registered agents."""
        return list(self._agents.values())

    def list_names(self) -> list[str]:
        """Return all registered agent names."""
        return list(self._agents.keys())

    async def route(self, message: str) -> list[str]:
        """Return the names of agents to invoke for a given message.

        Uses the LLM planner when available, falls back to keyword
        matching from the existing planner module.
        """
        from app.llm.planner import LLMPlanner

        planner = LLMPlanner(provider=self._provider)
        available = self.list_names()
        selected = await planner.plan(message, available)

        # Filter to only agents we actually have
        valid = [s for s in selected if s in self._agents]
        logger.info(
            "AgentRouter selected agents",
            extra={"selected": valid, "available": available},
        )
        return valid

    def route_by_intent(self, intents: list[str]) -> list[str]:
        """Route using intent matching (synchronous, keyword-based)."""
        matched: set[str] = set()
        for intent in intents:
            for agent in self._agents.values():
                if agent.can_handle(intent):
                    matched.add(agent.name)
        return sorted(matched)

    def get_by_priority(self) -> list[BaseAgent]:
        """Return agents sorted by priority (highest first)."""
        return sorted(self._agents.values(), key=lambda a: a.priority, reverse=True)
