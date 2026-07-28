"""Knowledge search API endpoint (debugging / testing only)."""

from __future__ import annotations

from fastapi import APIRouter

from app.core.security import CurrentUserDependency  # noqa: TC001
from app.schemas.knowledge import (
    KnowledgeDocument,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse,
)
from app.schemas.memory import MemorySearchRequest

router = APIRouter()


@router.post("/search", response_model=KnowledgeSearchResponse)
async def knowledge_search(
    request: KnowledgeSearchRequest,
    current_user: CurrentUserDependency,
) -> KnowledgeSearchResponse:
    """Search the farm knowledge base for relevant documents.

    This endpoint is intended for debugging and testing only.
    """
    from app.services.memory import MemoryService

    service = MemoryService()
    search_request = MemorySearchRequest(query=request.query, limit=request.k)
    memories = await service.search_memories(current_user.user_id, search_request)

    documents = [
        KnowledgeDocument(
            id=m.memory_id,
            content=m.content,
            source=m.memory_type,
            score=1.0,
            metadata={
                "crop": m.crop,
                "location": m.location,
                "memory_type": m.memory_type,
            },
        )
        for m in memories
    ]

    return KnowledgeSearchResponse(
        documents=documents,
        count=len(documents),
        query=request.query,
    )
