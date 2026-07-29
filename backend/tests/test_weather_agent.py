"""Tests for WeatherAgent."""

from unittest.mock import AsyncMock, patch

import pytest

from app.agents.context import AgentContext
from app.agents.schemas import AgentConfig
from app.agents.weather_agent import WeatherAgent


class TestWeatherAgentProperties:
    """Tests for agent metadata."""

    def test_name(self):
        agent = WeatherAgent()
        assert agent.name == "weather"

    def test_supported_intents(self):
        agent = WeatherAgent()
        assert "weather" in agent.supported_intents
        assert "rain" in agent.supported_intents
        assert "forecast" in agent.supported_intents
        assert "irrigate" in agent.supported_intents
        assert "temperature" in agent.supported_intents

    def test_priority(self):
        agent = WeatherAgent()
        assert agent.priority == 10

    def test_can_handle_weather(self):
        agent = WeatherAgent()
        assert agent.can_handle("weather") is True
        assert agent.can_handle("rain") is True
        assert agent.can_handle("unknown") is False


class TestWeatherAgentRun:
    """Tests for WeatherAgent.run()."""

    @pytest.mark.asyncio
    async def test_run_success(self):
        agent = WeatherAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="What is the weather?", city="Delhi")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {
            "success": True,
            "data": {"temp": 25, "condition": "sunny"},
        }

        with patch("app.tools.weather.WeatherTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "weather"
        assert result.success is True
        assert result.confidence == 0.9
        assert result.data == {"temp": 25, "condition": "sunny"}
        assert "weather_service" in result.sources

    @pytest.mark.asyncio
    async def test_run_tool_failure(self):
        agent = WeatherAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="Weather?", city="Delhi")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {"success": False, "error": "API error"}

        with patch("app.tools.weather.WeatherTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "weather"
        assert result.success is False
        assert result.confidence == 0.0

    @pytest.mark.asyncio
    async def test_run_timeout(self):
        import asyncio

        agent = WeatherAgent(config=AgentConfig(timeout_seconds=0.01))
        ctx = AgentContext(message="Weather?", city="Delhi")

        async def slow_run(*args, **kwargs):
            await asyncio.sleep(10)
            return {"success": True, "data": {}}

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = slow_run

        with patch("app.tools.weather.WeatherTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "weather"
        assert result.success is False
        assert any("timed out" in e for e in result.errors)

    @pytest.mark.asyncio
    async def test_run_exception(self):
        agent = WeatherAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="Weather?", city="Delhi")

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = RuntimeError("Connection failed")

        with patch("app.tools.weather.WeatherTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "weather"
        assert result.success is False
        assert result.confidence == 0.0
        assert any("Connection failed" in e for e in result.errors)
