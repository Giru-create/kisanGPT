from __future__ import annotations

import pytest

from app.services.dashboard import (
    DashboardService,
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
        assert "mandiPrices" in result
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
