"""Context builder -- merges retrieved knowledge, tool results, and memory."""

from __future__ import annotations

from typing import Any


class ContextBuilder:
    """Builds a unified context object for the LLM generator.

    Merges retrieved documents, tool results, farmer profile,
    conversation history, preferences, and the original user query
    into a single dictionary that the generator can consume.
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
            memory: Optional memory context dict.  May contain
                ``farmer_profile``, ``history``, ``preferences``,
                and ``facts`` keys from MemoryContext, or the older
                ``conversation_id``/``messages`` format.

        Returns:
            A dictionary with keys ``query``, ``knowledge``,
            ``tool_results``, and ``memory``.
        """
        knowledge = ContextBuilder._extract_knowledge(tool_results)
        memory_block = ContextBuilder._build_memory_block(memory)

        return {
            "query": query,
            "knowledge": knowledge,
            "tool_results": tool_results,
            "memory": memory_block,
        }

    @staticmethod
    def _build_memory_block(
        memory: dict[str, Any] | None,
    ) -> dict[str, Any]:
        """Normalise the memory dict into a consistent structure.

        Handles both the new MemoryContext format (with farmer_profile,
        history, preferences, facts) and the legacy format (with
        conversation_id, messages).
        """
        if not memory:
            return {}

        # New format: already structured
        if "farmer_profile" in memory or "preferences" in memory:
            return {
                "farmer_profile": memory.get("farmer_profile"),
                "history": memory.get("history", []),
                "preferences": memory.get("preferences", {}),
                "facts": memory.get("facts", []),
            }

        # Legacy format: conversation-based
        return {
            "farmer_profile": None,
            "history": memory.get("messages", []),
            "preferences": {},
            "facts": [],
            **{k: v for k, v in memory.items() if k not in ("messages",)},
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
