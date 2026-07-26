from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, Query

from app.services.dashboard import dashboard_service

if TYPE_CHECKING:
    from app.core.security import CurrentUserDependency

router = APIRouter()


@router.get("")
async def get_dashboard(
    current_user: CurrentUserDependency,
    lat: float | None = Query(None, ge=-90, le=90),
    lon: float | None = Query(None, ge=-180, le=180),
    city: str | None = Query(None, min_length=1, max_length=100),
) -> dict[str, object]:
    return await dashboard_service.get_dashboard(lat=lat, lon=lon, city=city)
