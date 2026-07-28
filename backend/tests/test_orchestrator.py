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
