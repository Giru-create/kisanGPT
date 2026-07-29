"""Knowledge tool -- wraps the RAG retrieval pipeline for the orchestrator."""

from __future__ import annotations

from typing import Any

from app.core.logging import logger
from app.tools.base import BaseTool

DEFAULT_K = 5


class KnowledgeTool(BaseTool):
    """Retrieve relevant knowledge documents from the vector store.

    This tool wraps the KnowledgeRetriever and exposes it as a standard
    orchestrator tool so the planner can invoke it alongside weather,
    market, and other tools.

    Supports metadata filters: category, crop, state, language.
    Returns source citations with each document.
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
            context: May contain ``user_id``, ``k``, ``category``,
                ``crop``, ``state``, ``language`` to refine results.

        Returns:
            Standardised tool result with ``documents``, ``count``, and
            ``success`` keys.
        """
        k = context.get("k", DEFAULT_K)

        try:
            from app.rag.retriever import KnowledgeRetriever, RetrievalFilter

            retriever = KnowledgeRetriever()
            filters = RetrievalFilter(
                category=context.get("category"),
                crop=context.get("crop"),
                state=context.get("state"),
                language=context.get("language"),
            )

            results = await retriever.retrieve(query=query, top_k=k, filters=filters)

            documents = [
                {
                    "id": r.id,
                    "content": r.content,
                    "source": r.metadata.get("source", ""),
                    "title": r.metadata.get("title", ""),
                    "score": round(r.score, 3),
                    "metadata": {
                        "category": r.metadata.get("category", ""),
                        "crop": r.metadata.get("crop", ""),
                        "state": r.metadata.get("state", ""),
                        "language": r.metadata.get("language", ""),
                        "tags": r.metadata.get("tags", []),
                        "heading": r.metadata.get("heading", ""),
                    },
                }
                for r in results
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
