from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.market import (
    CommodityPrice,
    ForecastPoint,
    MarketAdvice,
    MarketAdviceResponse,
    MarketForecast,
    MarketForecastResponse,
    MarketHistoryResponse,
    MarketOverview,
    MarketPriceResponse,
    MarketRecommendationResponse,
    MarketTrendResponse,
    PriceAlert,
    PriceAlertCreate,
    PriceAlertResponse,
    PriceHistoryItem,
    PriceTrend,
    Recommendation,
)


class TestCommodityPrice:
    def test_valid(self) -> None:
        p = CommodityPrice(
            commodity="Wheat",
            variety="PBW 550",
            mandi_name="Karnal Mandi",
            district="Karnal",
            state="Haryana",
            price_per_quintal=2275.0,
            updated_at="2026-01-01T00:00:00Z",
        )
        assert p.commodity == "Wheat"
        assert p.price_per_quintal == 2275.0

    def test_defaults(self) -> None:
        p = CommodityPrice(
            commodity="Wheat",
            variety="PBW 550",
            mandi_name="Karnal Mandi",
            district="Karnal",
            state="Haryana",
            price_per_quintal=2275.0,
            updated_at="2026-01-01T00:00:00Z",
        )
        assert p.change_amount == 0
        assert p.change_percent == 0
        assert p.is_rise is True

    def test_invalid_price(self) -> None:
        with pytest.raises(ValidationError):
            CommodityPrice(
                commodity="Wheat",
                variety="PBW 550",
                mandi_name="Karnal Mandi",
                district="Karnal",
                state="Haryana",
                price_per_quintal=-100,
                updated_at="2026-01-01T00:00:00Z",
            )


class TestPriceTrend:
    def test_valid_rising(self) -> None:
        t = PriceTrend(
            commodity="Wheat",
            dates=["2026-01-01"],
            prices=[2275.0],
            trend_direction="rising",
            avg_price=2275.0,
            min_price=2200.0,
            max_price=2350.0,
            price_range=150.0,
        )
        assert t.trend_direction == "rising"

    def test_invalid_direction(self) -> None:
        with pytest.raises(ValidationError):
            PriceTrend(
                commodity="Wheat",
                dates=[],
                prices=[],
                trend_direction="invalid",
                avg_price=0,
                min_price=0,
                max_price=0,
                price_range=0,
            )


class TestMarketPriceResponse:
    def test_valid(self) -> None:
        r = MarketPriceResponse(
            commodity="Wheat",
            prices=[],
            total_count=0,
            generated_at="2026-01-01T00:00:00Z",
        )
        assert r.commodity == "Wheat"
        assert r.total_count == 0


class TestMarketTrendResponse:
    def test_valid(self) -> None:
        t = PriceTrend(
            commodity="Wheat",
            dates=[],
            prices=[],
            trend_direction="stable",
            avg_price=0,
            min_price=0,
            max_price=0,
            price_range=0,
        )
        r = MarketTrendResponse(commodity="Wheat", trend=t)
        assert r.commodity == "Wheat"


class TestPriceAlert:
    def test_valid(self) -> None:
        a = PriceAlert(
            id="alert-1",
            user_id="user-1",
            commodity="Wheat",
            target_price=2500.0,
            condition="above",
            is_active=True,
            created_at="2026-01-01T00:00:00Z",
        )
        assert a.condition == "above"
        assert a.is_active is True
        assert a.user_id == "user-1"


class TestPriceAlertCreate:
    def test_valid_above(self) -> None:
        a = PriceAlertCreate(
            commodity="Wheat",
            target_price=2500.0,
            condition="above",
        )
        assert a.commodity == "Wheat"

    def test_valid_below(self) -> None:
        a = PriceAlertCreate(
            commodity="Wheat",
            target_price=2000.0,
            condition="below",
        )
        assert a.condition == "below"

    def test_invalid_condition(self) -> None:
        with pytest.raises(ValidationError):
            PriceAlertCreate(
                commodity="Wheat",
                target_price=2500.0,
                condition="equal",
            )


class TestPriceAlertResponse:
    def test_valid(self) -> None:
        r = PriceAlertResponse(alerts=[], total_count=0)
        assert r.total_count == 0


class TestMarketOverview:
    def test_valid(self) -> None:
        o = MarketOverview(
            top_commodities=[],
            rising=[],
            falling=[],
            generated_at="2026-01-01T00:00:00Z",
        )
        assert o.generated_at == "2026-01-01T00:00:00Z"


class TestPriceHistoryItem:
    def test_valid(self) -> None:
        h = PriceHistoryItem(
            date="2026-01-01",
            price=2275.0,
            mandi_name="Karnal Mandi",
        )
        assert h.price == 2275.0
        assert h.mandi_name == "Karnal Mandi"


class TestMarketHistoryResponse:
    def test_valid(self) -> None:
        r = MarketHistoryResponse(
            commodity="Wheat",
            mandi="Karnal Mandi",
            history=[],
            total_count=0,
        )
        assert r.commodity == "Wheat"
        assert r.total_count == 0


class TestMarketAdvice:
    def test_valid_info(self) -> None:
        a = MarketAdvice(
            category="price",
            title="Price Above MSP",
            message="Good time to sell",
            severity="info",
        )
        assert a.severity == "info"

    def test_valid_warning(self) -> None:
        a = MarketAdvice(
            category="trend",
            title="Price Falling",
            message="Sell quickly",
            severity="warning",
        )
        assert a.severity == "warning"

    def test_invalid_severity(self) -> None:
        with pytest.raises(ValidationError):
            MarketAdvice(
                category="price",
                title="Test",
                message="Test",
                severity="invalid",
            )


class TestMarketAdviceResponse:
    def test_valid(self) -> None:
        r = MarketAdviceResponse(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            trend="rising",
            advice=[],
            generated_at="2026-01-01T00:00:00Z",
        )
        assert r.commodity == "Wheat"
        assert r.current_price == 2275.0


class TestForecastPoint:
    def test_valid(self) -> None:
        p = ForecastPoint(
            date="2026-01-02",
            predicted_price=2300.0,
            confidence_low=2250.0,
            confidence_high=2350.0,
            factors=["rising_demand", "above_msp"],
        )
        assert p.predicted_price == 2300.0
        assert len(p.factors) == 2

    def test_empty_factors(self) -> None:
        p = ForecastPoint(
            date="2026-01-02",
            predicted_price=2300.0,
            confidence_low=2250.0,
            confidence_high=2350.0,
            factors=[],
        )
        assert p.factors == []


class TestMarketForecast:
    def test_valid(self) -> None:
        f = MarketForecast(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            forecast=[],
            summary="Stable market.",
            generated_at="2026-01-01T00:00:00Z",
        )
        assert f.commodity == "Wheat"
        assert f.summary == "Stable market."


class TestMarketForecastResponse:
    def test_valid(self) -> None:
        r = MarketForecastResponse(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            forecast=[],
            summary="Stable market.",
            generated_at="2026-01-01T00:00:00Z",
        )
        assert r.commodity == "Wheat"
        assert r.forecast == []


class TestRecommendation:
    def test_sell_now(self) -> None:
        r = Recommendation(
            type="sell_now",
            commodity="Wheat",
            confidence=85,
            headline="Sell Now",
            rationale="Price above MSP",
            potential_gain=50.0,
            risk_level="low",
            suggested_action="Sell at APMC",
            generated_at="2026-01-01T00:00:00Z",
        )
        assert r.type == "sell_now"
        assert r.confidence == 85

    def test_hold(self) -> None:
        r = Recommendation(
            type="hold",
            commodity="Wheat",
            confidence=70,
            headline="Hold",
            rationale="Prices falling",
            potential_gain=0,
            risk_level="medium",
            suggested_action="Wait",
            generated_at="2026-01-01T00:00:00Z",
        )
        assert r.type == "hold"

    def test_invalid_type(self) -> None:
        with pytest.raises(ValidationError):
            Recommendation(
                type="invalid",
                commodity="Wheat",
                confidence=85,
                headline="Test",
                rationale="Test",
                potential_gain=0,
                risk_level="low",
                suggested_action="Test",
                generated_at="2026-01-01T00:00:00Z",
            )

    def test_invalid_confidence(self) -> None:
        with pytest.raises(ValidationError):
            Recommendation(
                type="sell_now",
                commodity="Wheat",
                confidence=150,
                headline="Test",
                rationale="Test",
                potential_gain=0,
                risk_level="low",
                suggested_action="Test",
                generated_at="2026-01-01T00:00:00Z",
            )

    def test_invalid_risk_level(self) -> None:
        with pytest.raises(ValidationError):
            Recommendation(
                type="sell_now",
                commodity="Wheat",
                confidence=85,
                headline="Test",
                rationale="Test",
                potential_gain=0,
                risk_level="extreme",
                suggested_action="Test",
                generated_at="2026-01-01T00:00:00Z",
            )


class TestMarketRecommendationResponse:
    def test_valid(self) -> None:
        r = MarketRecommendationResponse(
            commodity="Wheat",
            current_price=2275.0,
            msp=2250.0,
            recommendation=Recommendation(
                type="sell_now",
                commodity="Wheat",
                confidence=85,
                headline="Sell Now",
                rationale="Price above MSP",
                potential_gain=50.0,
                risk_level="low",
                suggested_action="Sell at APMC",
                generated_at="2026-01-01T00:00:00Z",
            ),
            generated_at="2026-01-01T00:00:00Z",
        )
        assert r.commodity == "Wheat"
        assert r.recommendation.type == "sell_now"
