from __future__ import annotations

import asyncio
from typing import Any

from app.core.logging import logger


async def execute(
    tool_names: list[str],
    query: str,
    context: dict[str, Any],
    registry: Any,
    timeout: float = 30.0,
) -> list[dict[str, Any]]:
    """Run the requested tools concurrently and collect results.

    Args:
        tool_names: Tool names returned by the planner.
        query: The original user query.
        context: Request-scoped context dict.
        registry: A ``ToolRegistry`` instance.
        timeout: Per-tool timeout in seconds.

    Returns:
        A list of result dicts, one per tool.
    """
    results: list[dict[str, Any]] = []

    for name in tool_names:
        tool = registry.get(name)
        if tool is None:
            logger.warning("Tool not found in registry", extra={"tool": name})
            results.append(
                {
                    "tool": name,
                    "success": False,
                    "data": {"error": f"Tool '{name}' not found"},
                }
            )
            continue

        try:
            result = await asyncio.wait_for(
                tool.run(query, context),
                timeout=timeout,
            )
            results.append(result)
        except TimeoutError:
            logger.warning("Tool timed out", extra={"tool": name})
            results.append(
                {
                    "tool": name,
                    "success": False,
                    "data": {"error": f"Tool '{name}' timed out after {timeout}s"},
                }
            )
        except Exception as exc:
            logger.exception("Tool execution failed", extra={"tool": name})
            results.append(
                {
                    "tool": name,
                    "success": False,
                    "data": {"error": str(exc)},
                }
            )

    return results
