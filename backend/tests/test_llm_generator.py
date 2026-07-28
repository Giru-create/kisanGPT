"""Tests for the LLM response generator with fallback."""

from __future__ import annotations

from typing import Any

import pytest

from app.llm.generator import ResponseGenerator


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


SAMPLE_RESULTS: list[dict[str, Any]] = [
    {"tool": "weather", "success": True, "data": {"temperature": 28}},
    {"tool": "market", "success": True, "data": {"wheat": 2200}},
]


class TestGeneratorSuccess:
    @pytest.mark.asyncio
    async def test_generates_from_tool_outputs(self) -> None:
        provider = FakeProvider("It will be sunny tomorrow, 28C.")
        gen = ResponseGenerator(provider=provider)
        result = await gen.generate("What's the weather?", SAMPLE_RESULTS)
        assert result == "It will be sunny tomorrow, 28C."

    @pytest.mark.asyncio
    async def test_empty_response_falls_back(self) -> None:
        provider = FakeProvider("   ")
        gen = ResponseGenerator(provider=provider)
        result = await gen.generate("Weather?", SAMPLE_RESULTS)
        assert "weather" in result.lower() or "data" in result.lower()


class TestGeneratorFallback:
    @pytest.mark.asyncio
    async def test_no_provider_returns_fallback(self) -> None:
        gen = ResponseGenerator(provider=None)
        result = await gen.generate("Weather?", SAMPLE_RESULTS)
        assert "weather" in result.lower() or "data" in result.lower()

    @pytest.mark.asyncio
    async def test_provider_error_returns_fallback(self) -> None:
        gen = ResponseGenerator(provider=FailingProvider())
        result = await gen.generate("Weather?", SAMPLE_RESULTS)
        assert isinstance(result, str)
        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_fallback_with_successful_tools(self) -> None:
        gen = ResponseGenerator(provider=None)
        result = await gen.generate("What is the weather?", SAMPLE_RESULTS)
        assert "weather" in result.lower() or "query" in result.lower()

    @pytest.mark.asyncio
    async def test_fallback_with_no_successful_tools(self) -> None:
        failed_results: list[dict[str, Any]] = [
            {"tool": "weather", "success": False, "data": {"error": "timeout"}},
        ]
        gen = ResponseGenerator(provider=None)
        result = await gen.generate("Weather?", failed_results)
        assert "message" in result.lower() or "unable" in result.lower()


class TestFormatToolOutputs:
    def test_formats_successful_tool(self) -> None:
        results = [{"tool": "weather", "success": True, "data": {"temp": 30}}]
        formatted = ResponseGenerator._format_tool_outputs(results)
        assert "[weather]" in formatted
        assert "30" in formatted

    def test_formats_failed_tool(self) -> None:
        results = [{"tool": "weather", "success": False, "data": {"error": "timeout"}}]
        formatted = ResponseGenerator._format_tool_outputs(results)
        assert "[weather]" in formatted
        assert "timeout" in formatted

    def test_empty_results(self) -> None:
        formatted = ResponseGenerator._format_tool_outputs([])
        assert "No tool outputs" in formatted
