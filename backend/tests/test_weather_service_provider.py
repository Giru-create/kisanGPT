"""Tests for WeatherService provider selection and fallback."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest

from app.schemas.weather import WeatherQuery
from app.services.weather import WeatherService


class TestWeatherServiceProviderSelection:
    """Tests for automatic provider selection based on config."""

    def test_uses_open_meteo_when_no_api_key(self):
        with patch("app.services.weather.settings") as mock_settings:
            mock_settings.OPENWEATHERMAP_API_KEY = ""
            mock_settings.OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1"
            mock_settings.WEATHER_TIMEOUT = 10.0
            mock_settings.WEATHER_CACHE_TTL = 600

            from app.providers.weather.open_meteo import OpenMeteoProvider

            service = WeatherService()
            assert isinstance(service._provider, OpenMeteoProvider)

    def test_uses_openweathermap_when_api_key_set(self):
        with patch("app.services.weather.settings") as mock_settings:
            mock_settings.OPENWEATHERMAP_API_KEY = "test-key-123"
            mock_settings.WEATHER_TIMEOUT = 10.0
            mock_settings.WEATHER_CACHE_TTL = 600

            from app.agents.weather import OpenWeatherMapProvider

            service = WeatherService()
            assert isinstance(service._provider, OpenWeatherMapProvider)

    def test_custom_provider_override(self):
        mock_provider = AsyncMock()
        service = WeatherService(provider=mock_provider)
        assert service._provider is mock_provider


class TestWeatherServiceErrorHandling:
    """Tests for graceful error handling."""

    @pytest.mark.asyncio
    async def test_get_current_propagates_errors(self):
        mock_provider = AsyncMock()
        mock_provider.get_current.side_effect = ValueError("city not found")

        service = WeatherService(provider=mock_provider)
        with pytest.raises(ValueError, match="city not found"):
            await service.get_current(WeatherQuery(city="BadCity"))

    @pytest.mark.asyncio
    async def test_get_forecast_propagates_errors(self):
        mock_provider = AsyncMock()
        mock_provider.get_forecast.side_effect = ConnectionError("network down")

        service = WeatherService(provider=mock_provider)
        with pytest.raises(ConnectionError):
            await service.get_forecast(WeatherQuery(city="Delhi"))

    @pytest.mark.asyncio
    async def test_get_advice_propagates_errors(self):
        mock_provider = AsyncMock()
        mock_provider.get_current.side_effect = RuntimeError("timeout")

        service = WeatherService(provider=mock_provider)
        with pytest.raises(RuntimeError):
            await service.get_advice(WeatherQuery(city="Delhi"))
