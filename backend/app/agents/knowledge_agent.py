"""Knowledge specialist agent -- wraps the existing KnowledgeTool."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

from app.agents.base import BaseAgent
from app.agents.schemas import AgentConfig, AgentResult
from app.core.logging import logger

if TYPE_CHECKING:
    from app.agents.context import AgentContext


class KnowledgeAgent(BaseAgent):
    """Retrieves knowledge documents by delegating to KnowledgeTool."""

    name = "knowledge"
    description = (
        "Search farm knowledge base for information about crops, "
        "fertilizers, government schemes, and best practices."
    )
    supported_intents = [
        "knowledge",
        "guide",
        "scheme",
        "fertilizer",
        "how to",
    ]
    priority = 5

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config)

    async def run(self, context: AgentContext) -> AgentResult:
        from app.tools.knowledge import KnowledgeTool

        tool = KnowledgeTool()
        ctx_dict = context.to_dict()

        try:
            raw = await asyncio.wait_for(
                tool.run(context.message, ctx_dict),
                timeout=self.config.timeout_seconds,
            )

            data = raw.get("data", {}) if raw.get("success") else {}
            docs = data.get("documents", [])

            return AgentResult(
                name=self.name,
                success=raw.get("success", False),
                confidence=0.8 if docs else 0.3,
                data=data,
                sources=["knowledge_base"],
                metadata={"document_count": len(docs)},
            )
        except TimeoutError:
            logger.warning("KnowledgeAgent timed out")
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=["KnowledgeAgent timed out"],
            )
        except Exception as exc:
            logger.exception("KnowledgeAgent failed", extra={"error": str(exc)})
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=[str(exc)],
            )
