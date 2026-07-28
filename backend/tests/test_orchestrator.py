from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest

from app.agents.context import AgentContext
from app.agents.orchestrator import Orchestrator
from app.agents.registry import ToolRegistry
from app.tools.base import BaseTool


class StubWeatherTool(BaseTool):
    name = "weather"
    description = "Stub weather."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        return self._success({"temperature": 28, "condition": "sunny"})


class StubMarketTool(BaseTool):
    name = "market"
    description = "Stub market."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        return self._success({"wheat": 2200, "trend": "rising"})


def _make_registry() -> ToolRegistry:
    registry = ToolRegistry()
    registry.register(StubWeatherTool())
    registry.register(StubMarketTool())
    return registry


@pytest.mark.asyncio
async def test_orchestrator_weather_query() -> None:
    orch = Orchestrator(registry=_make_registry())
    result = await orch.chat("What is the weather?")
    assert "weather" in result["planned_tools"]
    assert len(result["tool_results"]) >= 1
    weather_result = next(r for r in result["tool_results"] if r["tool"] == "weather")
    assert weather_result["success"] is True


@pytest.mark.asyncio
async def test_orchestrator_market_query() -> None:
    orch = Orchestrator(registry=_make_registry())
    result = await orch.chat("What is the wheat price?")
    assert "market" in result["planned_tools"]
    market_result = next(r for r in result["tool_results"] if r["tool"] == "market")
    assert market_result["success"] is True


@pytest.mark.asyncio
async def test_orchestrator_multi_tool_query() -> None:
    orch = Orchestrator(registry=_make_registry())
    result = await orch.chat("Should I sell wheat because of rain?")
    assert "market" in result["planned_tools"]
    assert "weather" in result["planned_tools"]
    assert len(result["tool_results"]) == 2


@pytest.mark.asyncio
async def test_orchestrator_returns_response_message() -> None:
    orch = Orchestrator(registry=_make_registry())
    result = await orch.chat("Hello!")
    assert isinstance(result["message"], str)
    assert len(result["message"]) > 0


@pytest.mark.asyncio
async def test_orchestrator_with_context() -> None:
    orch = Orchestrator(registry=_make_registry())
    ctx = AgentContext(user_id="u1", city="Delhi")
    result = await orch.chat("Weather please", ctx)
    assert isinstance(result["message"], str)
    assert len(result["message"]) > 0
    assert len(result["planned_tools"]) >= 1


@pytest.mark.asyncio
async def test_orchestrator_default_returns_weather_market() -> None:
    orch = Orchestrator(registry=_make_registry())
    result = await orch.chat("hello")
    assert "weather" in result["planned_tools"]
    assert "market" in result["planned_tools"]


# --- LLM integration tests ---


class _FakeLLMProvider:
    """Deterministic fake for LLM integration tests."""

    def __init__(self, planner_response: str, generator_response: str) -> None:
        self._planner_response = planner_response
        self._generator_response = generator_response

    async def generate(self, *, system_instruction: str, user_content: str) -> str:
        lower = system_instruction.lower()
        if "planner" in lower or "tools" in lower:
            return self._planner_response
        return self._generator_response


@pytest.mark.asyncio
async def test_orchestrator_with_llm_planner() -> None:
    provider = _FakeLLMProvider('{"tools":["weather"]}', "It will be sunny, 28C.")
    orch = Orchestrator(registry=_make_registry(), llm_provider=provider)
    result = await orch.chat("What is the weather?")
    assert result["planned_tools"] == ["weather"]
    assert result["message"] == "It will be sunny, 28C."
    assert len(result["tool_results"]) == 1


@pytest.mark.asyncio
async def test_orchestrator_with_llm_multi_tool() -> None:
    provider = _FakeLLMProvider(
        '{"tools":["weather","market"]}',
        "Weather is sunny and wheat is at 2200.",
    )
    orch = Orchestrator(registry=_make_registry(), llm_provider=provider)
    result = await orch.chat("Should I sell wheat because of rain?")
    assert sorted(result["planned_tools"]) == ["market", "weather"]
    assert "sunny" in result["message"].lower()


@pytest.mark.asyncio
async def test_orchestrator_llm_fallback_on_planner_failure() -> None:
    class _FailingProvider:
        async def generate(self, *, system_instruction: str, user_content: str) -> str:
            raise RuntimeError("Gemini down")

    orch = Orchestrator(registry=_make_registry(), llm_provider=_FailingProvider())
    result = await orch.chat("What is the weather?")
    # Falls back to keyword planner
    assert "weather" in result["planned_tools"]
    # Falls back to generator fallback message
    assert isinstance(result["message"], str)
    assert len(result["message"]) > 0


@pytest.mark.asyncio
async def test_orchestrator_without_api_key_uses_fallback() -> None:
    with patch.dict("os.environ", {"GEMINI_API_KEY": ""}, clear=False):
        orch = Orchestrator(registry=_make_registry())
        result = await orch.chat("What is the weather?")
        assert "weather" in result["planned_tools"]
        assert isinstance(result["message"], str)


# --- Knowledge tool integration tests ---


class StubKnowledgeTool(BaseTool):
    name = "knowledge"
    description = "Stub knowledge."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        return self._success(
            {
                "documents": [
                    {
                        "id": "k1",
                        "content": "Wheat needs nitrogen.",
                        "source": "observation",
                    }
                ],
                "count": 1,
            }
        )


def _make_registry_with_knowledge() -> ToolRegistry:
    registry = ToolRegistry()
    registry.register(StubWeatherTool())
    registry.register(StubMarketTool())
    registry.register(StubKnowledgeTool())
    return registry


@pytest.mark.asyncio
async def test_orchestrator_knowledge_in_result() -> None:
    orch = Orchestrator(registry=_make_registry_with_knowledge())
    result = await orch.chat("What is the weather?")
    assert "context" in result
    assert isinstance(result["context"], dict)
    assert "knowledge" in result["context"]


@pytest.mark.asyncio
async def test_orchestrator_knowledge_tool_executes() -> None:
    """When planner selects knowledge, it appears in tool_results."""

    class _FakePlanner:
        async def generate(self, *, system_instruction: str, user_content: str) -> str:
            return '{"tools":["knowledge"]}'

    provider = _FakePlanner()
    orch = Orchestrator(registry=_make_registry_with_knowledge(), llm_provider=provider)
    result = await orch.chat("Tell me about government schemes")
    assert "knowledge" in result["planned_tools"]
    knowledge_result = next(
        r for r in result["tool_results"] if r["tool"] == "knowledge"
    )
    assert knowledge_result["success"] is True
    assert knowledge_result["data"]["count"] == 1


@pytest.mark.asyncio
async def test_orchestrator_context_has_knowledge_docs() -> None:
    """ContextBuilder extracts knowledge documents into context."""

    class _FakePlanner:
        async def generate(self, *, system_instruction: str, user_content: str) -> str:
            return '{"tools":["knowledge","weather"]}'

    provider = _FakePlanner()
    orch = Orchestrator(registry=_make_registry_with_knowledge(), llm_provider=provider)
    result = await orch.chat("What about wheat fertilizer?")
    ctx = result["context"]
    assert len(ctx["knowledge"]) == 1
    assert ctx["knowledge"][0]["content"] == "Wheat needs nitrogen."


@pytest.mark.asyncio
async def test_orchestrator_context_query_matches_user() -> None:
    orch = Orchestrator(registry=_make_registry_with_knowledge())
    result = await orch.chat("Hello!")
    assert result["context"]["query"] == "Hello!"


@pytest.mark.asyncio
async def test_planner_selects_knowledge_for_scheme_query() -> None:
    """Keyword planner should select knowledge for scheme queries."""
    from app.agents.planner import plan

    tools = plan("Tell me about government schemes")
    assert "knowledge" in tools


@pytest.mark.asyncio
async def test_planner_selects_knowledge_for_fertilizer_guide() -> None:
    from app.agents.planner import plan

    tools = plan("Give me a fertilizer guide for wheat")
    assert "knowledge" in tools


@pytest.mark.asyncio
async def test_planner_selects_knowledge_for_soil_question() -> None:
    from app.agents.planner import plan

    tools = plan("What type of soil is best for rice?")
    assert "knowledge" in tools


# --- Memory integration tests ---


class StubMemoryManager:
    """Fake memory manager for orchestrator tests."""

    def __init__(self) -> None:
        self.retrieved = False
        self.saved_messages: list[tuple[str, str]] = []
        self.saved_extractions: list[str] = []

    async def retrieve_memory(self, user_id: str) -> Any:  # noqa: ANN401
        self.retrieved = True
        from app.memory.schemas import MemoryContext

        return MemoryContext(
            farmer_profile=None,
            history=[],
            preferences={},
            facts=[],
        )

    async def save_conversation_message(
        self, user_id: str, role: str, content: str
    ) -> None:
        self.saved_messages.append((role, content))

    async def save_memory(self, user_id: str, message: str) -> list[Any]:
        self.saved_extractions.append(message)
        return []


@pytest.mark.asyncio
async def test_orchestrator_loads_memory() -> None:
    """Orchestrator retrieves memory before planning."""
    mgr = StubMemoryManager()
    orch = Orchestrator(registry=_make_registry(), memory_manager=mgr)
    await orch.chat("What is the weather?", AgentContext(user_id="u1"))
    assert mgr.retrieved is True


@pytest.mark.asyncio
async def test_orchestrator_saves_conversation() -> None:
    """Orchestrator saves user and assistant messages after response."""
    mgr = StubMemoryManager()
    orch = Orchestrator(registry=_make_registry(), memory_manager=mgr)
    await orch.chat("Hello!", AgentContext(user_id="u1"))
    assert len(mgr.saved_messages) == 2
    assert mgr.saved_messages[0] == ("user", "Hello!")
    assert mgr.saved_messages[1][0] == "assistant"


@pytest.mark.asyncio
async def test_orchestrator_extracts_memory() -> None:
    """Orchestrator triggers memory extraction from user message."""
    mgr = StubMemoryManager()
    orch = Orchestrator(registry=_make_registry(), memory_manager=mgr)
    await orch.chat("I grow wheat", AgentContext(user_id="u1"))
    assert len(mgr.saved_extractions) == 1
    assert "wheat" in mgr.saved_extractions[0]


@pytest.mark.asyncio
async def test_orchestrator_works_without_memory_manager() -> None:
    """Orchestrator functions normally when no memory manager is set."""
    orch = Orchestrator(registry=_make_registry())
    result = await orch.chat("What is the weather?")
    assert isinstance(result["message"], str)
    assert len(result["message"]) > 0


@pytest.mark.asyncio
async def test_orchestrator_memory_in_context() -> None:
    """Memory context appears in the merged context output."""
    mgr = StubMemoryManager()
    orch = Orchestrator(registry=_make_registry(), memory_manager=mgr)
    result = await orch.chat("Hello!", AgentContext(user_id="u1"))
    ctx = result["context"]
    assert "memory" in ctx
    assert isinstance(ctx["memory"], dict)
