"""Tests for KnowledgeAgent."""

from unittest.mock import AsyncMock, patch

import pytest

from app.agents.context import AgentContext
from app.agents.knowledge_agent import KnowledgeAgent
from app.agents.schemas import AgentConfig


class TestKnowledgeAgentProperties:
    """Tests for agent metadata."""

    def test_name(self):
        agent = KnowledgeAgent()
        assert agent.name == "knowledge"

    def test_supported_intents(self):
        agent = KnowledgeAgent()
        assert "knowledge" in agent.supported_intents
        assert "guide" in agent.supported_intents
        assert "scheme" in agent.supported_intents
        assert "fertilizer" in agent.supported_intents
        assert "how to" in agent.supported_intents

    def test_priority(self):
        agent = KnowledgeAgent()
        assert agent.priority == 5

    def test_can_handle_knowledge(self):
        agent = KnowledgeAgent()
        assert agent.can_handle("knowledge") is True
        assert agent.can_handle("guide") is True
        assert agent.can_handle("unknown") is False


class TestKnowledgeAgentRun:
    """Tests for KnowledgeAgent.run()."""

    @pytest.mark.asyncio
    async def test_run_success(self):
        agent = KnowledgeAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="How to use urea fertilizer?")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {
            "success": True,
            "data": {"documents": [{"id": 1, "content": "Apply urea at 5kg/acre"}]},
        }

        with patch("app.tools.knowledge.KnowledgeTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "knowledge"
        assert result.success is True
        assert result.confidence == 0.8
        assert "documents" in result.data
        assert "knowledge_base" in result.sources

    @pytest.mark.asyncio
    async def test_run_tool_failure(self):
        agent = KnowledgeAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="Fertilizer guide")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {"success": False, "error": "No docs"}

        with patch("app.tools.knowledge.KnowledgeTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "knowledge"
        assert result.success is False
        assert result.confidence == 0.3

    @pytest.mark.asyncio
    async def test_run_timeout(self):
        import asyncio

        agent = KnowledgeAgent(config=AgentConfig(timeout_seconds=0.01))
        ctx = AgentContext(message="How to farm?")

        async def slow_run(*args, **kwargs):
            await asyncio.sleep(10)
            return {"success": True, "data": {}}

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = slow_run

        with patch("app.tools.knowledge.KnowledgeTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "knowledge"
        assert result.success is False
        assert any("timed out" in e for e in result.errors)

    @pytest.mark.asyncio
    async def test_run_exception(self):
        agent = KnowledgeAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="How to farm?")

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = RuntimeError("DB error")

        with patch("app.tools.knowledge.KnowledgeTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "knowledge"
        assert result.success is False
        assert result.confidence == 0.0
        assert any("DB error" in e for e in result.errors)
