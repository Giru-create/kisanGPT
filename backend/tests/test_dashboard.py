from __future__ import annotations

import pytest

from app.services.dashboard import (
    DashboardService,
    _get_default_ai_advisor_chats,
    _get_default_crop_health_cards,
    _get_default_market_trends,
    _get_default_priority_alerts,
    _get_spray_advisory,
    _map_weather_condition,
)


class TestDashboardService:
    @pytest.mark.asyncio
    async def test_get_dashboard_returns_data(self) -> None:
        service = DashboardService()
        result = await service.get_dashboard()
        assert "profile" in result
        assert "weatherSummary" in result
        assert "cropFields" in result
        assert "cropHealthCards" in result
        assert "mandiPrices" in result
        assert "marketTrends" in result
        assert "aiAdvisorChats" in result
        assert "priorityAlerts" in result
        assert "schemes" in result
        assert "recentActivities" in result
        assert "notifications" in result

    @pytest.mark.asyncio
    async def test_get_dashboard_with_location(self) -> None:
        service = DashboardService()
        result = await service.get_dashboard(lat=29.15, lon=76.50)
        assert "weatherSummary" in result

    @pytest.mark.asyncio
    async def test_get_dashboard_with_city(self) -> None:
        service = DashboardService()
        result = await service.get_dashboard(city="Karnal")
        assert "weatherSummary" in result


class TestMapWeatherCondition:
    def test_sunny(self) -> None:
        assert _map_weather_condition("clear sky") == "sunny"

    def test_partly_cloudy(self) -> None:
        assert _map_weather_condition("few clouds") == "partly-cloudy"

    def test_cloudy(self) -> None:
        assert _map_weather_condition("overcast clouds") == "cloudy"

    def test_rain(self) -> None:
        assert _map_weather_condition("light rain") == "rain"

    def test_heavy_rain(self) -> None:
        assert _map_weather_condition("very heavy rain") == "heavy-rain"

    def test_thunderstorm(self) -> None:
        assert _map_weather_condition("thunderstorm") == "thunderstorm"

    def test_snow(self) -> None:
        assert _map_weather_condition("snow") == "snow"

    def test_fog(self) -> None:
        assert _map_weather_condition("fog") == "fog"

    def test_wind(self) -> None:
        assert _map_weather_condition("strong wind") == "windy"

    def test_unknown(self) -> None:
        assert _map_weather_condition("unknown") == "partly-cloudy"


class TestGetSprayAdvisory:
    def test_rain_advisory(self) -> None:
        advisory, safe = _get_spray_advisory(25, 60, 5, "rain")
        assert safe is False
        assert "rain" in advisory.lower()

    def test_heavy_rain_advisory(self) -> None:
        advisory, safe = _get_spray_advisory(25, 60, 5, "heavy-rain")
        assert safe is False

    def test_thunderstorm_advisory(self) -> None:
        advisory, safe = _get_spray_advisory(25, 60, 5, "thunderstorm")
        assert safe is False

    def test_high_wind_advisory(self) -> None:
        advisory, safe = _get_spray_advisory(25, 60, 25, "sunny")
        assert safe is False
        assert "wind" in advisory.lower()

    def test_extreme_heat_advisory(self) -> None:
        advisory, safe = _get_spray_advisory(42, 60, 5, "sunny")
        assert safe is False
        assert "heat" in advisory.lower()

    def test_high_humidity_advisory(self) -> None:
        advisory, safe = _get_spray_advisory(25, 90, 5, "sunny")
        assert safe is True
        assert "humidity" in advisory.lower()

    def test_low_temp_advisory(self) -> None:
        advisory, safe = _get_spray_advisory(5, 60, 5, "sunny")
        assert safe is True
        assert "temperature" in advisory.lower()

    def test_ideal_conditions(self) -> None:
        advisory, safe = _get_spray_advisory(25, 50, 5, "sunny")
        assert safe is True
        assert "safe" in advisory.lower()


class TestGetDefaultCropHealthCards:
    def test_returns_cards(self) -> None:
        cards = _get_default_crop_health_cards()
        assert len(cards) == 2
        assert cards[0].crop_name == "Wheat"
        assert cards[0].status == "healthy"
        assert cards[1].status == "alert"
        assert cards[1].alert_message is not None


class TestGetDefaultMarketTrends:
    def test_from_mandi_prices(self) -> None:
        from app.schemas.dashboard import MandiPriceItem

        prices = [
            MandiPriceItem(
                id="mandi-1",
                commodity="Wheat",
                variety="PBW 550",
                mandi_name="Karnal",
                price_per_quintal=2275,
                change_amount=45,
                change_percent=2.02,
                is_rise=True,
                msp_difference=25,
                updated_at="2026-01-01T00:00:00Z",
            ),
        ]
        trends = _get_default_market_trends(prices)
        assert len(trends) == 1
        assert trends[0].commodity == "Wheat"
        assert "2,275" in trends[0].price

    def test_empty_prices(self) -> None:
        trends = _get_default_market_trends([])
        assert len(trends) == 3
        assert trends[0].commodity == "Wheat (Dara)"


class TestGetDefaultAiAdvisorChats:
    def test_returns_chats(self) -> None:
        chats = _get_default_ai_advisor_chats()
        assert len(chats) == 2
        assert chats[0].icon_type == "water"
        assert chats[1].icon_type == "pest"


class TestGetDefaultPriorityAlerts:
    def test_includes_subsidy(self) -> None:
        from app.schemas.dashboard import WeatherSummary

        weather = WeatherSummary(
            temperature_c=25,
            feels_like_c=27,
            condition="sunny",
            humidity=50,
            wind_speed_kmh=10,
            advisory="Safe",
            advisory_safe=True,
        )
        alerts = _get_default_priority_alerts(weather)
        types = [a.type for a in alerts]
        assert "subsidy" in types

    def test_frost_alert_when_cold(self) -> None:
        from app.schemas.dashboard import WeatherSummary

        weather = WeatherSummary(
            temperature_c=5,
            feels_like_c=2,
            condition="fog",
            humidity=80,
            wind_speed_kmh=8,
            advisory="Cold",
            advisory_safe=True,
        )
        alerts = _get_default_priority_alerts(weather)
        types = [a.type for a in alerts]
        assert "frost" in types
