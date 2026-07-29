"""Weather specialist agent -- wraps the existing WeatherTool."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

from app.agents.base import BaseAgent
from app.agents.schemas import AgentConfig, AgentResult
from app.core.logging import logger

if TYPE_CHECKING:
    from app.agents.context import AgentContext


class WeatherAgent(BaseAgent):
    """Retrieves weather data by delegating to WeatherTool."""

    name = "weather"
    description = "Get current weather conditions, forecasts, and farming advice."
    supported_intents = ["weather", "rain", "forecast", "irrigate", "temperature"]
    priority = 10

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config)

    async def run(self, context: AgentContext) -> AgentResult:
        from app.tools.weather import WeatherTool

        tool = WeatherTool()
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
                sources=["weather_service"],
            )
        except TimeoutError:
            logger.warning("WeatherAgent timed out")
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=["WeatherAgent timed out"],
            )
        except Exception as exc:
            logger.exception("WeatherAgent failed", extra={"error": str(exc)})
            return AgentResult(
                name=self.name,
                success=False,
                confidence=0.0,
                errors=[str(exc)],
            )
