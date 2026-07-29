"""Tests for DiseaseAgent."""

from unittest.mock import AsyncMock, patch

import pytest

from app.agents.context import AgentContext
from app.agents.disease_agent import DiseaseAgent
from app.agents.schemas import AgentConfig


class TestDiseaseAgentProperties:
    """Tests for agent metadata."""

    def test_name(self):
        agent = DiseaseAgent()
        assert agent.name == "disease"

    def test_supported_intents(self):
        agent = DiseaseAgent()
        assert "disease" in agent.supported_intents
        assert "pest" in agent.supported_intents
        assert "fungus" in agent.supported_intents
        assert "blight" in agent.supported_intents
        assert "infection" in agent.supported_intents

    def test_priority(self):
        agent = DiseaseAgent()
        assert agent.priority == 20

    def test_can_handle_disease(self):
        agent = DiseaseAgent()
        assert agent.can_handle("disease") is True
        assert agent.can_handle("pest") is True
        assert agent.can_handle("unknown") is False


class TestDiseaseAgentRun:
    """Tests for DiseaseAgent.run()."""

    @pytest.mark.asyncio
    async def test_run_success(self):
        agent = DiseaseAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="My leaves have yellow spots")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {
            "success": True,
            "data": {"disease": "Leaf Blight", "confidence": 0.92},
        }

        with patch("app.tools.disease.DiseaseTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "disease"
        assert result.success is True
        assert result.confidence == 0.85
        assert result.data == {"disease": "Leaf Blight", "confidence": 0.92}
        assert "diagnosis_service" in result.sources

    @pytest.mark.asyncio
    async def test_run_tool_failure(self):
        agent = DiseaseAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="Sick plant")

        mock_tool = AsyncMock()
        mock_tool.run.return_value = {"success": False, "error": "No image"}

        with patch("app.tools.disease.DiseaseTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "disease"
        assert result.success is False
        assert result.confidence == 0.0

    @pytest.mark.asyncio
    async def test_run_timeout(self):
        import asyncio

        agent = DiseaseAgent(config=AgentConfig(timeout_seconds=0.01))
        ctx = AgentContext(message="Sick plant")

        async def slow_run(*args, **kwargs):
            await asyncio.sleep(10)
            return {"success": True, "data": {}}

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = slow_run

        with patch("app.tools.disease.DiseaseTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "disease"
        assert result.success is False
        assert any("timed out" in e for e in result.errors)

    @pytest.mark.asyncio
    async def test_run_exception(self):
        agent = DiseaseAgent(config=AgentConfig(timeout_seconds=5.0))
        ctx = AgentContext(message="Sick plant")

        mock_tool = AsyncMock()
        mock_tool.run.side_effect = RuntimeError("Model error")

        with patch("app.tools.disease.DiseaseTool", return_value=mock_tool):
            result = await agent.run(ctx)

        assert result.name == "disease"
        assert result.success is False
        assert result.confidence == 0.0
        assert any("Model error" in e for e in result.errors)
