"""Farmer memory and personalization API endpoints (debugging / testing only)."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.security import CurrentUserDependency  # noqa: TC001
from app.memory.manager import MemoryManager
from app.memory.schemas import (
    FarmerProfileCreateRequest,
    FarmerProfileResponse,
    MemoryContextResponse,
    MemoryItemCreateRequest,
    MemoryItemResponse,
)

router = APIRouter()

# Shared in-memory manager (singleton for the process lifetime).
# Suitable for debugging and testing.  Replace with a database-backed
# implementation for production.
_manager = MemoryManager()


@router.post("/profile", response_model=FarmerProfileResponse)
async def upsert_profile(
    request: FarmerProfileCreateRequest,
    current_user: CurrentUserDependency,
) -> FarmerProfileResponse:
    """Create or update the farmer's profile."""
    profile = await _manager.update_profile(
        user_id=current_user.user_id, request=request
    )
    return FarmerProfileResponse(
        profile=profile,
        message="Profile saved successfully",
    )


@router.get("/profile", response_model=FarmerProfileResponse)
async def get_profile(
    current_user: CurrentUserDependency,
) -> FarmerProfileResponse:
    """Get the farmer's profile."""
    profile = _manager.get_profile(current_user.user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return FarmerProfileResponse(
        profile=profile,
        message="Profile retrieved successfully",
    )


@router.post("/save", response_model=MemoryItemResponse)
async def save_memory_item(
    request: MemoryItemCreateRequest,
    current_user: CurrentUserDependency,
) -> MemoryItemResponse:
    """Manually save a memory item."""
    item = _manager._long_term.save_memory_item(
        user_id=current_user.user_id, request=request
    )
    return MemoryItemResponse(
        memory_item=item,
        message="Memory item saved successfully",
    )


@router.get("/context", response_model=MemoryContextResponse)
async def get_memory_context(
    current_user: CurrentUserDependency,
) -> MemoryContextResponse:
    """Get the full memory context for the current user."""
    context = await _manager.retrieve_memory(current_user.user_id)
    return MemoryContextResponse(
        context=context,
        user_id=current_user.user_id,
    )


@router.delete("/{memory_id}")
async def delete_memory_item(
    memory_id: str,
    current_user: CurrentUserDependency,
) -> dict[str, str]:
    """Delete a specific memory item."""
    deleted = await _manager.delete_memory_item(
        user_id=current_user.user_id, memory_id=memory_id
    )
    if not deleted:
        raise HTTPException(status_code=404, detail="Memory item not found")
    return {"message": "Memory item deleted successfully"}
