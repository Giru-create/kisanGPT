"""Knowledge search API endpoint (debugging / testing only)."""

from __future__ import annotations

from fastapi import APIRouter

from app.core.security import CurrentUserDependency  # noqa: TC001
from app.schemas.knowledge import (
    KnowledgeDocument,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse,
)

router = APIRouter()


@router.post("/search", response_model=KnowledgeSearchResponse)
async def knowledge_search(
    request: KnowledgeSearchRequest,
    current_user: CurrentUserDependency,
) -> KnowledgeSearchResponse:
    """Search the farm knowledge base for relevant documents.

    This endpoint is intended for debugging and testing only.
    """
    from app.rag.retriever import KnowledgeRetriever, RetrievalFilter

    retriever = KnowledgeRetriever()
    filters = RetrievalFilter(
        category=request.category,
        crop=request.crop,
        state=request.state,
        language=request.language,
    )

    results = await retriever.retrieve(
        query=request.query, top_k=request.k, filters=filters
    )

    documents = [
        KnowledgeDocument(
            id=r.id,
            content=r.content,
            source=r.metadata.get("source", ""),
            score=r.score,
            metadata={
                "title": r.metadata.get("title", ""),
                "category": r.metadata.get("category", ""),
                "crop": r.metadata.get("crop", ""),
                "state": r.metadata.get("state", ""),
            },
        )
        for r in results
    ]

    return KnowledgeSearchResponse(
        documents=documents,
        count=len(documents),
        query=request.query,
    )
