from __future__ import annotations

import pytest

from app.agents.market import MockMarketProvider, _build_forecast_summary
from app.services.market import MarketService


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

    @pytest.mark.asyncio
    async def test_get_forecast_returns_data(self) -> None:
        provider = MockMarketProvider()
        forecast = await provider.get_forecast("Wheat", days=7)
        assert forecast["commodity"] == "Wheat"
        assert "current_price" in forecast
        assert "msp" in forecast
        assert len(forecast["forecast"]) == 7
        assert "summary" in forecast

    @pytest.mark.asyncio
    async def test_get_forecast_unknown_commodity(self) -> None:
        provider = MockMarketProvider()
        forecast = await provider.get_forecast("Unknown")
        assert forecast == {}

    @pytest.mark.asyncio
    async def test_get_forecast_point_fields(self) -> None:
        provider = MockMarketProvider()
        forecast = await provider.get_forecast("Wheat", days=7)
        for point in forecast["forecast"]:
            assert "date" in point
            assert "predicted_price" in point
            assert "confidence_low" in point
            assert "confidence_high" in point
            assert "factors" in point
            assert isinstance(point["factors"], list)
            assert point["confidence_low"] <= point["predicted_price"]
            assert point["predicted_price"] <= point["confidence_high"]

    @pytest.mark.asyncio
    async def test_get_recommendation_returns_data(self) -> None:
        provider = MockMarketProvider()
        rec = await provider.get_recommendation("Wheat")
        assert rec["commodity"] == "Wheat"
        assert rec["type"] in ("sell_now", "hold", "wait", "switch_mandi")
        assert 0 <= rec["confidence"] <= 100
        assert "headline" in rec
        assert "rationale" in rec
        assert rec["risk_level"] in ("low", "medium", "high")

    @pytest.mark.asyncio
    async def test_get_recommendation_unknown_commodity(self) -> None:
        provider = MockMarketProvider()
        rec = await provider.get_recommendation("Unknown")
        assert rec == {}


class TestMarketService:
    @pytest.mark.asyncio
    async def test_get_history_returns_data(self) -> None:
        service = MarketService()
        result = await service.get_history("Wheat", "Karnal Mandi", days=30)
        assert result["commodity"] == "Wheat"
        assert result["mandi"] == "Karnal Mandi"
        assert result["total_count"] == 30
        assert len(result["history"]) == 30

    @pytest.mark.asyncio
    async def test_get_advice_returns_data(self) -> None:
        service = MarketService()
        result = await service.get_advice("Wheat")
        assert result["commodity"] == "Wheat"
        assert "current_price" in result
        assert "msp" in result
        assert "trend" in result
        assert "advice" in result
        assert len(result["advice"]) > 0

    @pytest.mark.asyncio
    async def test_get_forecast_returns_data(self) -> None:
        service = MarketService()
        result = await service.get_forecast("Wheat", days=7)
        assert result["commodity"] == "Wheat"
        assert "current_price" in result
        assert "msp" in result
        assert "forecast" in result
        assert len(result["forecast"]) == 7
        assert "summary" in result
        assert "generated_at" in result

    @pytest.mark.asyncio
    async def test_get_forecast_unknown_commodity(self) -> None:
        service = MarketService()
        result = await service.get_forecast("UnknownCrop")
        assert result["commodity"] == "UnknownCrop"
        assert result["forecast"] == []
        assert result["current_price"] == 0

    @pytest.mark.asyncio
    async def test_get_recommendation_returns_data(self) -> None:
        service = MarketService()
        result = await service.get_recommendation("Wheat")
        assert result["commodity"] == "Wheat"
        assert "recommendation" in result
        assert "generated_at" in result
        rec = result["recommendation"]
        assert "type" in rec
        assert "confidence" in rec
        assert "headline" in rec
        assert "rationale" in rec

    @pytest.mark.asyncio
    async def test_get_recommendation_unknown_commodity(self) -> None:
        service = MarketService()
        result = await service.get_recommendation("UnknownCrop")
        assert result["commodity"] == "UnknownCrop"
        rec = result["recommendation"]
        assert rec["confidence"] == 0

    @pytest.mark.asyncio
    async def test_caching_works(self) -> None:
        service = MarketService()
        result1 = await service.get_forecast("Wheat", days=7)
        result2 = await service.get_forecast("Wheat", days=7)
        assert result1 == result2

    @pytest.mark.asyncio
    async def test_overview_returns_data(self) -> None:
        service = MarketService()
        result = await service.get_overview()
        assert "top_commodities" in result
        assert "rising" in result
        assert "falling" in result
        assert "generated_at" in result
        assert len(result["top_commodities"]) > 0

    @pytest.mark.asyncio
    async def test_alerts_crud(self) -> None:
        from app.schemas.market import PriceAlertCreate

        service = MarketService()
        alert = service.create_alert(
            "user-1",
            PriceAlertCreate(commodity="Wheat", target_price=2500.0, condition="above"),
        )
        assert alert.commodity == "Wheat"
        assert alert.target_price == 2500.0

        alerts = service.get_alerts("user-1")
        assert len(alerts) == 1

        deleted = service.delete_alert("user-1", alert.id)
        assert deleted is True

        alerts_after = service.get_alerts("user-1")
        assert len(alerts_after) == 0


class TestForecastSummary:
    def test_rising_summary(self) -> None:
        points = [{"predicted_price": 2400.0}]
        summary = _build_forecast_summary(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            points=points,
        )
        assert "rise" in summary
        assert "Wheat" in summary

    def test_falling_summary(self) -> None:
        points = [{"predicted_price": 2100.0}]
        summary = _build_forecast_summary(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            points=points,
        )
        assert "fall" in summary

    def test_stable_summary(self) -> None:
        points = [{"predicted_price": 2280.0}]
        summary = _build_forecast_summary(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            points=points,
        )
        assert "stable" in summary

    def test_empty_points(self) -> None:
        summary = _build_forecast_summary(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            points=[],
        )
        assert "No forecast data" in summary

    def test_below_msp_note(self) -> None:
        points = [{"predicted_price": 2100.0}]
        summary = _build_forecast_summary(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            points=points,
        )
        assert "MSP" in summary

    def test_above_msp_note(self) -> None:
        points = [{"predicted_price": 2500.0}]
        summary = _build_forecast_summary(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            points=points,
        )
        assert "MSP" in summary
