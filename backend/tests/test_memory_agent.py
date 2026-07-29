"""Tests for MemoryAgent."""

from unittest.mock import AsyncMock, patch

import pytest

from app.agents.context import AgentContext
from app.agents.memory_agent import MemoryAgent
from app.agents.schemas import AgentConfig


class TestMemoryAgentProperties:
    """Tests for agent metadata."""

    def test_name(self):
        agent = MemoryAgent()
        assert agent.name == "memory"

    def test_supported_intents(self):
        agent = MemoryAgent()
        assert "memory" in agent.supported_intents
        assert "history" in agent.supported_intents
        assert "previous" in agent.supported_intents
        assert "remember" in agent.supported_intents

    def test_priority(self):
        agent = MemoryAgent()
        assert agent.priority == 5

    def test_can_handle_memory(self):
        agent = MemoryAgent()
        assert agent.can_handle("memory") is True
        assert agent.can_handle("history") is True
        assert agent.can_handle("unknown") is False


class TestMemoryAgentRun:
    """Tests for MemoryAgent.run()."""

    @pytest.mark.asyncio
    async def test_run_success_with_history(self):
        agent = MemoryAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(user_id="farmer1", message="What did we discuss last time?")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {
            "success": True,
            "data": {"messages": [{"role": "user", "content": "Hello"}]},
        }

        with patch("app.tools.memory.MemoryTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "memory"
        assert result.success is True
        assert result.confidence == 0.85
        assert "messages" in result.data
        assert "conversation_service" in result.sources

    @pytest.mark.asyncio
    async def test_run_enriches_context_history(self):
        agent = MemoryAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(user_id="farmer1", message="Previous discussion?")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {
            "success": True,
            "data": {"messages": [{"role": "user", "content": "Hi"}]},
        }

        with patch("app.tools.memory.MemoryTool", return_value=mock_tool):
            await agent.run(ctx)

        assert len(ctx.history) == 1
        assert ctx.history[0]["role"] == "user"

    @pytest.mark.asyncio
    async def test_run_tool_failure(self):
        agent = MemoryAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(user_id="farmer1", message="History?")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {"success": False, "error": "DB error"}

        with patch("app.tools.memory.MemoryTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "memory"
        assert result.success is False
        assert result.confidence == 0.0

    @pytest.mark.asyncio
    async def test_run_timeout(self):
        import asyncio

        agent = MemoryAgent(config=AgentConfig(timeout_seconds=0.01))
        ctx = AgentContext(user_id="farmer1", message="History?")

        async def slow_run(*args, **kwargs):
            await asyncio.sleep(10)
            return {"success": True, "data": {}}

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = slow_run

        with patch("app.tools.memory.MemoryTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "memory"
        assert result.success is False
        assert any("timed out" in e for e in result.errors)

    @pytest.mark.asyncio
    async def test_run_exception(self):
        agent = MemoryAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(user_id="farmer1", message="History?")

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = RuntimeError("Connection error")

        with patch("app.tools.memory.MemoryTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "memory"
        assert result.success is False
        assert result.confidence == 0.0
        assert any("Connection error" in e for e in result.errors)

    @pytest.mark.asyncio
    async def test_run_no_user_id(self):
        agent = MemoryAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(user_id="", message="History?")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {
            "success": True,
            "data": {"messages": []},
        }

        with patch("app.tools.memory.MemoryTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "memory"
        assert result.success is True
