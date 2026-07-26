from __future__ import annotations

import uuid
from datetime import UTC, datetime

from app.agents.market import MarketDataProvider, MockMarketProvider
from app.cache.memory import TTLCache
from app.core.config import settings
from app.core.logging import logger
from app.schemas.market import (
    CommodityPrice,
    MarketOverview,
    MarketPriceResponse,
    MarketTrendResponse,
    PriceAlert,
    PriceAlertCreate,
    PriceTrend,
)


class MarketService:
    """Orchestrates market data fetching, caching, and alert management."""

    def __init__(self, provider: MarketDataProvider | None = None) -> None:
        self._provider = provider or MockMarketProvider()
        self._cache = TTLCache(default_ttl=settings.MARKET_CACHE_TTL)
        self._alerts: list[PriceAlert] = []

    async def get_prices(
        self, commodity: str, state: str | None = None
    ) -> dict[str, object]:
        cache_key = f"prices:{commodity}:{state or 'all'}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Market prices cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        try:
            raw_prices = await self._provider.get_prices(commodity, state)
        except Exception:
            logger.exception("Failed to fetch market prices")
            raise

        prices = [CommodityPrice(**p) for p in raw_prices]
        result = MarketPriceResponse(
            commodity=commodity,
            prices=prices,
            total_count=len(prices),
            generated_at=datetime.now(UTC).isoformat(),
        ).model_dump(mode="json")

        self._cache.set(cache_key, result)
        return result

    async def get_trend(self, commodity: str, days: int = 30) -> dict[str, object]:
        cache_key = f"trend:{commodity}:{days}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Market trend cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        try:
            raw_trend = await self._provider.get_trend(commodity, days)
        except Exception:
            logger.exception("Failed to fetch market trend")
            raise

        if not raw_trend:
            return MarketTrendResponse(
                commodity=commodity,
                trend=PriceTrend(
                    commodity=commodity,
                    dates=[],
                    prices=[],
                    trend_direction="stable",
                    avg_price=0,
                    min_price=0,
                    max_price=0,
                    price_range=0,
                ),
            ).model_dump(mode="json")

        trend = PriceTrend(**raw_trend)
        result = MarketTrendResponse(
            commodity=commodity,
            trend=trend,
        ).model_dump(mode="json")

        self._cache.set(cache_key, result)
        return result

    async def get_overview(self, state: str | None = None) -> dict[str, object]:
        cache_key = f"overview:{state or 'all'}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Market overview cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        commodities = await self._provider.get_commodities()
        all_prices: list[CommodityPrice] = []

        for commodity in commodities[:5]:
            raw = await self._provider.get_prices(commodity, state)
            prices = [CommodityPrice(**p) for p in raw]
            if prices:
                all_prices.append(prices[0])

        rising = [p for p in all_prices if p.is_rise]
        falling = [p for p in all_prices if not p.is_rise]

        result = MarketOverview(
            top_commodities=all_prices,
            rising=sorted(rising, key=lambda x: x.change_percent, reverse=True),
            falling=sorted(falling, key=lambda x: x.change_percent),
            generated_at=datetime.now(UTC).isoformat(),
        ).model_dump(mode="json")

        self._cache.set(cache_key, result)
        return result

    def create_alert(self, user_id: str, alert_data: PriceAlertCreate) -> PriceAlert:
        alert = PriceAlert(
            id=str(uuid.uuid4()),
            commodity=alert_data.commodity,
            target_price=alert_data.target_price,
            condition=alert_data.condition,
            is_active=True,
            created_at=datetime.now(UTC).isoformat(),
            triggered_at=None,
        )
        self._alerts.append(alert)
        logger.info(
            "Price alert created",
            extra={
                "user_id": user_id,
                "commodity": alert.commodity,
                "target": alert.target_price,
            },
        )
        return alert

    def get_alerts(self, user_id: str) -> list[PriceAlert]:
        return [a for a in self._alerts if a.is_active]

    def delete_alert(self, user_id: str, alert_id: str) -> bool:
        for alert in self._alerts:
            if alert.id == alert_id:
                alert.is_active = False
                return True
        return False


market_service = MarketService()
