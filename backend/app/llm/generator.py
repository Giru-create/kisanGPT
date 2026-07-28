"""Generate natural-language responses from tool outputs using the LLM."""

from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any

from app.core.logging import logger
from app.llm.prompts import GENERATOR_SYSTEM_PROMPT, GENERATOR_USER_TEMPLATE

if TYPE_CHECKING:
    from app.llm.provider import LLMProvider


class ResponseGenerator:
    """Turns tool results and retrieved knowledge into a human-friendly answer."""

    def __init__(self, provider: LLMProvider | None = None) -> None:
        self._provider = provider

    async def generate(
        self,
        message: str,
        tool_results: list[dict[str, Any]],
        context: dict[str, Any] | None = None,
    ) -> str:
        """Generate a natural-language answer.

        Args:
            message: The original user question.
            tool_results: Raw results from the executor.
            context: Optional merged context from ContextBuilder.  When
                provided, retrieved knowledge documents are injected into
                the prompt before tool outputs.

        Returns:
            A natural-language answer string.  Falls back to a minimal
            response when the LLM is unavailable.
        """
        if self._provider is None:
            return self._fallback(message, tool_results)

        try:
            context_block = self._build_context_block(tool_results, context)
            user_content = GENERATOR_USER_TEMPLATE.format(
                message=message,
                context_block=context_block,
            )
            response = await self._provider.generate(
                system_instruction=GENERATOR_SYSTEM_PROMPT,
                user_content=user_content,
            )
            if not response.strip():
                return self._fallback(message, tool_results)
            return response
        except Exception as exc:
            logger.warning(
                "Response generator failed, using fallback",
                extra={"error": str(exc)},
            )
            return self._fallback(message, tool_results)

    @staticmethod
    def _build_context_block(
        tool_results: list[dict[str, Any]],
        context: dict[str, Any] | None = None,
    ) -> str:
        """Build the context section of the prompt.

        Includes retrieved knowledge documents first, then tool outputs.
        """
        parts: list[str] = []

        # Inject retrieved knowledge if available
        knowledge: list[dict[str, Any]] = []
        if context:
            knowledge = context.get("knowledge", [])
        if not knowledge:
            # Also check tool_results for knowledge tool output
            for r in tool_results:
                if r.get("tool") == "knowledge" and r.get("success"):
                    data = r.get("data", {})
                    if isinstance(data, dict):
                        knowledge = data.get("documents", [])
                    break

        if knowledge:
            parts.append("Retrieved knowledge documents:")
            for i, doc in enumerate(knowledge, 1):
                content = doc.get("content", "")
                source = doc.get("source", "")
                parts.append(f"  [{i}] ({source}) {content}")
            parts.append("")

        # Add tool outputs
        tool_outputs = ResponseGenerator._format_tool_outputs(tool_results)
        parts.append(f"Tool outputs:\n{tool_outputs}")

        return "\n".join(parts)

    @staticmethod
    def _format_tool_outputs(tool_results: list[dict[str, Any]]) -> str:
        """Format tool results into a readable string for the prompt."""
        parts: list[str] = []
        for r in tool_results:
            tool = r.get("tool", "unknown")
            success = r.get("success", False)
            data = r.get("data", {})
            if success:
                parts.append(f"[{tool}] {json.dumps(data, default=str)}")
            else:
                if isinstance(data, dict):
                    error = data.get("error", "unknown error")
                else:
                    error = str(data)
                parts.append(f"[{tool}] Error: {error}")
        return "\n".join(parts) if parts else "No tool outputs available."

    @staticmethod
    def _fallback(message: str, tool_results: list[dict[str, Any]]) -> str:
        """Return a minimal fallback response."""
        if tool_results:
            successful = [r for r in tool_results if r.get("success")]
            if successful:
                return (
                    f'Based on the data retrieved for your query: "{message}". '
                    "Please check the tool results for detailed information."
                )
        return (
            f'I received your message: "{message}". '
            "I'm unable to generate a detailed response right now."
        )
