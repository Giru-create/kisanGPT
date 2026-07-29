from __future__ import annotations

import uuid
from datetime import UTC, datetime

from app.agents.market import MarketDataProvider, MockMarketProvider
from app.cache.memory import TTLCache
from app.core.config import settings
from app.core.logging import logger
from app.schemas.market import (
    CommodityPrice,
    ForecastPoint,
    MarketAdvice,
    MarketAdviceResponse,
    MarketForecastResponse,
    MarketHistoryResponse,
    MarketOverview,
    MarketPriceResponse,
    MarketRecommendationResponse,
    MarketTrendResponse,
    PriceAlert,
    PriceAlertCreate,
    PriceHistoryItem,
    PriceTrend,
    Recommendation,
)


class MarketService:
    """Orchestrates market data fetching, caching, and alert management."""

    def __init__(self, provider: MarketDataProvider | None = None) -> None:
        if provider is not None:
            self._provider = provider
        elif settings.MARKET_PROVIDER == "live" and settings.MARKET_LIVE_URL:
            from app.providers.market.live import LiveMarketProvider

            self._provider = LiveMarketProvider(
                base_url=settings.MARKET_LIVE_URL,
                timeout=settings.MARKET_TIMEOUT,
            )
        else:
            self._provider = MockMarketProvider()
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

    async def get_history(
        self, commodity: str, mandi: str, days: int = 30
    ) -> dict[str, object]:
        cache_key = f"history:{commodity}:{mandi}:{days}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Market history cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        try:
            raw_trend = await self._provider.get_trend(commodity, days)
        except Exception:
            logger.exception("Failed to fetch market history")
            raise

        history = []
        if raw_trend:
            dates = raw_trend.get("dates", [])
            prices = raw_trend.get("prices", [])
            for date, price in zip(dates, prices, strict=False):
                history.append(
                    PriceHistoryItem(
                        date=str(date),
                        price=float(price),
                        mandi_name=mandi,
                    ).model_dump()
                )

        result = MarketHistoryResponse(
            commodity=commodity,
            mandi=mandi,
            history=[PriceHistoryItem(**h) for h in history],
            total_count=len(history),
        ).model_dump(mode="json")

        self._cache.set(cache_key, result)
        return result

    async def get_advice(self, commodity: str) -> dict[str, object]:
        cache_key = f"advice:{commodity}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Market advice cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        try:
            raw_prices = await self._provider.get_prices(commodity)
            raw_trend = await self._provider.get_trend(commodity, 30)
        except Exception:
            logger.exception("Failed to generate market advice")
            raise

        if not raw_prices:
            return MarketAdviceResponse(
                commodity=commodity,
                current_price=0,
                msp=0,
                trend="stable",
                advice=[],
                generated_at=datetime.now(UTC).isoformat(),
            ).model_dump(mode="json")

        first_price = raw_prices[0]
        current_price = float(first_price["price_per_quintal"])
        msp = float(first_price.get("msp", 0))
        trend_direction = (
            raw_trend.get("trend_direction", "stable") if raw_trend else "stable"
        )

        advice_items = _generate_market_advice(
            commodity=commodity,
            current_price=current_price,
            msp=msp,
            trend=trend_direction,
        )

        result = MarketAdviceResponse(
            commodity=commodity,
            current_price=current_price,
            msp=msp,
            trend=trend_direction,
            advice=advice_items,
            generated_at=datetime.now(UTC).isoformat(),
        ).model_dump(mode="json")

        self._cache.set(cache_key, result)
        return result

    async def get_forecast(self, commodity: str, days: int = 7) -> dict[str, object]:
        cache_key = f"forecast:{commodity}:{days}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Market forecast cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        try:
            raw_forecast = await self._provider.get_forecast(commodity, days)
        except Exception:
            logger.exception("Failed to fetch market forecast")
            raise

        if not raw_forecast:
            return MarketForecastResponse(
                commodity=commodity,
                current_price=0,
                msp=0,
                forecast=[],
                summary="No forecast data available.",
                generated_at=datetime.now(UTC).isoformat(),
            ).model_dump(mode="json")

        forecast_points = [ForecastPoint(**p) for p in raw_forecast.get("forecast", [])]
        result = MarketForecastResponse(
            commodity=commodity,
            current_price=float(raw_forecast.get("current_price", 0)),
            msp=float(raw_forecast.get("msp", 0)),
            forecast=forecast_points,
            summary=str(raw_forecast.get("summary", "")),
            generated_at=datetime.now(UTC).isoformat(),
        ).model_dump(mode="json")

        self._cache.set(cache_key, result)
        return result

    async def get_recommendation(self, commodity: str) -> dict[str, object]:
        cache_key = f"recommendation:{commodity}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Market recommendation cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        try:
            raw_rec = await self._provider.get_recommendation(commodity)
        except Exception:
            logger.exception("Failed to generate market recommendation")
            raise

        if not raw_rec:
            return MarketRecommendationResponse(
                commodity=commodity,
                current_price=0,
                msp=0,
                recommendation=Recommendation(
                    type="hold",
                    commodity=commodity,
                    confidence=0,
                    headline="No data available",
                    rationale="Insufficient data for recommendation.",
                    potential_gain=0,
                    risk_level="high",
                    suggested_action="Gather more market data.",
                    generated_at=datetime.now(UTC).isoformat(),
                ),
                generated_at=datetime.now(UTC).isoformat(),
            ).model_dump(mode="json")

        recommendation = Recommendation(
            type=str(raw_rec.get("type", "hold")),
            commodity=commodity,
            confidence=int(raw_rec.get("confidence", 0)),
            headline=str(raw_rec.get("headline", "")),
            rationale=str(raw_rec.get("rationale", "")),
            potential_gain=float(raw_rec.get("potential_gain", 0)),
            risk_level=str(raw_rec.get("risk_level", "medium")),
            suggested_action=str(raw_rec.get("suggested_action", "")),
            generated_at=datetime.now(UTC).isoformat(),
        )

        result = MarketRecommendationResponse(
            commodity=commodity,
            current_price=float(raw_rec.get("current_price", 0))
            if "current_price" in raw_rec
            else 0,
            msp=float(raw_rec.get("msp", 0)) if "msp" in raw_rec else 0,
            recommendation=recommendation,
            generated_at=datetime.now(UTC).isoformat(),
        ).model_dump(mode="json")

        self._cache.set(cache_key, result)
        return result


def _generate_market_advice(
    commodity: str,
    current_price: float,
    msp: float,
    trend: str,
) -> list[MarketAdvice]:
    advice: list[MarketAdvice] = []

    if msp > 0:
        diff = current_price - msp
        diff_pct = (diff / msp) * 100

        if diff_pct > 10:
            advice.append(
                MarketAdvice(
                    category="price",
                    title=f"{commodity} Price Above MSP",
                    message=(
                        f"Current price ₹{current_price:.0f}/qnt is "
                        f"{diff_pct:.1f}% above MSP (₹{msp:.0f}/qnt). "
                        f"Good time to sell."
                    ),
                    severity="info",
                )
            )
        elif diff_pct < -5:
            advice.append(
                MarketAdvice(
                    category="price",
                    title=f"{commodity} Price Below MSP",
                    message=(
                        f"Current price ₹{current_price:.0f}/qnt is "
                        f"{abs(diff_pct):.1f}% below MSP (₹{msp:.0f}/qnt). "
                        f"Consider holding or checking government procurement."
                    ),
                    severity="warning",
                )
            )

    if trend == "rising":
        advice.append(
            MarketAdvice(
                category="trend",
                title="Price Rising Trend",
                message=(
                    f"{commodity} prices are trending upward. "
                    f"Consider selling soon to maximize returns."
                ),
                severity="info",
            )
        )
    elif trend == "falling":
        advice.append(
            MarketAdvice(
                category="trend",
                title="Price Falling Trend",
                message=(
                    f"{commodity} prices are trending downward. "
                    f"If you need to sell, do so quickly to avoid further losses."
                ),
                severity="warning",
            )
        )
    elif trend == "volatile":
        advice.append(
            MarketAdvice(
                category="trend",
                title="Price Volatility",
                message=(
                    f"{commodity} prices are volatile. "
                    f"Monitor closely and sell when prices stabilize."
                ),
                severity="warning",
            )
        )

    if not advice:
        advice.append(
            MarketAdvice(
                category="general",
                title="Stable Market Conditions",
                message=(
                    f"{commodity} prices are stable. "
                    f"Good conditions for planned selling."
                ),
                severity="info",
            )
        )

    return advice


market_service = MarketService()
