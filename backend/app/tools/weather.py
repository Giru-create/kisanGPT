from __future__ import annotations

from typing import Any

from app.tools.base import BaseTool


class WeatherTool(BaseTool):
    """Adapter that wraps the existing WeatherService."""

    name = "weather"
    description = "Get current weather conditions, forecasts, and farming advice."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        from app.schemas.weather import WeatherQuery
        from app.services.weather import weather_service

        city = context.get("city")
        lat = context.get("lat")
        lon = context.get("lon")

        if lat is not None and lon is not None:
            wq = WeatherQuery(latitude=lat, longitude=lon)
        elif city:
            wq = WeatherQuery(city=city)
        else:
            wq = WeatherQuery(city="Delhi")

        try:
            data = await weather_service.get_advice(wq)
            return self._success(data)
        except Exception as exc:
            return self._error(str(exc))
