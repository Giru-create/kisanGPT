from __future__ import annotations

import abc
import random
from datetime import UTC, datetime, timedelta


class MarketDataProvider(abc.ABC):
    """Abstract base class for market price data providers.

    Architecture allows future Agmarknet or e-NAM integration by implementing
    this interface with real API calls.
    """

    @abc.abstractmethod
    async def get_prices(
        self, commodity: str, state: str | None = None
    ) -> list[dict[str, object]]: ...

    @abc.abstractmethod
    async def get_trend(self, commodity: str, days: int = 30) -> dict[str, object]: ...

    @abc.abstractmethod
    async def get_commodities(self) -> list[str]: ...

    @abc.abstractmethod
    async def get_forecast(
        self, commodity: str, days: int = 7
    ) -> dict[str, object]: ...

    @abc.abstractmethod
    async def get_recommendation(self, commodity: str) -> dict[str, object]: ...


class MockMarketProvider(MarketDataProvider):
    """Mock market data provider for development and testing.

    Generates realistic deterministic data using seeded random generators.
    Future implementations: AgmarknetProvider, ENAMProvider.
    """

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

    async def get_forecast(self, commodity: str, days: int = 7) -> dict[str, object]:
        info = self.COMMODITIES.get(commodity)
        if info is None:
            return {}

        base_price = float(info["base_price"])
        msp = float(info["msp"])
        now = datetime.now(UTC)
        rng = random.Random(hash(f"forecast:{commodity}"))

        forecast_points: list[dict[str, object]] = []
        running_price = base_price

        for i in range(days):
            d = now + timedelta(days=i + 1)
            drift = rng.uniform(-0.015, 0.02)
            volatility = rng.uniform(0.01, 0.04)
            predicted = round(running_price * (1 + drift), 0)
            confidence_range = round(predicted * volatility, 0)

            factors: list[str] = []
            if predicted > msp * 1.05:
                factors.append("above_msp")
            if drift > 0.01:
                factors.append("rising_demand")
            elif drift < -0.01:
                factors.append("increasing_supply")
            if i >= 4:
                factors.append("weekend_effect")
            if not factors:
                factors.append("stable_market")

            forecast_points.append(
                {
                    "date": d.strftime("%Y-%m-%d"),
                    "predicted_price": predicted,
                    "confidence_low": round(predicted - confidence_range, 0),
                    "confidence_high": round(predicted + confidence_range, 0),
                    "factors": factors,
                }
            )
            running_price = predicted

        summary = _build_forecast_summary(
            commodity=commodity,
            current_price=base_price,
            msp=msp,
            points=forecast_points,
        )

        return {
            "commodity": commodity,
            "current_price": base_price,
            "msp": msp,
            "forecast": forecast_points,
            "summary": summary,
        }

    async def get_recommendation(self, commodity: str) -> dict[str, object]:
        info = self.COMMODITIES.get(commodity)
        if info is None:
            return {}

        base_price = float(info["base_price"])
        msp = float(info["msp"])
        now = datetime.now(UTC)
        rng = random.Random(hash(f"rec:{commodity}:{now.strftime('%Y-%m-%d')}"))

        trend_data = await self.get_trend(commodity, 30)
        trend_direction = trend_data.get("trend_direction", "stable")

        msp_ratio = base_price / msp if msp > 0 else 1.0

        if trend_direction == "rising" and msp_ratio > 1.03:
            rec_type = "sell_now"
            confidence = min(95, int(70 + (msp_ratio - 1) * 200 + rng.uniform(0, 10)))
            headline = f"Sell {commodity} Now — Price Above MSP"
            rationale = (
                f"{commodity} is trading at ₹{base_price:.0f}/qnt, "
                f"{((msp_ratio - 1) * 100):.1f}% above MSP (₹{msp:.0f}/qnt). "
                f"Rising trend suggests this is a good selling window."
            )
            potential_gain = round(base_price - msp, 0)
            risk_level = "low"
            suggested_action = (
                "Sell at your nearest APMC mandi within 2-3 days "
                "to lock in current prices."
            )
        elif trend_direction == "falling" or msp_ratio < 0.95:
            rec_type = "hold"
            confidence = min(90, int(60 + rng.uniform(0, 15)))
            headline = f"Hold {commodity} — Wait for Better Prices"
            msp_pct = (msp_ratio - 1) * 100
            msp_note = f" ({msp_pct:.1f}% below MSP)" if msp < base_price else ""
            rationale = (
                f"{commodity} is trading at ₹{base_price:.0f}/qnt"
                f"{msp_note}. "
                f"Prices are"
                f"{' falling' if trend_direction == 'falling' else ' below MSP'}. "
                f"Holding may yield better returns."
            )
            potential_gain = round(msp - base_price, 0) if msp > base_price else 0.0
            risk_level = "medium"
            suggested_action = (
                "Hold your stock and monitor prices daily. "
                "Consider government procurement if available."
            )
        elif trend_direction == "volatile":
            rec_type = "wait"
            confidence = min(85, int(55 + rng.uniform(0, 10)))
            headline = f"Wait — {commodity} Market Volatile"
            rationale = (
                f"{commodity} prices are volatile (₹{base_price:.0f}/qnt). "
                f"Wait for stabilization before making a decision."
            )
            potential_gain = 0.0
            risk_level = "high"
            suggested_action = (
                "Monitor prices closely for 3-5 days. "
                "Sell when volatility reduces and trend becomes clear."
            )
        else:
            rec_type = "sell_now"
            confidence = min(80, int(60 + rng.uniform(0, 10)))
            headline = f"{commodity} — Stable Market, Consider Selling"
            rationale = (
                f"{commodity} is stable at ₹{base_price:.0f}/qnt "
                f"near MSP (₹{msp:.0f}/qnt). Good conditions for planned selling."
            )
            potential_gain = round(base_price - msp, 0) if msp > 0 else 0.0
            risk_level = "low"
            suggested_action = (
                "Good time to sell if you need liquidity. "
                "Prices are expected to remain stable."
            )

        return {
            "type": rec_type,
            "commodity": commodity,
            "confidence": confidence,
            "headline": headline,
            "rationale": rationale,
            "potential_gain": potential_gain,
            "risk_level": risk_level,
            "suggested_action": suggested_action,
        }


def _build_forecast_summary(
    commodity: str,
    current_price: float,
    msp: float,
    points: list[dict[str, object]],
) -> str:
    if not points:
        return f"No forecast data available for {commodity}."

    last_price = float(points[-1].get("predicted_price", 0))
    change_pct = (
        ((last_price - current_price) / current_price * 100) if current_price else 0
    )

    if change_pct > 3:
        trend_word = "rise"
    elif change_pct < -3:
        trend_word = "fall"
    else:
        trend_word = "remain stable"

    msp_note = ""
    if msp > 0:
        msp_ratio = last_price / msp
        if msp_ratio < 0.95:
            msp_note = " Prices may drop below MSP. Consider government procurement."
        elif msp_ratio > 1.1:
            msp_note = " Strong performance above MSP."

    return (
        f"{commodity} is expected to {trend_word} over the next 7 days, "
        f"moving from ₹{current_price:.0f}/qnt to ₹{last_price:.0f}/qnt "
        f"({change_pct:+.1f}%).{msp_note}"
    )
