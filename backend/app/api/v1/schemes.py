"""Government Schemes API endpoints."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, HTTPException, Query

from app.schemas.schemes import (
    SchemeDetailResponse,
    SchemeListResponse,
    SchemeSearchRequest,
)
from app.services.schemes import schemes_service

if TYPE_CHECKING:
    from app.core.security import CurrentUserDependency

router = APIRouter()


@router.get("", response_model=SchemeListResponse)
async def list_schemes(
    current_user: CurrentUserDependency,
    state: str | None = Query(None, max_length=100),
    crop: str | None = Query(None, max_length=100),
    farmer_category: str | None = Query(None, max_length=100),
    scheme_type: str | None = Query(None, max_length=100),
    search: str | None = Query(None, max_length=200),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> SchemeListResponse:
    """List government schemes with optional filters.

    Supports filtering by state, crop, farmer category, scheme type,
    and free-text search. Returns paginated results.
    """
    request = SchemeSearchRequest(
        state=state,
        crop=crop,
        farmer_category=farmer_category,
        scheme_type=scheme_type,
        search=search,
        page=page,
        page_size=page_size,
    )
    return await schemes_service.get_schemes(request)


@router.get("/{scheme_id}", response_model=SchemeDetailResponse)
async def get_scheme(
    current_user: CurrentUserDependency,
    scheme_id: str,
) -> SchemeDetailResponse:
    """Get detailed information about a specific scheme."""
    result = await schemes_service.get_scheme(scheme_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return result
