from __future__ import annotations

import pytest

from app.agents.market import MockMarketProvider


class TestMockMarketProvider:
    @pytest.mark.asyncio
    async def test_get_prices_returns_list(self) -> None:
        provider = MockMarketProvider()
        prices = await provider.get_prices("Wheat")
        assert isinstance(prices, list)
        assert len(prices) > 0

    @pytest.mark.asyncio
    async def test_get_prices_unknown_commodity(self) -> None:
        provider = MockMarketProvider()
        prices = await provider.get_prices("UnknownCrop")
        assert prices == []

    @pytest.mark.asyncio
    async def test_get_prices_filters_by_state(self) -> None:
        provider = MockMarketProvider()
        prices = await provider.get_prices("Wheat", state="Haryana")
        for p in prices:
            assert p["state"] == "Haryana"

    @pytest.mark.asyncio
    async def test_get_prices_fields(self) -> None:
        provider = MockMarketProvider()
        prices = await provider.get_prices("Wheat")
        required = {
            "commodity",
            "variety",
            "mandi_name",
            "district",
            "state",
            "price_per_quintal",
            "change_amount",
            "change_percent",
            "is_rise",
            "msp",
            "msp_difference",
            "updated_at",
        }
        for p in prices:
            assert required.issubset(p.keys())

    @pytest.mark.asyncio
    async def test_get_trend_returns_data(self) -> None:
        provider = MockMarketProvider()
        trend = await provider.get_trend("Wheat", days=30)
        assert trend["commodity"] == "Wheat"
        assert len(trend["dates"]) == 30
        assert len(trend["prices"]) == 30
        assert trend["trend_direction"] in {
            "rising",
            "falling",
            "stable",
            "volatile",
        }

    @pytest.mark.asyncio
    async def test_get_trend_unknown_commodity(self) -> None:
        provider = MockMarketProvider()
        trend = await provider.get_trend("Unknown")
        assert trend == {}

    @pytest.mark.asyncio
    async def test_get_commodities(self) -> None:
        provider = MockMarketProvider()
        commodities = await provider.get_commodities()
        assert "Wheat" in commodities
        assert "Mustard" in commodities
        assert len(commodities) >= 8


class TestMarketService:
    @pytest.mark.asyncio
    async def test_get_history_returns_data(self) -> None:
        from app.services.market import MarketService

        service = MarketService()
        result = await service.get_history("Wheat", "Karnal Mandi", days=30)
        assert result["commodity"] == "Wheat"
        assert result["mandi"] == "Karnal Mandi"
        assert result["total_count"] == 30
        assert len(result["history"]) == 30

    @pytest.mark.asyncio
    async def test_get_advice_returns_data(self) -> None:
        from app.services.market import MarketService

        service = MarketService()
        result = await service.get_advice("Wheat")
        assert result["commodity"] == "Wheat"
        assert "current_price" in result
        assert "msp" in result
        assert "trend" in result
        assert "advice" in result
        assert len(result["advice"]) > 0
