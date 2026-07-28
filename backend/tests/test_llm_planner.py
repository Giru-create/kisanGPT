"""Tests for the LLM planner with keyword fallback."""

from __future__ import annotations

import pytest

from app.llm.planner import LLMPlanner


class FakeProvider:
    """Deterministic fake LLM provider for tests."""

    def __init__(self, response_text: str) -> None:
        self._response = response_text

    async def generate(self, *, system_instruction: str, user_content: str) -> str:
        return self._response


class FailingProvider:
    """Provider that always raises."""

    async def generate(self, *, system_instruction: str, user_content: str) -> str:
        raise RuntimeError("Gemini API is down")


AVAILABLE_TOOLS = ["weather", "market", "disease", "memory", "dashboard"]


class TestLLMPlannerSuccess:
    @pytest.mark.asyncio
    async def test_single_tool_weather(self) -> None:
        provider = FakeProvider('{"tools":["weather"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("What is the weather?", AVAILABLE_TOOLS)
        assert result == ["weather"]

    @pytest.mark.asyncio
    async def test_single_tool_market(self) -> None:
        provider = FakeProvider('{"tools":["market"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("What is the wheat price?", AVAILABLE_TOOLS)
        assert result == ["market"]

    @pytest.mark.asyncio
    async def test_multi_tool(self) -> None:
        provider = FakeProvider('{"tools":["weather","market"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan(
            "Should I sell wheat because of rain?", AVAILABLE_TOOLS
        )
        assert sorted(result) == ["market", "weather"]

    @pytest.mark.asyncio
    async def test_deduplicates_tools(self) -> None:
        provider = FakeProvider('{"tools":["weather","weather"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Weather?", AVAILABLE_TOOLS)
        assert result == ["weather"]

    @pytest.mark.asyncio
    async def test_filters_invalid_tools(self) -> None:
        provider = FakeProvider('{"tools":["weather","nonexistent_tool"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Weather?", AVAILABLE_TOOLS)
        assert result == ["weather"]

    @pytest.mark.asyncio
    async def test_strips_markdown_fences(self) -> None:
        provider = FakeProvider('```json\n{"tools":["disease"]}\n```')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Leaf spots?", AVAILABLE_TOOLS)
        assert result == ["disease"]


class TestLLMPlannerFallback:
    @pytest.mark.asyncio
    async def test_no_provider_falls_back_to_keywords(self) -> None:
        planner = LLMPlanner(provider=None)
        result = await planner.plan("What is the weather?", AVAILABLE_TOOLS)
        assert "weather" in result

    @pytest.mark.asyncio
    async def test_provider_error_falls_back(self) -> None:
        planner = LLMPlanner(provider=FailingProvider())
        result = await planner.plan("What is the weather?", AVAILABLE_TOOLS)
        assert "weather" in result

    @pytest.mark.asyncio
    async def test_invalid_json_falls_back(self) -> None:
        provider = FakeProvider("not valid json at all")
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Weather update?", AVAILABLE_TOOLS)
        assert "weather" in result

    @pytest.mark.asyncio
    async def test_empty_tools_list_falls_back(self) -> None:
        provider = FakeProvider('{"tools":[]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Weather?", AVAILABLE_TOOLS)
        assert "weather" in result

    @pytest.mark.asyncio
    async def test_no_valid_tools_falls_back(self) -> None:
        provider = FakeProvider('{"tools":["nonexistent"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Weather?", AVAILABLE_TOOLS)
        assert "weather" in result

    @pytest.mark.asyncio
    async def test_non_list_tools_field_falls_back(self) -> None:
        provider = FakeProvider('{"tools":"weather"}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Weather?", AVAILABLE_TOOLS)
        assert "weather" in result


class TestLLMPlannerEdgeCases:
    @pytest.mark.asyncio
    async def test_empty_message_uses_defaults(self) -> None:
        provider = FakeProvider('{"tools":["weather","market"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("", AVAILABLE_TOOLS)
        assert sorted(result) == ["market", "weather"]

    @pytest.mark.asyncio
    async def test_hindi_query(self) -> None:
        provider = FakeProvider('{"tools":["weather"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Aaj mausam kaisa hai?", AVAILABLE_TOOLS)
        assert result == ["weather"]

    @pytest.mark.asyncio
    async def test_tool_results_sorted(self) -> None:
        provider = FakeProvider('{"tools":["market","disease","weather"]}')
        planner = LLMPlanner(provider=provider)
        result = await planner.plan("Complex query", AVAILABLE_TOOLS)
        assert result == ["disease", "market", "weather"]
