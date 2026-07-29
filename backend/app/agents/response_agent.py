"""Response agent -- collects all agent results and generates a final answer."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from app.agents.base import BaseAgent
from app.agents.schemas import AgentConfig, AgentResult
from app.core.logging import logger

if TYPE_CHECKING:
    from app.agents.context import AgentContext


class ResponseAgent(BaseAgent):
    """Generates a natural-language response from all agent results.

    Uses the existing ResponseGenerator (Gemini-backed) with a
    deterministic fallback when the LLM is unavailable.
    """

    name = "response"
    description = "Generate the final natural-language response for the farmer."
    supported_intents: list[str] = []
    priority = 100

    def __init__(
        self,
        provider: Any | None = None,
        config: AgentConfig | None = None,
    ) -> None:
        super().__init__(config)
        self._provider = provider

    async def run(self, context: AgentContext) -> AgentResult:
        """Not used directly -- response generation is orchestrated by MasterAgent."""
        return AgentResult(name=self.name, success=True, data={})

    async def generate(
        self,
        message: str,
        agent_results: list[AgentResult],
        context: AgentContext,
    ) -> str:
        """Generate a final answer from all collected agent results.

        Args:
            message: The original user message.
            agent_results: Results from all specialist agents.
            context: The shared agent context.

        Returns:
            A natural-language answer string.
        """
        tool_results = [r.to_tool_result() for r in agent_results]
        merged = self._build_merged_context(agent_results, context)

        from app.llm.generator import ResponseGenerator

        generator = ResponseGenerator(provider=self._provider)

        try:
            answer = await generator.generate(message, tool_results, context=merged)
            return answer
        except Exception as exc:
            logger.warning(
                "ResponseAgent generator failed, using fallback",
                extra={"error": str(exc)},
            )
            return self._fallback(message, agent_results)

    @staticmethod
    def _build_merged_context(
        agent_results: list[AgentResult],
        context: AgentContext,
    ) -> dict[str, Any]:
        """Build the context dict for the ResponseGenerator."""
        knowledge: list[dict[str, Any]] = []
        for r in agent_results:
            if r.name == "knowledge" and r.success:
                docs = r.data.get("documents", [])
                knowledge.extend(docs)

        return {
            "query": context.message,
            "knowledge": knowledge,
            "memory": context.memory or {},
        }

    @staticmethod
    def _fallback(message: str, agent_results: list[AgentResult]) -> str:
        """Deterministic fallback when LLM is unavailable."""
        successful = [r for r in agent_results if r.success]
        if successful:
            names = ", ".join(r.name for r in successful)
            return (
                f'Based on the data retrieved for your query: "{message}". '
                f"Agents consulted: {names}. "
                "Please check the results for detailed information."
            )
        return (
            f'I received your message: "{message}". '
            "I am unable to generate a detailed response right now."
        )
