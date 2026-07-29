"""Market specialist agent -- wraps the existing MarketTool."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

from app.agents.base import BaseAgent
from app.agents.schemas import AgentConfig, AgentResult
from app.core.logging import logger

if TYPE_CHECKING:
    from app.agents.context import AgentContext


class MarketAgent(BaseAgent):
    """Retrieves market data by delegating to MarketTool."""

    name = "market"
    description = "Get commodity prices, trends, forecasts, and selling advice."
    supported_intents = ["market", "price", "sell", "mandi", "commodity"]
    priority = 10

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config)

    async def run(self, context: AgentContext) -> AgentResult:
        from app.tools.market import MarketTool

        tool = MarketTool()
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
                confidence=0.9 if raw.get("success") else 0.0,
                data=data,
                sources=["market_service"],
            )
        except TimeoutError:
            logger.warning("MarketAgent timed out")
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=["MarketAgent timed out"],
            )
        except Exception as exc:
            logger.exception("MarketAgent failed", extra={"error": str(exc)})
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=[str(exc)],
            )
