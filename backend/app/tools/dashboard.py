from __future__ import annotations

from typing import Any

from app.tools.base import BaseTool


class DashboardTool(BaseTool):
    """Adapter that wraps the existing DashboardService."""

    name = "dashboard"
    description = "Get the farmer dashboard with weather, crops, prices, and schemes."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        from app.services.dashboard import dashboard_service

        lat = context.get("lat")
        lon = context.get("lon")
        city = context.get("city")

        try:
            data = await dashboard_service.get_dashboard(lat=lat, lon=lon, city=city)
            return self._success(data)
        except Exception as exc:
            return self._error(str(exc))
