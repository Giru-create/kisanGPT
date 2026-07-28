"""Agent orchestrator -- Sprint 5 with persistent memory integration."""

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
        1. Retrieve farmer memory (profile, history, facts).
        2. LLM planner selects tools (with keyword fallback).
        3. Executor runs tools sequentially.
        4. ContextBuilder merges knowledge, tool results, and memory.
        5. LLM generator produces a natural-language answer.
        6. Save useful information from the conversation.
    """

    def __init__(
        self,
        registry: ToolRegistry | None = None,
        llm_provider: LLMProvider | None = None,
        memory_manager: Any | None = None,
    ) -> None:
        self._registry = registry or default_registry
        provider = llm_provider or self._safe_get_provider()
        self._planner = LLMPlanner(provider=provider)
        self._generator = ResponseGenerator(provider=provider)
        self._memory_manager = memory_manager

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
            extra={"user_id": ctx.user_id, "user_message": message[:80]},
        )

        # Step 1: Retrieve farmer memory
        memory_context = await self._load_memory(ctx.user_id)

        # Step 2: Planner selects tools
        available_tools = self._registry.list_names()
        planned_tools = await self._planner.plan(message, available_tools)
        logger.info(
            "Planner selected tools",
            extra={"tools": planned_tools},
        )

        # Step 3: Execute tools
        tool_results = await execute(
            tool_names=planned_tools,
            query=message,
            context=ctx.to_dict(),
            registry=self._registry,
        )

        # Step 4: Build context
        merged_context = ContextBuilder.build(
            query=message,
            tool_results=tool_results,
            memory=memory_context,
        )

        # Step 5: Generate response
        answer = await self._generator.generate(
            message, tool_results, context=merged_context
        )

        # Step 6: Save memory after response
        await self._save_memory(ctx.user_id, message, answer)

        return {
            "message": answer,
            "planned_tools": planned_tools,
            "tool_results": tool_results,
            "context": merged_context,
        }

    async def _load_memory(self, user_id: str) -> dict[str, Any] | None:
        """Load farmer memory if a memory manager is available."""
        if not self._memory_manager or not user_id:
            return None

        try:
            memory_ctx = await self._memory_manager.retrieve_memory(user_id)
            return memory_ctx.model_dump()
        except Exception as exc:
            logger.warning(
                "Failed to load memory",
                extra={"user_id": user_id, "error": str(exc)},
            )
            return None

    async def _save_memory(
        self, user_id: str, user_message: str, assistant_message: str
    ) -> None:
        """Save conversation to memory if a memory manager is available."""
        if not self._memory_manager or not user_id:
            return

        try:
            await self._memory_manager.save_conversation_message(
                user_id, "user", user_message
            )
            await self._memory_manager.save_conversation_message(
                user_id, "assistant", assistant_message
            )
            await self._memory_manager.save_memory(user_id, user_message)
        except Exception as exc:
            logger.warning(
                "Failed to save memory",
                extra={"user_id": user_id, "error": str(exc)},
            )
