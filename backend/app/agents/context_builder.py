"""Context builder -- merges retrieved knowledge, tool results, and memory."""

from __future__ import annotations

from typing import Any


class ContextBuilder:
    """Builds a unified context object for the LLM generator.

    Merges retrieved documents, tool results, conversation memory,
    and the original user query into a single dictionary that the
    generator can consume.
    """

    @staticmethod
    def build(
        query: str,
        tool_results: list[dict[str, Any]],
        memory: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Build a merged context from all available sources.

        Args:
            query: The original user question.
            tool_results: Raw results returned by the executor.
            memory: Optional conversation memory dict.

        Returns:
            A dictionary with keys ``query``, ``knowledge``,
            ``tool_results``, and ``memory``.
        """
        knowledge = ContextBuilder._extract_knowledge(tool_results)

        return {
            "query": query,
            "knowledge": knowledge,
            "tool_results": tool_results,
            "memory": memory or {},
        }

    @staticmethod
    def _extract_knowledge(tool_results: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Extract knowledge documents from tool results.

        Looks for a tool result whose ``tool`` name is ``"knowledge"``
        and pulls out the ``documents`` list from its ``data``.
        """
        for result in tool_results:
            if result.get("tool") == "knowledge" and result.get("success"):
                data = result.get("data", {})
                if isinstance(data, dict):
                    return data.get("documents", [])
        return []
