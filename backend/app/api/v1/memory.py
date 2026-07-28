"""Memory API endpoints for farm memory features."""

from fastapi import APIRouter, HTTPException

from app.core.security import CurrentUserDependency
from app.schemas.memory import (
    MemoryCreateRequest,
    MemoryResponse,
    MemorySearchRequest,
    MemorySearchResponse,
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.memory import MemoryService
from app.services.recommendation import RecommendationEngine

router = APIRouter()


@router.post("", response_model=MemoryResponse)
async def create_memory(
    request: MemoryCreateRequest,
    current_user: CurrentUserDependency,
) -> MemoryResponse:
    """Create a new farm memory."""
    service = MemoryService()
    memory = await service.create_memory(
        user_id=current_user.user_id,
        request=request,
    )
    return MemoryResponse(
        memory=memory,
        message="Memory created successfully",
    )


@router.post("/search", response_model=MemorySearchResponse)
async def search_memories(
    request: MemorySearchRequest,
    current_user: CurrentUserDependency,
) -> MemorySearchResponse:
    """Search for farm memories using vector similarity."""
    service = MemoryService()
    memories = await service.search_memories(
        user_id=current_user.user_id,
        request=request,
    )
    return MemorySearchResponse(
        memories=memories,
        total=len(memories),
        query=request.query,
    )


@router.get("/{memory_id}", response_model=MemoryResponse)
async def get_memory(
    memory_id: str,
    current_user: CurrentUserDependency,
) -> MemoryResponse:
    """Get a specific memory by ID."""
    service = MemoryService()
    memory = await service.get_memory(
        user_id=current_user.user_id,
        memory_id=memory_id,
    )
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    return MemoryResponse(
        memory=memory,
        message="Memory retrieved successfully",
    )


@router.delete("/{memory_id}")
async def delete_memory(
    memory_id: str,
    current_user: CurrentUserDependency,
) -> dict[str, str]:
    """Delete a memory by ID."""
    service = MemoryService()
    deleted = await service.delete_memory(
        user_id=current_user.user_id,
        memory_id=memory_id,
    )
    if not deleted:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"message": "Memory deleted successfully"}


@router.get("", response_model=MemorySearchResponse)
async def list_memories(
    current_user: CurrentUserDependency,
    memory_type: str | None = None,
    limit: int = 50,
) -> MemorySearchResponse:
    """List all memories for the current user."""
    service = MemoryService()
    memories = await service.get_user_memories(
        user_id=current_user.user_id,
        memory_type=memory_type,
        limit=limit,
    )
    return MemorySearchResponse(
        memories=memories,
        total=len(memories),
        query="",
    )


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    current_user: CurrentUserDependency,
) -> RecommendationResponse:
    """Get personalized farming recommendations."""
    engine = RecommendationEngine()
    recommendations = await engine.generate_recommendations(
        user_id=current_user.user_id,
        request=request,
    )
    return RecommendationResponse(
        recommendations=recommendations,
        total=len(recommendations),
    )
