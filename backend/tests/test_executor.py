from __future__ import annotations

from typing import Any

import pytest

from app.agents.executor import execute
from app.agents.registry import ToolRegistry
from app.tools.base import BaseTool


class StubTool(BaseTool):
    """Deterministic tool that returns its input query as data."""

    def __init__(self, name: str = "stub", delay: float = 0) -> None:
        self.name = name
        self.description = f"Stub tool: {name}"
        self._delay = delay

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        if self._delay:
            import asyncio

            await asyncio.sleep(self._delay)
        return self._success({"query": query, "tool": self.name})


class FailTool(BaseTool):
    """Tool that always raises."""

    name = "fail"
    description = "Always fails."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        raise RuntimeError("Intentional failure")


@pytest.mark.asyncio
async def test_execute_single_tool() -> None:
    registry = ToolRegistry()
    registry.register(StubTool())
    results = await execute(["stub"], "hello", {}, registry)
    assert len(results) == 1
    assert results[0]["success"] is True
    assert results[0]["data"]["query"] == "hello"


@pytest.mark.asyncio
async def test_execute_multiple_tools() -> None:
    registry = ToolRegistry()
    registry.register(StubTool("a"))
    registry.register(StubTool("b"))
    results = await execute(["a", "b"], "test", {}, registry)
    assert len(results) == 2
    names = {r["data"]["tool"] for r in results}
    assert names == {"a", "b"}


@pytest.mark.asyncio
async def test_execute_missing_tool() -> None:
    registry = ToolRegistry()
    results = await execute(["nonexistent"], "hello", {}, registry)
    assert len(results) == 1
    assert results[0]["success"] is False
    assert "not found" in results[0]["data"]["error"]


@pytest.mark.asyncio
async def test_execute_exception_tool() -> None:
    registry = ToolRegistry()
    registry.register(FailTool())
    results = await execute(["fail"], "hello", {}, registry)
    assert len(results) == 1
    assert results[0]["success"] is False
    assert "Intentional failure" in results[0]["data"]["error"]


@pytest.mark.asyncio
async def test_execute_timeout() -> None:
    registry = ToolRegistry()
    registry.register(StubTool("slow", delay=10))
    results = await execute(["slow"], "hello", {}, registry, timeout=0.1)
    assert len(results) == 1
    assert results[0]["success"] is False
    assert "timed out" in results[0]["data"]["error"]


@pytest.mark.asyncio
async def test_execute_empty_list() -> None:
    registry = ToolRegistry()
    results = await execute([], "hello", {}, registry)
    assert results == []
