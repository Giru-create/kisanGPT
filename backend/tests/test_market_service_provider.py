"""Tests for MarketService provider selection and fallback."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from app.services.market import MarketService


class TestMarketServiceProviderSelection:
    """Tests for automatic provider selection based on config."""

    def test_uses_mock_when_default(self):
        with patch("app.services.market.settings") as mock_settings:
            mock_settings.MARKET_PROVIDER = "mock"
            mock_settings.MARKET_LIVE_URL = ""
            mock_settings.MARKET_TIMEOUT = 10.0
            mock_settings.MARKET_CACHE_TTL = 300

            from app.agents.market import MockMarketProvider

            service = MarketService()
            assert isinstance(service._provider, MockMarketProvider)

    def test_uses_live_when_configured(self):
        with patch("app.services.market.settings") as mock_settings:
            mock_settings.MARKET_PROVIDER = "live"
            mock_settings.MARKET_LIVE_URL = "http://test.example.com"
            mock_settings.MARKET_TIMEOUT = 5.0
            mock_settings.MARKET_CACHE_TTL = 300

            from app.providers.market.live import LiveMarketProvider

            service = MarketService()
            assert isinstance(service._provider, LiveMarketProvider)

    def test_uses_mock_when_live_no_url(self):
        with patch("app.services.market.settings") as mock_settings:
            mock_settings.MARKET_PROVIDER = "live"
            mock_settings.MARKET_LIVE_URL = ""
            mock_settings.MARKET_TIMEOUT = 10.0
            mock_settings.MARKET_CACHE_TTL = 300

            from app.agents.market import MockMarketProvider

            service = MarketService()
            assert isinstance(service._provider, MockMarketProvider)

    def test_custom_provider_override(self):
        mock_provider = AsyncMock()
        service = MarketService(provider=mock_provider)
        assert service._provider is mock_provider
