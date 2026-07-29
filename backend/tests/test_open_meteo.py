"""Tests for Open-Meteo weather provider."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest

from app.providers.weather.open_meteo import OpenMeteoProvider, _wmo_to_condition
from app.schemas.weather import WeatherQuery


class TestWMOCodeMapping:
    """Tests for WMO weather code interpretation."""

    def test_clear_sky(self):
        result = _wmo_to_condition(0)
        assert result["main"] == "Clear"
        assert result["description"] == "clear sky"

    def test_rain(self):
        result = _wmo_to_condition(61)
        assert result["main"] == "Slight Rain"
        assert result["description"] == "slight rain"

    def test_unknown_code(self):
        result = _wmo_to_condition(9999)
        assert result["main"] == "Unknown"
        assert result["description"] == "unknown"

    def test_thunderstorm(self):
        result = _wmo_to_condition(95)
        assert result["main"] == "Thunderstorm"


class TestOpenMeteoProvider:
    """Tests for OpenMeteoProvider."""

    def test_init_defaults(self):
        provider = OpenMeteoProvider()
        assert provider._base_url == "https://api.open-meteo.com/v1"
        assert provider._timeout == 10.0

    def test_init_custom(self):
        provider = OpenMeteoProvider(base_url="http://localhost:8080", timeout=5.0)
        assert provider._base_url == "http://localhost:8080"
        assert provider._timeout == 5.0

    @pytest.mark.asyncio
    async def test_resolve_coordinates_by_latlon(self):
        provider = OpenMeteoProvider()
        query = WeatherQuery(lat=28.61, lon=77.21)
        coords = await provider.resolve_coordinates(query)
        assert coords == {"lat": 28.61, "lon": 77.21}

    @pytest.mark.asyncio
    async def test_resolve_coordinates_by_city(self):
        provider = OpenMeteoProvider()
        query = WeatherQuery(city="Delhi")

        mock_data = {
            "results": [
                {"latitude": 28.6139, "longitude": 77.209},
            ]
        }
        with patch.object(
            provider, "_get", new_callable=AsyncMock, return_value=mock_data
        ):
            coords = await provider.resolve_coordinates(query)
            assert coords["lat"] == 28.6139
            assert coords["lon"] == 77.209

    @pytest.mark.asyncio
    async def test_resolve_coordinates_city_not_found(self):
        provider = OpenMeteoProvider()
        query = WeatherQuery(city="NonexistentCityXYZ")

        with (
            patch.object(
                provider, "_get", new_callable=AsyncMock, return_value={"results": []}
            ),
            pytest.raises(ValueError, match="City not found"),
        ):
            await provider.resolve_coordinates(query)

    @pytest.mark.asyncio
    async def test_resolve_coordinates_no_query(self):
        provider = OpenMeteoProvider()
        query = WeatherQuery()
        with pytest.raises(ValueError, match="Either lat/lon or city"):
            await provider.resolve_coordinates(query)

    @pytest.mark.asyncio
    async def test_get_current(self):
        provider = OpenMeteoProvider()
        query = WeatherQuery(lat=28.61, lon=77.21)

        mock_forecast = {
            "current": {
                "temperature_2m": 32.5,
                "apparent_temperature": 35.0,
                "relative_humidity_2m": 65,
                "surface_pressure": 1013,
                "wind_speed_10m": 12.3,
                "wind_direction_180": 180,
                "cloud_cover": 40,
                "weather_code": 2,
            }
        }
        with patch.object(
            provider, "_get", new_callable=AsyncMock, return_value=mock_forecast
        ):
            result = await provider.get_current(query)

        assert result["temperature"] == 32.5
        assert result["feels_like"] == 35.0
        assert result["humidity"] == 65
        assert result["pressure"] == 1013
        assert result["wind_speed"] == 12.3
        assert result["clouds"] == 40
        assert result["coordinates"]["lat"] == 28.61
        assert result["coordinates"]["lon"] == 77.21
        assert len(result["conditions"]) == 1
        assert result["conditions"][0]["main"] == "Partly Cloudy"

    @pytest.mark.asyncio
    async def test_get_forecast(self):
        provider = OpenMeteoProvider()
        query = WeatherQuery(lat=28.61, lon=77.21)

        mock_forecast = {
            "daily": {
                "time": ["2026-07-20", "2026-07-21"],
                "temperature_2m_max": [35.0, 33.0],
                "temperature_2m_min": [25.0, 23.0],
                "precipitation_probability_max": [10.0, 80.0],
                "wind_speed_10m_max": [15.0, 20.0],
                "weather_code": [0, 61],
            }
        }
        with patch.object(
            provider, "_get", new_callable=AsyncMock, return_value=mock_forecast
        ):
            results = await provider.get_forecast(query, days=2)

        assert len(results) == 2
        assert results[0]["date"] == "2026-07-20"
        assert results[0]["temp_min"] == 25.0
        assert results[0]["temp_max"] == 35.0
        assert results[0]["pop"] == 0.1
        assert results[0]["conditions"][0]["main"] == "Clear"

        assert results[1]["date"] == "2026-07-21"
        assert results[1]["pop"] == 0.8
        assert results[1]["conditions"][0]["main"] == "Slight Rain"

    @pytest.mark.asyncio
    async def test_get_forecast_includes_rain_summary(self):
        provider = OpenMeteoProvider()
        query = WeatherQuery(lat=28.61, lon=77.21)

        mock_forecast = {
            "daily": {
                "time": ["2026-07-20"],
                "temperature_2m_max": [30.0],
                "temperature_2m_min": [20.0],
                "precipitation_probability_max": [60.0],
                "wind_speed_10m_max": [10.0],
                "weather_code": [61],
            }
        }
        with patch.object(
            provider, "_get", new_callable=AsyncMock, return_value=mock_forecast
        ):
            results = await provider.get_forecast(query, days=1)

        assert "high chance of rain" in results[0]["summary"]
