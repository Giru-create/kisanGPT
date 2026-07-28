"""Knowledge tool -- wraps the memory/RAG pipeline for the orchestrator."""

from __future__ import annotations

from typing import Any

from app.core.logging import logger
from app.schemas.memory import MemorySearchRequest
from app.services.memory import MemoryService
from app.tools.base import BaseTool

KNOWLEDGE_COLLECTION = "farm_memories"
DEFAULT_K = 5


class KnowledgeTool(BaseTool):
    """Retrieve relevant knowledge documents from the vector store.

    This tool wraps the existing MemoryService (RAG pipeline) and exposes
    it as a standard orchestrator tool so the planner can invoke it
    alongside weather, market, and other tools.
    """

    name = "knowledge"
    description = (
        "Search farm knowledge base for relevant information about crops, "
        "diseases, fertilizers, government schemes, best practices, "
        "soil management, and farming guides."
    )

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        """Search the knowledge base for documents relevant to *query*.

        Args:
            query: The user's question or search terms.
            context: Must contain ``user_id``.  May contain ``k`` to
                override the default number of results.

        Returns:
            Standardised tool result with ``documents``, ``count``, and
            ``success`` keys.
        """
        user_id = context.get("user_id", "")
        k = context.get("k", DEFAULT_K)

        if not user_id:
            return self._success(
                {"documents": [], "count": 0, "message": "No user context."}
            )

        try:
            service = MemoryService()
            search_request = MemorySearchRequest(query=query, limit=k)
            memories = await service.search_memories(user_id, search_request)

            documents = [
                {
                    "id": m.memory_id,
                    "content": m.content,
                    "source": m.memory_type,
                    "score": 1.0,
                    "metadata": {
                        "crop": m.crop,
                        "location": m.location,
                        "memory_type": m.memory_type,
                    },
                }
                for m in memories
            ]

            logger.info(
                "KnowledgeTool retrieved documents",
                extra={"query": query[:50], "count": len(documents)},
            )

            return self._success({"documents": documents, "count": len(documents)})

        except Exception as exc:
            logger.warning(
                "KnowledgeTool retrieval failed",
                extra={"error": str(exc)},
            )
            return self._error(str(exc))
