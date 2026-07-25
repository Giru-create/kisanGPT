from __future__ import annotations

from typing import Any

import pytest

from app.agents.weather import WeatherProvider
from app.cache.memory import TTLCache
from app.schemas.weather import (
    FarmingAdvice,
    WeatherQuery,
)
from app.services.weather import (
    WeatherService,
    _generate_farming_advice,
)

# ---------------------------------------------------------------------------
# TTLCache tests
# ---------------------------------------------------------------------------


class TestTTLCache:
    def test_set_and_get(self) -> None:
        cache = TTLCache(default_ttl=60)
        cache.set("key1", "value1")
        assert cache.get("key1") == "value1"

    def test_missing_key_returns_none(self) -> None:
        cache = TTLCache()
        assert cache.get("missing") is None

    def test_delete(self) -> None:
        cache = TTLCache()
        cache.set("k", "v")
        cache.delete("k")
        assert cache.get("k") is None

    def test_clear(self) -> None:
        cache = TTLCache()
        cache.set("a", 1)
        cache.set("b", 2)
        cache.clear()
        assert len(cache) == 0

    def test_contains(self) -> None:
        cache = TTLCache()
        cache.set("x", 10)
        assert "x" in cache
        assert "y" not in cache

    def test_expired_key_returns_none(self) -> None:
        cache = TTLCache(default_ttl=0)
        cache.set("exp", "val", ttl=0)
        import time

        time.sleep(0.01)
        assert cache.get("exp") is None

    def test_custom_ttl(self) -> None:
        cache = TTLCache(default_ttl=300)
        cache.set("a", 1)
        assert cache.get("a") == 1


# ---------------------------------------------------------------------------
# Mock WeatherProvider for tests
# ---------------------------------------------------------------------------


class MockWeatherProvider(WeatherProvider):
    """Test double implementing WeatherProvider."""

    def __init__(
        self,
        current: dict[str, Any] | None = None,
        forecast: list[dict[str, Any]] | None = None,
        coords: dict[str, float] | None = None,
        error: Exception | None = None,
    ) -> None:
        self._current = current
        self._forecast = forecast or []
        self._coords = coords or {"lat": 28.6, "lon": 77.2}
        self._error = error

    async def resolve_coordinates(self, query: WeatherQuery) -> dict[str, float]:
        if self._error:
            raise self._error
        return self._coords

    async def get_current(self, query: WeatherQuery) -> dict[str, Any]:
        if self._error:
            raise self._error
        assert self._current is not None
        return self._current

    async def get_forecast(
        self, query: WeatherQuery, days: int = 7
    ) -> list[dict[str, Any]]:
        if self._error:
            raise self._error
        return self._forecast


def _make_current(**overrides: Any) -> dict[str, Any]:
    defaults: dict[str, Any] = {
        "temperature": 32.0,
        "feels_like": 35.0,
        "humidity": 60,
        "pressure": 1012,
        "wind_speed": 4.5,
        "wind_deg": 180,
        "visibility": 10000,
        "clouds": 30,
        "conditions": [
            {
                "main": "Clear",
                "description": "clear sky",
                "icon": "01d",
            }
        ],
        "dt": "2025-01-01T12:00:00Z",
        "city": "Delhi",
        "country": "IN",
        "coordinates": {"lat": 28.6, "lon": 77.2},
    }
    defaults.update(overrides)
    return defaults


# ---------------------------------------------------------------------------
# WeatherService tests
# ---------------------------------------------------------------------------


class TestWeatherService:
    @pytest.fixture
    def mock_provider(self) -> MockWeatherProvider:
        return MockWeatherProvider(
            current=_make_current(),
            forecast=[
                {
                    "date": "2025-01-01",
                    "temp_min": 18.0,
                    "temp_max": 32.0,
                    "humidity": 55,
                    "wind_speed": 4.0,
                    "conditions": [
                        {
                            "main": "Clear",
                            "description": "clear sky",
                            "icon": "01d",
                        }
                    ],
                    "pop": 0.1,
                    "summary": "Clear sky, 18-32°C",
                },
            ],
        )

    @pytest.fixture
    def service(self, mock_provider: MockWeatherProvider) -> WeatherService:
        return WeatherService(provider=mock_provider)

    @pytest.mark.asyncio
    async def test_get_current(self, service: WeatherService) -> None:
        result = await service.get_current(WeatherQuery(city="Delhi"))
        assert "temperature" in result
        assert result["city"] == "Delhi"

    @pytest.mark.asyncio
    async def test_get_current_cached(self, service: WeatherService) -> None:
        await service.get_current(WeatherQuery(city="Delhi"))
        result2 = await service.get_current(WeatherQuery(city="Delhi"))
        assert result2["temperature"] == 32.0

    @pytest.mark.asyncio
    async def test_get_forecast(self, service: WeatherService) -> None:
        result = await service.get_forecast(WeatherQuery(city="Delhi"), days=1)
        assert "daily" in result

    @pytest.mark.asyncio
    async def test_get_advice(self, service: WeatherService) -> None:
        result = await service.get_advice(WeatherQuery(city="Delhi"))
        assert "advice" in result
        assert "location" in result
        assert len(result["advice"]) > 0

    @pytest.mark.asyncio
    async def test_provider_error_raises(self) -> None:
        error_provider = MockWeatherProvider(error=ConnectionError("timeout"))
        svc = WeatherService(provider=error_provider)
        with pytest.raises(ConnectionError):
            await svc.get_current(WeatherQuery(city="Delhi"))


# ---------------------------------------------------------------------------
# Farming advice rule tests
# ---------------------------------------------------------------------------


class TestFarmingAdviceRules:
    def test_extreme_heat(self) -> None:
        advice = _generate_farming_advice(42, 50, 3.0, "clear sky", [])
        categories = [a.category for a in advice]
        assert "heat" in categories

    def test_high_temp_warning(self) -> None:
        advice = _generate_farming_advice(37, 50, 3.0, "clear sky", [])
        categories = [a.category for a in advice]
        assert "heat" in categories

    def test_cold_danger(self) -> None:
        advice = _generate_farming_advice(3, 50, 3.0, "clear sky", [])
        categories = [a.category for a in advice]
        assert "cold" in categories

    def test_cold_info(self) -> None:
        advice = _generate_farming_advice(8, 50, 3.0, "clear sky", [])
        categories = [a.category for a in advice]
        assert "cold" in categories

    def test_high_humidity(self) -> None:
        advice = _generate_farming_advice(25, 95, 3.0, "mist", [])
        categories = [a.category for a in advice]
        assert "humidity" in categories

    def test_low_humidity(self) -> None:
        advice = _generate_farming_advice(25, 20, 3.0, "clear sky", [])
        categories = [a.category for a in advice]
        assert "humidity" in categories

    def test_strong_wind(self) -> None:
        advice = _generate_farming_advice(25, 50, 18.0, "clear sky", [])
        categories = [a.category for a in advice]
        assert "wind" in categories

    def test_favorable_conditions(self) -> None:
        advice = _generate_farming_advice(25, 55, 3.0, "clear sky", [])
        assert len(advice) == 1
        assert advice[0].category == "general"
        assert advice[0].severity == "info"

    def test_severity_values(self) -> None:
        for sev in ("info", "warning", "danger"):
            a = FarmingAdvice(
                category="test",
                title="t",
                message="m",
                severity=sev,
            )
            assert a.severity == sev
