"""LLM-backed planner with automatic keyword fallback."""

from __future__ import annotations

import json
from typing import TYPE_CHECKING

from app.core.logging import logger
from app.llm.prompts import PLANNER_SYSTEM_PROMPT, PLANNER_USER_TEMPLATE

if TYPE_CHECKING:
    from app.llm.provider import LLMProvider


class LLMPlanner:
    """Decide which tools to invoke using the LLM.

    Falls back to the deterministic keyword planner when Gemini is
    unavailable or returns an invalid response.
    """

    def __init__(self, provider: LLMProvider | None = None) -> None:
        self._provider = provider
        self._fallback_planner = None  # lazy import to avoid circular deps

    def _get_fallback(self):  # type: ignore[no-untyped-def]
        if self._fallback_planner is None:
            from app.agents.planner import plan

            self._fallback_planner = plan
        return self._fallback_planner

    async def plan(self, message: str, available_tools: list[str]) -> list[str]:
        """Return the list of tool names to execute.

        Tries the LLM first; on any failure falls back to keyword matching.
        """
        if self._provider is None:
            logger.info("No LLM provider — using keyword planner")
            return self._get_fallback()(message)

        try:
            user_content = PLANNER_USER_TEMPLATE.format(message=message)
            raw = await self._provider.generate(
                system_instruction=PLANNER_SYSTEM_PROMPT,
                user_content=user_content,
            )
            tools = self._parse_response(raw, available_tools)
            logger.info("LLM planner succeeded", extra={"tools": tools})
            return tools
        except Exception as exc:
            logger.warning(
                "LLM planner failed, falling back to keywords",
                extra={"error": str(exc)},
            )
            return self._get_fallback()(message)

    @staticmethod
    def _parse_response(raw: str, available_tools: list[str]) -> list[str]:
        """Parse the LLM JSON response into a validated tool list."""
        text = raw.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            lines = text.split("\n")
            lines = [ln for ln in lines if not ln.strip().startswith("```")]
            text = "\n".join(lines)

        data = json.loads(text)
        tools = data.get("tools", [])
        if not isinstance(tools, list):
            raise ValueError("Expected 'tools' to be a list")

        # Filter to only tools that exist in the registry
        valid = [t for t in tools if t in available_tools]
        if not valid:
            raise ValueError("No valid tools returned by LLM")
        return sorted(set(valid))
