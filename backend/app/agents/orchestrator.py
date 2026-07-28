"""Agent orchestrator -- Sprint 4 with RAG context integration."""

from __future__ import annotations

from typing import Any

from app.agents.context import AgentContext
from app.agents.context_builder import ContextBuilder
from app.agents.executor import execute
from app.agents.registry import ToolRegistry, default_registry
from app.core.logging import logger
from app.llm.generator import ResponseGenerator
from app.llm.planner import LLMPlanner
from app.llm.provider import LLMProvider, get_default_provider


class Orchestrator:
    """Entry point for the agent pipeline.

    Workflow:
        1. LLM planner selects tools (with keyword fallback).
        2. Executor runs tools sequentially.
        3. ContextBuilder merges knowledge, tool results, and memory.
        4. LLM generator produces a natural-language answer.
    """

    def __init__(
        self,
        registry: ToolRegistry | None = None,
        llm_provider: LLMProvider | None = None,
    ) -> None:
        self._registry = registry or default_registry
        provider = llm_provider or self._safe_get_provider()
        self._planner = LLMPlanner(provider=provider)
        self._generator = ResponseGenerator(provider=provider)

    @staticmethod
    def _safe_get_provider() -> LLMProvider | None:
        """Return the default provider if configured, else ``None``."""
        try:
            return get_default_provider()
        except Exception:
            return None

    async def chat(
        self,
        message: str,
        context: AgentContext | None = None,
    ) -> dict[str, Any]:
        """Process a user message through the orchestration pipeline.

        Returns:
            Dict with ``message`` (natural-language), ``planned_tools``,
            ``tool_results``, and ``context``.
        """
        ctx = context or AgentContext()

        logger.info(
            "Orchestrator.chat started",
            extra={"user_message": message[:80]},
        )

        available_tools = self._registry.list_names()
        planned_tools = await self._planner.plan(message, available_tools)
        logger.info(
            "Planner selected tools",
            extra={"tools": planned_tools},
        )

        tool_results = await execute(
            tool_names=planned_tools,
            query=message,
            context=ctx.to_dict(),
            registry=self._registry,
        )

        merged_context = ContextBuilder.build(
            query=message,
            tool_results=tool_results,
        )

        answer = await self._generator.generate(
            message, tool_results, context=merged_context
        )

        return {
            "message": answer,
            "planned_tools": planned_tools,
            "tool_results": tool_results,
            "context": merged_context,
        }
