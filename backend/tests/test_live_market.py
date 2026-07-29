"""Tests for LiveMarketProvider with fallback."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest

from app.agents.market import MockMarketProvider
from app.providers.market.live import LiveMarketProvider


class TestLiveMarketProviderInit:
    """Tests for initialization."""

    def test_default_init(self):
        provider = LiveMarketProvider()
        assert provider._base_url is None
        assert provider._timeout == 10.0
        assert isinstance(provider._fallback, MockMarketProvider)

    def test_custom_init(self):
        fallback = MockMarketProvider()
        provider = LiveMarketProvider(
            base_url="http://localhost:8080",
            timeout=5.0,
            fallback=fallback,
        )
        assert provider._base_url == "http://localhost:8080"
        assert provider._timeout == 5.0
        assert provider._fallback is fallback


class TestLiveMarketProviderFallback:
    """Tests for fallback behavior when no live URL is configured."""

    @pytest.mark.asyncio
    async def test_get_prices_falls_back(self):
        provider = LiveMarketProvider(base_url=None)
        result = await provider.get_prices("Wheat")
        assert len(result) > 0
        assert result[0]["commodity"] == "Wheat"

    @pytest.mark.asyncio
    async def test_get_trend_falls_back(self):
        provider = LiveMarketProvider(base_url=None)
        result = await provider.get_trend("Wheat", days=7)
        assert "dates" in result
        assert len(result["dates"]) == 7

    @pytest.mark.asyncio
    async def test_get_commodities_falls_back(self):
        provider = LiveMarketProvider(base_url=None)
        result = await provider.get_commodities()
        assert "Wheat" in result

    @pytest.mark.asyncio
    async def test_get_forecast_falls_back(self):
        provider = LiveMarketProvider(base_url=None)
        result = await provider.get_forecast("Wheat")
        assert "forecast" in result

    @pytest.mark.asyncio
    async def test_get_recommendation_falls_back(self):
        provider = LiveMarketProvider(base_url=None)
        result = await provider.get_recommendation("Wheat")
        assert "type" in result


class TestLiveMarketProviderLiveCalls:
    """Tests for live API calls via _safe_get mock."""

    @pytest.mark.asyncio
    async def test_get_prices_success(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        mock_data = {"prices": [{"commodity": "Wheat", "price_per_quintal": 2300.0}]}
        provider._safe_get = AsyncMock(return_value=mock_data)  # type: ignore[method-assign]
        result = await provider.get_prices("Wheat")

        assert len(result) == 1
        assert result[0]["commodity"] == "Wheat"

    @pytest.mark.asyncio
    async def test_get_prices_timeout_falls_back(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        provider._safe_get = AsyncMock(return_value=None)  # type: ignore[method-assign]
        result = await provider.get_prices("Wheat")

        assert len(result) > 0
        assert result[0]["commodity"] == "Wheat"

    @pytest.mark.asyncio
    async def test_get_prices_network_error_falls_back(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        provider._safe_get = AsyncMock(return_value=None)  # type: ignore[method-assign]
        result = await provider.get_prices("Wheat")

        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_get_prices_http_error_falls_back(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        provider._safe_get = AsyncMock(return_value=None)  # type: ignore[method-assign]
        result = await provider.get_prices("Wheat")

        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_get_trend_live_success(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        mock_data = {
            "dates": ["2026-07-01", "2026-07-02"],
            "prices": [2300.0, 2310.0],
            "trend_direction": "rising",
        }
        provider._safe_get = AsyncMock(return_value=mock_data)  # type: ignore[method-assign]
        result = await provider.get_trend("Wheat", days=2)

        assert result["dates"] == ["2026-07-01", "2026-07-02"]

    @pytest.mark.asyncio
    async def test_get_trend_empty_response_falls_back(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        provider._safe_get = AsyncMock(return_value={})  # type: ignore[method-assign]
        result = await provider.get_trend("Wheat", days=7)

        assert "dates" in result
        assert len(result["dates"]) == 7

    @pytest.mark.asyncio
    async def test_get_forecast_live_success(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        mock_data = {
            "forecast": [{"date": "2026-07-21", "predicted_price": 2300.0}],
            "summary": "Prices stable",
        }
        provider._safe_get = AsyncMock(return_value=mock_data)  # type: ignore[method-assign]
        result = await provider.get_forecast("Wheat")

        assert len(result["forecast"]) == 1

    @pytest.mark.asyncio
    async def test_get_recommendation_live_success(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        mock_data = {"type": "sell_now", "confidence": 80}
        provider._safe_get = AsyncMock(return_value=mock_data)  # type: ignore[method-assign]
        result = await provider.get_recommendation("Wheat")

        assert result["type"] == "sell_now"

    @pytest.mark.asyncio
    async def test_get_commodities_live_success(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        mock_data = {"commodities": ["Wheat", "Rice"]}
        provider._safe_get = AsyncMock(return_value=mock_data)  # type: ignore[method-assign]
        result = await provider.get_commodities()

        assert result == ["Wheat", "Rice"]

    @pytest.mark.asyncio
    async def test_safe_get_none_base_url(self):
        provider = LiveMarketProvider(base_url=None)
        result = await provider._safe_get("http://test/prices")
        assert result is None


class TestSafeGetHTTP:
    """Tests for _safe_get HTTP behavior via httpx mock."""

    @pytest.mark.asyncio
    async def test_safe_get_success(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")
        mock_response = {"key": "value"}

        mock_resp = MagicMock()
        mock_resp.json.return_value = mock_response
        mock_resp.raise_for_status = MagicMock()

        mock_client = AsyncMock()
        mock_client.get.return_value = mock_resp
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)

        with patch(
            "app.providers.market.live.httpx.AsyncClient",
            return_value=mock_client,
        ):
            result = await provider._safe_get("http://test.example.com/prices")

        assert result == mock_response

    @pytest.mark.asyncio
    async def test_safe_get_timeout(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")

        mock_client = AsyncMock()
        mock_client.get.side_effect = httpx.TimeoutException("timeout")
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)

        with patch(
            "app.providers.market.live.httpx.AsyncClient",
            return_value=mock_client,
        ):
            result = await provider._safe_get("http://test.example.com/prices")

        assert result is None

    @pytest.mark.asyncio
    async def test_safe_get_connect_error(self):
        provider = LiveMarketProvider(base_url="http://test.example.com")

        mock_client = AsyncMock()
        mock_client.get.side_effect = httpx.ConnectError("refused")
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)

        with patch(
            "app.providers.market.live.httpx.AsyncClient",
            return_value=mock_client,
        ):
            result = await provider._safe_get("http://test.example.com/prices")

        assert result is None
