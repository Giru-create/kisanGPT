from __future__ import annotations

import abc
import random
from datetime import UTC, datetime, timedelta


class MarketDataProvider(abc.ABC):
    """Abstract base class for market price data providers."""

    @abc.abstractmethod
    async def get_prices(
        self, commodity: str, state: str | None = None
    ) -> list[dict[str, object]]: ...

    @abc.abstractmethod
    async def get_trend(self, commodity: str, days: int = 30) -> dict[str, object]: ...

    @abc.abstractmethod
    async def get_commodities(self) -> list[str]: ...


class MockMarketProvider(MarketDataProvider):
    """Mock market data provider for development and testing."""

    COMMODITIES: dict[str, dict[str, object]] = {
        "Wheat": {"base_price": 2275.0, "msp": 2250.0, "variety": "PBW 550 / FAQ"},
        "Mustard": {"base_price": 5650.0, "msp": 5500.0, "variety": "Black Bold"},
        "Paddy": {"base_price": 3850.0, "msp": 3700.0, "variety": "Pusa Basmati"},
        "Cotton": {"base_price": 7200.0, "msp": 7020.0, "variety": "Long Staple"},
        "Soybean": {"base_price": 4800.0, "msp": 4600.0, "variety": "JS 335"},
        "Gram": {"base_price": 5300.0, "msp": 5200.0, "variety": "Desi"},
        "Maize": {"base_price": 2100.0, "msp": 2000.0, "variety": "Hybrid"},
        "Onion": {"base_price": 2800.0, "msp": 0.0, "variety": "Red"},
        "Potato": {"base_price": 1800.0, "msp": 0.0, "variety": "Jyoti"},
        "Tomato": {"base_price": 3200.0, "msp": 0.0, "variety": "Local"},
    }

    MANDIS: list[dict[str, str]] = [
        {"name": "Karnal APMC Mandi", "district": "Karnal", "state": "Haryana"},
        {"name": "Sonipat Mandi", "district": "Sonipat", "state": "Haryana"},
        {"name": "Panipat Mandi", "district": "Panipat", "state": "Haryana"},
        {"name": "Delhi Azadpur Mandi", "district": "North Delhi", "state": "Delhi"},
        {"name": "Jaipur Mandi", "district": "Jaipur", "state": "Rajasthan"},
        {"name": "Ludhiana Mandi", "district": "Ludhiana", "state": "Punjab"},
        {"name": "Amritsar Mandi", "district": "Amritsar", "state": "Punjab"},
        {"name": "Indore Mandi", "district": "Indore", "state": "Madhya Pradesh"},
    ]

    async def get_prices(
        self, commodity: str, state: str | None = None
    ) -> list[dict[str, object]]:
        info = self.COMMODITIES.get(commodity)
        if info is None:
            return []

        base_price = float(info["base_price"])
        msp = float(info["msp"])
        variety = str(info["variety"])

        mandis = self.MANDIS
        if state:
            mandis = [m for m in mandis if m["state"] == state]

        now = datetime.now(UTC)
        results: list[dict[str, object]] = []

        for i, mandi in enumerate(mandis):
            seed = hash(f"{commodity}:{mandi['name']}:{now.strftime('%Y-%m-%d')}")
            rng = random.Random(seed)

            change_pct = rng.uniform(-3.0, 3.0)
            price = round(base_price * (1 + change_pct / 100), 0)
            change_amount = round(price - base_price, 0)

            results.append(
                {
                    "commodity": commodity,
                    "variety": variety,
                    "mandi_name": mandi["name"],
                    "district": mandi["district"],
                    "state": mandi["state"],
                    "price_per_quintal": price,
                    "change_amount": change_amount,
                    "change_percent": round(change_pct, 2),
                    "is_rise": change_amount >= 0,
                    "msp": msp,
                    "msp_difference": round(price - msp, 0) if msp > 0 else 0,
                    "updated_at": (now - timedelta(hours=i * 2)).isoformat(),
                }
            )

        return results

    async def get_trend(self, commodity: str, days: int = 30) -> dict[str, object]:
        info = self.COMMODITIES.get(commodity)
        if info is None:
            return {}

        base_price = float(info["base_price"])
        now = datetime.now(UTC)
        rng = random.Random(hash(commodity))

        dates: list[str] = []
        prices: list[float] = []

        for i in range(days):
            d = now - timedelta(days=days - 1 - i)
            dates.append(d.strftime("%Y-%m-%d"))
            noise = rng.uniform(-0.05, 0.05)
            trend = (i / days) * 0.02
            price = round(base_price * (1 + noise + trend), 0)
            prices.append(price)

        avg_price = round(sum(prices) / len(prices), 0)
        min_price = min(prices)
        max_price = max(prices)

        if prices[-1] > prices[0] * 1.03:
            trend_direction = "rising"
        elif prices[-1] < prices[0] * 0.97:
            trend_direction = "falling"
        elif max_price - min_price > base_price * 0.08:
            trend_direction = "volatile"
        else:
            trend_direction = "stable"

        return {
            "commodity": commodity,
            "dates": dates,
            "prices": prices,
            "trend_direction": trend_direction,
            "avg_price": avg_price,
            "min_price": min_price,
            "max_price": max_price,
            "price_range": round(max_price - min_price, 0),
        }

    async def get_commodities(self) -> list[str]:
        return list(self.COMMODITIES.keys())
