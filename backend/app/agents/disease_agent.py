"""Disease specialist agent -- wraps the existing DiseaseTool."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

from app.agents.base import BaseAgent
from app.agents.schemas import AgentConfig, AgentResult
from app.core.logging import logger

if TYPE_CHECKING:
    from app.agents.context import AgentContext


class DiseaseAgent(BaseAgent):
    """Diagnoses crop diseases by delegating to DiseaseTool."""

    name = "disease"
    description = "Diagnose crop diseases and get treatment recommendations."
    supported_intents = ["disease", "pest", "fungus", "blight", "infection"]
    priority = 20

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config)

    async def run(self, context: AgentContext) -> AgentResult:
        from app.tools.disease import DiseaseTool

        tool = DiseaseTool()
        ctx_dict = context.to_dict()

        try:
            raw = await asyncio.wait_for(
                tool.run(context.message, ctx_dict),
                timeout=self.config.timeout_seconds,
            )

            data = raw.get("data", {}) if raw.get("success") else {}
            return AgentResult(
                name=self.name,
                success=raw.get("success", False),
                confidence=0.85 if raw.get("success") else 0.0,
                data=data,
                sources=["diagnosis_service"],
            )
        except TimeoutError:
            logger.warning("DiseaseAgent timed out")
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=["DiseaseAgent timed out"],
            )
        except Exception as exc:
            logger.exception("DiseaseAgent failed", extra={"error": str(exc)})
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=[str(exc)],
            )
