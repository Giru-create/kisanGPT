from __future__ import annotations

from typing import Any

from app.tools.base import BaseTool


class MarketTool(BaseTool):
    """Adapter that wraps the existing MarketService."""

    name = "market"
    description = "Get commodity prices, trends, forecasts, and selling advice."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        from app.services.market import market_service

        commodity = context.get("commodity", "wheat")

        try:
            advice = await market_service.get_advice(commodity)
            return self._success(advice)
        except Exception as exc:
            return self._error(str(exc))
