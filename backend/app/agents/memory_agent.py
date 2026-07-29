"""Memory specialist agent -- wraps the existing MemoryTool."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

from app.agents.base import BaseAgent
from app.agents.schemas import AgentConfig, AgentResult
from app.core.logging import logger

if TYPE_CHECKING:
    from app.agents.context import AgentContext


class MemoryAgent(BaseAgent):
    """Retrieves conversation history by delegating to MemoryTool."""

    name = "memory"
    description = "Retrieve conversation history and user context."
    supported_intents = ["memory", "history", "previous", "remember"]
    priority = 5

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config)

    async def run(self, context: AgentContext) -> AgentResult:
        from app.tools.memory import MemoryTool

        tool = MemoryTool()
        ctx_dict = context.to_dict()

        try:
            raw = await asyncio.wait_for(
                tool.run(context.message, ctx_dict),
                timeout=self.config.timeout_seconds,
            )

            data = raw.get("data", {}) if raw.get("success") else {}

            # Enrich context with conversation history
            if raw.get("success"):
                context.history = data.get("messages", [])

            return AgentResult(
                name=self.name,
                success=raw.get("success", False),
                confidence=0.85 if raw.get("success") else 0.0,
                data=data,
                sources=["conversation_service"],
                metadata={
                    "message_count": data.get("message_count", 0),
                },
            )
        except TimeoutError:
            logger.warning("MemoryAgent timed out")
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=["MemoryAgent timed out"],
            )
        except Exception as exc:
            logger.exception("MemoryAgent failed", extra={"error": str(exc)})
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=[str(exc)],
            )
