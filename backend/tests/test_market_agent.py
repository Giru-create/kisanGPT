"""Tests for MarketAgent."""

from unittest.mock import AsyncMock, patch

import pytest

from app.agents.context import AgentContext
from app.agents.market_agent import MarketAgent
from app.agents.schemas import AgentConfig


class TestMarketAgentProperties:
    """Tests for agent metadata."""

    def test_name(self):
        agent = MarketAgent()
        assert agent.name == "market"

    def test_supported_intents(self):
        agent = MarketAgent()
        assert "market" in agent.supported_intents
        assert "price" in agent.supported_intents
        assert "sell" in agent.supported_intents
        assert "mandi" in agent.supported_intents
        assert "commodity" in agent.supported_intents

    def test_priority(self):
        agent = MarketAgent()
        assert agent.priority == 10

    def test_can_handle_market(self):
        agent = MarketAgent()
        assert agent.can_handle("market") is True
        assert agent.can_handle("price") is True
        assert agent.can_handle("unknown") is False


class TestMarketAgentRun:
    """Tests for MarketAgent.run()."""

    @pytest.mark.asyncio
    async def test_run_success(self):
        agent = MarketAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="What is the wheat price?", commodity="wheat")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {
            "success": True,
            "data": {"price": 2500, "unit": "INR/quintal"},
        }

        with patch("app.tools.market.MarketTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "market"
        assert result.success is True
        assert result.confidence == 0.9
        assert result.data == {"price": 2500, "unit": "INR/quintal"}
        assert "market_service" in result.sources

    @pytest.mark.asyncio
    async def test_run_tool_failure(self):
        agent = MarketAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="Price?", commodity="wheat")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {"success": False, "error": "API error"}

        with patch("app.tools.market.MarketTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "market"
        assert result.success is False
        assert result.confidence == 0.0

    @pytest.mark.asyncio
    async def test_run_timeout(self):
        import asyncio

        agent = MarketAgent(config=AgentConfig(timeout_seconds=0.01))
        ctx = AgentContext(message="Price?")

        async def slow_run(*args, **kwargs):
            await asyncio.sleep(10)
            return {"success": True, "data": {}}

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = slow_run

        with patch("app.tools.market.MarketTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "market"
        assert result.success is False
        assert any("timed out" in e for e in result.errors)

    @pytest.mark.asyncio
    async def test_run_exception(self):
        agent = MarketAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="Price?")

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = RuntimeError("Connection failed")

        with patch("app.tools.market.MarketTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "market"
        assert result.success is False
        assert result.confidence == 0.0
        assert any("Connection failed" in e for e in result.errors)
