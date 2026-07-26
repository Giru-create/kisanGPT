from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, Query

from app.schemas.market import (
    PriceAlert,
    PriceAlertCreate,
    PriceAlertResponse,
)
from app.services.market import market_service

if TYPE_CHECKING:
    from app.core.security import CurrentUserDependency

router = APIRouter()


@router.get("/prices")
async def get_market_prices(
    current_user: CurrentUserDependency,
    commodity: str = Query(..., min_length=1, max_length=100),
    state: str | None = Query(None, max_length=100),
) -> dict[str, object]:
    return await market_service.get_prices(commodity, state)


@router.get("/trend")
async def get_market_trend(
    current_user: CurrentUserDependency,
    commodity: str = Query(..., min_length=1, max_length=100),
    days: int = Query(30, ge=7, le=90),
) -> dict[str, object]:
    return await market_service.get_trend(commodity, days)


@router.get("/overview")
async def get_market_overview(
    current_user: CurrentUserDependency,
    state: str | None = Query(None, max_length=100),
) -> dict[str, object]:
    return await market_service.get_overview(state)


@router.post("/alerts", response_model=PriceAlert)
async def create_price_alert(
    current_user: CurrentUserDependency,
    alert_data: PriceAlertCreate,
) -> PriceAlert:
    return market_service.create_alert(
        user_id=current_user["uid"],
        alert_data=alert_data,
    )


@router.get("/alerts", response_model=PriceAlertResponse)
async def get_price_alerts(
    current_user: CurrentUserDependency,
) -> PriceAlertResponse:
    alerts = market_service.get_alerts(user_id=current_user["uid"])
    return PriceAlertResponse(alerts=alerts, total_count=len(alerts))


@router.delete("/alerts/{alert_id}")
async def delete_price_alert(
    current_user: CurrentUserDependency,
    alert_id: str,
) -> dict[str, str]:
    deleted = market_service.delete_alert(
        user_id=current_user["uid"], alert_id=alert_id
    )
    if not deleted:
        return {"detail": "Alert not found"}
    return {"detail": "Alert deleted"}
