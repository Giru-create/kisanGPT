"""Live market data provider with graceful fallback to mock data.

Attempts to fetch real commodity prices from government data sources.
If the live endpoint is unavailable, returns cached/mock values
and logs the failure. Never crashes.
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

import httpx

from app.agents.market import MarketDataProvider, MockMarketProvider
from app.core.logging import logger


class LiveMarketProvider(MarketDataProvider):
    """Live market provider with automatic fallback to MockMarketProvider.

    Currently supports:
    - AGMARKNET-style endpoint (configurable URL)
    - Graceful fallback on any failure
    - Structured logging of provider, latency, error, and fallback used
    """

    def __init__(
        self,
        base_url: str | None = None,
        timeout: float = 10.0,
        fallback: MarketDataProvider | None = None,
    ) -> None:
        self._base_url = base_url
        self._timeout = timeout
        self._fallback = fallback or MockMarketProvider()

    async def _safe_get(
        self, url: str, params: dict[str, Any] | None = None
    ) -> dict[str, Any] | None:
        """Attempt HTTP GET; return None on any failure."""
        if not self._base_url:
            return None

        start = datetime.now(UTC)
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                data: dict[str, Any] = resp.json()
                elapsed = (datetime.now(UTC) - start).total_seconds() * 1000
                logger.info(
                    "Live market request succeeded",
                    extra={
                        "url": url,
                        "latency_ms": round(elapsed, 1),
                    },
                )
                return data
        except httpx.TimeoutException:
            elapsed = (datetime.now(UTC) - start).total_seconds() * 1000
            logger.warning(
                "Live market request timed out",
                extra={
                    "url": url,
                    "latency_ms": round(elapsed, 1),
                    "provider": "live_market",
                    "fallback_used": True,
                },
            )
            return None
        except Exception as exc:
            elapsed = (datetime.now(UTC) - start).total_seconds() * 1000
            logger.warning(
                "Live market request failed",
                extra={
                    "url": url,
                    "latency_ms": round(elapsed, 1),
                    "error": str(exc),
                    "provider": "live_market",
                    "fallback_used": True,
                },
            )
            return None

    def _build_url(self, path: str) -> str:
        base = self._base_url.rstrip("/")
        return f"{base}/{path.lstrip('/')}"

    # ------------------------------------------------------------------
    # MarketDataProvider interface
    # ------------------------------------------------------------------

    async def get_prices(
        self, commodity: str, state: str | None = None
    ) -> list[dict[str, object]]:
        if self._base_url:
            params: dict[str, Any] = {"commodity": commodity}
            if state:
                params["state"] = state
            data = await self._safe_get(self._build_url("prices"), params)
            if data and isinstance(data.get("prices"), list):
                return data["prices"]  # type: ignore[return-value]

        logger.info("Falling back to mock market provider for prices")
        return await self._fallback.get_prices(commodity, state)

    async def get_trend(self, commodity: str, days: int = 30) -> dict[str, object]:
        if self._base_url:
            data = await self._safe_get(
                self._build_url("trend"),
                {"commodity": commodity, "days": days},
            )
            if data and data.get("dates"):
                return data

        logger.info("Falling back to mock market provider for trend")
        return await self._fallback.get_trend(commodity, days)

    async def get_commodities(self) -> list[str]:
        if self._base_url:
            data = await self._safe_get(self._build_url("commodities"))
            if data and isinstance(data.get("commodities"), list):
                return data["commodities"]  # type: ignore[return-value]

        logger.info("Falling back to mock market provider for commodities")
        return await self._fallback.get_commodities()

    async def get_forecast(self, commodity: str, days: int = 7) -> dict[str, object]:
        if self._base_url:
            data = await self._safe_get(
                self._build_url("forecast"),
                {"commodity": commodity, "days": days},
            )
            if data and data.get("forecast"):
                return data

        logger.info("Falling back to mock market provider for forecast")
        return await self._fallback.get_forecast(commodity, days)

    async def get_recommendation(self, commodity: str) -> dict[str, object]:
        if self._base_url:
            data = await self._safe_get(
                self._build_url("recommendation"),
                {"commodity": commodity},
            )
            if data and data.get("type"):
                return data

        logger.info("Falling back to mock market provider for recommendation")
        return await self._fallback.get_recommendation(commodity)
