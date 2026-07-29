"""Tests for ResponseAgent."""

from unittest.mock import AsyncMock, patch

import pytest

from app.agents.context import AgentContext
from app.agents.response_agent import ResponseAgent
from app.agents.schemas import AgentResult


class TestResponseAgentProperties:
    """Tests for agent metadata."""

    def test_name(self):
        agent = ResponseAgent()
        assert agent.name == "response"

    def test_priority(self):
        agent = ResponseAgent()
        assert agent.priority == 100

    def test_supported_intents_empty(self):
        agent = ResponseAgent()
        assert agent.supported_intents == []


class TestResponseAgentFallback:
    """Tests for ResponseAgent fallback logic."""

    def test_fallback_with_successful_agents(self):
        results = [
            AgentResult(name="weather", success=True, data={"temp": 25}),
            AgentResult(name="market", success=True, data={"price": 100}),
        ]
        fallback = ResponseAgent._fallback("What is the weather?", results)
        assert "weather" in fallback
        assert "market" in fallback
        assert "What is the weather?" in fallback

    def test_fallback_with_no_successful_agents(self):
        results = [
            AgentResult(name="weather", success=False, errors=["timeout"]),
        ]
        fallback = ResponseAgent._fallback("Hello", results)
        assert "Hello" in fallback
        assert "unable to generate" in fallback.lower()

    def test_fallback_with_empty_results(self):
        fallback = ResponseAgent._fallback("Test", [])
        assert "Test" in fallback
        assert "unable to generate" in fallback.lower()


class TestResponseAgentBuildMergedContext:
    """Tests for merged context building."""

    def test_build_merged_context_with_knowledge(self):
        ctx = AgentContext(message="Hello", memory={"key": "val"})
        results = [
            AgentResult(
                name="knowledge",
                success=True,
                data={"documents": [{"id": 1}]},
            ),
            AgentResult(name="weather", success=True, data={"temp": 25}),
        ]
        merged = ResponseAgent._build_merged_context(results, ctx)
        assert merged["query"] == "Hello"
        assert merged["knowledge"] == [{"id": 1}]
        assert merged["memory"] == {"key": "val"}

    def test_build_merged_context_no_knowledge(self):
        ctx = AgentContext(message="Hello")
        results = [
            AgentResult(name="weather", success=True, data={"temp": 25}),
        ]
        merged = ResponseAgent._build_merged_context(results, ctx)
        assert merged["knowledge"] == []

    def test_build_merged_context_empty_results(self):
        ctx = AgentContext(message="Hello")
        merged = ResponseAgent._build_merged_context([], ctx)
        assert merged["knowledge"] == []
        assert merged["query"] == "Hello"


class TestResponseAgentRun:
    """Tests for ResponseAgent.run() direct call."""

    @pytest.mark.asyncio
    async def test_run_returns_success(self):
        agent = ResponseAgent()
        ctx = AgentContext(message="Hello")
        result = await agent.run(ctx)
        assert result.name == "response"
        assert result.success is True
        assert result.data == {}


class TestResponseAgentGenerate:
    """Tests for ResponseAgent.generate() method."""

    @pytest.mark.asyncio
    async def test_generate_with_llm(self):
        agent = ResponseAgent()
        ctx = AgentContext(message="Hello")
        results = [
            AgentResult(name="weather", success=True, data={"temp": 25}),
        ]

        mock_generator = AsyncMock()
        mock_generator.generate.return_value = "It is sunny today."

        with patch("app.llm.generator.ResponseGenerator", return_value=mock_generator):
            answer = await agent.generate("Hello", results, ctx)

        assert answer == "It is sunny today."

    @pytest.mark.asyncio
    async def test_generate_llm_fails_uses_fallback(self):
        agent = ResponseAgent()
        ctx = AgentContext(message="Hello")
        results = [
            AgentResult(name="weather", success=True, data={"temp": 25}),
        ]

        mock_generator = AsyncMock()
        mock_generator.generate.side_effect = RuntimeError("LLM error")

        with patch("app.llm.generator.ResponseGenerator", return_value=mock_generator):
            answer = await agent.generate("Hello", results, ctx)

        assert "weather" in answer
        assert "Hello" in answer
