from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, Query

from app.schemas.weather import WeatherQuery
from app.services.weather import weather_service

if TYPE_CHECKING:
    from app.core.security import CurrentUserDependency

router = APIRouter()


def _validate_query(
    lat: float | None,
    lon: float | None,
    city: str | None,
) -> WeatherQuery:
    if lat is not None and lon is not None:
        return WeatherQuery(lat=lat, lon=lon)
    if city:
        return WeatherQuery(city=city)
    return WeatherQuery()


@router.get("/current")
async def get_current_weather(
    current_user: CurrentUserDependency,
    lat: float | None = Query(None, ge=-90, le=90),
    lon: float | None = Query(None, ge=-180, le=180),
    city: str | None = Query(None, min_length=1, max_length=200),
) -> dict[str, object]:
    query = _validate_query(lat, lon, city)
    return await weather_service.get_current(query)


@router.get("/forecast")
async def get_forecast(
    current_user: CurrentUserDependency,
    lat: float | None = Query(None, ge=-90, le=90),
    lon: float | None = Query(None, ge=-180, le=180),
    city: str | None = Query(None, min_length=1, max_length=200),
    days: int = Query(7, ge=1, le=7),
) -> dict[str, object]:
    query = _validate_query(lat, lon, city)
    return await weather_service.get_forecast(query, days=days)


@router.get("/advice")
async def get_weather_advice(
    current_user: CurrentUserDependency,
    lat: float | None = Query(None, ge=-90, le=90),
    lon: float | None = Query(None, ge=-180, le=180),
    city: str | None = Query(None, min_length=1, max_length=200),
) -> dict[str, object]:
    query = _validate_query(lat, lon, city)
    return await weather_service.get_advice(query)
